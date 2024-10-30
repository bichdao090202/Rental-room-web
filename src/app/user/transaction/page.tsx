'use client'

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  CircularProgress
} from '@mui/material';
import { getSession } from 'next-auth/react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { get } from '@/common/store/base.service';
import { formatDatetime } from '@/common/utils/helpers';
import axios from 'axios';
import { createTransaction } from '@/service/main/create_transaction';

interface Transaction {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  user_id: number;
  transaction_type: number;
  status: number;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  payment_method: number;
  transaction_no: string;
}

interface ApiResponse {
  status: string;
  message: string;
  error_message: null | string;
  data: Transaction[];
}

const getTransactionTypeLabel = (type: number) => {
  switch (type) {
    case 1:
      return <Chip label="Nạp tiền" color="success" />;
    case 2:
      return <Chip label="Rút tiền" color="error" />;
    case 3:
      return <Chip label="Thanh toán" color="warning" />;
    case 4:
      return <Chip label="Hoàn tiền" color="info" />;
    default:
      return <Chip label="Khác" />;
  }
};

const getStatusLabel = (status: number) => {
  switch (status) {
    case 1:
      return <Chip label="Thành công" color="success" />;
    case 2:
      return <Chip label="Thất bại" color="error" />;
    default:
      return <Chip label="Đang xử lý" color="warning" />;
  }
};


export default function Page() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>();

  console.log(user?.balance);


  useEffect(() => {
    fetchTransactions();
    fetchBalance();
  }, []);

  const fetchTransactions = async () => {
    try {
      const session = await getSession();
      if (!session) return;

      // try {
      //   const response = await axios.get(`http://54.253.233.87:3006/api/v1/users/${session.user.id}`, {
      //     headers: {
      //       Authorization: `${session.accessToken}`
      //     }
      //   });
      //   const userData = response.data.data;
      //   console.log(userData);
      //   setUser(userData);
      // } catch (error) {
      //   console.error("Error fetching user data:", error);
      // }
      // setUser(session?.user);
      if (session?.user?.id) {
        const response = await get(`transactions?user_id=${session.user.id}`);
        const data: ApiResponse = response;
        if (data.status === "SUCCESS") {
          // Sort transactions by id in descending order
          const sortedTransactions = data.data.sort((a, b) => b.id - a.id);
          setTransactions(sortedTransactions);
        }
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    const session = await getSession();
    if (!session) return;

    try {
      const response = await axios.get(`http://54.253.233.87:3006/api/v1/users/${session.user.id}`, {
        headers: {
          Authorization: `${session.accessToken}`
        }
      });
      const userData = response.data.data;
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }


  const handleClickOpen = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTransaction(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Số dư: {formatCurrency(user?.balance)}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => {
          createTransaction(user?.id, 'DEPOSIT', 20000, {});
        }}>
          + Nạp tiền
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Lịch sử giao dịch
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã GD</TableCell>
                {/* <TableCell>Mã tra cứu</TableCell> */}
                <TableCell>Ngày giao dịch</TableCell>
                <TableCell>Loại giao dịch</TableCell>
                <TableCell>Số tiền</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Chi tiết</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  {/* <TableCell>{transaction.transaction_no}</TableCell> */}
                  <TableCell>
                    {formatDatetime(new Date(transaction.created_at))}
                  </TableCell>
                  <TableCell>
                    {getTransactionTypeLabel(transaction.transaction_type)}
                  </TableCell>
                  <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell>{getStatusLabel(transaction.status)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleClickOpen(transaction)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Chi tiết giao dịch</DialogTitle>
          <DialogContent dividers>
            {selectedTransaction && (
              <Box sx={{ '& > *': { my: 1 } }}>
                <Typography><strong>Mã giao dịch:</strong> {selectedTransaction.id}</Typography>
                {/* <Typography><strong>Mã tra cứu:</strong> {selectedTransaction.transaction_no}</Typography> */}
                <Typography>
                  <strong>Thời gian:</strong> {formatDatetime(new Date(selectedTransaction.created_at))}
                </Typography>
                <Typography>
                  <strong>Loại giao dịch:</strong> {' '}
                  {getTransactionTypeLabel(selectedTransaction.transaction_type)}
                </Typography>
                <Typography><strong>Số tiền:</strong> {formatCurrency(selectedTransaction.amount)}</Typography>
                <Typography>
                  <strong>Số dư trước GD:</strong> {formatCurrency(selectedTransaction.balance_before)}
                </Typography>
                <Typography>
                  <strong>Số dư sau GD:</strong> {formatCurrency(selectedTransaction.balance_after)}
                </Typography>
                <Typography><strong>Mô tả:</strong> {selectedTransaction.description}</Typography>
                <Typography>
                  <strong>Trạng thái:</strong> {' '}
                  {getStatusLabel(selectedTransaction.status)}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Đóng</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}