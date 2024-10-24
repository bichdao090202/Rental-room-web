'use client'

import { get } from "@/common/store/base.service";
import { formatCurrency } from "@/common/utils/helpers";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Grid, Modal, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Room } from '../types/index';
import { ModalOrder } from "@/component/ContractsList/ModalOrder";

interface Address {
  city: string;
  district: string;
  ward: string;
  detail: string;
}


export default function Home() {
  const router = useRouter();

  const mockRooms = [
    {
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
    },
    {
      id: 2,
      title: "Phòng trọ tiện nghi",
      type: 1,
      image: "https://xaydungthuanphuoc.com/wp-content/uploads/2022/09/mau-phong-tro-co-gac-lung-dep2022-5.jpg",
      address: {
        city: "TP.HCM",
        district: "Bình Thạnh",
        ward: "phường 12",
        detail: "số 10 Điện Biên Phủ",
      },
      utilities: [1, 2],
      price: 40000000,
      deposit: 2000,
      gender: 1,
      roomSize: 15,
      owner_id: 2,
      description: "Phòng trọ đầy đủ tiện nghi, gần trung tâm...",
    },
  ];
  const [rooms, setRooms] = useState<Room[]>([])

  
  // const [orderModal, setOrderModal] = useState(true);

//   const handleOrderModal = () => {
//     setOrderModal(false);
// };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await get(`rooms?page_id=1&per_page=-1`)
        const result = response.data;
        console.log(result);
        setRooms(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchRooms();
  }, []);
  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: '100%',

      }}
    >
      <Container sx={{ py: 4, width: '100%' }}>
        <Grid container spacing={4}>
          {rooms.map((room) => (
            <Grid item key={room.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ maxWidth: 500, cursor: 'pointer', }} onClick={() => { router.push(`/room/${room.id}`) }}>

                <CardMedia
                  component="img"
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover'
                  }}
                  image={room.images[0]}
                  alt={room.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                    }}>
                    {room.title}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div" color="orange">
                    {formatCurrency(room.price)}
                  </Typography>
                  {/* <Typography variant="body2" color="text.secondary">
                    Địa chỉ: {`${room.address.detail}, ${room.address.ward}, ${room.address.district}, ${room.address.city}`}
                  </Typography> */}

                </CardContent>

              </Card>
            </Grid>
          ))}
        </Grid>

        {/* <ModalOrder onClose={handleOrderModal} contractId={21} /> */}
      </Container>
    </Box>
  );
}