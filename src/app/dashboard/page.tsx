"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Wifi, Clock, BarChart3, LogOut, ArrowRight, ShieldCheck, History, X, Copy, Ticket } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // Load history from phone storage when dashboard opens
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('nando_history') || '[]');
    setHistory(saved);
  }, []);

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-green-100 pb-10 relative">
      
      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-xl text-white shadow-lg shadow-slate-200">
              <Wifi size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">Choronko WIFI</span>
          </div>

          <div className="flex items-center gap-2">
            {/* NEW: History Button */}
            <button 
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider transition-all border border-blue-100"
            >
               <History size={16} /> <span className="hidden sm:inline">My Codes</span>
            </button>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wider transition-all border border-red-100"
            >
               <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-8">

        {/* 2. Status Card (The "Hero") */}
        <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest">Internet Active</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                You are <span className="text-emerald-500">Online</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">IP: 192.168.88.24 • <span className="font-mono">Choronko Secure</span></p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4 min-w-[200px]">
              <div className="bg-white p-3 rounded-xl shadow-sm text-slate-400">
                <Clock size={24} />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time Left</span>
                <span className="block text-2xl font-mono font-bold text-slate-800">23:58:12</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BarChart3 size={24} />
             </div>
             <div>
                <h3 className="text-slate-900 font-bold text-lg">Unlimited Data</h3>
                <p className="text-slate-400 text-xs font-medium">No caps. Stream all day.</p>
             </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShieldCheck size={24} />
             </div>
             <div>
                <h3 className="text-slate-900 font-bold text-lg">Secure Connection</h3>
                <p className="text-slate-400 text-xs font-medium">Your device is protected.</p>
             </div>
          </div>
        </div>

        {/* 4. "Extend" Banner */}
        <div className="bg-slate-900 rounded-[24px] p-8 text-white relative overflow-hidden group cursor-pointer" onClick={() => router.push('/')}>
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Need more time?</h2>
                <p className="text-slate-400 text-sm">Top up your account instantly.</p>
              </div>
              <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-100 transition-colors">
                 Extend Plan <ArrowRight size={16} />
              </button>
           </div>
        </div>

        <p className="text-center text-[10px] text-slate-300 mt-10 uppercase tracking-widest">
          Session ID: 883-XJ-99
        </p>

      </div>

      {/* --- HISTORY MODAL (POPUP) --- */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <History size={20} className="text-blue-600"/> Purchase History
              </h2>
              <button 
                onClick={() => setShowHistory(false)}
                className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {history.length === 0 ? (
                <div className="text-center py-10">
                  <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Ticket size={24} />
                  </div>
                  <p className="text-slate-500 text-sm">No codes found on this device.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">{item.planName}</p>
                        <p className="text-xl font-mono font-bold text-slate-900 tracking-wider">{item.code}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{item.date}</p>
                      </div>
                      <button 
                        onClick={() => navigator.clipboard.writeText(item.code)}
                        className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-50 text-center">
              <button 
                onClick={() => setShowHistory(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}