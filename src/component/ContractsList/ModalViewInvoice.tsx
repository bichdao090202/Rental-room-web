
'use client';
import { useMemo, useState } from 'react';
import CustomModal from '@/common/components/modal';
import { formatCurrency, formatDatetime } from '@/common/utils/helpers';
import {
    Box,
    Typography,
    Divider,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TextField,
    Button,
    Alert,
} from '@mui/material';

interface ViewInvoiceModalProps {
    onClose: () => void;
    invoice: any;
    onUpdateInvoice?: (updatedInvoice: any) => void;
}

export default function ModalViewInvoice({ onClose, invoice, onUpdateInvoice }: ViewInvoiceModalProps) {
    const [editable, setEditable] = useState(false);
    const [updatedInvoice, setUpdatedInvoice] = useState(invoice);
    const [error, setError] = useState('');

    const handleToggleEdit = () => {
        setEditable((prev) => !prev);
    };

    const handleInputChange = (field: string, value: any) => {
        setUpdatedInvoice({
            ...updatedInvoice,
            [field]: value,
        });
    };

    const handleServiceChange = (id: number, field: string, value: any) => {
        const updatedServices = updatedInvoice.service_demands.map((service: any) =>
            service.id === id ? { ...service, [field]: value } : service
        );
        setUpdatedInvoice({
            ...updatedInvoice,
            service_demands: updatedServices,
        });
    };

    const handleConfirm = () => {
        if (editable && onUpdateInvoice) {
            onUpdateInvoice(updatedInvoice);
        }
        onClose();
    };

    // const totalAmount = updatedInvoice.amount + updatedInvoice.service_demands.reduce((sum: number, service: any) => sum + service.amount, 0);

    const totalServiceAmount = useMemo(() => {
        return updatedInvoice.service_demands.reduce((sum: number, service: any) => sum + service.amount, 0);
    }, [updatedInvoice.service_demands]);

    const monthlyRent = useMemo(() => {
        return updatedInvoice.amount - totalServiceAmount;
    }, [updatedInvoice.amount, totalServiceAmount]);

    const totalAmount = useMemo(() => {
        return updatedInvoice.amount + totalServiceAmount;
    }, [updatedInvoice.amount, totalServiceAmount]);

    return (
        <CustomModal
            open={true}
            onClose={onClose}
            width="70%"
            height="auto"
            title="Xem hóa đơn"
            type="alert"
            onConfirm={handleConfirm}
        >
            <Box
                sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '850px',
                    overflowY: 'auto',
                }}
            >
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: '10px' }}>
                    Thông tin hóa đơn
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Typography><strong>ID:</strong> {updatedInvoice.id}</Typography>
                <Typography><strong>Mã hợp đồng:</strong> {updatedInvoice.contract_id}</Typography>
                <Typography>
                    <strong>Thời gian:</strong> {formatDatetime(new Date(updatedInvoice.created_at))}
                </Typography>

                <Divider sx={{ mb: 2, mt: 2 }} />

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '30%' }}>Tên dịch vụ</TableCell>
                                <TableCell align="right">Đơn giá</TableCell>
                                <TableCell align="right">Số lượng</TableCell>
                                <TableCell align="right">Thành tiền</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Tiền thuê tháng</TableCell>
                                <TableCell>
                                </TableCell>
                                <TableCell >
                                    
                                </TableCell>
                                <TableCell align="right">
                                    {formatCurrency(monthlyRent)}
                                </TableCell>
                            </TableRow>
                            {updatedInvoice.service_demands.map((service: any) => (
                                <TableRow key={service.id}>
                                    <TableCell>{service.name}</TableCell>
                                    <TableCell align="right">
                                        {editable ? (
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={service.based_price}
                                                onChange={(e) => handleServiceChange(service.id, 'based_price', Number(e.target.value))}
                                            />
                                        ) : (
                                            `${service.based_price.toLocaleString()} VNĐ`
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {editable ? (
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={service.quality}
                                                onChange={(e) => handleServiceChange(service.id, 'quality', Number(e.target.value))}
                                            />
                                        ) : (
                                            service.quality
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {(service.based_price * service.quality).toLocaleString()} VNĐ
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

                <Divider sx={{ mb: 2, mt: 2 }} />

                {/* <Button variant="contained" color="primary" onClick={handleToggleEdit} sx={{ mb: 2 }}>
                    {editable ? 'Lưu thay đổi' : 'Chỉnh sửa'}
                </Button> */}
            </Box>
        </CustomModal>
    );
}
