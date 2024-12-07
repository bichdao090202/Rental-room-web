'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button } from '@mui/material';
import { Room } from '@/types';
import { get, put } from '@/common/store/base.service';
import SmallCard, { HeadCell } from '@/common/components/card/SmallCard';
import { formatCurrency } from '@/common/utils/helpers';
import { useRouter } from 'next/navigation';
import { getRoomTypeNameById } from './create/CreateRoomForm';
import getRoomStatus from './getRoomStatus';


export default function Page() {
    const [rooms, setRooms] = useState<Room[]>([])
    const router = useRouter();
    const headCells: HeadCell[] = [
        {
            id: 'status', label: "Trạng thái", type: 'render', render: (row) => getRoomStatus(row.status)
        },
        {
            id: 'room_type', label: "Loại phòng", type: 'render', render: (row) => getRoomTypeNameById(row.room_type)
        },
        { id: 'price', label: 'Giá phòng' },
        { id: 'deposit', label: 'Tiền cọc' },
        {
            id: 'action', label: "Action",
            render: (row) =>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                        variant="contained" onClick={() => router.push(`/room/${row.id}`)}>
                        Xem phòng
                    </Button>
                    <>
                            {row.status == 1 && (
                                <Button variant="contained" color="inherit"
                                    onClick={() => updateRoomStatus(row.id, 2)} >
                                    {getRoomStatus(2)}
                                </Button>
                            )}
                            {(row.status == 2 || row.status == 0 ) && (
                                <Button variant="contained" color="success"
                                    onClick={() => updateRoomStatus(row.id, 1)} >
                                    {getRoomStatus(1)}
                                </Button>
                            )}

                        </>
                    
                    <Button variant="contained" color="error"
                        onClick={() => updateRoomStatus(row.id, 2)} >
                        Xóa
                    </Button>
                </Box>
        }
    ]

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
    useEffect(() => {

        fetchRooms();
    }, []);

    const updateRoomStatus = async (id: number, status: number) => {
        const body = { id: id, status: status };
        console.log(body);
        const response = await put(`rooms/${id}/status`, body);
        console.log(response);
        if (response.status == "SUCCESS")
            alert("Cập nhật trạng thái thành công");
        fetchRooms();
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '70vw' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                <Typography variant="h4">Danh sách phòng</Typography>
                <Button variant="contained" onClick={() => router.push('/manager/lessor/room/create')}>Thêm phòng</Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {rooms?.map((room) => (
                    <SmallCard key={room.id}
                        dataSource={{
                            image: room.images[0] ?? '',
                            title: room.title,
                            id: room.id,
                            price: formatCurrency(room.price),
                            deposit: formatCurrency(room.deposit),
                            status: room.status,
                            room_type: room.room_type
                        }}
                        headCells={headCells}
                    />
                ))}
            </Box>
        </Box>
    )
}