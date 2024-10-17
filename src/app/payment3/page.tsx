'use client'
import { post } from "@/common/store/base.service";
import { Box, Button } from "@mui/material";
import { PaymentInfo } from "../api/payment/vnpay/create-payment-url/route";
import VNPayButton from "@/common/components/Payment/PaymentButton";
import VNPayForm from "@/common/components/PaymentForm2";

export default function Page() {
    const createPaymentUrl = async (paymentInfo: PaymentInfo): Promise<string> => {
        const data = await post('/api/payment/vnpay/create-payment-url', paymentInfo, false);
        window.open(data.url, '_blank');
        return data.url;
    };

    const paymentInfo: PaymentInfo = {
        amount: 100000,
        orderId: '123456',
        orderDescription: 'Thanh toán đơn hàng #12345',
        clientIp: '192.168.1.1',
    };

    createPaymentUrl(paymentInfo)
        .then((url) => {
            console.log('Payment URL:', url);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    return (
        <Box>
            {/* <Button onClick={async () => { await createPaymentUrl(paymentInfo) }} >
                Thanh toán với VNPay
            </Button> */}
            <VNPayButton
                userId="12345"
                amount={100000}
                orderDescription="Thanh toán đơn hàng #12345"
            />
            {/* <VNPayForm/> */}
        </Box>
    )
}