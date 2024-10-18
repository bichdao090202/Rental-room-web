import VNPayButton from "@/common/components/Payment/PaymentButton";
import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import { PaymentInfo } from '../../../api/payment/vnpay/create-payment-url/route';
import { handlePayment } from "@/common/components/Payment/handlePayment";
import { formatCurrency } from "@/common/utils/helpers";
import CustomFormControl from "@/common/components/FormControl";
import FormControlDisable from "@/common/components/DisableTextfield";

export const orderInit = {
    bookingRequestId: 0,
    user: {},
    OrderDetails: [],
    deposit: 0,
    priceMonth: 0,
}

interface PaymentModalProps {
    onClose: () => void;
    order?: Order;
}

export interface Order {
    bookingRequestId: number;
    user:any;
    OrderDetails?: OrderDetail[];
    deposit?: number;
    priceMonth: number;
}

interface OrderDetail {
    title: string;
    value: number;
    quantity: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, order }) => {
    let total = 0;
    let orderDescription = '';

    if(!order) return null;
    if (order.deposit) {
        total = order.deposit + order.priceMonth;
        orderDescription = 'Thanh toan tien coc va tien thue phong thang 1';
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
                    {/* <Typography >
                        Họ tên: {order?.user?.full_name}
                    </Typography> */}

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
                    <Button variant="contained" sx={{ background: '#1976d2' }} onClick={() => {
                        const PaymentInfo = {
                            amount: total / 100,
                            // userId: order.userId,
                            userId: order.bookingRequestId,
                            orderDescription: orderDescription,
                        }
                        handlePayment(PaymentInfo);
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