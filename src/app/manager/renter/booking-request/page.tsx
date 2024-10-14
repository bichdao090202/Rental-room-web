'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button, Stack, CircularProgress, Modal } from '@mui/material';
import SmallCard, { HeadCell } from '@/common/components/card/SmallCard';
import { get } from '@/common/store/base.service';
import { BookingRequest, Room } from '@/types';
import PaymentButton from '@/payment';
import { usersSelectors } from '@/common/store/user/users.selectors';
import { useRouter } from 'next/navigation';

import OpenPdfButton from '@/common/components/OpenPdfButton';

export default function Page() {
    const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
    const user = usersSelectors.useUserInformation();
    const router = useRouter();
    const headCells: HeadCell[] = [
        { id: 'status', label: 'Trạng thái' },
        // { id: 'note', label: 'Ghi chú' },
        { id: 'start_date', label: 'Ngày bắt đầu' },
        { id: 'rental_duration', label: 'Thời gian thuê' },
        { id: 'message_from_renter', label: 'Tin nhắn từ khách hàng' },
        {
            id: 'action', label: "Action",
            render: (row: BookingRequest) =>
            (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {row.note == "Waiting for renter to sign and pay" && (
                        <Button onClick={() => {
                            console.log(row.id);
                        }}
                            variant="contained" color="success" >
                            Thanh toán
                        </Button>
                    )}

{row.note === "Waiting for renter to sign and pay" && row.message_from_lessor && (
            <OpenPdfButton 
                fileBase64={row.message_from_lessor} 
                filename={"SignDocument.pdf"} 
            /> 
        )} 



                    <Button variant="contained" color="primary" onClick={() => {
                        router.push(`/room/${row.id}`)
                    }}>
                        Xem phòng
                    </Button>

                    <Button variant="contained" color="error" onClick={() => {

                    }}>
                        Hủy
                    </Button>
                </Box>
            )
        }
    ]

    useEffect(() => {
        const fetchBookingRequests = async () => {
            try {
                const res = await get(`booking-requests?renter_id=${user?.id}`);
                const result = res.data;
                console.log(res);
                setBookingRequests(result);
            } catch (error) {
                console.error('Error fetching booking requests:', error);
            }
        };
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
                            // start_date: new Date(request.start_date).toLocaleDateString(),
                            start_date: request.start_date,
                            rental_duration: request.rental_duration,
                            message_from_renter: request.message_from_renter,
                            message_from_lessor: request.message_from_lessor,
                            id: request.id,
  renter_id: request.renter_id,
  lessor_id: request.lessor_id,
  room_id: request.room.id,
                        }}
                        headCells={headCells}
                    />
                ))}
            </Box>
        </Box>
    );
};
