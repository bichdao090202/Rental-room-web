'use client'
import React, { useEffect, useState } from 'react';
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
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { formatCurrency } from '@/common/utils/helpers';
import CustomFormControl from '@/common/components/FormControl';
import { SubmitHandler, useForm } from 'react-hook-form';
import { get, post } from '@/common/store/base.service';
import axios from 'axios';
import { Room } from '@/types';
import { getSession, useSession } from 'next-auth/react';

interface Params {
  params: {
    roomId: number;
  };
}

interface FormInputs {
  duration: number;
  message: string;
  date: string;
}

export default function Page({ params }: Params) {
  const { roomId } = params;
  const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
    mode: 'onSubmit'
  });
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const session = await getSession();
    const body = {
      renter_id: session?.user?.id,
      lessor_id: room?.owner_id,
      room_id: Number(roomId),
      status: "PROCESSING",
      note: "Waiting for landlord approval",
      message_from_renter: data.message,
      start_date: new Date(data.date).toISOString(),
      rental_duration: Number(data.duration),
    }

    const response = await post(`booking-requests`, body)
    if (response.status == "SUCCESS") {
      alert("Đã gửi yêu cầu đặt phòng thành công")
      setOpenBookingModal(false)
    }
    else
      alert("Thao tác thất bại, vui lòng thử lại")
  };

  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [room, setRoom] = useState<Room>();

  const handleOpenBookingModal = async () => {
    const session = await getSession();
    if (session?.user?.id == room?.owner_id){
      alert("Không thể thuê phòng của chính mình")
      return
    }
    setOpenBookingModal(true)
  };
  const handleCloseBookingModal = () => setOpenBookingModal(false);
  const handleOpenTermsModal = () => setOpenTermsModal(true);
  const handleCloseTermsModal = () => setOpenTermsModal(false);
  const handleSnackClose = () => setSnackOpen(false);

  const getGender = (gender: number) => {
    switch (gender) {
      case 1:
        return 'Nữ';
      case 2:
        return 'Nam';
      default:
        return 'Cả hai';
    }
  };

  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const response = await get(`rooms/${roomId}`)
        const result = response.data;
        console.log(result);
        setRoom(result);
      } catch (error) {
        console.error('Error fetching booking requests:', error);
      }
    };
    fetchBookingRequests();
  }, []);

  return (
    room &&
    <Box className="w-full space-y-1">
      {/* <img src={room.images[0]} alt={room.title} className="w-full h-[400px] object-contain pb-5" /> */}

      <Box className="w-full flex flex-row">
        <Box sx={{ width: '70%' }}>
          <img
            src={room.images[0]}
            alt={room.title}
            style={{ width: '100%', height: '400px', objectFit: 'contain' }}
          />
        </Box>

        <Box sx={{ width: '30%' }}>
          <Typography variant="h6" gutterBottom>Dịch vụ</Typography>
          <Typography variant="subtitle1">Có phí:</Typography>
          <List dense>
            {room.services?.map((service) => (
              service.price > 0 && (
                <ListItem key={service.id}>
                  <ListItemText
                    primary={`${service.name} (${service.description}): ${formatCurrency(service.price)}`}
                    // secondary={`${service.name}: ${service.price}`}
                  />
                </ListItem>
              )
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          {/* <Typography variant="subtitle1">Miễn phí:</Typography> */}
          {/* <List dense>
            {room.services?.map((service) => (
              service.price > 0 && (
                <ListItem key={service.id}>
                  <ListItemText primary={service.name} />
                </ListItem>
              )
            ))}
          </List> */}
        </Box>
      </Box>

      <Box>
        <Typography variant="h5" line-height='5px'>{room.title}</Typography>
        <Typography variant="h6" color="error" >
          {formatCurrency(room.price)}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '80%',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ width: '12rem', height: '3rem' }}
          onClick={handleOpenBookingModal}
        >
          <Typography sx={{ fontWeight: 'bold' }}>Yêu cầu thuê</Typography>
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: '13rem', height: '3rem' }}
          onClick={handleOpenTermsModal}
        >
          <Typography sx={{ fontWeight: 'bold' }}>Điều khoản dịch vụ</Typography>
        </Button>
      </Box>

      <Box>
        <Typography variant="h6">
          Địa chỉ:
        </Typography>
        <Typography>
          {`${room.address.detail}, ${room.address.province_name}, ${room.address.district_name}, ${room.address.ward_name}`}
        </Typography>
        <Typography >
          Tiền cọc: {formatCurrency(room.deposit)}
        </Typography>
        <Typography>
          Kích thước phòng: {room.acreage} m²
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          Chi tiết:
        </Typography>

        <Box>
          {/* <Typography style={{
            whiteSpace: 'pre-line',
            lineHeight: 2,
            textIndent: '2em',
            marginBottom: '1em', 
            padding: '10px', 
          }}>
            {room.description}
          </Typography> */}
          <Typography style={{
            whiteSpace: 'pre-line',
            lineHeight: 2,
            padding: '10px',
          }}>
            <div style={{ textIndent: '2em', marginBottom: '1em' }}>
              {room.description.split('\n').map((paragraph, index) => (
                <p key={index} style={{ textIndent: '2em', marginBottom: '1em' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </Typography>

          {/* <Typography>
            Giới tính: {getGender(room.gender)}
          </Typography> */}
        </Box>
      </Box>

      <Dialog open={openBookingModal} onClose={handleCloseBookingModal} component="form" onSubmit={handleSubmit(onSubmit)} >
        <DialogTitle>Yêu cầu thuê</DialogTitle>
        <DialogContent>
          <Box className="max-w-lg mx-auto pt-5 bg-white rounded-lg space-y-5" >
            <CustomFormControl
              name="duration"
              control={control}
              type="number"
              label="Thời gian thuê"
              placeholder="Thời gian thuê (tháng)"
              error={errors.duration}
              rules={{
                required: 'Trường này là bắt buộc',
                min: { value: 1, message: 'Thời gian thuê tối thiểu là 1 tháng' }
              }}
            />
            <CustomFormControl
              name="message"
              control={control}
              type="text"
              label="Tin nhắn"
              placeholder="Tin nhắn cho chủ trọ"
              error={errors.message}
              rules={{ required: 'Trường này là bắt buộc' }}
            />
            <CustomFormControl
              name="date"
              control={control}
              type="date"
              label="Chọn ngày bắt đầu"
              error={errors.date}
              rules={{ required: 'Trường này là bắt buộc' }}
            />

          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseBookingModal}>Hủy</Button>
          <Button type="submit" variant="contained" color="primary" >
            Gửi yêu cầu
          </Button>
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
    </Box>
  )
}