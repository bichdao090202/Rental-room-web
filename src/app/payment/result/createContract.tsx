import { get, post, put } from '@/common/store/base.service';
import { BookingRequest } from '@/types';
import {formatDatePost} from "@/common/utils/helpers";
export const createContract = async (data: any) => {
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
    const responseUpdateBookingRequest = await put(`booking-requests/${bodyBookingRequest.id}`,bodyBookingRequest);
    console.log(responseUpdateBookingRequest);

    const responseCreateContract = await post(`contracts`, bodyContract);
    console.log(responseCreateContract);

    const bodyOrder={
        contract_id: responseCreateContract.data.id,
        // contract_id: 8,
        amount: data.vnp_Amount,
        start_date: formatDatePost( data.vnp_PayDate),
    }


    const order = await post(`invoices`, bodyOrder);
    console.log(order);
    
    
}