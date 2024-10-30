import { post } from "@/common/store/base.service";
import { createRequestPayment } from "../sub/create_request_payment";

export const createTransaction = async (userId: number, type: string, amount: number, data: any) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    if (type === 'DEPOSIT') {
        createRequestPayment({ userId,  amount, orderDescription: 'DEPOSIT' });
    }

    if (type === 'DEPOSIT,ROOM_CONTRACT') {
        createRequestPayment({ userId,  amount, orderDescription: 'DEPOSIT,ROOM_CONTRACT' });
    }

    if (type === "REFUND"){
        const transactionBody = {
            user_id: userId,
            amount: amount,
            transaction_type: 4,
            status: 1,
            description: `Hoan tien`,
            transaction_no: `${data} - ${userId}`,
            payment_method: 0
        };
        let transactionResult = await post(`transactions`, transactionBody);
    }



}
