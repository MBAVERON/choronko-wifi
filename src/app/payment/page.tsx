"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db, defaultPricing } from '@/utils/db';
import { Check, ArrowLeft, CreditCard, Loader2, Phone, Copy, Wifi, Home } from 'lucide-react';

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-green-600"/></div>}>
      <PaymentContent />
    </Suspense>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const planId = searchParams.get('plan') || '1h'; 
  
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'om'>('momo');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // NEW: State to hold the receipt data after payment
  const [successReceipt, setSuccessReceipt] = useState<any>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      const prices = await db.getPrices();
      const selected = prices[planId] || defaultPricing['1h'];
      setPlan(selected);
    };
    fetchPlan();
  }, [planId]);

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 9) return;

    setLoading(true);
    
    try {
      // Step 1: Process payment (simulated)
      // In a real app, this would call your payment provider (MTN/Orange)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 2: Fetch actual voucher from database
      // This calls the /api/get-voucher endpoint to get a real code
      const voucherResponse = await fetch('/api/get-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          voucherCategory: plan.name.en, // Must match "1 Day Unlimited", etc.
          phoneNumber: phoneNumber 
        }),
      });

      const voucherData = await voucherResponse.json();

      if (!voucherData.success) {
        alert(voucherData.message || "No vouchers available for this plan.");
        setLoading(false);
        return;
      }

      // Step 3: Save the sale record to database
      const saleRecord = {
        code: voucherData.code,
        plan: plan.name.en, 
        price: plan.price,
        method: paymentMethod,
        customerPhone: phoneNumber,
        status: 'active',
        synced: false,
        createdAt: new Date().toISOString()
      };

      await db.add(saleRecord);
      
      // Step 4: Show success receipt with the REAL voucher code from database
      setSuccessReceipt({
          code: voucherData.code,
          planName: plan.name.en,
          amount: plan.price,
          phone: phoneNumber
      });
        
    } catch (e) {
      console.error(e);
      // Only alert on critical errors (like no internet)
      alert("Connection Error. Please check your internet.");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (successReceipt) {
        navigator.clipboard.writeText(successReceipt.code);
        alert("Code Copied!"); // Tiny feedback is okay here, or we can make a custom one
    }
  };

  // --- VIEW 1: LOADING ---
  if (!plan) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Loading Plan...</div>;

  // --- VIEW 2: SUCCESS RECEIPT (Replaces the Pop-up) ---
  if (successReceipt) {
    return (
        <div className="min-h-screen bg-green-600 font-sans p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <Wifi size={400} className="text-white absolute -top-20 -left-20" />
            </div>

            <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-500">
                <div className="bg-slate-900 p-8 text-center text-white relative">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-900/50">
                        <Check size={32} strokeWidth={4} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Payment Success</h2>
                    <p className="text-slate-400 text-sm font-bold mt-2">Transaction Complete</p>
                    
                    {/* Ticket Cutout Effect */}
                    <div className="absolute -bottom-3 left-0 w-full flex justify-between px-4">
                        <div className="w-6 h-6 bg-green-600 rounded-full"></div>
                        <div className="w-6 h-6 bg-green-600 rounded-full"></div>
                    </div>
                </div>

                <div className="p-8 pt-10">
                    <div className="text-center mb-8">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Access Code</p>
                        <div 
                            onClick={copyToClipboard}
                            className="bg-slate-100 border-2 border-dashed border-slate-300 p-4 rounded-xl flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-200 transition-colors group"
                        >
                            <span className="text-3xl font-mono font-black text-slate-900 tracking-wider">{successReceipt.code}</span>
                            <Copy size={20} className="text-slate-400 group-hover:text-slate-600" />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 font-bold">Click box to copy</p>
                    </div>

                    <div className="space-y-4 text-sm border-t border-slate-100 pt-6 mb-8">
                        <div className="flex justify-between">
                            <span className="text-slate-500 font-bold">Plan</span>
                            <span className="font-black text-slate-900">{successReceipt.planName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500 font-bold">Phone</span>
                            <span className="font-black text-slate-900">{successReceipt.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500 font-bold">Amount Paid</span>
                            <span className="font-black text-green-600">{successReceipt.amount} FCFA</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => router.push('/')}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Home size={20} /> Back to Home
                    </button>
                </div>
            </div>
            
            <p className="text-white/60 text-xs font-bold mt-8 text-center">
                A copy of this code has been sent via SMS to your number.
            </p>
        </div>
    );
  }

  // --- VIEW 3: CHECKOUT FORM (The default view) ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-md flex items-center mb-8">
        <button onClick={() => router.back()} className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition-colors">
          <ArrowLeft size={20} className="text-slate-600"/>
        </button>
        <span className="ml-4 font-bold text-lg text-slate-700">Checkout</span>
      </div>

      {/* Bill Card */}
      <div className="w-full max-w-md bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4"></div>
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{plan.name.en}</h2>
            <p className="text-slate-400 font-bold text-sm">Valid for {planId.replace('h', ' Hours').replace('d', ' Days')}</p>
          </div>
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            IN STOCK
          </div>
        </div>
        <div className="border-t border-dashed border-slate-200 my-4"></div>
        <div className="flex justify-between items-center relative z-10">
          <span className="font-bold text-slate-500 text-sm uppercase tracking-wide">Total to pay</span>
          <span className="text-3xl font-black text-slate-900">{plan.price} <span className="text-sm text-slate-400 font-bold">FCFA</span></span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="w-full max-w-md space-y-3 mb-6">
        <p className="font-bold text-slate-400 text-xs uppercase tracking-widest ml-2">Select Method</p>
        
        <div className="grid grid-cols-2 gap-3">
            <button 
            onClick={() => setPaymentMethod('momo')}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'momo' ? 'border-[#FFCC00] bg-yellow-50' : 'border-white bg-white shadow-sm'}`}
            >
            <div className="w-10 h-10 bg-[#FFCC00] rounded-full flex items-center justify-center font-bold text-[10px] border border-[#e6b800] text-slate-900">MoMo</div>
            <span className="font-bold text-slate-700 text-sm">MTN</span>
            {paymentMethod === 'momo' && <div className="absolute top-2 right-2 text-[#FFCC00]"><Check size={16}/></div>}
            </button>

            <button 
            onClick={() => setPaymentMethod('om')}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'om' ? 'border-[#FF7900] bg-orange-50' : 'border-white bg-white shadow-sm'}`}
            >
            <div className="w-10 h-10 bg-[#FF7900] rounded-lg flex items-center justify-center font-bold text-[8px] text-white leading-none">orange<br/>money</div>
            <span className="font-bold text-slate-700 text-sm">Orange</span>
            {paymentMethod === 'om' && <div className="absolute top-2 right-2 text-[#FF7900]"><Check size={16}/></div>}
            </button>
        </div>
      </div>

      {/* Phone Number Input */}
      <div className="w-full max-w-md mb-8">
        <label className="font-bold text-slate-400 text-xs uppercase tracking-widest ml-2 mb-2 block">
            Enter {paymentMethod === 'momo' ? 'MTN' : 'Orange'} Number
        </label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Phone size={20} />
            </div>
            <input 
                type="tel" 
                placeholder="670 00 00 00"
                value={phoneNumber}
                onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 9) setPhoneNumber(val);
                }}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-lg text-slate-900 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-slate-300"
            />
            {phoneNumber.length === 9 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in">
                    <Check size={20} strokeWidth={3} />
                </div>
            )}
        </div>
      </div>

      {/* Pay Button */}
      <button 
        onClick={handlePayment}
        disabled={loading || phoneNumber.length < 9}
        className={`
            w-full max-w-md py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all
            ${loading || phoneNumber.length < 9 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:scale-[1.02] active:scale-95 shadow-slate-200'}
        `}
      >
        {loading ? <Loader2 className="animate-spin" /> : <CreditCard size={20} />}
        {loading ? "Processing..." : `Pay ${plan.price} FCFA`}
      </button>

      <p className="mt-6 text-xs text-center text-slate-400 max-w-xs leading-relaxed">
        You will receive a prompt on <strong>{phoneNumber || "your phone"}</strong> to confirm the payment.
      </p>

    </div>
  );
}