'use client'
import { Box, Button, Divider, Grid, Modal, Typography } from "@mui/material";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { get, put } from "@/common/store/base.service";
import Loading from "@/app/loading";
import { Contract } from "@/types";
import { formatCurrency, formatDatetime, formatDay } from "@/common/utils/helpers";
import { ModalCreateOrder } from "./ModalCreateOrder";
import ModalViewInvoice from "./ModalViewInvoice";
import CustomModal from "@/common/components/modal";

interface PaymentModalProps {
    onClose: () => void;
    contractId: number;
    type: 'lessor' | 'renter';
}

export const ModalOrder: React.FC<PaymentModalProps> = ({ onClose, contractId, type }) => {
    const [contract, setContract] = useState<Contract>();
    const [modalCreate, setModalCreate] = useState(false);
    const [modalInvoice, setModalInvoice] = useState(false);
    const [invoice, setInvoice] = useState<any>();
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState<number>(0);

    const fetchContracts = async () => {
        try {
            const res = await get(`contracts/${contractId}`);
            const result = res.data;
            console.log(res);
            if (!result) return;
            setContract(result);

            let maxMonth = 0;
            result.invoices.map((invoice: any) => {
                if (invoice.at_month > maxMonth) {
                    maxMonth = invoice.at_month;
                }
            })
            setMonth(maxMonth);
        } catch (error) {
            console.error('Error fetching booking requests:', error);
        }
    };

    const handleModalCreate = () => {
        setModalCreate(false);
        fetchContracts();
    };

    const handleModalInvoice = () => {
        setModalInvoice(false);
    }

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
                    width: '80vw',
                    height: '770px',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    overflowY: 'auto',
                }}
            >
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: '10px' }}>
                    Danh sách hóa đơn
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography component="h2" sx={{ fontWeight: 'bold' }} >
                        Thông tin hợp đồng:
                    </Typography>

                    <Typography  >
                        Mã hợp đồng(ID): {contractId}
                    </Typography>
                    <Typography  >
                        Giá phòng: {formatCurrency(contract.monthly_price)}
                    </Typography>
                    <Typography  >
                        Ngày bắt đầu: {formatDay(new Date(contract.start_date))}
                    </Typography>
                    <Typography  >
                        Thời gian thuê: {contract.rental_duration} tháng
                    </Typography>

                    <Box sx={{ mt: '10px' }}></Box>

                    <Typography component="h2" sx={{ fontWeight: 'bold' }} >
                        Danh sách hóa đơn:
                    </Typography>

                    <Grid container spacing={2} sx={{ maxHeight: 400, overflowY: 'auto', marginTop: '1px' }}>
                        {contract.invoices.map((invoice: any, index: number) => (
                            <Grid item xs={12} key={invoice.id}>
                                <Grid container alignItems="center" justifyContent="space-between" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '9px' }}>
                                    <Grid item>
                                        <Typography variant="body1">
                                            <strong>Thời gian:</strong> {formatDatetime(new Date(invoice.created_at))}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Số tiền:</strong> {formatCurrency(invoice.amount)}
                                        </Typography>
                                        {
                                            invoice.at_month == 0 ? <></> :
                                                <Typography variant="body1">
                                                    <strong>Tháng:</strong> {invoice.at_month}
                                                </Typography>
                                        }
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" color="primary"
                                            onClick={() => {
                                                console.log(invoice);
                                                setInvoice(invoice);
                                                setModalInvoice(true);
                                            }}
                                        >
                                            Xem
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ mt: '10px' }}></Box>

                    {type == 'renter' && month < contract.rental_duration &&
                        <Button variant="contained" sx={{ mt: '10px' }} onClick={() => {
                            setModalCreate(true);
                        }}>Tạo hóa đơn</Button>
                    }

                </Box>
                <Box display="flex" justifyContent="flex-end" gap={2}>                    
                </Box>
                {modalCreate && <ModalCreateOrder onClose={handleModalCreate} contractId={contractId} />}
                {modalInvoice && <ModalViewInvoice onClose={handleModalInvoice} invoice={invoice} />}
            </Box>
        </Modal>
    );
}