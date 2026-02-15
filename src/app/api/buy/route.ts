// src/app/api/buy/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/utils/db'; // Connect to our Shared Brain

export async function POST(request: Request) {
  const body = await request.json();
  const { plan, price } = body;

  // 1. Simulate processing time (talking to MTN/Orange)
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 2. Generate a Real Code
  const newCode = `CH-${Math.floor(10000 + Math.random() * 90000)}`;

  // 3. Save to Database (So Admin can see it!)
  const newVoucher = {
    code: newCode,
    plan: plan,
    price: price,
    status: 'active' as const,
    createdAt: 'Just now' // In real app: new Date().toISOString()
  };
  
  db.add(newVoucher);

  // 4. Send success back to the frontend
  return NextResponse.json({ success: true, code: newCode });
}