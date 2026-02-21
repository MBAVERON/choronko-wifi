import { db } from "@/utils/firebase"; // Using the '@' alias for 'src'
import { 
  collection, query, where, limit, getDocs, updateDoc, doc, Timestamp 
} from "firebase/firestore";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { voucherCategory, phoneNumber } = await request.json();

    if (!voucherCategory) {
      return NextResponse.json({ message: "Voucher category is required" }, { status: 400 });
    }

    const vRef = collection(db, "available_vouchers");
    
    // STRICT FILTER: Only grab a code that matches the chosen duration (Lock and Key mechanism)
    const q = query(
      vRef, 
      where("plan", "==", voucherCategory), 
      where("status", "==", "available"), 
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ message: `Out of stock for ${voucherCategory}` }, { status: 404 });
    }

    const voucherDoc = snapshot.docs[0];
    const voucherData = voucherDoc.data();

    // Mark it as sold in your database
    const voucherRef = doc(db, "available_vouchers", voucherDoc.id);
    await updateDoc(voucherRef, {
      status: "sold",
      soldTo: phoneNumber || "Customer",
      soldAt: Timestamp.now(),
    });

    // Return the code
    return NextResponse.json({ 
      success: true,
      code: voucherData.code,
      plan: voucherCategory 
    });

  } catch (error) {
    console.error("Voucher Fetch Error:", error);
    return NextResponse.json({ message: "Error retrieving voucher" }, { status: 500 });
  }
}
