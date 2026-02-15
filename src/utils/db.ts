export type Voucher = {
  code: string;
  plan: string;
  price: string;
  status: 'active' | 'used' | 'expired';
  createdAt: string;
};

const DB_KEY = 'choronko_master_db';

// Helper to get data safely
const getData = (): Voucher[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(DB_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const db = {
  // Get all vouchers (for Admin)
  getAll: () => {
    return getData();
  },

  // Add a new voucher (for Payment Page)
  add: (voucher: Voucher) => {
    const current = getData();
    const updated = [voucher, ...current];
    localStorage.setItem(DB_KEY, JSON.stringify(updated));
  },

  // Verify a code (for Sign In)
  verify: (code: string) => {
    const vouchers = getData();
    return vouchers.find(v => v.code === code && v.status === 'active');
  },
  
  // Initialize with dummy data if empty
  init: () => {
    if (typeof window !== 'undefined' && !localStorage.getItem(DB_KEY)) {
      const dummy = [
        { code: 'VIP-8821', plan: 'Monthly Pass', price: '10,000', status: 'active', createdAt: '2 mins ago' },
      ];
      localStorage.setItem(DB_KEY, JSON.stringify(dummy));
    }
  }
};