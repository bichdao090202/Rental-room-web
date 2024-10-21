'use client'
import {Box, Button, Divider, Grid, Modal, Typography} from "@mui/material";
import {getSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {get, put} from "@/common/store/base.service";
import Loading from "@/app/loading";
import {Contract} from "@/types";
import {formatCurrency, formatDatetime} from "@/common/utils/helpers";

interface PaymentModalProps {
    onClose: () => void;
    contractId: number;
}

export const ModalOrder: React.FC<PaymentModalProps> = ({ onClose, contractId }) => {
    const [contract, setContract] = useState<Contract>();
    const fetchContracts = async () => {
        try {
            const res = await get(`contracts/${contractId}`);
            const result = res.data;
            console.log(res);
            if (!result) return;
            setContract(result);
        } catch (error) {
            console.error('Error fetching booking requests:', error);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    if (!contract){
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
                    height: '80vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    overflowY: 'auto',
                }}
            >
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
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

                    <Box sx={{mt:'20px',mb:'20px'}}></Box>

                    <Typography component="h2" sx={{ fontWeight: 'bold' }} >
                        Danh sách hóa đơn:
                    </Typography>

                    <Grid container spacing={2} >
                        {contract.invoices.map((invoice:any) => (
                            <Grid item xs={12}  key={invoice.id}>
                                <Grid container alignItems="center" justifyContent="space-between" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px' }}>
                                    <Grid item>
                                        <Typography variant="body1">
                                            <strong>Thời gian:</strong> {formatDatetime(new Date(invoice.start_date))}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Số tiền:</strong> {formatCurrency(invoice.amount)}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" color="primary" >
                                            Xem
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>

                    {/*<Typography  >*/}
                    {/*    Tiền cọc: {contract.room?.deposit}*/}
                    {/*</Typography>*/}

                    {/*<Typography  >*/}
                    {/*    Đang chờ hủy: {(contract.canceled_by==null? 'Không': contract.canceled_by==contract.renter.id?'Người thuê':'Chủ trọ')}*/}
                    {/*</Typography>*/}

                    {/*<Divider sx={{ my: 2 }} />*/}


                </Box>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                    {/*<Button variant="contained" sx={{ background: 'primary' }} onClick={ async () => {*/}
                    {/*    const body = {*/}
                    {/*        ...contract,*/}
                    {/*        pay_mode : 2,*/}
                    {/*        status: 6*/}
                    {/*    }*/}
                    {/*    // await put(`contracts/${contract.id}`,body)*/}
                    {/*    onClose()*/}
                    {/*}}>*/}
                    {/*    Đồng ý*/}
                    {/*</Button>*/}
                    {/*<Button variant="contained" onClick={ async () => {*/}
                    {/*    const body = {*/}
                    {/*        ...contract,*/}
                    {/*        pay_mode : 6,*/}
                    {/*    }*/}
                    {/*    // await put(`contracts/${contract.id}`,body)*/}
                    {/*    onClose()*/}
                    {/*}}>*/}
                    {/*    Không đồng ý*/}
                    {/*</Button>*/}
                </Box>
            </Box>
        </Modal>
    );
}