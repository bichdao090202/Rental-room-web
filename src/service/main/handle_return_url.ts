import { get, post, put } from '@/common/store/base.service';
import { BookingRequest } from '@/types';
import { formatDatePost } from "@/common/utils/helpers";

export const handleReturnUrl = async (userId: number, transactionType: string, data: any, orderData: any) => {
    if (data.vnp_OrderInfo === 'DEPOSIT') {
        const transactionBody = {
            user_id: userId,
            amount: parseInt(data.vnp_Amount),
            transaction_type: 1,
            status: data.vnp_TransactionStatus === '00' ? 1 : 2,
            description: `DEPOSIT`,
            transaction_no: data.vnp_TransactionNo,
            payment_method: 0
        };
        let transactionResult = await post(`transactions`, transactionBody);
    }

    if (data.vnp_OrderInfo === 'DEPOSIT,ROOM_CONTRACT' && transactionType) {
        console.log(transactionType);
        const transactionBody = {
            user_id: userId,
            amount: parseInt(data.vnp_Amount),
            transaction_type: 1,
            status: data.vnp_TransactionStatus === '00' ? 1 : 2,
            description: `Nap tien`,
            transaction_no: data.vnp_TransactionNo,
            payment_method: 0
        };

        let transactionResult = await post(`transactions`, transactionBody);

        const newTrans = {
            ...transactionBody,
            transaction_type: 3,
            status: 1,
            description: 'DEPOSIT,ROOM_CONTRACT',
            transaction_no: `${data.vnp_TransactionNo}- ${orderData.contract_id}`,
        };
        transactionResult = await post(`transactions`, newTrans);

        if (transactionResult.status === "SUCCESS") {
            createContract(data, transactionResult.data.id);
        }
    }

    if (transactionType === 'CREATE_ORDER') {
        const transactionBody = {
            user_id: userId,
            amount: parseInt(data.vnp_Amount),
            transaction_type: 1,
            status: data.vnp_TransactionStatus === '00' ? 1 : 2,
            description: `Nap tien`,
            transaction_no: data.vnp_TransactionNo,
            payment_method: 0
        };
        let transactionResult = await post(`transactions`, transactionBody);

        const newTrans = {
            ...transactionBody,
            transaction_type: 3,
            description: 'PAYMENT_ORDER',
            transaction_no: `${data.vnp_TransactionNo}- ${orderData.contract_id}`,
        };
        transactionResult = await post(`transactions`, newTrans);
        const invoiceBody = {
            ...orderData,
            transaction_id: transactionResult.data.id ? transactionResult.data.id : 8
        };

        if (transactionResult.status === "SUCCESS") {
            const invoice = await post('invoices', invoiceBody);
            console.log(invoice);
        }
    }
}

const createContract = async (data: any, transId: number) => {
    const bookingRequestId = data.vnp_TxnRef.split('-')[1];
    const responseGetBookingRequest = await get(`booking-requests`);
    const bookingRequests = responseGetBookingRequest.data;
    const bookingRequest = bookingRequests.find((bookingRequest: BookingRequest) => bookingRequest.id == bookingRequestId);
    const bodyBookingRequest = {
        ...bookingRequest,
        status: 'Success',
        note: 'Success',
    }

    const bodyContract = {
        renter_id: bookingRequest.renter_id,
        lessor_id: bookingRequest.lessor_id,
        room_id: bookingRequest.room_id,
        date_rent: bookingRequest.start_date,
        monthly_price: bookingRequest.room.price,
        status: 2,
        file_base64: bookingRequest.message_from_lessor,
        file_name: bookingRequest.room.title,
        payment: bookingRequest.rental_duration,
    }
    const responseUpdateBookingRequest = await put(`booking-requests/${bodyBookingRequest.id}`, bodyBookingRequest);
    console.log(responseUpdateBookingRequest);

    const responseCreateContract = await post(`contracts`, bodyContract);
    console.log(responseCreateContract);

    const bodyOrder = {
        contract_id: responseCreateContract.data.id,
        amount: data.vnp_Amount,
        start_date: formatDatePost(data.vnp_PayDate),
        transaction_id: transId,
        hash: "DEPOSIT,ROOM_CONTRACT"
    }

    const order = await post(`invoices`, bodyOrder);
    console.log(order);
}