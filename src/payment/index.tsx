// import React from 'react';
// import crypto from 'crypto';
// import { Button } from '@mui/material';

// // Thông tin cấu hình VNPay
// const vnp_TmnCode = 'J0XPO6P7';
// const vnp_HashSecret = 'DQN8ZJ6HVK2RZBDQDNT78R3BJD4L6LQN';
// const vnp_ReturnUrl = 'http://localhost:3000';

// const getCurrentDateTime = (): string => {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = String(now.getMonth() + 1).padStart(2, '0');
//   const day = String(now.getDate()).padStart(2, '0');
//   const hours = String(now.getHours()).padStart(2, '0');
//   const minutes = String(now.getMinutes()).padStart(2, '0');
//   const seconds = String(now.getSeconds()).padStart(2, '0');

//   return `${year}${month}${day}${hours}${minutes}${seconds}`;
// };

// const generateSecureHash = (params: Record<string, string>): string => {
//   const sortedKeys = Object.keys(params).sort();
//   const hashData = sortedKeys.map((key) => `${key}=${params[key]}`).join('&');
//   return crypto.createHmac('sha512', vnp_HashSecret).update(hashData).digest('hex');
// };

// const handlePayment = (amount: number, orderInfo: string, orderType: string) => {
//   const vnp_Amount = (amount * 100).toString(); // Số tiền nhân với 100 để phù hợp với định dạng VNPay yêu cầu
//   const vnp_TxnRef = Date.now().toString(); // Mã giao dịch duy nhất
//   const vnp_IpAddr = getUserIp(); // Lấy địa chỉ IP của client (có thể dùng phương thức khác để lấy IP thực)
//   const vnp_CreateDate = getCurrentDateTime();

//   const vnp_Params = {
//     vnp_Version: '2.1.0',
//     vnp_Command: 'pay',
//     vnp_TmnCode,
//     vnp_Amount,
//     vnp_CurrCode: 'VND',
//     vnp_TxnRef,
//     vnp_OrderInfo: orderInfo,
//     vnp_OrderType: orderType,
//     vnp_ReturnUrl,
//     vnp_IpAddr,
//     vnp_Locale: 'vn',
//     vnp_CreateDate,
//   };

//   const secureHash = generateSecureHash(vnp_Params);
//   const vnp_ParamsWithHash = { ...vnp_Params, vnp_SecureHash: secureHash };

//   const queryString = new URLSearchParams(vnp_ParamsWithHash ).toString();
//   const paymentUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${queryString}`;

//   console.log(paymentUrl);
  
//   window.open(paymentUrl, '_blank');
// };

// const PaymentButton: React.FC = () => {
//   const handleClick = () => {
//     handlePayment(100000, 'Thanh toan don hang: ABC123', 'other');
//   };

//   return <Button onClick={handleClick}>Thanh toán với VNPay</Button>;
// };

// export default PaymentButton;

import React from 'react';
import crypto from 'crypto';

interface PaymentInfo {
  amount: number;
  orderInfo: string;
  orderType: string;
  bankCode?: string;
}

async function getUserIp() {
  try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip; // Trả về địa chỉ IP
  } catch (error) {
      console.error('Error fetching IP:', error);
      return null; // Trả về null nếu có lỗi
  }
}

const createPaymentUrl = (paymentInfo: PaymentInfo): string => {
  const vnp_Params: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: 'J0XPO6P7',
    vnp_Amount: (paymentInfo.amount * 100).toString(),
    vnp_CreateDate: formatDate(new Date()),
    vnp_CurrCode: 'VND',
    vnp_IpAddr: '103.199.7.2', 
    vnp_Locale: 'vn',
    vnp_OrderInfo: paymentInfo.orderInfo,
    vnp_OrderType: paymentInfo.orderType,
    vnp_ReturnUrl: 'http://localhost:3000', 
    vnp_TxnRef: generateTransactionRef(),
    vnp_ExpireDate: formatDate(new Date(Date.now() + 15 * 60 * 1000)) 
  };

  if (paymentInfo.bankCode) {
    vnp_Params.vnp_BankCode = paymentInfo.bankCode;
  }

  const secretKey = 'DQN8ZJ6HVK2RZBDQDNT78R3BJD4L6LQN';
  const signData = Object.keys(vnp_Params)
    .sort()
    .map(key => `${key}=${vnp_Params[key]}`)
    .join('&');

  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  vnp_Params.vnp_SecureHash = signed;

  const queryString = Object.keys(vnp_Params)
    .map(key => `${key}=${encodeURIComponent(vnp_Params[key])}`)
    .join('&');
  
  console.log(`https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${queryString}`);
  

  return `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${queryString}`;
};

const formatDate = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
};

const generateTransactionRef = (): string => {
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
};

const VNPayPaymentButton: React.FC = () => {
  const handlePayment = () => {
    const paymentInfo: PaymentInfo = {
      amount: 1000000, 
      orderInfo: 'Thanh toan don hang test',
      orderType: '170001',
      bankCode: 'VNBANK' 
    };

    const paymentUrl = createPaymentUrl(paymentInfo);
    window.open(paymentUrl, '_blank');
    console.log(paymentUrl);    
    // window.location.href = paymentUrl;
  };

  return (
    <button onClick={handlePayment}>Thanh toán với VNPay</button>
  );
};

export default VNPayPaymentButton;