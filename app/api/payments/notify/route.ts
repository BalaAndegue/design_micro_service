// app/api/payments/notify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handlePaymentNotification } from '@/lib/api/payements';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('X-NotchPay-Signature');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Signature manquante' },
        { status: 400 }
      );
    }

    const data = await request.json();
    
    const result = await handlePaymentNotification(signature, data);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error processing payment notification:', error);
    return NextResponse.json(
      { error: 'Erreur de traitement' },
      { status: 500 }
    );
  }
}