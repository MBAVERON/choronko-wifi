"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, Loader2, XCircle } from "lucide-react";
import { db } from '@/utils/db'; // Import the new DB

const plansConfig: any = {
  '1h': { price: '500', name: { en: 'Quick Surf', fr: 'Surf Rapide' }, color: 'bg-blue-600', gradient: 'from-blue-600 to-cyan-400' },
  '24h': { price: '1,000', name: { en: 'Day Pass', fr: 'Pass Jour' }, color: 'bg-purple-600', gradient: 'from-violet-600 to-purple-600' },
  'fam': { price: '3,000', name: { en: 'Family Plan', fr: 'Plan Famille' }, color: 'bg-orange-600', gradient: 'from-orange-500 to-red-500' },
  '30d': { price: '10,000', name: { en: 'Monthly Pass', fr: 'Pass Mensuel' }, color: 'bg-emerald-600', gradient: 'from-emerald-600 to-green-500' }
};

const content = {
  en: { back: "Back", currency: "FCFA", phoneLabel: "Mobile Money Number", payBtn: "Pay Now", hint: "Dial *126# (MTN) or #150# (Orange)" },
  fr: { back: "Retour", currency: "FCFA", phoneLabel: "Numéro Mobile Money", payBtn: "Payer", hint: "Composez *126# (MTN) ou #150# (Orange)" }
};

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') || '1h'; 
  const lang = (searchParams.get('lang') as 'en' | 'fr') || 'en';
  const activePlan = plansConfig[planId] || plansConfig['1h'];
  const t = content[lang];

  const [provider, setProvider] = useState<'mtn' | 'orange'>('mtn');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'failed'>('idle');

  const handlePay = () => {
    if (phone.length < 9) return;
    setStatus('loading');

    // 1. Simulate Payment Delay
    setTimeout(() => {
      // 2. Fail if number is 600000000
      if (phone === '600000000') {
        setStatus('failed');
        return;
      }

      // 3. GENERATE CODE
      const newCode = `CH-${Math.floor(10000 + Math.random() * 90000)}`;

      // 4. SAVE TO DATABASE (So Admin sees it)
      db.add({
        code: newCode,
        plan: activePlan.name[lang],
        price: activePlan.price,
        status: 'active',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // 5. Success Redirect
      router.push(`/connect?code=${newCode}&plan=${planId}&lang=${lang}`);
      
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans flex flex-col">
      <div className={`absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b ${activePlan.gradient} opacity-10 rounded-b-[40px] transition-all duration-500 -z-10`} />

      <header className="w-full z-40 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button onClick={() => router.back()} className="group flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-xl border border-white/10 text-slate-900 transition-all">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm hidden sm:inline">{t.back}</span>
          </button>
          <div className="flex items-center gap-1.5 opacity-60 text-slate-900 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <Lock size={12} /> <span className="text-[10px] font-bold uppercase tracking-widest">SSL Secure</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-start pt-6 px-4">
        <div className="w-full max-w-sm bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative z-10">
          <div className="p-8 text-center border-b border-slate-50 relative">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{activePlan.name[lang]}</p>
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight transition-all">
              {activePlan.price}<span className="text-lg text-slate-400 font-medium ml-1">{t.currency}</span>
            </h1>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
              <button onClick={() => setProvider('mtn')} className={`py-3 rounded-lg text-sm font-bold transition-all flex flex-col items-center gap-1 ${provider === 'mtn' ? 'bg-white shadow-sm text-slate-900 ring-1 ring-yellow-400' : 'text-slate-400 hover:text-slate-600'}`}>
                <span>MTN MoMo</span>{provider === 'mtn' && <div className="h-1 w-8 bg-[#FFCC00] rounded-full"></div>}
              </button>
              <button onClick={() => setProvider('orange')} className={`py-3 rounded-lg text-sm font-bold transition-all flex flex-col items-center gap-1 ${provider === 'orange' ? 'bg-white shadow-sm text-orange-600 ring-1 ring-orange-500' : 'text-slate-400 hover:text-slate-600'}`}>
                <span>Orange Money</span>{provider === 'orange' && <div className="h-1 w-8 bg-[#FF7900] rounded-full"></div>}
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">{t.phoneLabel}</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none">
                  <img src="https://flagcdn.com/w40/cm.png" alt="Cameroon" className="w-6 h-auto rounded-[2px] shadow-sm"/>
                  <span className="font-bold text-slate-500 text-lg tracking-tight">+237</span>
                  <div className="w-[1px] h-6 bg-slate-200"></div>
                </div>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))} placeholder="6XX XX XX XX" className={`w-full pl-28 pr-4 py-4 bg-slate-50 border-2 rounded-xl text-lg font-bold text-slate-900 focus:outline-none transition-all ${provider === 'mtn' ? 'focus:border-[#FFCC00] focus:bg-yellow-50/10' : 'focus:border-[#FF7900] focus:bg-orange-50/10'} ${!phone ? 'border-slate-100' : 'border-slate-300'}`} maxLength={9} />
              </div>
            </div>

            <button onClick={handlePay} disabled={status === 'loading' || phone.length < 9} className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 ${status === 'loading' ? 'bg-slate-300 shadow-none cursor-not-allowed' : (provider === 'mtn' ? 'bg-slate-900 hover:bg-slate-800 shadow-yellow-900/10' : 'bg-[#FF7900] hover:bg-[#e66e00] shadow-orange-500/20')}`}>
              {status === 'loading' ? <Loader2 className="animate-spin" /> : t.payBtn}
            </button>
          </div>
        </div>
        <p className="text-center mt-6 text-xs text-slate-400">{t.hint}</p>
      </div>

      {status === 'failed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xs rounded-[32px] p-6 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce"><XCircle size={32} /></div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Payment Failed</h2>
            <div className="flex flex-col gap-2">
              <button onClick={() => setStatus('idle')} className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors">Try Again</button>
              <button onClick={() => router.back()} className="w-full py-3 text-slate-400 font-bold hover:text-slate-600 text-xs uppercase tracking-widest">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return <Suspense fallback={<div>Loading...</div>}><PaymentContent /></Suspense>;
}