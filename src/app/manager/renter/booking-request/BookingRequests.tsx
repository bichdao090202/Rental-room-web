'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button, Stack, CircularProgress, Modal } from '@mui/material';
import SmallCard, { HeadCell } from '@/common/components/card/SmallCard';
import { get } from '@/common/store/base.service';
import { BookingRequest, Room } from '@/types';
import { useRouter } from 'next/navigation';

import OpenPdfButton from '@/common/components/OpenPdfButton';
import { getSession, useSession } from 'next-auth/react';
import { Order, orderInit, PaymentModal } from './PaymentModal';

export default function BookingRequests() {
    const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
    const router = useRouter();
    const [paymentModal, setPaymentModal] = useState(false);
    const [order, setOrder] = useState<Order>(orderInit);
    const { data: session } = useSession();
    console.log(session);
    

    const headCells: HeadCell[] = [
        { id: 'status', label: 'Trạng thái' },
        // { id: 'note', label: 'Ghi chú' },
        { id: 'start_date', label: 'Ngày bắt đầu' },
        { id: 'rental_duration', label: 'Thời gian thuê(tháng)' },
        { id: 'message_from_renter', label: 'Tin nhắn từ khách hàng' },
        {id: 'price', label: 'Giá'},
        {
            id: 'action', label: "Action",
            render: (row) =>
            (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {row.note == "Waiting for renter to sign and pay" && (
                        <Button variant="contained" color="success" onClick={() => {
                            setPaymentModal(true);
                            setOrder({
                                bookingRequestId: row.id,
                                user: session?.user,
                                priceMonth: row.price,
                                deposit: row.deposit,
                                OrderDetails: [
                                    {
                                        title: row.title,
                                        value: row.price,
                                        quantity: row.rental_duration,                                        
                                    }
                                ]
                            });
                            console.log(row.id);
                        }}>Thanh toán</Button>
                        // <VNPayButton
                        //     userId="12345"
                        //     amount={100000}
                        //     orderDescription="Thanh toán đơn hàng #12345"
                        // />
                    )}

                    {row.note === "Waiting for renter to sign and pay" && row.message_from_lessor && (
                        <OpenPdfButton
                            fileBase64={row.message_from_lessor}
                            filename={"SignDocument.pdf"}
                        />
                    )}

                    <Button variant="contained" color="primary" onClick={() => {
                        router.push(`/room/${row.room_id}`)
                    }}>
                        Xem phòng
                    </Button>

                    {row.status!='Success' && (
                        <Button variant="contained" color="error" onClick={() => {

                        }}>
                            Hủy
                        </Button>
                    )}
                </Box>
            )
        }
    ]

    const fetchBookingRequests = async () => {
        const session = await getSession();
        try {
            const res = await get(`booking-requests?renter_id=${session?.user?.id}`);
            const result = res.data;
            console.log(res);
            setBookingRequests(result);
        } catch (error) {
            console.error('Error fetching booking requests:', error);
        }
    };

    const handlePaymentModal = () => {
        setPaymentModal(false);
    };

    useEffect(() => {
        fetchBookingRequests();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '70vw' }}>
            <Typography variant="h4" gutterBottom >
                Danh sách yêu cầu thuê
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {bookingRequests.map((request) => (
                    <SmallCard key={request.id}
                        dataSource={{
                            image: request.room.images?.[0] || '',
                            title: request.room.title,
                            status: request.status,
                            note: request.note,
                            start_date: request.start_date,
                            rental_duration: request.rental_duration,
                            message_from_renter: request.message_from_renter,
                            message_from_lessor: request.message_from_lessor,
                            id: request.id,
                            renter_id: request.renter_id,
                            lessor_id: request.lessor_id,
                            room_id: request.room.id,
                            price: request.room.price,
                            deposit: request.room.deposit,
                        }}
                        headCells={headCells}
                    />
                ))}
            </Box>
            {paymentModal && <PaymentModal onClose={handlePaymentModal} order={order}/>}
        </Box>
    );
};
