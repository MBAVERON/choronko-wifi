"use client";
import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import { Wifi, CheckCircle, Copy, Loader2, Home, ArrowLeft } from "lucide-react";

function ConnectContent() {
  const params = useSearchParams();
  const router = useRouter();
  
  const code = params.get('code') || 'ERROR';
  const [status, setStatus] = useState<'ready' | 'connecting' | 'success'>('ready');

  const handleConnect = () => {
    setStatus('connecting');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => router.push('/dashboard'), 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans flex flex-col">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-green-500 to-emerald-400 opacity-10 rounded-b-[50px] -z-10" />

      {/* --- HEADER (Matches Landing Page Layout) --- */}
      <header className="w-full z-50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          
          {/* Left: Back Button */}
          <button 
            onClick={() => router.back()} 
            className="p-2.5 rounded-xl bg-white/20 hover:bg-white/40 text-slate-800 shadow-sm backdrop-blur-md transition-all border border-white/10"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Right: Home Button */}
          <button 
            onClick={() => router.push('/')} 
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/40 text-slate-800 text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md transition-all border border-white/10"
          >
            <Home size={16} /> <span className="hidden sm:inline">Home</span>
          </button>

        </div>
      </header>

      {/* Main Content Centered */}
      <div className="flex-1 flex flex-col items-center justify-start pt-6 px-4">
        
        {/* Main Card */}
        <div className="w-full max-w-sm relative z-10">
          
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-full shadow-xl shadow-green-100 animate-bounce">
              <CheckCircle size={64} className="text-green-500" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Success!</h1>
            <p className="text-slate-500 text-sm">You are ready to connect.</p>
          </div>

          {/* Glass Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl shadow-slate-200/50 border border-white p-8 text-center">
            
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Your Access Code</p>
            
            <div className="bg-slate-50 rounded-2xl p-4 mb-8 flex items-center justify-between border-2 border-slate-100 border-dashed group hover:border-green-200 transition-colors">
              <span className="text-3xl font-mono font-bold text-slate-800 tracking-widest">{code}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(code)}
                className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Copy size={20} />
              </button>
            </div>

            <button
              onClick={handleConnect}
              disabled={status !== 'ready'}
              className={`w-full py-5 rounded-2xl font-bold text-lg text-white shadow-lg shadow-green-200/50 flex items-center justify-center gap-3 transition-all transform active:scale-95
                ${status === 'success' ? 'bg-green-500' : 'bg-slate-900 hover:bg-slate-800'}
              `}
            >
              {status === 'connecting' ? (
                <> <Loader2 className="animate-spin" /> Authenticating... </>
              ) : status === 'success' ? (
                <> <Wifi className="animate-pulse" /> Connected! </>
              ) : (
                <> <Wifi /> CONNECT NOW </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ConnectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConnectContent />
    </Suspense>
  );
}