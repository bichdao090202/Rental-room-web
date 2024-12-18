'use client'
import FormControlDisable from "@/common/components/DisableTextfield";
import { post } from "@/common/store/base.service";
import { formatCurrency } from "@/common/utils/helpers";
import { Box, Button, Divider, FormControl, MenuItem, Modal, Select, Typography } from "@mui/material";
import React, { useState } from "react";

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
    const [loading, setLoading] = useState(false);
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
                    width: '900px',
                    height: 'auto',
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
                                <MenuItem value={-1}>VNPT</MenuItem>
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
                    <Button variant="contained" color="success" onClick={async () => {
                        setLoading(true);                   
                        try {
                            const body = {
                                user_id: "083202010950",
                                serial_number: "54010101eec8a59ad71b4777401e27f4",
                                transaction_id: "da25ed27-7bfe-495f-89fd-06723a584094",
                                time_stamp: "2024-09-17T15:58:01+07:00",
                                image_base64: "",
                                rectangles: [
                                    {
                                        number_page_sign: 1,
                                        margin_top: 100,
                                        margin_left: 10,
                                        margin_right: 250,
                                        margin_bottom: 200
                                    }
                                ],
                                visible_type: 1,
                                contact: "",
                                font_size: 12,
                                sign_files: [
                                    {
                                        data_to_be_signed: "c803ba9e0b741be5995687c3611ecea617d532f12d7bae81aad0fa5d6ffe3f23",
                                        doc_id: "32c-7401-25621",
                                        file_type: "pdf",
                                        sign_type: "hash",
                                        file_base64: order.base64,
                                        tag_save_signature: ""
                                    }
                                ]
                            };
                            const res = await post('https://mallard-fluent-lightly.ngrok-free.app/api/sign/sign_document', body, false);
                            console.log(res);
                            const signedData = res[0].signed_data;
                            console.log(signedData);
                            if (!signedData) return;
                            const newBody = {
                                booking_request_id: order.bookingRequestId,
                                pay_for: 2,
                                file_base64: signedData,
                                file_name: `contract-${order.bookingRequestId}.pdf`,
                            }
                            const resp = await post('contracts/booking', newBody);
                            if (resp.status == "SUCCESS") {
                                alert("Tạo hợp đồng thành công");
                            } else {
                                alert("Tạo hợp đồng thất bại, thủ lại sau");
                            }
                            onClose();
                        } catch (error){
                            alert("Có lỗi xảy ra, vui lòng thử lại sau.");
                            console.error(error);
                        } finally {
                            setLoading(false); 
                            onClose();

                        }
                    }}>
                        {loading ? "Đang xử lý..." : "Thanh toán"}
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        Hủy
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}