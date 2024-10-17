'use client'
import { PaymentInfo } from "@/app/api/payment/vnpay/create-payment-url/route";
import { post } from "@/common/store/base.service";
import { Box, Button } from "@mui/material";

interface VNPayButtonProps {
    userId: string;
    amount: number;
    orderDescription: string;
}

const VNPayButton: React.FC<VNPayButtonProps> = ({ userId, amount, orderDescription }) => {
    const createPaymentUrl = async (paymentInfo: PaymentInfo): Promise<string> => {
        try {
            const data = await post('/api/payment/vnpay/create-payment-url', paymentInfo, false);
            window.open(data.url, '_blank');
            return data.url;
        } catch (error) {
            console.error('Error creating payment URL:', error);
            throw error;
        }
    };

    const getClientIp = (): string => {
        return '192.168.1.1';
    };

    const handlePayment = async () => {
        const orderId = `${new Date().getTime()}-${userId}`;
        const paymentInfo: PaymentInfo = {
            amount,
            orderId,
            orderDescription,
            clientIp: getClientIp(),
        };

        try {
            const url = await createPaymentUrl(paymentInfo);
            console.log('Payment URL:', url);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Box>
            <Button variant="contained" sx={{background:'#1976d2'}} onClick={handlePayment}>
                Thanh toán
            </Button>
        </Box>
    );
};

export default VNPayButton;
