"use client";
import React from 'react';
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Mail, Phone } from "lucide-react";

export default function LegalPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6">
      
      <header className="max-w-3xl mx-auto mb-8">
        <button 
          onClick={() => router.back()} 
          className="p-3 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </header>

      <main className="max-w-3xl mx-auto bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-100">
        
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="text-blue-600" size={32} />
          <h1 className="text-3xl font-extrabold text-slate-900">Terms & Support</h1>
        </div>

        <div className="space-y-8 text-slate-600 leading-relaxed">
          
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Service Description</h2>
            <p className="text-sm">
              Choronko WIFI provides time-based internet access vouchers. 
              The service is provided "as is" and speeds may vary based on network congestion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">2. Refunds</h2>
            <p className="text-sm">
              Purchases are final. However, if a generated code fails to work due to a system error, 
              users are eligible for a replacement code or refund within 24 hours of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">3. Usage Policy</h2>
            <p className="text-sm">
              Illegal activities, torrenting, or network abuse will result in an immediate 
              ban without refund.
            </p>
          </section>

          <div className="border-t border-slate-100 pt-8 mt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm"><Mail size={20} className="text-slate-400"/></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Email</p>
                  <p className="font-bold text-slate-900">support@choronko.com</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm"><Phone size={20} className="text-slate-400"/></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">WhatsApp</p>
                  <p className="font-bold text-slate-900">+237 6XX XX XX XX</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="text-center mt-10 text-xs text-slate-400">
        © 2026 Choronko WIFI.
      </footer>
    </div>
  );
}