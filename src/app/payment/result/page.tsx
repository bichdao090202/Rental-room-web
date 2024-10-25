'use client'
import { Badge, Box, Button, Card, CardContent, createStyles, Divider, Grid, List, ListItem, ListItemText, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Theme, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingBox from "@/common/components/LoadingBox";
import FormControlDisable from "@/common/components/DisableTextfield";
import { formatCurrency, formatDatetime } from "@/common/utils/helpers";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { create } from "domain";
import { createContract } from "./createContract";
import { post } from "@/common/store/base.service";
import { useTransactionStore } from "@/common/store/order/store";
import { getSession } from "next-auth/react";

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
  // const router = useRouter();
  const transactionType = useTransactionStore((state) => state.type);
  const orderData = useTransactionStore((state) => state.data);


  const createTransaction = async (data: any) => {
    const session = await getSession();
    const transactionBody = {
      user_id: session?.user?.id,
      amount: parseInt(data.vnp_Amount),
      transaction_type: 1,
      status: data.vnp_TransactionStatus === '00' ? 1 : 2,
      description: `${transactionType}`,
      transaction_no: data.vnp_TransactionNo,
      payment_method: 0
    };

    let transactionResult;
    try {
      transactionResult = await post(`transactions`, transactionBody);
    } catch (error) {
      console.error("Failed to post transaction:", error);
      transactionResult = { id: 8 };
    }


    if (transactionType === 'CREATE_ORDER') {
      const newTrans = {
        ...transactionBody,
        transaction_type: 3,
        status: 1,
        description: 'PAYMENT_ORDER',
        transaction_no: `${data.vnp_TransactionNo}- ${orderData.contract_id}`,
      };
      transactionResult = await post(`transactions`, newTrans);
      const invoiceBody = {
        ...orderData,
        transaction_id: transactionResult.data.id ? transactionResult.data.id : 8
      };

      const invoice = await post('invoices', invoiceBody);
      console.log(invoice);
    }


    // if (data.vnp_TransactionStatus === '00' &&
    //   transactionType === 'CREATE_ORDER' &&
    //   transactionResult.id) {
    //   const invoiceBody = {
    //     ...orderData,
    //     transaction_id: transactionResult.id
    //   };
    //   const invoice = await post('invoices', invoiceBody);
    //   console.log(invoice);
    // }
  }

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
          // createContract(data);
        } else setPaymentResult(data);

        if (orderData)
          createTransaction(data);
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

