'use client'
import { Box, Button, Divider, FormControl, MenuItem, Modal, Select, Typography } from "@mui/material";
import { PaymentInfo } from '../../app/api/payment/vnpay/create-payment-url/route';
import { createRequestPayment } from "@/service/sub/create_request_payment";
import { formatCurrency } from "@/common/utils/helpers";
import CustomFormControl from "@/common/components/FormControl";
import FormControlDisable from "@/common/components/DisableTextfield";
import React from "react";
import { userAction } from "@/common/store/user/users.actions";
import { createTransaction } from "@/service/main/create_transaction";
import { useTransactionStore } from "@/common/store/order/store";
import { post } from "@/common/store/base.service";

export const orderInit = {
    bookingRequestId: 0,
    user: {},
    OrderDetails: [],
    deposit: 0,
    priceMonth: 0,
    base64: '',
}

interface PaymentModalProps {
    onClose: () => void;
    order?: Order;
}

export interface Order {
    bookingRequestId: number;
    user: any;
    OrderDetails?: OrderDetail[];
    deposit?: number;
    priceMonth: number;
    base64?: string;
}

interface OrderDetail {
    title: string;
    value: number;
    quantity: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, order }) => {
    const updateTransactionData = useTransactionStore((state) => state.updateData);
    const data = useTransactionStore((state) => state.type);

    let total = 0;
    let orderDescription = '';

    if (!order) return null;
    if (order.deposit) {
        total = order.deposit + order.priceMonth;
        orderDescription = 'DEPOSIT,ROOM_CONTRACT';
    } else {
        total = order.priceMonth;
        orderDescription = 'Thanh toan tien thue phong va dich vu';
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
                    height: '70vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    Thông tin thanh toán
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                    <Typography component="h2" sx={{ fontWeight: 'bold' }} >
                        Thông tin khách hàng:
                    </Typography>
                    <Typography >
                        {/* ID: {order?.userId} */}
                        ID: {order?.user?.id}
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <Typography sx={{ marginRight: '10px' }}>Chọn nhà cung cấp chữ ký số:</Typography>
                        <FormControl variant="outlined" className="w-1/5">
                            <Select
                                variant="outlined"
                                id="sign"
                                value={-1}
                                // onChange={(event: any) => setRole(event.target.value)}
                                sx={{
                                    borderRadius: '8px',
                                    marginBottom: '10px'
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 400,
                                        },
                                    },
                                }}
                            >
                                <MenuItem value={-1}>Viettel</MenuItem>

                            </Select>
                        </FormControl>
                    </Box>

                    <Divider sx={{ my: 2 }} />
                    <Typography component="h2" sx={{ fontWeight: 'bold' }} >
                        Thông tin hóa đơn:
                    </Typography>

                    {order?.deposit ?
                        <>
                            <FormControlDisable
                                title="Tiền cọc"
                                value={formatCurrency(order.deposit)} />

                            <FormControlDisable
                                title="Tiền thuê phòng tháng 1"
                                value={formatCurrency(order.priceMonth)} />
                            <FormControlDisable
                                title="Tổng cộng"
                                value={formatCurrency(total)} />
                            <FormControlDisable
                                title="Mô tả"
                                value={orderDescription} />
                        </>
                        :
                        <>
                            <Box>Tiền dịch vụ</Box>
                        </>
                    }
                </Box>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="contained" sx={{ background: '#1976d2' }} onClick={ async() => {
                        const body = {
                            user_id: "083202010950_002",
                            serial_number: "54010101b710e8055dcb29e10f1aa584",
                            image_base64: "",
                            rectangles: [
                                {
                                    number_page_sign: 1,
                                    margin_top: 100,
                                    margin_left: 100,
                                    margin_right: 500,
                                    margin_bottom: 100
                                }
                            ],
                            visible_type: 0,
                            contact: "",
                            font_size: 12,
                            sign_files: [
                                {
                                    data_to_be_signed: "c803ba9e0b741be5995687c3611ecea617d532f12d7bae81aad0fa5d6ffe3f23",
                                    doc_id: "32c-7401-25621",
                                    file_type: "pdf",
                                    sign_type: "hash",
                                    file_base64: order.base64
                                }
                            ]
                        };

                        console.log(body);      


                        const res = await post('http://54.253.233.87:8010/sign/sign_document', body,false);
                        console.log(res);                        
                        const signedData = res[0].signedData;
                        console.log(signedData);
                        if (!signedData) return;
                        const newBody = {   
                            booking_request_id: order.bookingRequestId,
                            pay_for: 2,
                            file_base64: signedData,
                            file_name: `contract-${order.bookingRequestId}`,
                        }
                        const resp = await post('contracts/booking',newBody);                        
                        console.log(resp);
                        if (resp.status=="SUCCESS") {
                            alert("Tạo hợp đồng thành công");                            
                        } else {
                            alert("Tạo hợp đồng thất bại, thủ lại sau");
                        }

                        onClose();
                        // updateTransactionData(order, "DEPOSIT,ROOM_CONTRACT");
                        // createTransaction(order.bookingRequestId, "DEPOSIT,ROOM_CONTRACT", total / 100, order);
                    }}>
                        Thanh toán
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        Hủy
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}