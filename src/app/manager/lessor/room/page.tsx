'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button } from '@mui/material';
import { Room } from '@/types';
import { get } from '@/common/store/base.service';
import SmallCard, { HeadCell } from '@/common/components/card/SmallCard';
import { formatCurrency } from '@/common/utils/helpers';
import { useRouter } from 'next/navigation';


export default function Page() {
    const [rooms, setRooms] = useState<Room[]>([])
    const router = useRouter();
    const headCells: HeadCell[] = [
        { id: 'price', label: 'Giá' },
        { id: 'deposit', label: 'Tiền cọc' },
    ]

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
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '70vw' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                <Typography variant="h4">Danh sách phòng</Typography>
                <Button variant="contained" onClick={() => router.push('/manager/lessor/room/create')}>Thêm phòng</Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {rooms.map((room) => (
                    <SmallCard key={room.id} 
                        dataSource={{
                            image: room.images[0] || '',
                            title: room.title,
                            id: room.id,
                            price: formatCurrency(room.price),
                            deposit: formatCurrency(room.deposit),
                        }}
                        headCells={headCells}
                    />
                ))}
            </Box>
        </Box>
    )
}