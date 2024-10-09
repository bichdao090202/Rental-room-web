'use client'
import React, { useState } from 'react';
import {
  AppBar,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Box,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';

interface Params {
    params: {
      roomId: string;
    };
  }

export default function Page({ params }: Params) {
    const { roomId } = params; 
    
    const room = {
        id: 1,
        title: "Căn hộ cho thuê giá rẻ",
        type: 2,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI3poe0CGMok1sqDPSkHL74DJs3eG8ASb2Ew&s",
        address: {
            city: "TP.HCM",
            district: "Gò Vấp",
            ward: "phường 4",
            detail: "số 9 Nguyễn Văn Nghi",
        },
        utilities: [1, 2, 3, 4],
        price: 3000000,
        deposit: 3000000,
        gender: 0,
        roomSize: 20,
        owner_id: 1,
        description: "Nhà rộng 10x20m, 3 phòng ngủ...",
    }

    const [openBookingModal, setOpenBookingModal] = useState(false);
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const [startDate, setStartDate] = useState();
  const [rentalDuration, setRentalDuration] = useState('');
  const [messageFromRenter, setMessageFromRenter] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);

  const handleOpenBookingModal = () => setOpenBookingModal(true);
  const handleCloseBookingModal = () => setOpenBookingModal(false);
  const handleOpenTermsModal = () => setOpenTermsModal(true);
  const handleCloseTermsModal = () => setOpenTermsModal(false);
  const handleSnackClose = () => setSnackOpen(false);

    const getGender = (gender:number) => {
        switch (gender) {
          case 1:
            return 'Nữ';
          case 2:
            return 'Nam';
          default:
            return 'Cả hai';
        }
      };
      const handleBookingRequest = () => {
        if (startDate && rentalDuration) {
          const bookingRequest = {
            requestId: 1, 
            renterId: 2, 
            landlordId: room.owner_id,
            room,
            requestDate: new Date(),
            messageFromRenter: messageFromRenter || '',
            startDate,
            rentalDuration,
          };
    
          console.log('Booking request created:', bookingRequest);
          handleCloseBookingModal();
        } else {
          setSnackOpen(true);
        }
      };

    return (
        <Box className="w-full pt-5 pb-5">
            <img src={room.image} alt={room.title} className="w-full h-[500px] object-contain" />

          <Typography variant="h5">{room.title}</Typography>
          <Typography variant="h6" color="error">
            {room.price} đ
          </Typography>

          <Grid container spacing={2} justifyContent="center" heigh='150px'>            
            <Grid item xs={6}>
              <Button variant="contained" color="primary" onClick={handleOpenBookingModal}>
                Yêu cầu thuê
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" color="primary" onClick={handleOpenTermsModal}>
                Điều khoản dịch vụ
              </Button>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Địa chỉ:
          </Typography>
          <Typography>
            {`${room.address.city}, ${room.address.district}, ${room.address.ward}, ${room.address.detail}`}
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Mô tả:
          </Typography>
          <Typography>{room.description}</Typography>

          <Typography variant="body1" sx={{ mt: 2 }}>
            Kích thước phòng: {room.roomSize} m²
          </Typography>
          <Typography variant="body1">
            Giới tính: {getGender(room.gender)}
          </Typography>


      <Dialog open={openBookingModal} onClose={handleCloseBookingModal}>
        <DialogTitle>Yêu cầu thuê</DialogTitle>
        <DialogContent>
          <TextField
            label="Ngày bắt đầu"
            type="date"
            fullWidth
            // onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Thời gian thuê (tháng)"
            select
            fullWidth
            value={rentalDuration}
            onChange={(e) => setRentalDuration(e.target.value)}
            SelectProps={{
              native: true,
            }}
            sx={{ mt: 2 }}
          >
            <option value="" disabled>
              Chọn
            </option>
            {[3, 6, 12].map((duration) => (
              <option key={duration} value={duration}>
                {duration} tháng
              </option>
            ))}
          </TextField>
          <TextField
            label="Lời nhắn đến chủ trọ"
            fullWidth
            onChange={(e) => setMessageFromRenter(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBookingModal}>Hủy</Button>
          <Button onClick={handleBookingRequest}>Gửi yêu cầu</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openTermsModal} onClose={handleCloseTermsModal}>
        <DialogTitle>Điều khoản dịch vụ</DialogTitle>
        <DialogContent>
          <Typography>
            {room.description || 'Chưa có điều khoản dịch vụ.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTermsModal}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        message="Vui lòng nhập đầy đủ thông tin"
      />
        {roomId}
      </Box>
    )
}