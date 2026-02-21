const handleCheckout = async () => {
  setIsLoading(true);

  try {
    // 1. CALL THE PAYMENT API
    const payResponse = await fetch('/api/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        phone: phoneNumber, 
        amount: selectedPlan.price, 
        service: 'MTN' // or your service variable
      }),
    });

    const paymentData = await payResponse.json();

    if (paymentData.success) {
      // 2. PAYMENT WORKED! NOW FETCH THE VOUCHER
      // This calls our S:\nando-wifi\src\app\api\get-voucher\route.ts
      const voucherResponse = await fetch('/api/get-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          voucherCategory: selectedPlan.name, // Must match "1 Day Unlimited", etc.
          phoneNumber: phoneNumber 
        }),
      });

      const voucherData = await voucherResponse.json();

      if (voucherData.success) {
        // 3. UPDATE STATE TO SHOW THE SUCCESS SCREEN
        setVoucherCode(voucherData.code);
        setStep('success'); // Or however you trigger your success view
      } else {
        alert("Payment was successful, but we couldn't retrieve a code. Please contact support.");
      }
    } else {
      alert("Payment failed: " + paymentData.message);
    }
  } catch (error) {
    console.error("Checkout error:", error);
    alert("An error occurred during checkout.");
  } finally {
    setIsLoading(false);
  }
};