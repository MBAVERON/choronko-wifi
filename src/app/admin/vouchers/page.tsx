"use client";
import { useState, useEffect } from "react";
import { db } from "@/utils/firebase"; 
import { collection, getDocs, query, updateDoc, doc, addDoc, Timestamp } from "firebase/firestore";

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Moved outside useEffect so we can call it after making a sale
  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "available_vouchers"));
      const snapshot = await getDocs(q);
      
      const voucherList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setVouchers(voucherList);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  // --- THE NEW CASH SALE LOGIC ---
  const handleCashSale = async (voucher: any) => {
    const price = window.prompt(`Enter amount collected in cash for plan "${voucher.plan}":\n(e.g., 500, 1000)`, "");
    
    if (!price) return; // Admin cancelled the prompt

    try {
      // 1. Mark the specific code as sold in the Vault
      const voucherRef = doc(db, "available_vouchers", voucher.id);
      await updateDoc(voucherRef, {
        status: "sold",
        soldTo: "Admin (Cash Sale)"
      });

      // 2. Log the sale in the main 'vouchers' collection so the Dashboard sees the revenue
      await addDoc(collection(db, "vouchers"), {
        code: voucher.code,
        plan: voucher.plan,
        price: price, 
        status: "sold",
        createdAt: Timestamp.now()
      });

      alert(`Success! Code ${voucher.code} marked as sold for ${price} FCFA.`);
      fetchVouchers(); // Refresh the table automatically
    } catch (error) {
      console.error(error);
      alert("Error processing cash sale.");
    }
  };

  // Filter by Status AND Search Query
  const filteredVouchers = vouchers.filter(v => {
    const matchesStatus = filter === "all" || v.status === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (v.code && v.code.toLowerCase().includes(searchLower)) ||
      (v.soldTo && v.soldTo.toLowerCase().includes(searchLower));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Voucher Vault ({filteredVouchers.length})</h1>
        
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search code or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded shadow-sm w-full md:w-64"
          />

          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded shadow-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="available">Available/Active</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading your codes from Chronko WiFi database...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-gray-100 sticky top-0 shadow">
                <tr>
                  <th className="p-4 border-b font-semibold">Code</th>
                  <th className="p-4 border-b font-semibold">Plan Category</th>
                  <th className="p-4 border-b font-semibold">Status</th>
                  <th className="p-4 border-b font-semibold">Sold To (Phone)</th>
                  <th className="p-4 border-b font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVouchers.map((voucher, index) => (
                  <tr key={voucher.id || index} className="hover:bg-gray-50">
                    <td className="p-4 border-b font-mono font-medium text-blue-600">
                      {voucher.code}
                    </td>
                    <td className="p-4 border-b text-gray-700">
                      {voucher.plan}
                    </td>
                    <td className="p-4 border-b">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        voucher.status !== 'sold' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {voucher.status}
                      </span>
                    </td>
                    <td className="p-4 border-b text-gray-500">
                      {voucher.soldTo ? voucher.soldTo : "-"}
                    </td>
                    <td className="p-4 border-b text-right">
                      {/* Button only shows if code is NOT sold */}
                      {voucher.status !== 'sold' && (
                        <button 
                          onClick={() => handleCashSale(voucher)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-bold shadow-sm transition-colors"
                        >
                          Sell (Cash)
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                
                {filteredVouchers.length === 0 && (
                  <tr>
                    {/* Updated colSpan to 5 because we added the Action column */}
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No codes found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}