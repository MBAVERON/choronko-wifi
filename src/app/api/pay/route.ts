import { NextResponse } from 'next/server';
import { PaymentOperation } from '@hachther/mesomb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, amount, service } = body; 

    // --- 1. DEVELOPER BYPASS (While waiting for MeSomb Activation) ---
    // If you enter this specific number, the system will pretend it worked.
    // This allows you to test the "Success Screen" and "Settings Page".
    if (phone === '670000000') {
      console.log("⚠️ DEV MODE: Simulating success for 670000000");
      await new Promise(resolve => setTimeout(resolve, 2000)); // Fake delay
      return NextResponse.json({ 
        success: true, 
        status: 'SUCCESS', 
        transactionId: 'DEV_TEST_123' 
      });
    }

    // --- 2. REAL PAYMENT LOGIC (For everyone else) ---
    if (!process.env.MESOMB_APP_KEY || !process.env.MESOMB_ACCESS_KEY) {
      return NextResponse.json({ success: false, message: "Server Error: Keys missing" }, { status: 500 });
    }

    const payment = new PaymentOperation({
      applicationKey: process.env.MESOMB_APP_KEY,
      accessKey: process.env.MESOMB_ACCESS_KEY,
      secretKey: process.env.MESOMB_SECRET_KEY,
    });

    const response = await payment.makeCollect({
      amount: parseInt(amount),
      service: service,
      payer: phone,
      nonce: Math.floor(Math.random() * 1000000).toString(),
    });

    if (response.isOperationSuccess()) {
      return NextResponse.json({ 
        success: true, 
        transactionId: response.pk,
        status: response.status 
      });
    } else {
      return NextResponse.json({ success: false, message: "Transaction Failed" });
    }

  } catch (error: any) {
    console.error("MeSomb Error:", error);
    // This will still show "User not activated" if you use your REAL number
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}