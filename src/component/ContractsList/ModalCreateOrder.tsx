'use client'
import { Box, Button, Divider, Grid, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, Typography, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { get, post, put } from "@/common/store/base.service";
import Loading from "@/app/loading";
import CustomModal from "@/common/components/modal";
import { formatCurrency } from "@/common/utils/helpers";

interface PaymentModalProps {
    onClose: () => void;
    contractId: number;
}

interface ServiceDemand {
    service_history_id: number;
    contract_id: number;
    quality: number;
    amount: number;
    based_price: number;
    name: string;
    description: string;
}

export const ModalCreateOrder: React.FC<PaymentModalProps> = ({ onClose, contractId }) => {
    const [contract, setContract] = useState<any>();
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [month, setMonth] = useState<number>(0);
    const [error, setError] = useState<string>("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('')

    const handleQuantityChange = (id: number, value: string) => {
        const quantity = value ? parseInt(value) : 0;
        setQuantities((prev) => ({
            ...prev,
            [id]: quantity,
        }));
        setError("");
    };

    const totalAmount = contract?.services_history.reduce((total: any, service: any) => {
        const quantity = quantities[service.id] || 0;
        return total + service.price * quantity;
    }, contract.deposit);

    const fetchContracts = async () => {
        try {
            const res = await get(`contracts/${contractId}`);
            const result = res.data;
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
            console.error('Error fetching contracts:', error);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    const handleCreateOrder = async () => {
        const hasEmptyQuantities = contract.services_history.some(
            (service: any) => !quantities[service.id]
        );

        if (hasEmptyQuantities) {
            setError("Vui lòng nhập đầy đủ số lượng cho tất cả các dịch vụ");
            return;
        }

        const serviceDemands: ServiceDemand[] = contract.services_history.map((service: any) => ({
            service_history_id: service.id,
            contract_id: contractId,
            quality: quantities[service.id],
            amount: service.price * quantities[service.id],
            based_price: service.price,
            name: service.service_name,
            description: service.description || ""
        }));

        const orderData = {
            contract_id: contractId,
            amount: totalAmount,
            transaction_id: 1,
            at_month: month,
            start_date: new Date().toISOString(),
            service_demands: serviceDemands
        };

        const invoiceBody = {
            ...orderData,
            transaction_id: 178
        };

        const invoice = await post('invoices', invoiceBody);
        setModalMessage('Tạo hóa đơn thành công');
        setShowSuccessModal(true);
    };

    if (!contract) {
        return <Loading />;
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
                    width: '700px',
                    height: 'auto',
                    maxHeight: '850px',
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

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Typography component="h2" sx={{ fontWeight: 'bold' }} >
                    Thông tin hóa đơn:
                </Typography>
                <Typography>
                    Tháng: {month}
                </Typography>

                <Divider sx={{ mb: '20px', mt: '20px' }} />

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '30%'}}>Tên dịch vụ</TableCell>
                                <TableCell  align="right">Đơn giá</TableCell>
                                <TableCell style={{ width: '25%', minWidth: '150px' }} align="right">Số lượng</TableCell>
                                <TableCell align="right">Thành tiền</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Tiền thuê tháng</TableCell>
                                <TableCell align="right">
                                    {formatCurrency(contract.deposit)}
                                </TableCell>
                                <TableCell align="right">
                                    <TextField
                                        type="number"
                                        size="small"
                                        value={1}
                                        disabled
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    {formatCurrency(contract.deposit)}
                                </TableCell>
                            </TableRow>

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
                                            error={!quantities[service.id] && error !== ""}
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
                    <Button
                        variant="contained"
                        sx={{ width: '100%' }}
                        onClick={handleCreateOrder}
                    >
                        Tạo hóa đơn
                    </Button>
                </Box>

                <CustomModal
                    open={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    title="Thông báo"
                    type="confirm"
                    onConfirm={() => setShowSuccessModal(false)}
                >
                    <Typography>{modalMessage}</Typography>
                </CustomModal>
            </Box>
        </Modal>
    );
}