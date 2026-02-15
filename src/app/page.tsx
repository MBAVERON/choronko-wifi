"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Wifi, Zap, Clock, Users, Star, Lock, Globe } from "lucide-react";

// --- 1. TRANSLATION CONFIGURATION ---
const content = {
  en: {
    status: "Online",
    title: "Select Your",
    titleHighlight: "Access Pass",
    subtitle: "High-speed, unlimited internet.",
    secureLabel: "Secured Payments",
    footer: "© 2026 Choronko WIFI. All rights reserved.",
    currency: "FCFA"
  },
  fr: {
    status: "En Ligne",
    title: "Choisissez Votre",
    titleHighlight: "Pass d'Accès",
    subtitle: "Internet haut débit illimité.",
    secureLabel: "Paiements Sécurisés",
    footer: "© 2026 Choronko WIFI. Tous droits réservés.",
    currency: "FCFA"
  }
};

// --- 2. PLANS CONFIGURATION ---
const plans = [
  { 
    id: '1h', 
    name: { en: 'Quick Surf', fr: 'Surf Rapide' },
    price: '500', 
    duration: { en: '1 Hour', fr: '1 Heure' },
    tag: null,
    color: 'bg-blue-500', 
    soft: 'bg-blue-50',
    text: 'text-blue-600',
    icon: Zap
  },
  { 
    id: '24h', 
    name: { en: 'Day Pass', fr: 'Pass Jour' },
    price: '1,000', 
    duration: { en: '24 Hours', fr: '24 Heures' },
    tag: { en: 'POPULAR', fr: 'POPULAIRE' },
    color: 'bg-purple-500', 
    soft: 'bg-purple-50',
    text: 'text-purple-600',
    icon: Clock
  },
  { 
    id: 'fam', 
    name: { en: 'Family Plan', fr: 'Plan Famille' },
    price: '3,000', 
    duration: { en: '3 Devices / 24h', fr: '3 Appareils / 24h' },
    tag: null,
    color: 'bg-orange-500', 
    soft: 'bg-orange-50',
    text: 'text-orange-600',
    icon: Users
  },
  { 
    id: '30d', 
    name: { en: 'Monthly Pass', fr: 'Pass Mensuel' },
    price: '10,000', 
    duration: { en: '30 Days / 1 Device', fr: '30 Jours / 1 Appareil' },
    tag: { en: 'BEST VALUE', fr: 'MEILLEURE OFFRE' },
    color: 'bg-emerald-500', 
    soft: 'bg-emerald-50',
    text: 'text-emerald-600',
    icon: Star,
    highlight: true
  }
];

export default function LandingPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'fr'>('en');

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'fr' : 'en');
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100 pb-6">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-xl text-white shadow-lg shadow-slate-200">
            <Wifi size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">Choronko WIFI</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-xs font-bold text-slate-600 border border-slate-200"
          >
            <Globe size={16} />
            {lang === 'en' ? 'EN' : 'FR'}
          </button>

          <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-xl border border-green-200">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-green-700 uppercase">{t.status}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6">

        {/* Hero Section */}
        <div className="pt-10 pb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-3">
            {t.title} <br className="sm:hidden"/> <span className="text-blue-600">{t.titleHighlight}</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-lg max-w-lg mx-auto leading-relaxed mb-4">
            {t.subtitle}
          </p>
          
          <button 
             onClick={() => router.push('/signin')}
             className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline"
          >
             Already have a code? Login here
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => router.push(`/payment?plan=${plan.id}&lang=${lang}`)}
              className={`relative group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                ${plan.highlight 
                  ? 'md:col-span-2 ring-2 ring-emerald-400 shadow-xl shadow-emerald-100/50' 
                  : 'hover:shadow-slate-200 bg-white border border-slate-100'
                }
                rounded-[28px] overflow-hidden
              `}
            >
              {plan.tag && (
                <div className={`absolute top-0 right-0 px-4 py-2 rounded-bl-2xl text-[10px] font-bold uppercase tracking-wider z-10
                  ${plan.highlight ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}
                `}>
                  {plan.tag[lang]}
                </div>
              )}

              <div className={`p-6 md:p-8 flex items-center justify-between relative
                 ${plan.highlight ? 'bg-gradient-to-r from-white to-emerald-50' : 'bg-white'}
              `}>
                <div className="flex items-center gap-5 md:gap-6 z-10">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center ${plan.soft} ${plan.text} shadow-sm group-hover:scale-110 transition-transform`}>
                    <plan.icon size={28} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl md:text-2xl text-slate-800 leading-tight">{plan.name[lang]}</h3>
                    <p className="text-xs md:text-sm font-semibold text-slate-400 flex items-center gap-1 mt-1">
                      {plan.duration[lang]}
                    </p>
                  </div>
                </div>
                <div className="text-right z-10">
                  <span className={`block font-extrabold text-2xl md:text-3xl ${plan.text}`}>{plan.price}</span>
                  <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wide">{t.currency}</span>
                </div>
                <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-3xl ${plan.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center pb-8">
          <div className="flex items-center justify-center gap-1.5 mb-3 opacity-60">
              <Lock size={10} className="text-slate-400"/>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.secureLabel}</span>
          </div>
          
          <div className="flex justify-center gap-2 items-center mb-6">
              <div className="h-6 px-2 bg-[#FFCC00] rounded flex items-center justify-center shadow-sm cursor-default">
                <span className="text-[9px] font-extrabold text-slate-900 tracking-tighter">MTN</span>
              </div>
              <div className="h-6 px-2 bg-[#FF7900] rounded flex items-center justify-center shadow-sm cursor-default">
                <span className="text-[9px] font-extrabold text-white tracking-tighter">orange</span>
              </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <p className="text-[10px] text-slate-300">
              {t.footer}
            </p>
            <button 
              onClick={() => router.push('/legal')}
              className="text-[10px] text-slate-400 underline hover:text-slate-500"
            >
              Terms & Support
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}