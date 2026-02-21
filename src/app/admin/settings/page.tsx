"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, RotateCcw, Plus, Trash2, X } from "lucide-react";
import { db, defaultPricing } from '@/utils/db';

// Duration options for the dropdown - maps display name to plan ID
const DURATION_OPTIONS = [
  { id: '1h', label: '1 Hour' },
  { id: '24h', label: '1 Day' },
  { id: '7d', label: '1 Week' },
  { id: '30d', label: '1 Month' },
];

export default function SettingsPage() {
  const router = useRouter();
  const [prices, setPrices] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Plan Form State
  const [newPlan, setNewPlan] = useState({ id: '', nameEn: '', nameFr: '', price: '' });
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[0].id);

  useEffect(() => {
    db.init();
    setPrices(db.getPrices());
  }, []);

  if (!prices) return <div className="p-10 text-center">Loading Settings...</div>;

  const handleChange = (key: string, field: string, value: string) => {
    setPrices((prev: any) => ({
      ...prev,
      [key]: { 
        ...prev[key], 
        [field === 'price' ? 'price' : 'name']: field === 'price' ? value : { ...prev[key].name, [field]: value }
      }
    }));
    setSaved(false);
  };

  const handleDelete = (key: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      const updated = { ...prices };
      delete updated[key];
      setPrices(updated);
      setSaved(false);
    }
  };

const handleAddPlan = () => {
    if (!selectedDuration || !newPlan.nameEn || !newPlan.price) return alert("Please fill all fields");
    
    setPrices((prev: any) => ({
      ...prev,
      [selectedDuration]: {
        price: newPlan.price,
        name: { en: newPlan.nameEn, fr: newPlan.nameFr || newPlan.nameEn }
      }
    }));
    setShowAddModal(false);
    setNewPlan({ id: '', nameEn: '', nameFr: '', price: '' });
    setSelectedDuration(DURATION_OPTIONS[0].id);
    setSaved(false);
  };

  const handleSave = () => {
    db.savePrices(prices);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if(confirm("Reset ALL plans to default? This deletes custom plans.")) {
      db.savePrices(defaultPricing);
      setPrices(defaultPricing);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 text-slate-900 pb-20">
      <header className="max-w-2xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-3 bg-white rounded-full shadow-sm border border-slate-100">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-extrabold">Plan Manager</h1>
        </div>
        <button 
           onClick={() => setShowAddModal(true)}
           className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={18} /> New Plan
        </button>
      </header>

      <main className="max-w-2xl mx-auto space-y-4">
        {Object.entries(prices).map(([key, plan]: any) => (
          <div key={key} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 relative group transition-all hover:shadow-md">
            
            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                ID: {key}
              </div>
              <button onClick={() => handleDelete(key)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <Trash2 size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Name (English)</label>
                <input 
                  type="text" 
                  value={plan.name.en}
                  onChange={(e) => handleChange(key, 'en', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Price (FCFA)</label>
                <input 
                  type="text" 
                  value={plan.price}
                  onChange={(e) => handleChange(key, 'price', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-900 text-right focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

          </div>
        ))}
      </main>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 left-0 w-full px-6">
        <div className="max-w-2xl mx-auto flex gap-4">
          <button 
            onClick={handleSave}
            className={`flex-1 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-xl
              ${saved ? 'bg-green-500 shadow-green-200 scale-95' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-300'}
            `}
          >
            {saved ? 'Saved Successfully!' : <><Save size={18}/> Save All Changes</>}
          </button>
           <button onClick={handleReset} className="p-4 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 transition-colors shadow-lg">
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

{/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Plan</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 rounded-full"><X size={16}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 block mb-2">Duration</label>
                <select 
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm outline-none focus:ring-2 ring-blue-500 border-0"
                >
                  {DURATION_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
              </div>
              <input 
                placeholder="Name (e.g. Weekly Pass)" 
                value={newPlan.nameEn}
                onChange={(e) => setNewPlan({...newPlan, nameEn: e.target.value})}
                className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm outline-none focus:ring-2 ring-blue-500"
              />
              <input 
                placeholder="Price (e.g. 2,500)" 
                value={newPlan.price}
                onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
                className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm outline-none focus:ring-2 ring-blue-500"
              />
              <button onClick={handleAddPlan} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}