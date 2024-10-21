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

export const ModalCancelContract: React.FC<PaymentModalProps> = ({ onClose, contractId }) => {
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
                    <Typography>- Yêu cầu của bạn sẽ được gửi đến đối tác để họ xem xét và phản hồi.</Typography>
                    <Typography>
                        - Xin lưu ý rằng nếu việc hủy bỏ không được sự đồng ý của cả hai bên, bạn sẽ mất khoản tiền đặt cọc đã thanh toán khi ký hợp đồng cho đối tác để bồi thường.
                    </Typography>
                    
                </Box>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="contained" sx={{ background: 'primary' }} onClick={ async () => {
                        const session = await getSession();
                        const body = {
                            ...contract,
                            canceled_by: session?.user.id,
                            pay_mode : 5,
                            renter_id: contract?.renter.id,
                            lessor_id: contract?.lessor.id,
                            room_id: contract?.room!.id
                        }
                        console.log(body);
                        const res = await put(`contracts/${contract.id}`,body)
                        onClose()
                    }}>
                        Xác nhận
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        Bỏ
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}