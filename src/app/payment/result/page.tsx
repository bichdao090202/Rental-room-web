'use client'
import { Badge, Box, Button, Card, CardContent, createStyles, Divider, Grid, List, ListItem, ListItemText, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Theme, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingBox from "@/common/components/LoadingBox";
import { formatCurrency, formatDatetime } from "@/common/utils/helpers";
import { useTransactionStore } from "@/common/store/order/store";
import { getSession } from "next-auth/react";
import { handleReturnUrl } from "@/service/main/handle_return_url";

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
  const transactionType = useTransactionStore((state) => state.type);
  const orderData = useTransactionStore((state) => state.data);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/payment/vnpay/verify-url?${searchParams.toString()}`);
        if (!response.ok) {
          throw new Error('Verification failed');
        }
        const data = await response.json();
        if (data.isSuccess && data.isVerified && data.vnp_TransactionStatus === '00') { //vnp_ResponseCode
          setPaymentResult(data);
        }

        console.log(data);

        const session = await getSession();

        handleReturnUrl(parseInt(session!.user.id), transactionType, data,orderData);

      } catch (err) {
        setError('Có lỗi xảy ra khi xác thực thanh toán');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [orderData]);

  if (loading) {
    return (
      <LoadingBox />
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
    <Box sx={{ height: '60vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
      <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto', my: 4, boxShadow: 4, bgcolor: '#e0f7fa', borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom  >
          Thông tin thanh toán
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Mã giao dịch:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{paymentResult.vnp_TransactionNo}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>Số tiền:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{formatCurrency(parseInt(paymentResult.vnp_Amount))}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Ngân hàng:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{paymentResult.vnp_BankCode}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Thời gian:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{paymentResult.vnp_PayDate}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Trạng thái:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color={paymentResult.vnp_TransactionStatus === '00' ? 'green' : 'red'}>
              {paymentResult.vnp_TransactionStatus === '00' ? 'Thành công' : 'Thất bại'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

