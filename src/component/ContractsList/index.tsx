'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button, Stack, CircularProgress, Modal } from '@mui/material';
import SmallCard, { HeadCell } from '@/common/components/card/SmallCard';
import { get } from '@/common/store/base.service';
import { useRouter } from 'next/navigation';
import { getSession, useSession } from 'next-auth/react';
import OpenPdfButton from "@/common/components/OpenPdfButton";
import { PaymentModal } from '../BookingRequestsList/PaymentModal';
import { ModalCancelContract } from './ModalCancelContract';
import { ModalOrder } from './ModalOrder';

export default function ContractsList({ type }: { type: 'renter' | 'lessor' }) {
    const [bookingRequests, setBookingRequests] = useState<any[]>([]);
    const router = useRouter();
    const [paymentModal, setPaymentModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [typeModal, setTypeModal] = useState<'cancel' | 'handle' | 'confirm'>('cancel');
    const [contract, setContract] = useState(0);
    const { data: session } = useSession();

    const [orderModal, setOrderModal] = useState(false);

    function getStatusText(status: number) {
        switch (status) {
            case 1:
                return 'Processing';
            case 2:
                return 'Active';
            case 3:
                return 'Finished';
            case 4:
                return 'Failure';
            case 5:
                return 'One-side cancel';
            case 6:
                return 'Agreed cancel';
            default:
                return 'Unknown status';
        }
    }

    const headCells: HeadCell[] = [
        { id: 'status', label: 'Trạng thái' },
        // { id: 'note', label: 'Ghi chú' },
        { id: 'date_rent', label: 'Ngày bắt đầu' },
        { id: 'rental_duration', label: 'Thời gian thuê(tháng)' },
        // { id: 'message_from_renter', label: 'Tin nhắn từ khách hàng' },
        { id: 'monthly_price', label: 'Giá mỗi tháng' },
        {
            id: 'action', label: "Action",
            render: (row) =>
            (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {row.note == "Waiting for renter to sign and pay" && (
                        <Button variant="contained" color="success" onClick={() => {
                            setPaymentModal(true);
                            console.log(row.id);
                        }}>Thanh toán</Button>
                    )}

                    <Button variant="contained" color="primary" onClick={() => {
                        window.open(row.file_path, '_blank');
                    }}>
                        Xem pdf
                    </Button>

                    <Button variant="contained" color="info" onClick={() => {
                        setContract(row.id);
                        setOrderModal(true);
                    }}>
                        Xem hóa đơn
                    </Button>

                    {/* <Button variant="contained" color="primary" onClick={() => {
                        router.push(`/room/${row.room_id}`)
                    }}>
                        Xem phòng
                    </Button> */}

                    {
                        row.canceled_by == null &&
                        <Button variant="contained" color="primary" onClick={() => {
                            setContract(row.id);
                            setTypeModal('cancel');
                            setCancelModal(true);
                        }}>
                            Hủy hợp đồng
                        </Button>
                    }

                    {
                        row.canceled_by == session?.user.id && row.pay_mode == 5 &&
                        <Button variant="outlined" color="primary" onClick={() => {
                            setContract(row.id);
                            setTypeModal('cancel');
                            setCancelModal(true);
                        }}>
                            <i>Chờ phản hồi</i>
                        </Button>
                    }

                    {
                        row.canceled_by != session?.user.id && row.pay_mode == 5 &&
                        <Button variant="contained" color="primary" onClick={async () => {
                            setContract(row.id);
                            setTypeModal('handle');
                            setCancelModal(true);
                        }}>
                            Xem yêu cầu hủy
                        </Button>
                    }

                    {
                        row.canceled_by != null && row.canceled_by == session?.user.id && row.pay_mode == 6 &&
                        <Button variant="contained" color="primary" onClick={() => {
                            setContract(row.id);
                            setTypeModal('confirm');
                            setCancelModal(true);
                        }}> {`Xem phản hồi`}
                        </Button>
                    }
                </Box>
            )
        }
    ]

    const fetchBookingRequests = async () => {
        const session = await getSession();
        try {
            const path = type === 'renter' ? `contracts?renter_id=${session?.user?.id}` : `contracts?lessor_id=${session?.user?.id}`;
            const res = await get(path);
            const result = res.data;
            console.log(res);
            if (!result) return;
            const sortedResult = result.sort((a: any, b: any) => b.id - a.id);
            setBookingRequests(sortedResult);
        } catch (error) {
            console.error('Error fetching booking requests:', error);
        }
    };

    const handlePaymentModal = () => {
        setPaymentModal(false);
    };

    const handleCancelModal = () => {
        setCancelModal(false);
    };

    const handleOrderModal = () => {
        setOrderModal(false);
    };

    useEffect(() => {
        fetchBookingRequests();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%'  }}>
            <Typography variant="h4" gutterBottom >
                Danh sách hợp đồng
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {bookingRequests.map((request) => (
                    <SmallCard key={request.id}
                        dataSource={{
                            image: request.room.images?.[0] || '',
                            title: request.room.title,
                            status: getStatusText(request.status),
                            note: request.note,
                            date_rent: request.date_rent,
                            rental_duration: request.payment,
                            message_from_renter: request.message_from_renter,
                            message_from_lessor: request.message_from_lessor,
                            id: request.id,
                            renter_id: request.renter_id,
                            lessor_id: request.lessor_id,
                            room_id: request.room.id,
                            monthly_price: request.monthly_price,
                            deposit: request.room.deposit,
                            payment_mode: request.payment_mode,
                            canceled_by: request.canceled_by?.id,
                            pay_mode: request.pay_mode,
                            file_path: request.file_path
                        }}
                        headCells={headCells}
                    />

                ))}
            </Box>
            {paymentModal && <PaymentModal onClose={handlePaymentModal} />}
            {cancelModal && <ModalCancelContract onClose={handleCancelModal} contractId={contract} type={typeModal} />}
            {orderModal && <ModalOrder onClose={handleOrderModal} contractId={contract} />}
        </Box>
    );
};