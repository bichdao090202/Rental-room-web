'use client'
import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import {getSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {get, put} from "@/common/store/base.service";
import Loading from "@/app/loading";
import {Contract} from "@/types";

interface PaymentModalProps {
    onClose: () => void;
    contractId: number;
}

export const ModalHandleCancelContract: React.FC<PaymentModalProps> = ({ onClose, contractId }) => {
    const [contract, setContract] = useState<Contract>();
    const fetchContracts = async () => {
        try {
            const res = await get(`contracts/${contractId}`);
            const result = res.data;
            if (!result) return;
            setContract(result);
        } catch (error) {
            console.error('Error fetching booking requests:', error);
        }
    };

    function getStatusText(status:number) {
        switch (status) {
            case 1:
                return 'Processing';
            case 2:
                return 'Active';
            case 3:
                return 'Finished';
            case 4:
                return 'Failure';
            case 5:
                return 'One-side cancel';
            case 6:
                return 'Agreed cancel';
            default:
                return 'Unknown status';
        }
    }

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
                    height: '50vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    Xác nhận hủy hợp đồng 
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography component="h2" sx={{ fontWeight: 'bold' }} >
                        Thông tin hợp đồng:
                    </Typography>

                    <Typography  >
                        Mã hợp đồng(ID): {contract.id}
                    </Typography>

                    <Typography  >
                        Trạng thái: {getStatusText(contract.status)}
                    </Typography>

                    <Typography  >
                        Tiền cọc: {contract.room?.deposit}
                    </Typography>

                    <Typography  >
                        Đang chờ hủy: {(contract.canceled_by==null? 'Không': contract.canceled_by.id==contract.renter.id?'Người thuê':'Chủ trọ')}
                    </Typography>

                    <Divider sx={{ my: 2 }} />
                    <Typography component="h2" sx={{ fontWeight: 'bold' }} >
                        Thông báo:
                    </Typography>
                    <Typography>
                        Bạn vừa nhận được yêu cầu hủy hợp đồng thuê nhà từ phía đối tác.
                        Xin lưu ý rằng nếu bạn đồng ý hủy hợp đồng, toàn bộ quá trình sẽ kết thúc mà không ảnh hưởng đến khoản tiền đặt cọc.
                        Tuy nhiên, nếu bạn không đồng ý, đối tác sẽ mất khoản tiền đặt cọc đã thanh toán khi ký hợp đồng.
                    </Typography>
                    
                </Box>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="contained" sx={{ background: 'primary' }} onClick={ async () => {
                        const session = await getSession();
                        // const body = {
                        //     ...contract,
                        //     pay_mode : 2,
                        //     status: 6,
                        //     renter_id: contract?.renter.id,
                        //     lessor_id: contract?.lessor.id,
                        //     room_id: contract?.room!.id
                        // }
                        const body = {
                            ...contract,
                            pay_mode : 2,
                            status: 6,
                            renter_id: contract?.renter.id,
                            lessor_id: contract?.lessor.id,
                            room_id: contract?.room!.id,
                            canceled_by: contract?.canceled_by.id,
                        }
                        console.log(body);
                        const res = await put(`contracts/${contract.id}`,body)
                        onClose()
                    }}>
                        Đồng ý
                    </Button>
                    <Button variant="contained" onClick={ async () => {
                        const body = {
                            ...contract,
                            pay_mode : 6,
                            renter_id: contract?.renter.id,
                            lessor_id: contract?.lessor.id,
                            room_id: contract?.room!.id,
                            canceled_by: contract?.canceled_by.id,
                        }
                        console.log(body)
                        await put(`contracts/${contract.id}`,body)
                        onClose()
                    }}>
                        Không đồng ý
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}