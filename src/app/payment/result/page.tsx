// import { Box, Typography } from "@mui/material";

// export default async function Page({ searchParams }: { searchParams: any }) {
//     const response = await fetch(`/api/payment/vnpay/verify-url?${new URLSearchParams(searchParams)}`);
//     const result = await response.json(); 

//     return (
//         <Box>
//             <Typography variant="h4">Kết quả thanh toán</Typography>
//             <Typography variant="body1">Mã giao dịch: {result.vnp_TransactionNo}</Typography>
//             <Typography variant="body1">Số tiền: {result.vnp_Amount}</Typography>
//             <Typography variant="body1">Trạng thái: {result.vnp_TransactionStatus}</Typography>
//             <Typography variant="body1">Ngày thanh toán: {result.vnp_PayDate}</Typography>
//             <Typography variant="body1">Thông tin đơn hàng: {result.vnp_OrderInfo}</Typography>
//         </Box>
//     );
// }
'use client'
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LoadingBox from "@/common/components/LoadingBox";

interface PaymentResult {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
}

export default function Page() {
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/payment/vnpay/verify-url?${searchParams.toString()}`);
        if (!response.ok) {
          throw new Error('Verification failed');
        }
        const data = await response.json();
        setPaymentResult(data);
      } catch (err) {
        setError('Có lỗi xảy ra khi xác thực thanh toán');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <LoadingBox/>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!paymentResult) {
    return (
      <Box>
        <Typography>Không có thông tin thanh toán</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Kết quả thanh toán</Typography>
      <Typography>Số tiền: {parseInt(paymentResult.vnp_Amount) / 100} VND</Typography>
      <Typography>Ngân hàng: {paymentResult.vnp_BankCode}</Typography>
      <Typography>Thời gian: {paymentResult.vnp_PayDate}</Typography>
      <Typography>Trạng thái: {paymentResult.vnp_TransactionStatus === '00' ? 'Thành công' : 'Thất bại'}</Typography>
    </Box>
  );
}