import { PaymentInfo } from "@/app/api/payment/vnpay/create-payment-url/route";
import { post } from "@/common/store/base.service";

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

export interface HandlePaymentParams {
    userId: number;
    amount: number;
    orderDescription: string;
}

export const createRequestPayment = async ({ userId, amount, orderDescription }: HandlePaymentParams): Promise<void> => {
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