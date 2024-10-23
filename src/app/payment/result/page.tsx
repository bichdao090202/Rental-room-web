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
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/payment/vnpay/verify-url?${searchParams.toString()}`);
        if (!response.ok) {
          throw new Error('Verification failed');
        }
        const data = await response.json();
        if (data.isSuccess && data.isVerified && data.vnp_TransactionStatus === '00'){ //vnp_ResponseCode
          setPaymentResult(data);
          createContract(data);
        } else setPaymentResult(data);

      } catch (err) {
        setError('Có lỗi xảy ra khi xác thực thanh toán');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

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
            <Typography>{formatCurrency(parseInt(paymentResult.vnp_Amount) )}</Typography>
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

      {/*<Button variant="contained" color="primary" onClick={() => {*/}
      {/*  router.push(`/manager/renter/booking-request`)*/}
      {/*}}>*/}
      {/*  Quay lại trang quản lý*/}
      {/*</Button>*/}

      {/* <Box sx={{ maxWidth: 450, mx: 'auto', my: 3, boxShadow: 1, p: 2, bgcolor: '#e0f7fa', borderRadius: 3 }}>
        <Typography variant="h6" color="textPrimary" gutterBottom>
          Thông tin thanh toán
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Số tiền" secondary={`${parseInt(paymentResult.vnp_Amount) / 100} VND`} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Ngân hàng" secondary={paymentResult.vnp_BankCode} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Thời gian" secondary={paymentResult.vnp_PayDate} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Trạng thái"
              secondary={paymentResult.vnp_TransactionStatus === '00' ? 'Thành công' : 'Thất bại'}
              sx={{ color: paymentResult.vnp_TransactionStatus === '00' ? 'green' : 'red' }}
            />
          </ListItem>
        </List>
      </Box> */}


      {/* <TableContainer component={Paper}>
        <Table aria-label="payment result table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">Số tiền</TableCell>
              <TableCell align="right">{formatCurrency(parseInt(paymentResult.vnp_Amount) / 100)} VND</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Ngân hàng</TableCell>
              <TableCell align="right">{paymentResult.vnp_BankCode}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Thời gian</TableCell>
              <TableCell align="right">{paymentResult.vnp_PayDate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Trạng thái</TableCell>
              <TableCell align="right">
                <Typography color={paymentResult.vnp_TransactionStatus === '00' ? 'green' : 'red'}>
                  {paymentResult.vnp_TransactionStatus === '00' ? 'Thành công' : 'Thất bại'}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer> */}

    </Box>
  );
}

