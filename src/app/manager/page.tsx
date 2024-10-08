'use client'
import React from 'react';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { bookingRequests, contracts } from '@/types';
import BookingRequestCard from '@/common/components/card/BookingRequestCard';
import ContractCard from '@/common/components/card/ContractCard';
const Home = () => {
    const router = useRouter();
    return (
        <Container>
            <Typography variant="h5" sx={{ marginBottom: 3 }}>QUẢN LÝ THUÊ</Typography>

            <Typography variant="h5" sx={{ marginBottom: 2 }}>Booking Requests</Typography>
            {bookingRequests.map((request) => (
                <BookingRequestCard key={request.request_id} bookingRequest={request} />
            ))}

            <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2 }}>Contracts</Typography>
            {contracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
            ))}
        </Container>
    );
};

export default Home;
