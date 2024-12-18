'use client'
import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { get, post, put } from "@/common/store/base.service";
import Loading from "@/app/loading";
import { Contract } from "@/types";
import { createTransaction } from "@/service/main/create_transaction";
import { getContractStatus } from ".";

interface PaymentModalProps {
    onClose: () => void;
    contractId: number;
    type: "cancel" | "confirm" | "handle";
}

export const ModalCancelContract: React.FC<PaymentModalProps> = ({ onClose, contractId, type }) => {
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
                    height: 'auto',
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
                        Trạng thái: {getContractStatus(contract.status)}
                    </Typography>

                    <Typography  >
                        Tiền cọc: {contract.room?.deposit}
                    </Typography>

                    <Typography  >
                        Đang chờ hủy: {(contract.canceled_by == null ? 'Không' : contract.canceled_by.id == contract.renter.id ? 'Người thuê' : 'Chủ trọ')}
                    </Typography>

                    <Divider sx={{ my: 2 }} />
                    <Typography component="h2" sx={{ fontWeight: 'bold' }} >
                        Thông báo:
                    </Typography>

                    {type === "cancel" &&
                        <Box>
                            <Typography>- Yêu cầu của bạn sẽ được gửi đến đối tác để họ xem xét và phản hồi.</Typography>
                            <Typography>
                                - Xin lưu ý rằng nếu việc hủy bỏ không được sự đồng ý của cả hai bên, bạn sẽ mất khoản tiền đặt cọc đã thanh toán khi ký hợp đồng cho đối tác để bồi thường.
                            </Typography>
                        </Box>
                    }

                    {type === "confirm" &&
                        <Box>
                            <Typography>- Đối tác không đồng ý yêu cầu hủy của bạn, vẫn hủy? Xin lưu ý rằng, bạn sẽ mất khoản tiền đặt cọc đã thanh toán khi ký hợp đồng cho đối tác để bồi thường. </Typography>
                        </Box>
                    }

                    {type === "handle" &&
                        <Typography>
                            Bạn vừa nhận được yêu cầu hủy hợp đồng thuê nhà từ phía đối tác.
                            Xin lưu ý rằng nếu bạn đồng ý hủy hợp đồng, toàn bộ quá trình sẽ kết thúc mà không ảnh hưởng đến khoản tiền đặt cọc.
                            Tuy nhiên, nếu bạn không đồng ý, đối tác sẽ mất khoản tiền đặt cọc đã thanh toán khi ký hợp đồng để bồi thường cho bạn.
                        </Typography>
                    }

                </Box>
                {type === "cancel" &&
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button variant="contained" sx={{ background: 'primary' }} onClick={async () => {
                            const session = await getSession();
                            const body = {
                                ...contract,
                                renter_id: contract?.renter.id,
                                lessor_id: contract?.lessor.id,

                                cancel_status: 1,
                                canceled_by: session?.user.id,
                                contract_id: contract.id,
                            }
                            const res = await post(`contracts/cancel`, body)
                            onClose()
                        }}>
                            Xác nhận
                        </Button>
                        <Button variant="outlined" onClick={onClose}>
                            Bỏ
                        </Button>
                    </Box>
                }

                {type === "confirm" &&
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button variant="contained" sx={{ background: 'primary' }} onClick={async () => {
                            const body = {
                                ...contract,
                                renter_id: contract?.renter.id,
                                lessor_id: contract?.lessor.id,
                                
                                canceled_by: contract?.canceled_by,
                                cancel_status: 3,
                                status: 5,
                                contract_id: contract.id,
                            }
                            const res = await post(`contracts/cancel`, body)
                            // const id = contract?.canceled_by.id == contract?.renter.id ? contract?.lessor.id : contract?.renter.id
                            // createTransaction(id, 'REFUND', (contract.room!.deposit) * 2, contract?.id)
                            onClose()
                        }}>
                            Đồng ý
                        </Button>
                        <Button variant="contained" onClick={async () => {
                            const body = {
                                ...contract,
                                renter_id: contract?.renter.id,
                                lessor_id: contract?.lessor.id,

                                cancel_status: 0,
                                canceled_by: null,
                                contract_id: contract.id,
                            }
                            const res = await post(`contracts/cancel`, body)
                            onClose()
                        }}>
                            Không hủy nữa
                        </Button>
                    </Box>
                }

                {type === "handle" &&
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button variant="contained" sx={{ background: 'primary' }} onClick={async () => {
                            const body = {
                                ...contract,
                                renter_id: contract?.renter.id,
                                lessor_id: contract?.lessor.id,
                                room_id: contract?.room!.id,

                                canceled_by: contract?.canceled_by,
                                cancel_status: 3,
                                status: 6,
                                contract_id: contract.id,
                            }
                            const res = await post(`contracts/cancel`, body)
                            createTransaction(contract?.lessor.id, 'REFUND', contract.room!.deposit, contract?.id)
                            createTransaction(contract?.renter.id, 'REFUND', contract.room!.deposit, contract?.id)
                            onClose()
                        }}>
                            Đồng ý
                        </Button>
                        <Button variant="contained" onClick={async () => {
                            const body = {
                                ...contract,
                                renter_id: contract?.renter.id,
                                lessor_id: contract?.lessor.id,

                                canceled_by: contract?.canceled_by,
                                cancel_status: 2,
                                contract_id: contract.id,
                            }
                            console.log(body)
                            const res = await post(`contracts/cancel`, body)
                            onClose()
                        }}>
                            Không đồng ý
                        </Button>
                    </Box>
                }

            </Box>
        </Modal>
    );
}