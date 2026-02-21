const { initializeApp } = require("firebase/app");
const { getFirestore, collection, writeBatch, doc } = require("firebase/firestore");

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

// --- 2. PASTE YOUR MANUAL CODES HERE ---
// (Copy the arrays from the 'voucher_list.js' file you generated and paste them here)

const MONTHLY_CODES = [
    "MO-wcd8b", "MO-76g3w", "MO-esvqr", "MO-hb88e", "MO-6e2pu", "MO-9kzbu", "MO-kxb8d", "MO-dxeen", "MO-kmq4z", "MO-t6kxf", "MO-4kd5c", "MO-grq9j", "MO-kqm55", "MO-bg32c", "MO-h3jt7", "MO-zrfg2", "MO-r79re", "MO-jh5bc", "MO-nsffh", "MO-9j5uk", "MO-grb5u", "MO-v3jkt", "MO-q32mu", "MO-5z5ay", "MO-8w9wa", "MO-29chp", "MO-65pr5", "MO-cmmdf", "MO-65zt4", "MO-xn665", "MO-g98ku", "MO-mqcqc", "MO-xj6dh", "MO-paxqm", "MO-39nb6", "MO-y7w35", "MO-fj4t7", "MO-czdqw", "MO-zczrf", "MO-97dnv", "MO-29f2n", "MO-gyfgk", "MO-sv3tf", "MO-bjthh", "MO-sb7cr", "MO-8vvsf", "MO-v92y5", "MO-ujqym", "MO-s4cwj", "MO-4rba9", "MO-rbdju", "MO-yhq4u", "MO-yq4rx", "MO-4me56", "MO-3r9ba", "MO-hh8q9", "MO-q3ys6", "MO-pgkqc", "MO-dt9k9", "MO-4nqha", "MO-h2sxr", "MO-7uynv", "MO-znutn", "MO-efw6w", "MO-z4d9a", "MO-54den", "MO-4zdcd", "MO-dayh4", "MO-rkak4", "MO-9ertr", "MO-gw9jb", "MO-7955w", "MO-6k6ks", "MO-tr9wx", "MO-rb4ty", "MO-82tcb", "MO-7964t", "MO-w2z9h", "MO-z8s92", "MO-7h3f4", "MO-wsr6t", "MO-aq4b4", "MO-e9p68", "MO-5kmw8", "MO-w54pv", "MO-rj3gc", "MO-wzukx", "MO-2cgzu", "MO-t2uy9", "MO-asg5s", "MO-amrd8", "MO-g8ge9", "MO-kag6e", "MO-95fq8", "MO-ue3ab", "MO-utw56", "MO-utv8r", "MO-5zk7f", "MO-wx787", "MO-9np57", "MO-wn94c", "MO-9q4gu", "MO-2uutn", "MO-s2u4d", "MO-jw75j", "MO-tp4ms", "MO-m8phy", "MO-6x3p7", "MO-k2byy", "MO-e53sn", "MO-p4hhc", "MO-gf3uc", "MO-w3zm5", "MO-yezs7", "MO-2c4j9", "MO-7t4sj", "MO-csrjf", "MO-rxnrk", "MO-c7afw", "MO-g4evp", "MO-agkt5", "MO-h8euk", "MO-s2f5x", "MO-b9jcr", "MO-3eqjf", "MO-vgyb5", "MO-xzrmn", "MO-rjaze", "MO-t6dpk", "MO-was4v", "MO-x9qut", "MO-nzdga", "MO-8m7pg", "MO-kd27q", "MO-h68a4", "MO-bf4wj", "MO-wsqad", "MO-dnmka", "MO-9bbff", "MO-3c2km", "MO-8832p", "MO-kym7w", "MO-bnazg", "MO-8bjw7", "MO-nzshz", "MO-tb542", "MO-9jgm6", "MO-2fcj7", "MO-zf74h", "MO-hjqgx", "MO-37xkg", "MO-5342q", "MO-gbmxa", "MO-67rwj", "MO-aw66r", "MO-pv55z", "MO-szmxw", "MO-8p876", "MO-eg9zn", "MO-4s9eu", "MO-htj5m", "MO-2ju5b", "MO-52nf9", "MO-t8yws", "MO-twrep", "MO-hmz22", "MO-j7bxs", "MO-wgysa", "MO-rj56w", "MO-xnrq5", "MO-jhfxu", "MO-v6yzg", "MO-h3mzb", "MO-3g4qd", "MO-rkzfr", "MO-nssb2", "MO-cdv88", "MO-ytrdz", "MO-phkvu", "MO-xun8m", "MO-h2txs", "MO-utevd", "MO-ycvmq", "MO-hartw", "MO-rqtmu", "MO-d5zyz", "MO-fz2kv", "MO-358r8", "MO-vuse4", "MO-p87x5", "MO-fcuvg", "MO-65vfr", "MO-p87jm", "MO-4m6we", "MO-vac5z", "MO-nu38a", "MO-mn2ep", "MO-3vghf", "MO-7wk6v", "MO-tkpe4", "MO-jms35", "MO-eabvv", "MO-ub2z9", "MO-tr9mu", "MO-zazp8", "MO-gvhck", "MO-6wnhb", "MO-ke82g", "MO-68ek6", "MO-sqwms", "MO-q96gf", "MO-6s6qm", "MO-twadb", "MO-rq2sp", "MO-bfqs3", "MO-gbz59", "MO-z9yf3", "MO-zp7fr", "MO-2953v", "MO-upy9s", "MO-bdadw", "MO-bc883", "MO-q8dsm", "MO-uk55v", "MO-mdwmm", "MO-u2vbj", "MO-pr2db", "MO-u5st6", "MO-as9bg", "MO-teeqh", "MO-tzjr4", "MO-fa9vd", "MO-afsq3", "MO-hn3f9", "MO-n9wd5", "MO-rpg8v", "MO-jhpn4", "MO-z9wy5", "MO-b8ygq", "MO-2tc4a", "MO-eud3m", "MO-tcfkn", "MO-st5yw", "MO-ctnac", "MO-qjuqx", "MO-tk9du", "MO-sptrc", "MO-83xkc", "MO-vdeyq", "MO-ed3nq", "MO-qfgjd", "MO-fmec3", "MO-7q8nq", "MO-bw3rr", "MO-748hv", "MO-yf5uu", "MO-ajd55", "MO-35jhh", "MO-m8m4x", "MO-g5rjt", "MO-pkfz8", "MO-fcc68", "MO-fkn8n", "MO-m6en5", "MO-zz9bp", "MO-8dtwb", "MO-vpp3w", "MO-9esq9", "MO-ydghw", "MO-v4xq7", "MO-kfnkc", "MO-je4b2", "MO-mrr54", "MO-c6k93", "MO-49wug", "MO-64c6y", "MO-jkt4k", "MO-7perc", "MO-nexh9", "MO-w23fj", "MO-w2vj9", "MO-em4q6", "MO-5jvfd", "MO-aau34", "MO-p3tcq", "MO-pk8u5", "MO-h72xd", "MO-tzrgn", "MO-tq3k7", "MO-gd98x", "MO-9s3rs", "MO-h3fzv", "MO-nkgbb", "MO-9wksw", "MO-yz4b3", "MO-t5hx3", "MO-jn5dd", "MO-a88zy", "MO-4m5p6", "MO-nfe4u", "MO-v5bbu", "MO-cg56y", "MO-puf7s", "MO-hpnng", "MO-4wyff", "MO-45pmc", "MO-q4cjh", "MO-kuq28", "MO-qa4hq", "MO-n5mgy", "MO-nc9cs", "MO-364c8", "MO-fy9hf", "MO-88q5k", "MO-gwbvt", "MO-kxfds", "MO-ts62n", "MO-yqp4s", "MO-27833", "MO-xc423", "MO-sjdmg", "MO-hmm83", "MO-dbnwj", "MO-93gqn", "MO-ej8bf", "MO-8cs3q", "MO-egw35", "MO-gp56t", "MO-nka89", "MO-vsfvb", "MO-tr5pc", "MO-fbj3r", "MO-agbf3", "MO-z8mme", "MO-6e2tg", "MO-zhh4h", "MO-bfqbw", "MO-f5hkm", "MO-bae9v", "MO-m9m9x", "MO-8fmv6", "MO-eqqst", "MO-dpsfp", "MO-xs3e9", "MO-j99vk", "MO-fb3gh", "MO-rg3kp", "MO-pp6pv", "MO-2bgfr", "MO-uzdcv", "MO-3n8xb", "MO-8uxeh", "MO-x5kh5", "MO-2ddct", "MO-pepb5", "MO-egzns", "MO-mfc26", "MO-bmy7v", "MO-mege2", "MO-kk9wm", "MO-7vnmk", "MO-barhs", "MO-jegy9", "MO-dupy3", "MO-5pchk", "MO-nyxqx", "MO-5tfzw", "MO-afe33", "MO-7b6cn", "MO-846xt", "MO-569rf", "MO-726ud", "MO-26ukd", "MO-g3ku3", "MO-8rweu", "MO-9xgmw", "MO-7cxwj", "MO-px35s", "MO-n76mt", "MO-wbtr4", "MO-563m2", "MO-468p5", "MO-dasnx", "MO-t4jv8", "MO-79ebu", "MO-esuss", "MO-cyxmq", "MO-vch2c", "MO-63srp", "MO-e7yuy", "MO-qx86e", "MO-9hacr", "MO-qcf4s", "MO-w79tq", "MO-fnenx", "MO-barua", "MO-by5ht", "MO-smyf2", "MO-tjckw", "MO-wye7v"
];

