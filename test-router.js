const RosClient = require('ros-client');

// --- FINAL CONFIG CHECK ---
const config = {
    host: '10.0.0.1',       // Your Gateway IP
    user: 'apiuser',        // Must match WinBox User
    password: '1234',       // Must match WinBox Password
    port: 8728,             // Must match IP -> Services -> api
    timeout: 10000          // 10 seconds to be patient
};

const api = new RosClient(config);

console.log("\n🔍 Starting Final Connection Test...");
console.log(`📡 Target: ${config.host} (Port ${config.port})`);

api.connect()
    .then(() => {
        console.log("✅ LOGIN SUCCESSFUL! We are in.");
        // Ask for the router's name to prove we can talk
        return api.command('/system/identity/print');
    })
    .then((data) => {
        console.log("📝 Router Name:", data[0].name);
        console.log("🎉 DIAGNOSIS: API is fully functional.");
        api.close();
    })
    .catch((err) => {
        console.error("❌ FAILURE:", err.message);
        console.log("\n💡 IF THIS FAILED with 'Error 6':");
        console.log("   1. Go to System -> Users -> Groups -> 'full'");
        console.log("   2. CHECK the 'api' box. (It is usually unchecked!)");
        api.close();
    });