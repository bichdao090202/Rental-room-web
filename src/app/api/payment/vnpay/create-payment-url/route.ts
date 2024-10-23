import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { VNPay } from 'vnpay';

export interface PaymentInfo {
  amount: number;
  orderId: string;
  orderDescription: string;
  bankCode?: string;
  clientIp: string;
}

export async function POST(req: NextRequest) {
  try {
    const paymentInfo: PaymentInfo = await req.json();

    const vnpay = new VNPay({
      vnpayHost: process.env.VNPAY_HOST || 'https://sandbox.vnpayment.vn',
      tmnCode: process.env.VNPAY_TMN_CODE || '',
      secureSecret: process.env.VNPAY_SECURE_SECRET || '',
      testMode: true,
    });

    // vnp_BankCode=NCB&
    // vnp_OrderInfo=Thanh+toan+tien+coc+va+tien+thue+phong+thang+1
    // vnp_PayDate=20241023140102&
    // vnp_TransactionNo=14628152&
    // vnp_TxnRef=1729666820356-7
    const buildPaymentData = {
      vnp_Amount: paymentInfo.amount * 100,
      vnp_OrderInfo: paymentInfo.orderDescription,
      vnp_TxnRef: paymentInfo.orderId,
      vnp_IpAddr: paymentInfo.clientIp,
      vnp_ReturnUrl: 'http://localhost:3000/payment/result',
    };

    const paymentUrl = vnpay.buildPaymentUrl(buildPaymentData);
    return NextResponse.json({ url: paymentUrl }, { status: 200 });
  } catch (error) {
    console.error('Error creating payment URL:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}