const WEEKLY_CODES = [
   "WK-7sq24", "WK-rmc8c", "WK-gu5du", "WK-u444e", "WK-ntwj5", "WK-xrct4", "WK-uan9t", "WK-2k7qg", "WK-p3dqu", "WK-89zee", "WK-ze3hz", "WK-ugyzd", "WK-fsvke", "WK-7w2p6", "WK-6ne4n", "WK-4cxs9", "WK-wbeht", "WK-eg2bz", "WK-fkwqw", "WK-vy5am", "WK-rq8sy", "WK-2s5cj", "WK-55j94", "WK-39r7e", "WK-dyhme", "WK-dx8gw", "WK-zc23k", "WK-2yrqz", "WK-8fpjy", "WK-by7y6", "WK-9ym62", "WK-kgr63", "WK-bur7s", "WK-rdwmm", "WK-6y5qy", "WK-b5ug5", "WK-fdapz", "WK-z3j5t", "WK-4qjzh", "WK-a55m7", "WK-kywqn", "WK-dwu86", "WK-nrks2", "WK-furnk", "WK-5re2t", "WK-2e3jd", "WK-zdxx5", "WK-7rby7", "WK-np8t5", "WK-muczu", "WK-yvgck", "WK-p74s6", "WK-rh5vu", "WK-ttt4s", "WK-57phu", "WK-qxvme", "WK-txb55", "WK-udfpx", "WK-tp7tz", "WK-h2vfr", "WK-x4dd8", "WK-n8m7h", "WK-58jwd", "WK-ycnmw", "WK-ju83e", "WK-ry27k", "WK-8a5ye", "WK-yy44t", "WK-qc5y9", "WK-35vdd", "WK-q4vaj", "WK-j5dsx", "WK-3uepj", "WK-bnwpz", "WK-wdqbf", "WK-95x5v", "WK-c4jsc", "WK-jqc7q", "WK-c4kq4", "WK-8v2s5", "WK-ttst6", "WK-a6tg4", "WK-x4et9", "WK-vt63m", "WK-rbykr", "WK-vcq8k", "WK-uuv6z", "WK-2zgvg", "WK-7yzbm", "WK-bxjdg", "WK-4smrz", "WK-2j5zj", "WK-6naj7", "WK-up9dc", "WK-nt8mm", "WK-km4mu", "WK-cabw7", "WK-bzc8z", "WK-94qd4", "WK-5wbqt"
];

