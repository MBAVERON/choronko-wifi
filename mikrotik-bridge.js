/* CHORONKO WIFI - PRODUCTION BRIDGE
   - Connects Firebase Sales to MikroTik Router
   - Uses Correct Profile Names (1 hour, 1 day, etc.)
   - Verifies creation success
*/

const RosClient = require('ros-client');
const { initializeApp } = require("firebase/app");
const { 
  getFirestore, collection, query, where, onSnapshot, updateDoc, doc 
} = require("firebase/firestore");

// --- 1. CONFIGURATION ---
// --- 1. CONFIGURATION ---
const MIKROTIK_CONFIG = {
    host: '10.0.0.1',      
    user: 'apiuser',       
    password: '1234',      
    port: 8728,            
    timeout: 5000          
};

// --- 2. FIREBASE CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyBADbVFYd_NVoWU1Wxi4mxOTyBoeuBDAyQ",
  authDomain: "choronko-wifi.firebaseapp.com",
  projectId: "choronko-wifi",
  storageBucket: "choronko-wifi.firebasestorage.app",
  messagingSenderId: "531864817668",
  appId: "1:531864817668:web:e9d3085994c4c92196a551",
  measurementId: "G-27651Y192E"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Use a queue to process items one by one
let isProcessing = false;
let processingQueue = [];

async function startBridge() {
    console.clear();
    console.log("🔌 Connecting to Firebase...");
    console.log(`📡 Target Router: ${MIKROTIK_CONFIG.host}`);

    // Listen only for unsynced vouchers
    const q = query(collection(db, "vouchers"), where("synced", "==", false));

    console.log("✅ Listening for new sales...");

    onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                // Add to queue instead of running immediately
                processingQueue.push({
                    docId: change.doc.id,
                    data: change.doc.data()
                });
                processQueue();
            }
        });
    });
}

async function processQueue() {
    if (isProcessing) return; // Busy? Wait.
    if (processingQueue.length === 0) return; // Empty? Stop.

    isProcessing = true;
    const item = processingQueue.shift(); // Get first item
    
    try {
        await handleVoucher(item);
    } catch (err) {
        console.log("   ⚠️ Error processing item, skipping...");
    }

    isProcessing = false;
    // Check if there are more items left
    if (processingQueue.length > 0) {
        processQueue();
    }
}

async function handleVoucher({ docId, data }) {
    console.log(`\n-----------------------------------------`);
    console.log(`🆕 Processing Sale: ${data.code}`);

    // --- PROFILE MAPPING (Matches your Screenshot) ---
    let profileName = "default"; 
    
    // Normalize to lowercase to make matching easier
    const planName = (data.plan || "").toLowerCase();

    if (planName.includes("1 hour"))   profileName = "1 hour";
    else if (planName.includes("24 hours")) profileName = "1 day";
    else if (planName.includes("monthly"))  profileName = "1 month";
    else if (planName.includes("week"))     profileName = "1 week";

    console.log(`   ➡️ Using Router Profile: '${profileName}'`);

    try {
        // 1. Send to Router (With explicit Timeout)
        console.log("   1️⃣ Sending to Router...");
        await sendToRouter(data.code, profileName);
        console.log("   ✅ Created on Router.");

        // 2. Verify
        console.log("   2️⃣ Verifying...");
        const verified = await verifyUserOnRouter(data.code);

        if (verified) {
            console.log(`   🎉 VERIFIED! User '${data.code}' is active.`);
            await updateDoc(doc(db, "vouchers", docId), { synced: true });
            console.log("   ☁️  Synced to Database.");
        } else {
            console.error(`   ❌ Failed Verification. User '${data.code}' not found.`);
        }

    } catch (err) {
        console.error("   ⛔ FAILED:", err);
    }
}

function sendToRouter(username, profile) {
    return new Promise((resolve, reject) => {
        const api = new RosClient({ ...MIKROTIK_CONFIG });

        // Force timeout if router hangs
        const timer = setTimeout(() => {
            api.close();
            reject("Timeout: Router took too long to answer.");
        }, 5000);

        api.connect().then(() => {
            api.command('/ip/hotspot/user/add', {
                "name": username,
                "password": username,
                "profile": profile,
                "comment": "Choronko-Auto"
            }).then(() => {
                clearTimeout(timer);
                api.close();
                resolve();
            }).catch((err) => {
                clearTimeout(timer);
                api.close();
                // If user already exists, we consider it a success
                if (err.message && err.message.includes("already exists")) {
                    resolve();
                } else {
                    reject(err);
                }
            });
        }).catch((err) => {
            clearTimeout(timer);
            reject("Connection Failed: " + err.message);
        });
    });
}

function verifyUserOnRouter(username) {
    return new Promise((resolve, reject) => {
        const api = new RosClient({ ...MIKROTIK_CONFIG });
        
        const timer = setTimeout(() => {
            api.close();
            reject("Timeout verifying user.");
        }, 5000);

        api.connect().then(() => {
            api.command('/ip/hotspot/user/print', {
                "?name": username
            }).then((users) => {
                clearTimeout(timer);
                api.close();
                resolve(users && users.length > 0);
            }).catch((err) => {
                clearTimeout(timer);
                api.close();
                reject(err);
            });
        }).catch((err) => {
            clearTimeout(timer);
            reject("Verify Failed: " + err.message);
        });
    });
}

startBridge();