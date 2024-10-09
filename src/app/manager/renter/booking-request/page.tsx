'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import SmallCard from '@/common/components/card/SmallCard';

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

interface ApiResponse {
    status: string;
    message: string;
    data: BookingRequest[];
}

export default function Page() {
    const mockBookingRequests: BookingRequest[] = [
        {
            id: 1,
            created_at: "2023-09-01T10:00:00Z",
            updated_at: "2023-09-01T10:00:00Z",
            renter_id: 101,
            lessor_id: 201,
            room_id: 1,
            room: {
                id: 1,
                title: "Cozy Room in the City Center",
                price: 5000000,
                images: [
                    "https://www.wilsonhomes.com.au/sites/default/files/styles/blog_hero_banner/public/My%20project%20-%202023-06-20T095818.329%20%281%29_0.jpg?itok=UbtVbhT0",
                ],
            },
            request_date: "2023-10-01T12:00:00Z",
            status: "PROCESSING",
            note: "Looking forward to renting this room.",
            message_from_renter: "Please let me know if the room is available.",
            start_date: "2023-10-15T12:00:00Z",
            rental_duration: 12,
        },
        {
            id: 2,
            created_at: "2023-09-05T15:00:00Z",
            updated_at: "2023-09-05T15:00:00Z",
            renter_id: 102,
            lessor_id: 202,
            room_id: 2,
            room: {
                id: 2,
                title: "Spacious Room with a View",
                price: 6000000,
                images: [
                    "https://www.wilsonhomes.com.au/sites/default/files/styles/blog_hero_banner/public/My%20project%20-%202023-06-20T095818.329%20%281%29_0.jpg?itok=UbtVbhT0",
                ],
            },
            request_date: "2023-10-02T12:00:00Z",
            status: "ACCEPTED",
            note: "Excited to move in!",
            message_from_renter: "I will be available for a visit.",
            start_date: "2023-10-20T12:00:00Z",
            rental_duration: 6,
        },
    ];

    const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(mockBookingRequests);
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
                Danh sách yêu cầu thuê
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {bookingRequests.map((request) => (
                <SmallCard
                    dataSource={{
                        image: request.room.images?.[0] || '',
                        title: request.room.title,
                        status: request.status,
                        note: request.note,
                        start_date: new Date(request.start_date).toLocaleDateString(), 
                        rental_duration: request.rental_duration,
                        message_from_renter: request.message_from_renter,
                    }}
                    headCells={[
                        { id: 'status', label: 'Trạng thái' },
                        { id: 'note', label: 'Ghi chú' },
                        { id: 'start_date', label: 'Ngày bắt đầu' },
                        { id: 'rental_duration', label: 'Thời gian thuê' },
                        { id: 'message_from_renter', label: 'Tin nhắn từ khách hàng' },
                    ]}
                    onButtonClick={(actionType) => {
                        console.log(`${actionType} clicked for request ID: ${request.id}`);
                    }}
                />
            ))}
            </Box>
        </Box>
    );
};
