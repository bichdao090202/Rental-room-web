// components/BookingRequestCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Button, Grid, Divider } from '@mui/material';
import { BookingRequest } from '@/types';


interface BookingRequestCardProps {
  bookingRequest: BookingRequest;
}

const BookingRequestCard: React.FC<BookingRequestCardProps> = ({ bookingRequest }) => {
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">{bookingRequest.property.title}</Typography>
        <Typography variant="body2">Status: {bookingRequest.status}</Typography>
        <Typography variant="body2">Note: {bookingRequest.note}</Typography>
        <Typography variant="body2">Renter's Message: {bookingRequest.message_from_renter}</Typography>
        <Typography variant="body2">Rental Duration: {bookingRequest.rental_duration} months</Typography>

        <Divider sx={{ marginY: 1 }} />
        <Grid container justifyContent="flex-end">
          <Button variant="contained">View Details</Button>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BookingRequestCard;
