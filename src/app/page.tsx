"use client";
import React, { useState, useEffect } from 'react';
import { 
  Wifi, Zap, Users, Clock, Globe, ArrowRight, Star, ShieldCheck, Sparkles, 
  MessageCircle, Phone, MapPin, Mail 
} from "lucide-react";
import { db, defaultPricing } from '@/utils/db';
import { useLanguage } from '@/context/LanguageContext'; 

// --- CONTACT INFO ---
const WHATSAPP_NUMBER = "677735248"; 

// --- STYLING CONFIGURATION ---
const specificStyles: any = {
  '1h':  { icon: Zap,   color: 'text-green-600',   bg: 'bg-green-100',   gradient: 'from-green-500 to-emerald-400' },
  '24h': { icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100', gradient: 'from-purple-600 to-indigo-600', popular: true },
  'fam': { icon: Users, color: 'text-orange-600', bg: 'bg-orange-100', gradient: 'from-orange-500 to-red-500' },
  '30d': { icon: Globe, color: 'text-blue-600',   bg: 'bg-blue-100',   gradient: 'from-blue-600 to-cyan-500' }
};

const fallbackStyles = [
  { icon: Star,        gradient: 'from-pink-500 to-rose-500',     bg: 'bg-pink-100' },
  { icon: ShieldCheck, gradient: 'from-slate-700 to-slate-900',   bg: 'bg-slate-100' },
  { icon: Sparkles,    gradient: 'from-yellow-400 to-orange-500', bg: 'bg-yellow-100' },
];

export default function HomePage() {
  const { lang, setLang, t } = useLanguage();
  const [prices, setPrices] = useState<any>(defaultPricing);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrices = async () => {
      setLoading(true);
      try {
        // Safe check for init
        if (typeof db.init === 'function') {
           db.init();
        }
        
        const saved = await db.getPrices();
        if (saved) setPrices(saved);
      } catch (error) {
        console.error("Failed to load prices from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPrices();
  }, []);

  // Helper to safely get arrays from translation context
  const getFeaturesList = () => {
    const features = t('features');
    return Array.isArray(features) ? features : [];
  };

  const getStepsList = () => {
    const steps = t('steps');
    return Array.isArray(steps) ? steps : [];
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-green-100 relative">
      
      {/* Navbar */}
      <nav className="relative z-50 bg-white border-b border-slate-100 px-6 py-1 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo - clickable to go home */}
            <a href="/">
               <img src="/logo.png" alt="Choronko Logo" className="h-32 w-auto object-contain hover:scale-105 transition-transform" />
            </a>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>EN</button>
            <button onClick={() => setLang('fr')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'fr' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>FR</button>
          </div>
        </div>
      </nav>

      <main className="px-6 py-8 max-w-5xl mx-auto pb-32">
        
        {/* Hero */}
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
            Choronko WIFI
          </h1>
          <p className="text-xl md:text-2xl text-green-600 font-extrabold italic tracking-tight">{t('lightning')}</p>
          <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-widest">{t('star')}</p>
          <div className="flex justify-center pt-6">
            <a 
              href="/signin" 
              className="px-8 py-4 bg-white border-2 border-slate-100 hover:border-green-200 text-slate-700 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Wifi size={20} className="text-green-600" />{t('connectBtn')}
            </a>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {loading ? (
            <div className="col-span-full text-center text-slate-400 py-10 font-bold">Syncing with Cloud...</div>
          ) : (
            Object.keys(prices).map((key, index) => {
              const plan = prices[key];
              let style = specificStyles[key];
              if (!style) style = fallbackStyles[index % fallbackStyles.length];

              // Compute dot color for feature list (accent color of the plan)
              const dotColor = style.color ? style.color.replace('text-', 'bg-') : 'bg-slate-400';
              
              return (
                <a 
                  key={key} 
                  href={`/payment?plan=${key}`}
                  className="group relative bg-white p-2 rounded-[32px] hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-xl hover:shadow-green-900/5 border border-slate-100 block"
                >
                  {style.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-10 whitespace-nowrap">
                      {t('popular')}
                    </div>
                  )}
                  <div className={`h-32 rounded-[24px] bg-gradient-to-br ${style.gradient} p-6 flex flex-col justify-between text-white relative overflow-hidden`}>
                    <style.icon className="opacity-80" size={32} />
                    <p className="font-bold text-lg relative z-10 truncate pr-2">{plan.name[lang] || plan.name.en}</p>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                      <span className="text-xs font-bold text-slate-400">FCFA</span>
                    </div>
                    
                    {/* Features List */}
                    {getFeaturesList().length > 0 && (
                      <ul className="space-y-3 mb-6">
                        {getFeaturesList().map((feat: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div> {feat}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="w-full py-3 rounded-xl bg-slate-50 text-slate-900 font-bold text-sm group-hover:bg-slate-900 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                      {t('buy')} <ArrowRight size={16} />
                    </div>
                  </div>
                </a>
              );
            })
          )}
        </div>

        {/* How It Works */}
        <div className="mb-20">
            <h2 className="text-2xl font-black text-center text-slate-900 mb-10 uppercase tracking-tight">{t('howItWorks')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {getStepsList().map((step: any, i: number) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">{i + 1}</div>
                        <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                        <p className="text-slate-500 text-sm">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer / Contact */}
        <footer className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                <div>
                    <h3 className="text-2xl font-bold mb-4">{t('contactTitle')}</h3>
                    <p className="text-slate-400 mb-6">{t('contactText')}</p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-300">
                            <MapPin className="text-green-400" size={20} /> 
                            <span>{t('location') || "Yaoundé, Cameroon"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <Phone className="text-green-400" size={20} /> 
                            <span>(+237) {WHATSAPP_NUMBER}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <Mail className="text-green-400" size={20} /> 
                            <span>choronkowifi@gmail.com</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center md:items-end gap-6">
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Accepted Payments</p>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-[#FF7900] flex items-center justify-center rounded-lg font-black text-[8px] leading-none text-white">orange<br/>money</div>
                        <div className="w-12 h-12 bg-[#FFCC00] flex items-center justify-center rounded-full font-black text-slate-900 text-[10px] border border-[#e6b800]">MoMo</div>
                    </div>
                </div>
            </div>
            <div className="mt-10 pt-10 border-t border-slate-800 text-center text-slate-500 text-xs font-bold">
                {t('footer')}
            </div>
        </footer>

      </main>

      {/* WhatsApp Button */}
      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white px-5 py-4 rounded-full shadow-2xl shadow-green-900/30 flex items-center gap-2 hover:-translate-y-1 transition-transform font-bold"
      >
        <MessageCircle size={24} fill="white" className="text-white" />
        <span className="hidden sm:inline">{t('whatsappBtn')}</span>
      </a>

    </div>
  );
}