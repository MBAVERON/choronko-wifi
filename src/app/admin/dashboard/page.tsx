"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, CreditCard, Banknote, RefreshCw, LogOut, Plus, X, Settings, Search
} from "lucide-react";
import { db } from '@/utils/db'; 

export default function AdminDashboard() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await db.getAll(); 
      
      // SAFETY CHECK: Ensure data is an array before using .reduce
      if (Array.isArray(data)) {
        setVouchers(data);
        
        const total = data.reduce((sum: number, v: any) => {
          // Remove commas and convert price string to number
          const priceStr = v.price ? String(v.price).replace(/,/g, '') : "0";
          const priceNum = parseInt(priceStr) || 0;
          return sum + priceNum;
        }, 0);
        
        setRevenue(total);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-refresh every 30 seconds to stay updated with cloud sales
    const interval = setInterval(loadData, 30000); 
    return () => clearInterval(interval);
  }, []);

  const handleCreate = async (plan: string, price: string) => {
    const newCode = `CH-${Math.floor(1000 + Math.random() * 9000)}`; 
    const newVoucher = {
      code: newCode,
      plan,
      price,
      status: 'active'
    };
    
    try {
      await db.add(newVoucher); 
      await loadData(); // Refresh list after adding
      setShowModal(false); 
    } catch (err) {
      alert("Error saving to cloud. Check internet connection.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-900">
      
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col p-6 fixed h-full z-10">
        <div className="text-xl font-bold tracking-tight mb-10 flex flex-col items-center gap-4">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center overflow-hidden p-2 shadow-lg shadow-blue-900/50">
             <img src="/logo.png" alt="Logo" className="h-full w-auto object-contain" />
           </div>
           <span>Choronko Admin</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/50">
            <LayoutDashboard size={18} /> Overview
          </button>
          
          {/* NEW: Voucher Vault Sidebar Link */}
          <button 
            onClick={() => router.push('/admin/vouchers')} 
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl text-sm font-bold transition-all"
          >
            <Search size={18} /> Voucher Vault
          </button>

          <button 
            onClick={() => router.push('/admin/settings')} 
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl text-sm font-bold transition-all"
          >
            <Settings size={18} /> Settings
          </button>
        </nav>

        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold mt-auto mb-4">
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm">
                {loading ? "Syncing with Cloud..." : "Real-time Sales Monitor"}
            </p>
          </div>
          <div className="flex gap-3">
             <button onClick={loadData} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 shadow-sm">
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
             </button>
             <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800">
                <Plus size={16} /> <span className="hidden sm:inline">New Voucher</span>
             </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-50 text-green-500"><Banknote size={28}/></div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase">Total Revenue</p>
               <p className="text-2xl font-extrabold">{revenue.toLocaleString()} FCFA</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-500"><Users size={28}/></div>
             <div><p className="text-xs font-bold text-slate-400 uppercase">Active Users</p><p className="text-2xl font-extrabold">{vouchers.length > 0 ? "Live" : "0"}</p></div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-50 text-purple-500"><CreditCard size={28}/></div>
             <div><p className="text-xs font-bold text-slate-400 uppercase">Total Sold</p><p className="text-2xl font-extrabold">{vouchers.length}</p></div>
          </div>
        </div>

        {/* NEW: Voucher Vault Access Banner */}
        <div className="bg-blue-600 p-6 rounded-[24px] shadow-lg mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Search size={20} /> Voucher Vault
            </h2>
            <p className="text-blue-100 text-sm mt-1">View, search, and manage all automated Chronko WiFi codes and customers.</p>
          </div>
          
          <button 
            onClick={() => router.push('/admin/vouchers')} 
            className="bg-white text-blue-600 font-bold py-3 px-6 rounded-xl shadow hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            Open Vault &rarr;
          </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-900">Recent Manual Sales</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {vouchers.map((v, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">{v.code}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{v.plan}</td>
                    <td className="px-6 py-4 text-slate-600">{v.price} FCFA</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                        ${v.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}
                      `}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!loading && vouchers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-slate-400 italic">
                      No sales recorded in the cloud yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* --- CREATE VOUCHER MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Manual Sale</h2>
              <button onClick={() => setShowModal(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={16}/></button>
            </div>
            
            <div className="space-y-3">
              <button onClick={() => handleCreate('Quick Surf', '500')} className="w-full p-4 border border-slate-200 rounded-xl flex justify-between hover:border-blue-500 transition-all">
                <span className="font-bold">1 Hour</span>
                <span>500 FCFA</span>
              </button>
              <button onClick={() => handleCreate('Day Pass', '1,000')} className="w-full p-4 border border-slate-200 rounded-xl flex justify-between hover:border-blue-500 transition-all">
                <span className="font-bold">24 Hours</span>
                <span>1,000 FCFA</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}