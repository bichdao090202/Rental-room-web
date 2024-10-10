'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button, Stack, CircularProgress, Modal } from '@mui/material';
import SmallCard from '@/common/components/card/SmallCard';
import { HeadCard } from '@/common/components/card/headCard';
import { get } from '@/common/store/base.service';
import { BookingRequest } from '@/types';

export default function Page() {
    const headCells: HeadCard[] = [
        { id: 'status', label: 'Trạng thái' },
        { id: 'note', label: 'Ghi chú' },
        { id: 'start_date', label: 'Ngày bắt đầu' },
        { id: 'rental_duration', label: 'Thời gian thuê' },
        { id: 'message_from_renter', label: 'Tin nhắn từ khách hàng' },
        {
            id: 'action', label: "Action",
            render: (row: BookingRequest) =>
            (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {(
                        <Button onClick={() => { }} variant="contained" color="success" >
                            Thanh toán
                        </Button>
                    )}

                    {true && (
                        <Button variant="contained" color="error" >
                            Hủy
                        </Button>
                    )}

                    <Button variant="contained" color="primary" >
                        Chi tiết
                    </Button>
                </Box>
            )
        }
    ]

    const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
    const [loadingPage, setLoadingPage] = useState(false);

    useEffect(() => {
        const fetchBookingRequests = async () => {
            try {
                const res = await get(`booking-requests`);
                const result = res.data;
                console.log(res);
                setBookingRequests(result);
            } catch (error) {
                console.error('Error fetching booking requests:', error);
            }

        };
        fetchBookingRequests();
    }, [bookingRequests]);

    if (loadingPage) {
        return <Typography variant="h6">Loading...</Typography>;
    }

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
                            start_date: new Date(request.start_date).toLocaleDateString(),
                            rental_duration: request.rental_duration,
                            message_from_renter: request.message_from_renter,
                        }}
                        headCells={headCells}
                        onButtonClick={(actionType) => {
                            console.log(`${actionType} clicked for request ID: ${request.id}`);
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};
