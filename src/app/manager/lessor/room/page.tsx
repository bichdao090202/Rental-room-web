'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';

interface ApiResponse {
    status: string;
    message: string;
    data: BookingRequest[];
}

interface BookingRequest {
    id: number;
    created_at: string;
    updated_at: string;
    renter_id: number;
    lessor_id: number;
    room_id: number;
    room: {
        id: number;
        title: string;
        price: number;
        images: string[];
    };
    request_date: string;
    status: string;
    note: string;
    message_from_renter: string;
    start_date: string;
    rental_duration: number;
}

export default function Page() {
    const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBookingRequests = async () => {
            try {
                const response = await fetch('/api/booking-requests');
                const result: ApiResponse = await response.json();
                if (result.status === 'SUCCESS') {
                    setBookingRequests(result.data);
                }
            } catch (error) {
                console.error('Error fetching booking requests:', error);
            } finally {
                setLoading(false);
            }
        };

        // fetchBookingRequests();
    }, []);

    if (loading) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '70vw' }}>
            <Typography variant="h4" gutterBottom >
                Danh sách phòng đã đăng
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            </Box>
        </Box>
    )
}