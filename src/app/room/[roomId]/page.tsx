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
  ListItemIcon,
  Container,
  Paper,
  IconButton,
} from '@mui/material';
import { formatCurrency } from '@/common/utils/helpers';
import CustomFormControl from '@/common/components/FormControl';
import { SubmitHandler, useForm } from 'react-hook-form';
import { get, post } from '@/common/store/base.service';
import { Room } from '@/types';
import { getSession, useSession } from 'next-auth/react';
import { ArrowBackIos, ArrowForwardIos, AttachMoney, MonetizationOn } from '@mui/icons-material';
import { getRoomTypeNameById } from '@/app/manager/lessor/room/create/CreateRoomForm';
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
      status: 1,
      message_from_renter: data.message,
      start_date: new Date(data.date).toISOString(),
      rental_duration: Number(data.duration),
    }

    console.log(body);

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
    if (session?.user?.id == room?.owner_id) {
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

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openZoom, setOpenZoom] = useState(false);
  const [openGallery, setOpenGallery] = useState(false);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      (prev + 1) % room!.images.length
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? room!.images.length - 1 : prev - 1
    );
  };

  return (
    room &&
    <Box className="w-full space-y-1">
      <Box sx={{ width: '100%', p: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Dialog
              open={openGallery}
              onClose={() => setOpenGallery(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogContent sx={{ position: 'relative', p: 0 }}>
                <img
                  src={room.images[currentImageIndex]}
                  alt={`Full image ${currentImageIndex + 1}`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '80vh',
                    objectFit: 'contain'
                  }}
                />
                <IconButton
                  onClick={handlePrevImage}
                  sx={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.7)'
                  }}
                >
                  <ArrowBackIos />
                </IconButton>
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.7)'
                  }}
                >
                  <ArrowForwardIos />
                </IconButton>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1,
                  py: 2,
                  overflowX: 'auto'
                }}>
                  {room.images.map((img, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: index === currentImageIndex ? '2px solid primary.main' : '1px solid grey'
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </DialogContent>
            </Dialog>

            <Box sx={{ position: 'relative', width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  overflow: 'hidden',
                  width: '100%'
                }}
              >
                {room.images.map((img, index) => (
                  <Box
                    key={index}
                    sx={{
                      flexShrink: 0,
                      width: '100%',
                      transform: `translateX(-${currentImageIndex * 100}%)`,
                      transition: 'transform 0.3s ease-in-out'
                    }}
                  >
                    <img
                      src={img}
                      alt={`Image ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '600px',
                        objectFit: 'cover',
                        borderRadius: 8
                      }}
                      onClick={() => setOpenGallery(true)}
                    />
                  </Box>
                ))}
              </Box>
              <Box sx={{
                position: 'absolute',
                bottom: 10,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: 1
              }}>
                {room.images.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: index === currentImageIndex ? 'primary.main' : 'grey.500'
                    }}
                  />
                ))}
              </Box>
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255,255,255,0.7)'
                }}
              >
                <ArrowBackIos />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255,255,255,0.7)'
                }}
              >
                <ArrowForwardIos />
              </IconButton>
              <Paper
                elevation={3}
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  px: 2,
                  py: 1,
                  borderRadius: 8
                }}
              >
                <Typography variant="h6" color="error">
                  {formatCurrency(room.price)}
                </Typography>
              </Paper>
            </Box>


            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2,
              gap: 1
            }}>
              {room.images.map((img, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 100,
                    height: 100,
                    border: index === currentImageIndex ? '2px solid primary.main' : '1px solid grey',
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {room.title}
              </Typography>
              <Typography color="text.secondary">
                {`${isNaN(Number(room.address.ward_name)) ? room.address.ward_name : `Phường ${room.address.ward_name}`
                  }, ${isNaN(Number(room.address.district_name)) ? room.address.district_name : `Quận ${room.address.district_name}`
                  }, ${room.address.province_name}`}
              </Typography>
              <Typography color="text.secondary">
                {`${room.address.detail}`}
              </Typography>

            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button variant="contained" color="primary" fullWidth size="large"
                onClick={handleOpenBookingModal} sx={{ py: 2 }} >
                Yêu cầu thuê
              </Button>
              <Button variant="contained" color="primary" fullWidth size="large"
                onClick={handleOpenTermsModal} sx={{ py: 2 }} >
                Quy định
              </Button>
            </Box>

            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Tiền cọc
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(room.deposit)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Loại phòng
                    </Typography>
                    <Typography variant="h6">
                      {getRoomTypeNameById(room.room_type)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>


            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Người ở tối đa
                    </Typography>
                    <Typography variant="h6">
                      {room.max_people ?? "Không quy định"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Diện tích
                    </Typography>
                    <Typography variant="h6">
                      {room.acreage ? `${room.acreage} m²` : "Không quy định"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Phí dịch vụ
                </Typography>
                <List>
                  {room.services?.map((service) => (
                    service.price > 0 && (
                      <ListItem key={service.id}>
                        <ListItemText
                          primary={service.name}
                          secondary={formatCurrency(service.price) + " / " + service.description}
                        />
                      </ListItem>
                    )
                  ))}
                </List>
              </CardContent>
            </Card>

            {room.borrowed_items && (
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tài sản đi kèm
                  </Typography>
                  <List>
                    {room.borrowed_items?.map((item) => (
                      item.price > 0 && (
                        <ListItem key={item.id}>
                          <ListItemText
                            primary={item.name}
                            secondary={formatCurrency(item.price)}
                          />
                        </ListItem>
                      )
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Mô tả chi tiết
            </Typography>
            <Box sx={{ pl: 3 }}>
              {room.description.split('\n').map((paragraph, index) => (
                <Typography
                  key={index}
                  paragraph
                  sx={{
                    textIndent: '2em',
                    lineHeight: 1.8,
                    color: 'text.secondary'
                  }}
                >
                  {paragraph}
                </Typography>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Dialog open={openBookingModal} onClose={handleCloseBookingModal} component="form" onSubmit={handleSubmit(onSubmit)} >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'primary.main',
            color: 'white',
            padding: '8px 16px',
          }}
        >
          Yêu cầu thuê
          <Button
            onClick={handleCloseBookingModal}
            sx={{ color: 'white', minWidth: 0, padding: 0 }}
          >
            ✕
          </Button>
        </DialogTitle>
        <DialogContent>
          <Box className="max-w-lg mx-auto pt-7 bg-white rounded-lg space-y-5 " >
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

  // return (
  //   room && (
  //     <div className="w-full max-w-7xl mx-auto p-6 space-y-8">

  //       <Box sx={{ width: '100%', p: 2 }}>
  //         <Grid container spacing={4}>
  //           {/* Left Column */}
  //           <Grid item xs={12} md={8}>
  //             <Box sx={{ position: 'relative' }}>
  //               <img
  //                 src={room.images[0]}
  //                 alt={room.title}
  //                 style={{
  //                   width: '100%',
  //                   height: 'auto',
  //                   aspectRatio: '16/9',
  //                   objectFit: 'cover',
  //                   borderRadius: 2
  //                 }}
  //               />
  //               <Paper
  //                 elevation={3}
  //                 sx={{
  //                   position: 'absolute',
  //                   bottom: 16,
  //                   right: 16,
  //                   px: 2,
  //                   py: 1,
  //                   borderRadius: 8
  //                 }}
  //               >
  //                 <Typography variant="h6" color="error">
  //                   {formatCurrency(room.price)}
  //                 </Typography>
  //               </Paper>
  //             </Box>

  //             <Box sx={{ mt: 3 }}>
  //               <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
  //                 {room.title}
  //               </Typography>
  //               <Typography color="text.secondary">
  //                 {`${room.address.detail}, ${room.address.ward_name}`}
  //               </Typography>
  //             </Box>

  //             <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
  //               <Button
  //                 variant="contained"
  //                 color="primary"
  //                 fullWidth
  //                 size="large"
  //                 onClick={handleOpenBookingModal}
  //                 sx={{ py: 2 }}
  //               >
  //                 Yêu cầu thuê
  //               </Button>
  //               <Button
  //                 variant="contained"
  //                 color="primary"
  //                 fullWidth
  //                 size="large"
  //                 onClick={handleOpenTermsModal}
  //                 sx={{ py: 2 }}
  //               >
  //                 Điều khoản dịch vụ
  //               </Button>
  //             </Box>

  //             <Grid container spacing={2} sx={{ mt: 3 }}>
  //               <Grid item xs={12} sm={6}>
  //                 <Card>
  //                   <CardContent>
  //                     <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
  //                       Tiền cọc
  //                     </Typography>
  //                     <Typography variant="h6">
  //                       {formatCurrency(room.deposit)}
  //                     </Typography>
  //                   </CardContent>
  //                 </Card>
  //               </Grid>
  //               <Grid item xs={12} sm={6}>
  //                 <Card>
  //                   <CardContent>
  //                     <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
  //                       Diện tích
  //                     </Typography>
  //                     <Typography variant="h6">
  //                       {room.acreage} m²
  //                     </Typography>
  //                   </CardContent>
  //                 </Card>
  //               </Grid>
  //             </Grid>
  //           </Grid>

  //           {/* Right Column */}
  //           <Grid item xs={12} md={4}>
  //             <Card>
  //               <CardContent>
  //                 <Typography variant="h6" gutterBottom>
  //                   Phí dịch vụ
  //                 </Typography>
  //                 <List>
  //                   {room.services?.map((service) => (
  //                     service.price > 0 && (
  //                       <ListItem key={service.id}>
  //                         <ListItemText
  //                           primary={service.name}
  //                           secondary={formatCurrency(service.price)}
  //                         />
  //                       </ListItem>
  //                     )
  //                   ))}
  //                 </List>
  //               </CardContent>
  //             </Card>

  //             {room.borrowed_items && (
  //               <Card sx={{ mt: 2 }}>
  //                 <CardContent>
  //                   <Typography variant="h6" gutterBottom>
  //                     Tài sản đi kèm
  //                   </Typography>
  //                   <List>
  //                     {room.borrowed_items?.map((item) => (
  //                       item.price > 0 && (
  //                         <ListItem key={item.id}>
  //                           <ListItemText
  //                             primary={item.name}
  //                             secondary={formatCurrency(item.price)}
  //                           />
  //                         </ListItem>
  //                       )
  //                     ))}
  //                   </List>
  //                 </CardContent>
  //               </Card>
  //             )}
  //           </Grid>
  //         </Grid>

  //         {/* Description Section */}
  //         <Card sx={{ mt: 4 }}>
  //           <CardContent>
  //             <Typography variant="h5" sx={{ mb: 3 }}>
  //               Mô tả chi tiết
  //             </Typography>
  //             <Box sx={{ pl: 3 }}>
  //               {room.description.split('\n').map((paragraph, index) => (
  //                 <Typography
  //                   key={index}
  //                   paragraph
  //                   sx={{
  //                     textIndent: '2em',
  //                     lineHeight: 1.8,
  //                     color: 'text.secondary'
  //                   }}
  //                 >
  //                   {paragraph}
  //                 </Typography>
  //               ))}
  //             </Box>
  //           </CardContent>
  //         </Card>
  //       </Box>




  //       <div className="grid grid-cols-3 gap-8">
  //         {/* Main Content - 2/3 width */}
  //         <div className="col-span-2 space-y-6">
  //           <img
  //             src={room.images[0]}
  //             alt={room.title}
  //             className="w-full h-96 object-cover rounded-lg"
  //           />

  //           <div className="space-y-4">
  //             <h1 className="text-2xl font-bold">{room.title}</h1>
  //             <p className="text-xl text-red-600 font-semibold">
  //               {formatCurrency(room.price)}
  //             </p>
  //           </div>

  //           <div className="flex space-x-4">
  //             <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold">
  //               Yêu cầu thuê
  //             </button>
  //             <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold">
  //               Điều khoản dịch vụ
  //             </button>
  //           </div>

  //           <div className="space-y-4">
  //             <h2 className="text-xl font-semibold">Địa chỉ:</h2>
  //             <p>{`${room.address.detail}, ${room.address.ward_name}`}</p>
  //             <p>Tiền cọc: {formatCurrency(room.deposit)}</p>
  //             <p>Kích thước phòng: {room.acreage} m²</p>
  //           </div>
  //         </div>

  //         {/* Sidebar - 1/3 width */}
  //         <div className="space-y-6">
  //           <div className="bg-gray-50 p-6 rounded-lg">
  //             <h2 className="text-xl font-semibold mb-4">Phí dịch vụ</h2>
  //             <ul className="space-y-3">
  //               {room.services?.map(service => (
  //                 service.price > 0 && (
  //                   <li key={service.id} className="flex justify-between">
  //                     <span>{service.name}</span>
  //                     <span>{formatCurrency(service.price)}</span>
  //                   </li>
  //                 )
  //               ))}
  //             </ul>
  //           </div>

  //           {room.borrowed_items && (
  //             <div className="bg-gray-50 p-6 rounded-lg">
  //               <h2 className="text-xl font-semibold mb-4">Tài sản đi kèm</h2>
  //               <ul className="space-y-3">
  //                 {room.borrowed_items?.map(item => (
  //                   item.price > 0 && (
  //                     <li key={item.id} className="flex justify-between">
  //                       <span>{item.name}</span>
  //                       <span>{formatCurrency(item.price)}</span>
  //                     </li>
  //                   )
  //                 ))}
  //               </ul>
  //             </div>
  //           )}
  //         </div>
  //       </div>

  //       <div className="mt-8">
  //         <h2 className="text-xl font-semibold mb-4">Mô tả:</h2>
  //         <div className="prose max-w-none">
  //           {room.description.split('\n').map((paragraph, index) => (
  //             <p key={index} className="indent-8 mb-4">
  //               {paragraph}
  //             </p>
  //           ))}
  //         </div>
  //       </div>











  //       <div className="w-full max-w-7xl mx-auto p-8 space-y-6">
  //         <div className="flex gap-8">
  //           <div className="w-2/3 space-y-6">
  //             <div className="bg-white rounded-xl shadow-lg overflow-hidden">
  //               <img
  //                 src={room.images[0]}
  //                 alt={room.title}
  //                 className="w-full h-96 object-cover"
  //               />
  //               <div className="p-6 space-y-4">
  //                 <h1 className="text-3xl font-bold">{room.title}</h1>
  //                 <p className="text-2xl text-red-600 font-semibold">
  //                   {formatCurrency(room.price)}
  //                 </p>
  //               </div>
  //             </div>

  //             <div className="flex gap-4 px-6">
  //               <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-colors">
  //                 Yêu cầu thuê
  //               </button>
  //               <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-colors">
  //                 Điều khoản dịch vụ
  //               </button>
  //             </div>

  //             <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
  //               <h2 className="text-xl font-semibold">Thông tin chi tiết</h2>
  //               <div className="grid grid-cols-2 gap-4">
  //                 <div>
  //                   <p className="font-medium">Địa chỉ:</p>
  //                   <p>{`${room.address.detail}, ${room.address.ward_name}`}</p>
  //                 </div>
  //                 <div>
  //                   <p className="font-medium">Tiền cọc:</p>
  //                   <p>{formatCurrency(room.deposit)}</p>
  //                 </div>
  //                 <div>
  //                   <p className="font-medium">Kích thước:</p>
  //                   <p>{room.acreage} m²</p>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>

  //           <div className="w-1/3 space-y-6">
  //             <div className="bg-white rounded-xl shadow-lg p-6">
  //               <h2 className="text-xl font-semibold mb-4">Phí dịch vụ</h2>
  //               <ul className="divide-y">
  //                 {room.services?.map(service => (
  //                   service.price > 0 && (
  //                     <li key={service.id} className="py-3 flex justify-between">
  //                       <span>{service.name}</span>
  //                       <span className="font-medium">{formatCurrency(service.price)}</span>
  //                     </li>
  //                   )
  //                 ))}
  //               </ul>
  //             </div>

  //             {room.borrowed_items && (
  //               <div className="bg-white rounded-xl shadow-lg p-6">
  //                 <h2 className="text-xl font-semibold mb-4">Tài sản đi kèm</h2>
  //                 <ul className="divide-y">
  //                   {room.borrowed_items?.map(item => (
  //                     item.price > 0 && (
  //                       <li key={item.id} className="py-3 flex justify-between">
  //                         <span>{item.name}</span>
  //                         <span className="font-medium">{formatCurrency(item.price)}</span>
  //                       </li>
  //                     )
  //                   ))}
  //                 </ul>
  //               </div>
  //             )}
  //           </div>
  //         </div>

  //         <div className="bg-white rounded-xl shadow-lg p-6">
  //           <h2 className="text-xl font-semibold mb-4">Mô tả chi tiết</h2>
  //           <div className="prose max-w-none">
  //             {room.description.split('\n').map((paragraph, index) => (
  //               <p key={index} className="indent-8 mb-4 leading-relaxed">
  //                 {paragraph}
  //               </p>
  //             ))}
  //           </div>
  //         </div>
  //       </div>














  //       <div className="flex flex-col lg:flex-row gap-8">
  //         <div className="lg:w-2/3 space-y-8">
  //           <div className="relative">
  //             <img
  //               src={room.images[0]}
  //               alt={room.title}
  //               className="w-full aspect-video object-cover rounded-2xl"
  //             />
  //             <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full">
  //               <p className="text-lg font-bold text-red-600">
  //                 {formatCurrency(room.price)}
  //               </p>
  //             </div>
  //           </div>

  //           <div>
  //             <h1 className="text-3xl font-bold mb-2">{room.title}</h1>
  //             <p className="text-gray-600">{`${room.address.detail}, ${room.address.ward_name}`}</p>
  //           </div>

  //           <div className="flex flex-col sm:flex-row gap-4">
  //             <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold transition-all transform hover:scale-105">
  //               Yêu cầu thuê
  //             </button>
  //             <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold transition-all transform hover:scale-105">
  //               Điều khoản dịch vụ
  //             </button>
  //           </div>

  //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  //             <div className="bg-gray-50 p-6 rounded-xl">
  //               <h3 className="font-semibold mb-2">Tiền cọc</h3>
  //               <p className="text-lg">{formatCurrency(room.deposit)}</p>
  //             </div>
  //             <div className="bg-gray-50 p-6 rounded-xl">
  //               <h3 className="font-semibold mb-2">Diện tích</h3>
  //               <p className="text-lg">{room.acreage} m²</p>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="lg:w-1/3 space-y-6 lg:sticky lg:top-4 self-start">
  //           <div className="bg-gray-50 p-6 rounded-xl">
  //             <h2 className="text-xl font-semibold mb-6">Phí dịch vụ</h2>
  //             <ul className="space-y-4">
  //               {room.services?.map(service => (
  //                 service.price > 0 && (
  //                   <li key={service.id} className="flex justify-between items-center">
  //                     <span className="text-gray-700">{service.name}</span>
  //                     <span className="font-medium">{formatCurrency(service.price)}</span>
  //                   </li>
  //                 )
  //               ))}
  //             </ul>
  //           </div>

  //           {room.borrowed_items && (
  //             <div className="bg-gray-50 p-6 rounded-xl">
  //               <h2 className="text-xl font-semibold mb-6">Tài sản đi kèm</h2>
  //               <ul className="space-y-4">
  //                 {room.borrowed_items?.map(item => (
  //                   item.price > 0 && (
  //                     <li key={item.id} className="flex justify-between items-center">
  //                       <span className="text-gray-700">{item.name}</span>
  //                       <span className="font-medium">{formatCurrency(item.price)}</span>
  //                     </li>
  //                   )
  //                 ))}
  //               </ul>
  //             </div>
  //           )}
  //         </div>
  //       </div>

  //       <div className="mt-8 bg-gray-50 p-8 rounded-xl">
  //         <h2 className="text-2xl font-semibold mb-6">Mô tả chi tiết</h2>
  //         <div className="prose prose-lg max-w-none">
  //           {room.description.split('\n').map((paragraph, index) => (
  //             <p key={index} className="indent-8 mb-6 leading-relaxed text-gray-700">
  //               {paragraph}
  //             </p>
  //           ))}
  //         </div>
  //       </div>











































  //       <Container maxWidth="xl" sx={{ py: 4 }}>
  //         <Box sx={{ display: 'flex', gap: 4 }}>
  //           {/* Main Content */}
  //           <Box sx={{ flex: '0 0 70%' }}>
  //             <Card
  //               elevation={0}
  //               sx={{ mb: 4, border: '1px solid', borderColor: 'divider' }}
  //             >
  //               <Box sx={{ position: 'relative' }}>
  //                 <img
  //                   src={room.images[0]}
  //                   alt={room.title}
  //                   style={{
  //                     width: '100%',
  //                     height: '500px',
  //                     objectFit: 'cover'
  //                   }}
  //                 />
  //               </Box>

  //               <CardContent sx={{ p: 3 }}>
  //                 <Typography variant="h4" gutterBottom fontWeight="bold">
  //                   {room.title}
  //                 </Typography>

  //                 <Typography variant="body1" color="text.secondary" gutterBottom>
  //                   {`${room.address.detail}, ${room.address.ward_name}`}
  //                 </Typography>

  //                 <Typography
  //                   variant="h5"
  //                   color="error"
  //                   fontWeight="bold"
  //                   sx={{ mb: 3 }}
  //                 >
  //                   {formatCurrency(room.price)}
  //                 </Typography>

  //                 <Box sx={{ display: 'flex', gap: 2 }}>
  //                   <Button
  //                     variant="contained"
  //                     size="large"
  //                     fullWidth
  //                     sx={{ py: 1.5 }}
  //                   >
  //                     Yêu cầu thuê
  //                   </Button>
  //                   <Button
  //                     variant="contained"
  //                     size="large"
  //                     fullWidth
  //                     sx={{ py: 1.5 }}
  //                   >
  //                     Điều khoản dịch vụ
  //                   </Button>
  //                 </Box>
  //               </CardContent>
  //             </Card>

  //             <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, mb: 4 }}>
  //               <Card elevation={2}>
  //                 <CardContent>
  //                   <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
  //                     Tiền cọc
  //                   </Typography>
  //                   <Typography variant="h6">
  //                     {formatCurrency(room.deposit)}
  //                   </Typography>
  //                 </CardContent>
  //               </Card>

  //               <Card elevation={2}>
  //                 <CardContent>
  //                   <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
  //                     Diện tích
  //                   </Typography>
  //                   <Typography variant="h6">
  //                     {room.acreage} m²
  //                   </Typography>
  //                 </CardContent>
  //               </Card>
  //             </Box>

  //             <Card elevation={2} sx={{ mb: 4 }}>
  //               <CardContent>
  //                 <Typography variant="h6" gutterBottom>
  //                   Mô tả chi tiết
  //                 </Typography>
  //                 <Box sx={{ px: 2 }}>
  //                   {room.description.split('\n').map((paragraph, index) => (
  //                     <Typography
  //                       key={index}
  //                       paragraph
  //                       sx={{
  //                         textIndent: '2em',
  //                         lineHeight: 1.8
  //                       }}
  //                     >
  //                       {paragraph}
  //                     </Typography>
  //                   ))}
  //                 </Box>
  //               </CardContent>
  //             </Card>
  //           </Box>

  //           {/* Sidebar */}
  //           <Box
  //             component="aside"
  //             sx={{
  //               flex: '0 0 30%',
  //               position: 'sticky',
  //               top: 16,
  //               alignSelf: 'flex-start'
  //             }}
  //           >
  //             <Card elevation={2}>
  //               <CardContent>
  //                 <Typography variant="h6" gutterBottom>
  //                   Phí dịch vụ
  //                 </Typography>
  //                 <List disablePadding>
  //                   {room.services?.map((service) => (
  //                     service.price > 0 && (
  //                       <ListItem
  //                         key={service.id}
  //                         divider
  //                         sx={{ px: 0 }}
  //                       >
  //                         <ListItemText
  //                           primary={service.name}
  //                           secondary={service.description}
  //                         />
  //                         <Typography>
  //                           {formatCurrency(service.price)}
  //                         </Typography>
  //                       </ListItem>
  //                     )
  //                   ))}
  //                 </List>
  //               </CardContent>
  //             </Card>

  //             {room.borrowed_items && (
  //               <Card elevation={2} sx={{ mt: 3 }}>
  //                 <CardContent>
  //                   <Typography variant="h6" gutterBottom>
  //                     Tài sản đi kèm
  //                   </Typography>
  //                   <List disablePadding>
  //                     {room.borrowed_items?.map((item) => (
  //                       item.price > 0 && (
  //                         <ListItem
  //                           key={item.id}
  //                           divider
  //                           sx={{ px: 0 }}
  //                         >
  //                           <ListItemText primary={item.name} />
  //                           <Typography>
  //                             {formatCurrency(item.price)}
  //                           </Typography>
  //                         </ListItem>
  //                       )
  //                     ))}
  //                   </List>
  //                 </CardContent>
  //               </Card>
  //             )}
  //           </Box>
  //         </Box>
  //       </Container>



















  //       <Container maxWidth="xl" sx={{ py: 4 }}>
  //         <Box sx={{ display: 'flex', gap: 4 }}>
  //           {/* Main Content */}
  //           <Box sx={{ flex: '0 0 70%' }}>
  //             <Card
  //               elevation={3}
  //               sx={{
  //                 mb: 4,
  //                 borderRadius: 4,
  //                 overflow: 'hidden'
  //               }}
  //             >
  //               <Box sx={{ position: 'relative' }}>
  //                 <img
  //                   src={room.images[0]}
  //                   alt={room.title}
  //                   style={{
  //                     width: '100%',
  //                     height: '500px',
  //                     objectFit: 'cover'
  //                   }}
  //                 />
  //               </Box>

  //               <CardContent sx={{ p: 4 }}>
  //                 <Typography
  //                   variant="h4"
  //                   gutterBottom
  //                   fontWeight="bold"
  //                   sx={{ color: 'primary.main' }}
  //                 >
  //                   {room.title}
  //                 </Typography>

  //                 <Typography
  //                   variant="body1"
  //                   color="text.secondary"
  //                   gutterBottom
  //                   sx={{ fontSize: '1.1rem' }}
  //                 >
  //                   {`${room.address.detail}, ${room.address.ward_name}`}
  //                 </Typography>

  //                 <Typography
  //                   variant="h5"
  //                   color="error"
  //                   fontWeight="bold"
  //                   sx={{ mb: 4 }}
  //                 >
  //                   {formatCurrency(room.price)}
  //                 </Typography>

  //                 <Box sx={{ display: 'flex', gap: 2 }}>
  //                   <Button
  //                     variant="contained"
  //                     size="large"
  //                     fullWidth
  //                     sx={{
  //                       py: 2,
  //                       borderRadius: 3,
  //                       textTransform: 'none',
  //                       fontSize: '1.1rem'
  //                     }}
  //                   >
  //                     Yêu cầu thuê
  //                   </Button>
  //                   <Button
  //                     variant="outlined"
  //                     size="large"
  //                     fullWidth
  //                     sx={{
  //                       py: 2,
  //                       borderRadius: 3,
  //                       textTransform: 'none',
  //                       fontSize: '1.1rem'
  //                     }}
  //                   >
  //                     Điều khoản dịch vụ
  //                   </Button>
  //                 </Box>
  //               </CardContent>
  //             </Card>

  //             <Box sx={{
  //               display: 'grid',
  //               gridTemplateColumns: 'repeat(2, 1fr)',
  //               gap: 3,
  //               mb: 4
  //             }}>
  //               <Card elevation={2} sx={{ borderRadius: 4 }}>
  //                 <CardContent sx={{ p: 3 }}>
  //                   <Typography
  //                     variant="subtitle1"
  //                     fontWeight="medium"
  //                     gutterBottom
  //                     color="text.secondary"
  //                   >
  //                     Tiền cọc
  //                   </Typography>
  //                   <Typography variant="h6" color="primary.main">
  //                     {formatCurrency(room.deposit)}
  //                   </Typography>
  //                 </CardContent>
  //               </Card>

  //               <Card elevation={2} sx={{ borderRadius: 4 }}>
  //                 <CardContent sx={{ p: 3 }}>
  //                   <Typography
  //                     variant="subtitle1"
  //                     fontWeight="medium"
  //                     gutterBottom
  //                     color="text.secondary"
  //                   >
  //                     Diện tích
  //                   </Typography>
  //                   <Typography variant="h6" color="primary.main">
  //                     {room.acreage} m²
  //                   </Typography>
  //                 </CardContent>
  //               </Card>
  //             </Box>

  //             <Card elevation={2} sx={{ borderRadius: 4, mb: 4 }}>
  //               <CardContent sx={{ p: 4 }}>
  //                 <Typography variant="h6" gutterBottom color="primary.main">
  //                   Mô tả chi tiết
  //                 </Typography>
  //                 <Box sx={{ px: 2 }}>
  //                   {room.description.split('\n').map((paragraph, index) => (
  //                     <Typography
  //                       key={index}
  //                       paragraph
  //                       sx={{
  //                         textIndent: '2em',
  //                         lineHeight: 1.8,
  //                         color: 'text.secondary'
  //                       }}
  //                     >
  //                       {paragraph}
  //                     </Typography>
  //                   ))}
  //                 </Box>
  //               </CardContent>
  //             </Card>
  //           </Box>

  //           {/* Sidebar */}
  //           <Box
  //             component="aside"
  //             sx={{
  //               flex: '0 0 30%',
  //               position: 'sticky',
  //               top: 16,
  //               alignSelf: 'flex-start'
  //             }}
  //           >
  //             <Card elevation={3} sx={{ borderRadius: 4 }}>
  //               <CardContent sx={{ p: 3 }}>
  //                 <Typography
  //                   variant="h6"
  //                   gutterBottom
  //                   color="primary.main"
  //                   sx={{ mb: 3 }}
  //                 >
  //                   Phí dịch vụ
  //                 </Typography>
  //                 <List>
  //                   {room.services?.map((service) => (
  //                     service.price > 0 && (
  //                       <ListItem
  //                         key={service.id}
  //                         sx={{
  //                           px: 0,
  //                           borderBottom: '1px solid',
  //                           borderColor: 'divider',
  //                           py: 2
  //                         }}
  //                       >
  //                         <ListItemText
  //                           primary={
  //                             <Typography variant="subtitle1">
  //                               {service.name}
  //                             </Typography>
  //                           }
  //                           secondary={service.description}
  //                         />
  //                         <Typography color="primary.main" fontWeight="medium">
  //                           {formatCurrency(service.price)}
  //                         </Typography>
  //                       </ListItem>
  //                     )
  //                   ))}
  //                 </List>
  //               </CardContent>
  //             </Card>

  //             {room.borrowed_items && (
  //               <Card elevation={3} sx={{ mt: 3, borderRadius: 4 }}>
  //                 <CardContent sx={{ p: 3 }}>
  //                   <Typography
  //                     variant="h6"
  //                     gutterBottom
  //                     color="primary.main"
  //                     sx={{ mb: 3 }}
  //                   >
  //                     Tài sản đi kèm
  //                   </Typography>
  //                   <List>
  //                     {room.borrowed_items?.map((item) => (
  //                       item.price > 0 && (
  //                         <ListItem
  //                           key={item.id}
  //                           sx={{
  //                             px: 0,
  //                             borderBottom: '1px solid',
  //                             borderColor: 'divider',
  //                             py: 2
  //                           }}
  //                         >
  //                           <ListItemText
  //                             primary={
  //                               <Typography variant="subtitle1">
  //                                 {item.name}
  //                               </Typography>
  //                             }
  //                           />
  //                           <Typography color="primary.main" fontWeight="medium">
  //                             {formatCurrency(item.price)}
  //                           </Typography>
  //                         </ListItem>
  //                       )
  //                     ))}
  //                   </List>
  //                 </CardContent>
  //               </Card>
  //             )}
  //           </Box>
  //         </Box>
  //       </Container>




















  //     </div>
  //   )
  // );
}