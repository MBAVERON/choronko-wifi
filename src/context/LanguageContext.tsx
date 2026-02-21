"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'en' | 'fr';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: any = {
  en: {
    connectBtn: "Check Dashboard",
    popular: "MOST POPULAR",
    buy: "Buy Now",
    features: ["Unlimited Data", "High Speed 4G+", "No Account Needed"],
    lightning: "Lightning Speed ⚡",
    star: "The Shooting Star 💫",
    back: "Back",
    payBtn: "Pay Now",
    phoneLabel: "Mobile Money Number",
    hint: "Dial *126# (MTN) or #150# (Orange)",
    howItWorks: "How It Works",
    steps: [
      { title: "Choose Plan", desc: "Select the time you need." },
      { title: "Pay Securely", desc: "Pay via MTN or Orange Money." },
      { title: "Start Surfing", desc: "Get your code instantly!" }
    ],
    contactTitle: "Contact Us",
    contactText: "Need help? We are available 24/7.",
    location: "Yaoundé, Cameroon",
    whatsappBtn: "Chat on WhatsApp",
    
    // --- UPDATED FOOTER ---
    footer: "© 2026 Choronko Systems. Powered by Lumin Tech." 
  },
  fr: {
    connectBtn: "Tableau de Bord",
    popular: "LE PLUS POPULAIRE",
    buy: "Acheter",
    features: ["Données Illimitées", "Haut Débit 4G+", "Sans Compte"],
    lightning: "Vitesse de l'Éclair ⚡",
    star: "L'Étoile Filante 💫",
    back: "Retour",
    payBtn: "Payer",
    phoneLabel: "Numéro Mobile Money",
    hint: "Composez *126# (MTN) ou #150# (Orange)",
    howItWorks: "Comment Ça Marche",
    steps: [
      { title: "Choisir un Plan", desc: "Sélectionnez votre durée." },
      { title: "Payer Sécurisé", desc: "Via MTN ou Orange Money." },
      { title: "Surfez !", desc: "Recevez votre code instantanément." }
    ],
    contactTitle: "Contactez-Nous",
    contactText: "Besoin d'aide ? Nous sommes là 24/7.",
    location: "Yaoundé, Cameroun",
    whatsappBtn: "Discuter sur WhatsApp",
    
    // --- UPDATED FOOTER ---
    footer: "© 2026 Choronko Systèmes. Propulsé par Lumin Tech."
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('choronko_lang') as Lang; 
    if (saved) setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('choronko_lang', l); 
  };

  const t = (key: string) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};