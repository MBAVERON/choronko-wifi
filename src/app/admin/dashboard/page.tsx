"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, CreditCard, Banknote, RefreshCw, LogOut, Plus, X } from "lucide-react";
import { db, Voucher } from '@/utils/db'; // Connect to DB

export default function AdminDashboard() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    // 1. Initialize data
    db.init();
    
    // 2. Load immediately
    setVouchers(db.getAll());

    // 3. AUTO-REFRESH (Polling every 2 seconds)
    // This allows you to see sales appear live!
    const interval = setInterval(() => {
      setVouchers(db.getAll());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setVouchers([...db.getAll()]); 
  };

  const handleCreate = (plan: string, price: string) => {
    const newCode = `CH-${Math.floor(1000 + Math.random() * 9000)}`; 
    const newVoucher: Voucher = {
      code: newCode,
      plan,
      price,
      status: 'active',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    db.add(newVoucher); 
    refreshData();      
    setShowModal(false); 
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-900">
      
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col p-6 fixed h-full z-10">
        <div className="text-xl font-bold tracking-tight mb-10 flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">C</div>
           Choronko Admin
        </div>
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/50">
            <LayoutDashboard size={18} /> Overview
          </button>
        </nav>
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold mt-auto">
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm">Welcome back, Boss.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={refreshData} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 shadow-sm">
                <RefreshCw size={20} />
             </button>
             <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800">
                <Plus size={16} /> <span className="hidden sm:inline">New Voucher</span>
             </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-50 text-green-500"><Banknote size={28}/></div>
             <div><p className="text-xs font-bold text-slate-400 uppercase">Revenue</p><p className="text-2xl font-extrabold">45,000</p></div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-500"><Users size={28}/></div>
             <div><p className="text-xs font-bold text-slate-400 uppercase">Active</p><p className="text-2xl font-extrabold">12</p></div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-50 text-purple-500"><CreditCard size={28}/></div>
             <div><p className="text-xs font-bold text-slate-400 uppercase">Sold</p><p className="text-2xl font-extrabold">{vouchers.length}</p></div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-900">All Vouchers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {vouchers.map((v, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">{v.code}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{v.plan}</td>
                    <td className="px-6 py-4 text-slate-600">{v.price}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{v.createdAt}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                        ${v.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}
                      `}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* --- CREATE VOUCHER MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Generate Code</h2>
              <button onClick={() => setShowModal(false)} className="p-2 bg-slate-100 rounded-full"><X size={16}/></button>
            </div>
            
            <div className="space-y-3">
              <button onClick={() => handleCreate('Quick Surf', '500')} className="w-full p-4 border border-slate-200 rounded-xl flex justify-between hover:border-blue-500 hover:bg-blue-50">
                <span className="font-bold text-slate-700">Quick Surf (1h)</span>
                <span className="font-mono text-slate-400">500 FCFA</span>
              </button>
              <button onClick={() => handleCreate('Day Pass', '1,000')} className="w-full p-4 border border-slate-200 rounded-xl flex justify-between hover:border-blue-500 hover:bg-blue-50">
                <span className="font-bold text-slate-700">Day Pass (24h)</span>
                <span className="font-mono text-slate-400">1,000 FCFA</span>
              </button>
              <button onClick={() => handleCreate('Monthly', '10,000')} className="w-full p-4 border border-slate-200 rounded-xl flex justify-between hover:border-blue-500 hover:bg-blue-50">
                <span className="font-bold text-slate-700">Monthly VIP</span>
                <span className="font-mono text-slate-400">10,000 FCFA</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}