const DAILY_CODES = [
  "DY-7qvf8", "DY-jmhga", "DY-qmyub", "DY-brzs4", "DY-223uy", "DY-2tsmv", "DY-jg9uy", "DY-2x8b2", "DY-kamgx", "DY-ka7pp", "DY-smeft", "DY-tzctc", "DY-yyfby", "DY-r5krc", "DY-9t93c", "DY-wmrnr", "DY-x9867", "DY-f72td", "DY-ddwy4", "DY-qpt6z", "DY-chrcv", "DY-4nrt5", "DY-kfpyp", "DY-qetgv", "DY-nnnwj", "DY-mbj6w", "DY-npumn", "DY-9q963", "DY-ezdh7", "DY-582eb", "DY-2mz8e", "DY-pe3b5", "DY-mbnku", "DY-8cran", "DY-j6hdz", "DY-52kgt", "DY-h2jx3", "DY-wfgpn", "DY-ae3yp", "DY-58233", "DY-n63vu", "DY-m88t2", "DY-ybzs6", "DY-fjuay", "DY-au9gm", "DY-sy9nw", "DY-p6eq3", "DY-st4vx", "DY-env8p", "DY-d73n6", "DY-2mrqt", "DY-sxkn2", "DY-h4uuz", "DY-8jp4r", "DY-z9s24", "DY-dbyje", "DY-war2u", "DY-y4fdm", "DY-tck75", "DY-tgwq3", "DY-tuws7", "DY-aj8ad", "DY-3gxkt", "DY-k3k5v", "DY-cpp5s", "DY-8kdsf", "DY-xkxy4", "DY-gtqg5", "DY-j7tya", "DY-ks942", "DY-xpqpp", "DY-7xaxj", "DY-c5rfu", "DY-eqrjq", "DY-42fpp", "DY-evev2", "DY-cs2g8", "DY-prbxa", "DY-r7etw", "DY-3wp4u", "DY-epytf", "DY-98vv4", "DY-hyzdt", "DY-jxwvx", "DY-mq64z", "DY-hz23n", "DY-ms9hr", "DY-msnsk", "DY-e76cb", "DY-dgjmc", "DY-ftrj9", "DY-eaezz", "DY-cbyvf", "DY-a22ue", "DY-v9mdv", "DY-wc6nf", "DY-fhye5", "DY-sy7ff", "DY-r4d3m", "DY-874ez"
];

