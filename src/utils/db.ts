import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  doc,
  setDoc,
  getDoc,
  Timestamp
} from "firebase/firestore";

// --- FIX IS HERE: We import 'db' but call it 'firestore' inside this file ---
import { db as firestore } from './firebase';

export type Voucher = {
  id?: string;
  code: string;
  plan: string;
  price: string;
  status: 'active' | 'used' | 'expired';
  createdAt: any;
};

// --- DEFAULT PRICING ---
export const defaultPricing = {
  '1h': { price: '500', name: { en: 'Quick Surf', fr: 'Surf Rapide' } },
  '24h': { price: '1,000', name: { en: 'Day Pass', fr: 'Pass Jour' } },
  'fam': { price: '3,000', name: { en: 'Family Plan', fr: 'Plan Famille' } },
  '30d': { price: '10,000', name: { en: 'Monthly Pass', fr: 'Pass Mensuel' } }
};

export const db = {
  // --- 1. GET ALL SALES ---
  getAll: async () => {
    try {
      const q = query(collection(firestore, "vouchers"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
    } catch (e) {
      console.error("Error fetching vouchers:", e);
      return [];
    }
  },

  // --- 2. ADD NEW SALE ---
  add: async (voucher: any) => {
    try {
      const docRef = await addDoc(collection(firestore, "vouchers"), {
        ...voucher,
        createdAt: Timestamp.now(), 
        status: voucher.status || 'active'
      });
      console.log("✅ Success! Voucher saved to Cloud with ID:", docRef.id);
      return docRef.id;
    } catch (e) {
      console.error("❌ Error adding voucher:", e);
      throw e;
    }
  },

  // --- 3. VERIFY CODE ---
  verify: async (code: string) => {
    try {
      const q = query(
        collection(firestore, "vouchers"), 
        where("code", "==", code), 
        where("status", "==", "active")
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
      }
      return null;
    } catch (e) {
      console.error("Error verifying code:", e);
      return null;
    }
  },

  // --- 4. GET SETTINGS ---
  getPrices: async () => {
    try {
      const docRef = doc(firestore, "settings", "prices");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        await setDoc(docRef, defaultPricing);
        return defaultPricing;
      }
    } catch (e) {
      console.error("Error getting prices:", e);
      return defaultPricing;
    }
  },

  // --- 5. SAVE SETTINGS ---
  savePrices: async (newPrices: any) => {
    try {
      const docRef = doc(firestore, "settings", "prices");
      await setDoc(docRef, newPrices);
      console.log("✅ Prices updated in Cloud!");
    } catch (e) {
      console.error("Error saving prices:", e);
      throw e;
    }
  },

  init: () => {
    console.log("🚀 Choronko Firebase Module Ready");
  }
};