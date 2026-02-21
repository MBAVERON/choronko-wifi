const fs = require('fs');
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, writeBatch, doc } = require("firebase/firestore");

// --- 1. FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyBADbVFYd_NVoWU1Wxi4mxOTyBoeuBDAyQ",
  authDomain: "choronko-wifi.firebaseapp.com",
  projectId: "choronko-wifi",
  storageBucket: "choronko-wifi.firebasestorage.app",
  messagingSenderId: "531864817668",
  appId: "1:531864817668:web:e9d3085994c4c92196a551"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- 2. BATCH SETTINGS ---
const BATCHES = [
    { name: "MONTHLY", count: 400, prefix: "MO-", profile: "1 month", price: 10000, plan: "1 Month Unlimited" },
    { name: "WEEKLY",  count: 100, prefix: "WK-", profile: "1 week",  price: 3000,  plan: "1 Week Unlimited" },
    { name: "DAILY",   count: 100, prefix: "DY-", profile: "1 day",   price: 500,   plan: "1 Day Unlimited" },
    { name: "HOURLY",  count: 100, prefix: "HR-", profile: "1 hour",  price: 100,   plan: "1 Hour Unlimited" }
];

// --- 3. HELPER FUNCTIONS ---
function generateCode(prefix) {
    const chars = "abcdefghjkmnpqrstuvwxyz23456789"; 
    let rand = "";
    for (let i = 0; i < 5; i++) {
        rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return prefix + rand;
}

async function wipeFirebase() {
    console.log(`🔥 Wiping 'available_vouchers' collection...`);
    const colRef = collection(db, "available_vouchers");
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty) {
        console.log("   (Collection is already empty)");
        return;
    }

    const docs = snapshot.docs;
    let deletedCount = 0;
    
    for (let i = 0; i < docs.length; i += 400) {
        const batch = writeBatch(db);
        const chunk = docs.slice(i, i + 400);
        chunk.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        deletedCount += chunk.length;
        console.log(`   Deleted ${deletedCount} vouchers...`);
    }
    console.log("   ✅ Firebase Wiped.");
}

async function runReset() {
    console.log("\n⚠️  STARTING SYSTEM RESET ⚠️");
    console.log("------------------------------");

    // STEP 1: WIPE FIREBASE
    await wipeFirebase();

    // STEP 2: GENERATE NEW DATA
    console.log("\n⚙️  Generating 700 new vouchers...");
    
    let mikrotikScript = `# --- MIKROTIK MASTER IMPORT FILE ---\n`;
    mikrotikScript += `:log warning "--- STARTING DATABASE RESET ---"\n`;
    
    // FIX: Only remove users that ARE NOT the protected default-trial user
    mikrotikScript += `/ip hotspot user remove [find where name!="default-trial"]\n`; 
    mikrotikScript += `:delay 2s\n`;

    let allVouchers = [];

    BATCHES.forEach(batch => {
        console.log(`   Creating ${batch.count} codes for ${batch.name}...`);
        mikrotikScript += `\n:log info "Importing ${batch.name} Batch..."\n`;

        for (let i = 0; i < batch.count; i++) {
            const code = generateCode(batch.prefix);
            allVouchers.push({
                code: code,
                plan: batch.plan,
                price: batch.price,
                status: "available",
                createdAt: new Date()
            });

            mikrotikScript += `/ip hotspot user add name="${code}" password="${code}" profile="${batch.profile}" comment="Batch_${batch.name}"\n`;
        }
    });

    mikrotikScript += `\n:log warning "--- IMPORT COMPLETE ---"`;

    // STEP 3: SAVE MIKROTIK FILE
    fs.writeFileSync('mikrotik_import.rsc', mikrotikScript);
    console.log("\n📄 'mikrotik_import.rsc' has been updated.");

    // STEP 4: UPLOAD NEW CODES TO FIREBASE
    console.log("\n🚀 Uploading new codes to Firebase...");
    
    for (let i = 0; i < allVouchers.length; i += 400) {
        const batch = writeBatch(db);
        const chunk = allVouchers.slice(i, i + 400);
        
        chunk.forEach((v) => {
            const docRef = doc(collection(db, "available_vouchers"));
            batch.set(docRef, v);
        });
        
        await batch.commit();
        console.log(`   Uploaded batch of ${chunk.length}...`);
    }

    console.log("\n🎉 SUCCESS! System is reset and synced.");
    console.log("👉 ACTION: Drag the NEW 'mikrotik_import.rsc' into WinBox and run /import again.");
}

runReset();