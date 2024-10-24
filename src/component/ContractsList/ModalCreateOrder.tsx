'use client'
import { Box, Button, Divider, Grid, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { get, put } from "@/common/store/base.service";
import Loading from "@/app/loading";
import { Contract } from "@/types";
import { formatCurrency, formatDatetime } from "@/common/utils/helpers";

interface PaymentModalProps {
    onClose: () => void;
    contractId: number;
}

export const ModalCreateOrder: React.FC<PaymentModalProps> = ({ onClose, contractId }) => {
    const [contract, setContract] = useState<any>();
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [month, setMonth] = useState<number>(0);

    const handleQuantityChange = (id: number, value: string) => {
        const quantity = value ? parseInt(value) : 0;
        setQuantities((prev) => ({
            ...prev,
            [id]: quantity,
        }));
    };

    const totalAmount = contract?.services_history.reduce((total: any, service: any) => {
        const quantity = quantities[service.id] || 0;
        return total + service.price * quantity;
    }, 0);

    const fetchContracts = async () => {
        try {
            const res = await get(`contracts/${contractId}`);
            const result = res.data;
            console.log(res);
            if (!result) return;
            let maxMonth = 0;
            result.invoices.map((invoice: any) => {
                if (invoice.at_month > maxMonth) {
                    maxMonth = invoice.at_month;
                }
            })
            setMonth(maxMonth + 1);
            setContract(result);
        } catch (error) {
            console.error('Error fetching booking requests:', error);
        }
    };

    useEffect(() => {
        fetchContracts();

    }, []);


    if (!contract) {
        return (
            <Loading></Loading>
        )
    }

    return (
        <Modal
            open={true}
            onClose={onClose}
            aria-labelledby="custom-modal-title"
            aria-describedby="custom-modal-description"

        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70vw',
                    height: '800px',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    overflowY: 'auto',
                }}
            >
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: '10px' }}>
                    Tạo hóa đơn
                </Typography>

                <Divider sx={{ mb: 2 }} />


                <Typography component="h2" sx={{ fontWeight: 'bold' }} >
                    Thông tin hóa đơn:
                </Typography>

                <Typography  >
                    Mã hợp đồng(ID): {contractId}
                </Typography>

                <Typography  >
                    Tháng: {month}
                </Typography>


                <Divider sx={{ mb: '20px', mt: '20px' }} />

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên dịch vụ</TableCell>
                                <TableCell align="right">Đơn giá</TableCell>
                                <TableCell align="right">Số lượng</TableCell>
                                <TableCell align="right">Thành tiền</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contract.services_history.map((service: any) => (
                                <TableRow key={service.id}>
                                    <TableCell>{service.service_name}</TableCell>
                                    <TableCell align="right">
                                        {service.price.toLocaleString()} VNĐ
                                    </TableCell>
                                    <TableCell align="right">
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={quantities[service.id] || ''}
                                            onChange={(e) => handleQuantityChange(service.id, e.target.value)}
                                            inputProps={{ min: 0 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {((quantities[service.id] || 0) * service.price).toLocaleString()} VNĐ
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={4} sx={{ borderBottom: 'none' }}>
                                    <Box sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)', mt: 2, pt: 2 }}>
                                        <Typography variant="h6" align="right">
                                            Tổng cộng: {totalAmount.toLocaleString()} VNĐ
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                    <Button variant="contained" sx={{ width: '100%' }}>
                        Tạo hóa đơn
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}