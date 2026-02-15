"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldAlert } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // SIMPLE SECURITY: The password is "admin123"
    // In the real version, we will check this against a database.
    if (key === 'admin123') {
      router.push('/admin/dashboard');
    } else {
      setError(true);
      setKey('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <Lock className="text-blue-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Choronko Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Restricted Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="password"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setError(false);
              }}
              placeholder="Enter Admin Key"
              className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white text-center text-lg placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-500 text-sm font-bold animate-pulse">
              <ShieldAlert size={16} /> Access Denied
            </div>
          )}

          <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50">
            Access Dashboard <ArrowRight size={18} />
          </button>
        </form>

        <button 
          onClick={() => router.push('/')}
          className="w-full mt-6 text-slate-500 text-xs hover:text-slate-300 transition-colors"
        >
          ← Return to Website
        </button>

      </div>
    </div>
  );
}