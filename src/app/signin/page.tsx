"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { ArrowLeft, Wifi, Loader2, KeyRound, AlertCircle } from "lucide-react";
import { db } from '@/utils/db'; 

export default function SignInPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for history
    const lastCode = localStorage.getItem('nando_last_code');
    if (lastCode) setSavedCode(lastCode);
  }, []);

  // FIX: Added 'async' here
  const handleReconnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) return;
    
    setLoading(true);
    setError(null);

    try {
      // Simulate network delay properly in an async function
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // FIX: Added 'await' here so it actually waits for the database answer
      const validVoucher = await db.verify(code);
      
      // ALSO check if it matches the "Saved Code" (in case DB reset during dev)
      const isSavedMatch = code === savedCode;

      if (validVoucher || isSavedMatch) {
        router.push('/dashboard');
      } else {
        setLoading(false);
        setError("Invalid Code. Please check your receipt.");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Connection error. Try again.");
    }
  };

  const useSavedCode = () => {
    if(savedCode) {
      setCode(savedCode);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-start">
          <button onClick={() => router.back()} className="p-3 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          
          <div className="text-center mb-10">
            <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-100">
              <KeyRound size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 mt-2 text-sm">Enter your access code to reconnect.</p>
          </div>

          {/* Quick Login for Saved Code */}
          {savedCode && !code && (
            <div onClick={useSavedCode} className="mb-6 p-4 bg-white border border-blue-100 shadow-sm rounded-2xl flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all group">
              <div>
                <p className="text-[10px] font-bold text-blue-600 uppercase">Last Used Code</p>
                <p className="text-lg font-mono font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{savedCode}</p>
              </div>
              <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold">
                Auto-Fill
              </div>
            </div>
          )}

          <form onSubmit={handleReconnect} className="space-y-4">
            <div className={`bg-white p-2 rounded-3xl shadow-xl shadow-slate-200/50 border transition-colors relative
               ${error ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-100 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50'}
            `}>
              <input 
                type="text"
                placeholder="Enter Code (e.g. VIP-8821)"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-none text-center text-2xl font-mono font-bold tracking-widest focus:ring-0 outline-none placeholder:text-slate-300 text-slate-800"
              />
              
              {/* Error Icon inside input */}
              {error && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-pulse">
                  <AlertCircle size={24} />
                </div>
              )}
            </div>

            {/* Error Message Text */}
            {error && (
              <p className="text-center text-red-500 text-xs font-bold animate-bounce">
                {error}
              </p>
            )}

            <button
              disabled={loading || code.length < 4}
              className={`w-full py-5 rounded-3xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all
                ${loading 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-slate-900 text-white shadow-slate-300 hover:bg-slate-800 active:scale-95'
                }
              `}
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Wifi size={20} /> Reconnect Now</>}
            </button>
          </form>

          <p className="text-center mt-8 text-xs text-slate-400">
            Lost your code? Contact support.
          </p>
        </div>
      </main>
    </div>
  );
}