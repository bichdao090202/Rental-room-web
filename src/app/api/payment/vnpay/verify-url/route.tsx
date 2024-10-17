// import { NextResponse } from 'next/server';
// import {
//     VNPay,
//     parseDate,
//     VerifyReturnUrl,
// } from 'vnpay';

// const vnpay = new VNPay({
//     vnpayHost: process.env.VNPAY_HOST || 'https://sandbox.vnpayment.vn',
//     tmnCode: process.env.VNPAY_TMN_CODE || '',
//     secureSecret: process.env.VNPAY_SECURE_SECRET || '',
//     testMode: true,
// });

// export async function GET(req: Request) {
//     const { searchParams } = new URL(req.url);

//     const params: Record<string, string> = {};
//     searchParams.forEach((value, key) => {
//         params[key] = value;
//     });

//     const result = vnpay.verifyReturnUrl(params as unknown as VerifyReturnUrl);

//     const formattedResult = {
//         ...result,
//         vnp_PayDate: parseDate(result.vnp_PayDate ?? 'Invalid Date').toLocaleString(),
//     };

//     return NextResponse.json(formattedResult);
// }
import { NextRequest, NextResponse } from 'next/server';
import { VNPay, VerifyReturnUrl, parseDate } from 'vnpay';

const vnpay = new VNPay({
  vnpayHost: process.env.VNPAY_HOST || 'https://sandbox.vnpayment.vn',
  tmnCode: process.env.VNPAY_TMN_CODE || '',
  secureSecret: process.env.VNPAY_SECURE_SECRET || '',
  testMode: true,
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const params: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  try {
    const result = vnpay.verifyReturnUrl(params as unknown as VerifyReturnUrl);
    return NextResponse.json({
      ...result,
      vnp_PayDate: parseDate(result.vnp_PayDate ?? 'Invalid Date').toLocaleString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid VNPay URL' }, { status: 400 });
  }
}