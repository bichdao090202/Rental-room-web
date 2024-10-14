'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';


export default function Page() {
    const [bookingRequests, setBookingRequests] = useState<[]>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBookingRequests = async () => {
            
        };

        // fetchBookingRequests();
    }, []);

    if (loading) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '70vw' }}>
            <Typography variant="h4" gutterBottom >
                Danh sách hợp đồng
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            </Box>
        </Box>
    )
}