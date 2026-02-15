"use client";
import React from 'react';
import { useRouter } from "next/navigation";
import { WifiOff, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-red-100">
      
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-start">
          <button 
            onClick={() => router.back()} 
            className="p-3 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        
        <div className="w-full max-w-sm">
          
          {/* Animated Icon */}
          <div className="relative w-24 h-24 mx-auto mb-8">
             <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
             <div className="relative bg-white w-24 h-24 rounded-full flex items-center justify-center shadow-xl shadow-red-50 border border-red-50">
               <WifiOff size={40} className="text-red-500" />
             </div>
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Page Not Found</h1>
          <p className="text-slate-500 text-sm mb-10 leading-relaxed">
            Oops! It seems you have wandered off the network coverage area.
          </p>

          <div className="space-y-3">
            <button 
              onClick={() => router.push('/')}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Home size={18} /> Go Back Home
            </button>
            
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
            >
              Check Dashboard
            </button>
          </div>

          <p className="mt-12 text-[10px] text-slate-400 font-mono">
            ERROR CODE: 404_LOST_SIGNAL
          </p>

        </div>
      </main>
    </div>
  );
}