const fs = require('fs');

// --- CONFIGURATION ---
const BATCHES = [
    { name: "MONTHLY", count: 400, prefix: "MO-", profile: "1 month" },
    { name: "WEEKLY",  count: 100, prefix: "WK-", profile: "1 week" },
    { name: "DAILY",   count: 100, prefix: "DY-", profile: "1 day" },  // Check if your profile is "1 day" or "1 day "
    { name: "HOURLY",  count: 100, prefix: "HR-", profile: "1 hour" }
];

let routerOutput = `/log info "--- STARTING BULK IMPORT ---"\n`;
let jsOutput = `// --- COPY THESE ARRAYS INTO upload-vouchers.js ---\n\n`;

function generateCode(prefix) {
    const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // No confusing chars like i, l, 1, o, 0
    let rand = "";
    for (let i = 0; i < 5; i++) {
        rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return prefix + rand;
}

BATCHES.forEach(batch => {
    let codeList = [];
    
    // Header for Router File
    routerOutput += `\n# --- ${batch.name} CODES (${batch.count}) ---\n`;
    routerOutput += `:log info "Importing ${batch.name}..."\n`;

    for (let i = 0; i < batch.count; i++) {
        const code = generateCode(batch.prefix);
        codeList.push(`"${code}"`);
        
        // Add Router Command
        routerOutput += `/ip hotspot user add name=${code} password=${code} profile="${batch.profile}" comment="Batch_Final"\n`;
    }

    // Add JS Array
    jsOutput += `const ${batch.name}_CODES = [\n    ${codeList.join(', ')}\n];\n\n`;
});

routerOutput += `\n:log info "--- IMPORT COMPLETE ---"`;

// Write Files
fs.writeFileSync('router_commands.rsc', routerOutput);
fs.writeFileSync('voucher_list.js', jsOutput);

console.log("✅ DONE! Generated 2 files:");
console.log("   1. router_commands.rsc (Drag this into WinBox)");
console.log("   2. voucher_list.js (Copy these arrays to your upload script)");