const HOURLY_CODES = [
   "HR-99c75", "HR-jrnbj", "HR-nw3d3", "HR-j5r5p", "HR-f6y3u", "HR-7cv2f", "HR-zhpcm", "HR-aqmb8", "HR-zyf2n", "HR-wyz94", "HR-aqbx3", "HR-93q65", "HR-y897u", "HR-5k5ac", "HR-qcpvs", "HR-xhxat", "HR-xbuby", "HR-fgndk", "HR-2c7k3", "HR-x2gkb", "HR-r7tge", "HR-66y8d", "HR-78y32", "HR-53gsk", "HR-qa7jn", "HR-9ex7u", "HR-8ugwm", "HR-e8qvt", "HR-etr5g", "HR-p89ud", "HR-t42hw", "HR-w5ms6", "HR-ddg32", "HR-tje5u", "HR-xejfq", "HR-ex4by", "HR-ujg85", "HR-6xkhn", "HR-6d97k", "HR-mycbs", "HR-7kfsa", "HR-z2pgf", "HR-8ypvz", "HR-ky369", "HR-bwz6e", "HR-cs8b5", "HR-8w52r", "HR-62ctq", "HR-bvx9h", "HR-u9yyq", "HR-w8uc9", "HR-g6x7q", "HR-fsgjh", "HR-rj3nz", "HR-h67mg", "HR-dc6j6", "HR-49gbc", "HR-4ws3p", "HR-ne62w", "HR-3fqum", "HR-6jxcn", "HR-sp9v7", "HR-a73n5", "HR-a7brv", "HR-vr54x", "HR-7cmzj", "HR-7wwvf", "HR-qhh4e", "HR-9uy8y", "HR-25nta", "HR-kfbqm", "HR-t6fwb", "HR-qq9dp", "HR-7d5cx", "HR-ufxv9", "HR-he43h", "HR-q8zvm", "HR-q3xky", "HR-28u2x", "HR-354pb", "HR-9sqbj", "HR-9296e", "HR-mb8br", "HR-equ2z", "HR-zj69v", "HR-ysh8y", "HR-a5fyb", "HR-3bs4t", "HR-8near", "HR-eavc4", "HR-6asmj", "HR-x9949", "HR-ustrv", "HR-jt5fh", "HR-g2n6n", "HR-h8w39", "HR-bwtvu", "HR-5s7jr", "HR-epu75", "HR-ja8m8"
];


// --- 3. UPLOAD FUNCTION ---
async function uploadBatch(codes, planName, price) {
    if (codes.length === 0) {
        console.log(`⚠️  No codes found for ${planName}, skipping...`);
        return;
    }
    
    console.log(`🚀 Uploading ${codes.length} vouchers for ${planName}...`);
    
    // Firestore allows max 500 writes per batch, so we chunk it just in case
    const batchSize = 400; 
    
    for (let i = 0; i < codes.length; i += batchSize) {
        const chunk = codes.slice(i, i + batchSize);
        const batch = writeBatch(db);
        
        chunk.forEach((code) => {
            // Create a new document in the 'available_vouchers' collection
            const docRef = doc(collection(db, "available_vouchers")); 
            batch.set(docRef, {
                code: code,
                plan: planName,
                price: price,
                status: "available", // Ready to be sold
                createdAt: new Date()
            });
        });

        await batch.commit();
        console.log(`   ✅ Batch of ${chunk.length} uploaded successfully.`);
    }
}

async function startUpload() {
    console.log("--- STARTING UPLOAD PROCESS ---");
    
    // Adjust prices to match your actual pricing in CFA
    await uploadBatch(MONTHLY_CODES, "1 Month Unlimited", 10000); 
    await uploadBatch(WEEKLY_CODES, "1 Week Unlimited", 3000);
    await uploadBatch(DAILY_CODES, "1 Day Unlimited", 500);
    await uploadBatch(HOURLY_CODES, "1 Hour Unlimited", 100);
    
    console.log("--- UPLOAD COMPLETE 🎉 ---");
    process.exit(0);
}

startUpload();