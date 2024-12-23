'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button, Stack, CircularProgress, Modal, FormControl, Select, MenuItem } from '@mui/material';
import SmallCard, { HeadCell } from '@/common/components/card/SmallCard';
import { get, post, put, signPost } from '@/common/store/base.service';
import { BookingRequest, Room } from '@/types';
import { useRouter } from 'next/navigation';

import OpenPdfButton from '@/common/components/OpenPdfButton';
import { getSession, useSession } from 'next-auth/react';
import { Order, orderInit, PaymentModal } from '@/component/BookingRequestsList/PaymentModal';
import CustomModal from '@/common/components/modal';
import { base64ToFile, getBase64FromPdf } from '@/common/utils/helpers';
import PdfUploader from '@/common/components/PdfUploader';
import LoadingBox from '@/common/components/LoadingBox';
import UserModal from './UserModal';

export function getBookingStatus(status: number): string {
    switch (status) {
        case 0:
            return "Không xác định"
        case 1:
            return "Đang chờ chủ trọ đồng ý";
        case 2:
            return "Đang chờ người thuê thanh toán";
        case 3:
            return "Hoàn thành";
        case 4:
            return "Chủ trọ từ chối";
        case 5:
            return "Người thuê hủy";
        default:
            return "Không xác định";
    }
}

export default function BookingRequestsList({ type }: { type: 'renter' | 'lessor' }) {
    const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
    const router = useRouter();
    const [paymentModal, setPaymentModal] = useState(false);
    const [order, setOrder] = useState<Order>(orderInit);
    const { data: session } = useSession();

    //for lessor
    const [open, setOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
    const [loadingPage, setLoadingPage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [userModal, setUserModal] = useState(false);
    const [user, setUser] = useState<any>();

    const headCells: HeadCell[] = [
        { id: 'start_date', label: 'Ngày bắt đầu' },
        { id: 'rental_duration', label: 'Thời gian thuê(tháng)' },
        { id: 'message_from_renter', label: 'Tin nhắn từ khách hàng' },
        { id: 'price', label: 'Giá', type: 'money' },
        { id: 'deposit', label: 'Tiền cọc', type: 'money' },
        {
            id: 'status', label: "Trạng thái", type: 'render', render: (row) => getBookingStatus(row.status)
        },
        {
            id: 'action', label: "Action",
            render: (row) =>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {row.status == 2 && type == 'renter' && (
                        <Button variant="contained" color="success" onClick={() => {
                            setPaymentModal(true);
                            setOrder({
                                bookingRequestId: row.id,
                                base64: row.message_from_lessor,
                                user: session?.user,
                                priceMonth: row.price,
                                deposit: row.deposit,
                                OrderDetails: [
                                    {
                                        title: row.title,
                                        value: row.price,
                                        quantity: row.rental_duration,
                                    }
                                ]
                            });
                        }}>Thanh toán</Button>
                    )}

                    <Button variant="contained" color="primary" onClick={() => {
                        router.push(`/room/${row.room_id}`)
                    }}>
                        Xem phòng
                    </Button>

                    {row.status == 1 && type == 'lessor' && (
                        <Button onClick={() => {
                            setOpen(true);
                            setSelectedRequest(row);
                        }} variant="contained" color="success" >
                            Đồng ý
                        </Button>
                    )}

                    {(row.status == 1 || row.status == 2) && type == 'lessor' && (
                        <Button variant="contained" color="error" >
                            Từ chối
                        </Button>
                    )}

                    {(row.status == 1 || row.status == 2) && type == 'renter' && (
                        <Button variant="contained" color="error" >
                            Hủy
                        </Button>
                    )}

                    {row.status == 2 && row.message_from_lessor && (
                        <OpenPdfButton
                            fileBase64={row.message_from_lessor}
                            filename={"SignDocument.pdf"}
                        />
                    )}
                    {type == 'lessor' && (
                        <Button variant="contained" color="warning" 
                        onClick={() => {
                            console.log(row.lessor);
                            
                            setUser(row.renter);
                            setUserModal(true);
                        }}                        
                        >
                            Người thuê
                        </Button>
                    )}

                    {type == 'renter' && (
                        <Button variant="contained" color="warning" 
                        onClick={() => {
                            setUser(row.lessor);
                            setUserModal(true);
                        }}                        
                        >
                            Chủ trọ
                        </Button>
                    )}
                </Box>
        },
    ]

    const fetchBookingRequests = async () => {
        const session = await getSession();
        try {
            const path = type === 'renter' ? `booking-requests?renter_id=${session?.user?.id}` : `booking-requests?lessor_id=${session?.user?.id}`;
            const res = await get(path);
            const result = res.data;
            console.log(res);
            const sortedResult = result.sort((a: any, b: any) => b.id - a.id);
            setBookingRequests(sortedResult);
        } catch (error) {
            console.error('Error fetching booking requests:', error);
        }
    };

    const handlePaymentModal = () => {
        setPaymentModal(false);
    };

    //for lessor    
    const handleClose = () => setOpen(false);
    const handleConfirm = async () => {
        setLoading(true);
        const body = {
            user_id: "083202010950",
            provider: "VNPT",
        }
        try {
            const fileBase64 = await getBase64FromPdf(selectedFile!);
            await handleSignDoc(fileBase64!);
        } catch {
            
        }
        setLoading(false);
        setOpen(false)
    };

    const updateBookingRequest = async (basa64: any) => {
        if (!selectedRequest) return;
        const updatedRequest = {
            ...selectedRequest,
            status: 2,
            message_from_lessor: basa64!,
        };
        console.log(basa64);
        const res = await put(`booking-requests/${selectedRequest.id}`, updatedRequest);
        console.log(res);
        setBookingRequests(bookingRequests =>
            bookingRequests.map(obj => obj.id === selectedRequest.id ? res.data : obj)
        );
    }

    const handleSignDoc = async (fileBase64: string) => {
        const body = {
            user_id: "083202010950",
            serial_number: "54010101eec8a59ad71b4777401e27f4",
            transaction_id: "da25ed27-7bfe-495f-89fd-06723a584094",
            time_stamp: "2024-09-17T15:58:01+07:00",
            image_base64: "",
            rectangles: [
                {
                    number_page_sign: 1,
                    margin_top: 100,
                    margin_left: 10,
                    margin_right: 250,
                    margin_bottom: 200
                }
            ],
            visible_type: 1,
            contact: "",
            font_size: 12,
            sign_files: [
                {
                    data_to_be_signed: "c803ba9e0b741be5995687c3611ecea617d532f12d7bae81aad0fa5d6ffe3f23",
                    doc_id: "32c-7401-25621",
                    file_type: "pdf",
                    sign_type: "hash",
                    file_base64: fileBase64,
                    tag_save_signature: ""
                }
            ]
        };
        console.log(body)
        try {
            const res = await post('https://mallard-fluent-lightly.ngrok-free.app/api/sign/sign_document', body, false);
            console.log(res)
            const file = base64ToFile(res[0].signed_data, "DocumentSigned.pdf");
            if (!file) return;
            updateBookingRequest(res[0].signed_data);            
            setSuccessModalOpen(true);
        } catch {
            alert('Lỗi, thử lại sau')
        }


        // const response = await fetch("https://mallard-fluent-lightly.ngrok-free.app/signPdfBase64ImageDisplay", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(body),
        // });
        // console.log('Đã gửi yêu cầu ký');
        // const data = await response.json();
        // console.log('Đã xác nhận');
        // if (response.ok) {
        //     const file = base64ToFile(data.signedFileBase64, "DocumentSigned.pdf");
        //     updateBookingRequest(data.signedFileBase64);
        // } else {
        //     console.error("Server error");
        // }
        // const file = base64ToFile(fileBase64, "DocumentSigned.pdf");
        // updateBookingRequest(fileBase64);
    };

    if (loadingPage) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    useEffect(() => {
        fetchBookingRequests();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="h4" gutterBottom >
                Danh sách yêu cầu thuê
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {
                    bookingRequests.length === 0 && <Typography>Không có yêu cầu nào</Typography>
                }
                {bookingRequests.map((request) => (
                    <SmallCard key={request.id}
                        dataSource={{
                            image: request.room.images?.[0] || '',
                            title: request.room.title,
                            status: request.status,
                            note: request.note,
                            start_date: request.start_date,
                            rental_duration: request.rental_duration,
                            message_from_renter: request.message_from_renter,
                            message_from_lessor: request.message_from_lessor,
                            id: request.id,
                            renter_id: request.renter_id,
                            lessor_id: request.lessor_id,
                            room_id: request.room.id,
                            price: request.room.price,
                            deposit: request.room.deposit,
                            base64: request.message_from_lessor,
                            lessor: request.lessor,
                            renter: request.renter,
                        }}
                        headCells={headCells}
                    />
                ))}
            </Box>
            {paymentModal && <PaymentModal onClose={handlePaymentModal} order={order} />}
            {
                userModal &&
                <UserModal open={userModal} onClose={() => setUserModal(false)} user={user} />
            }
    

            {selectedRequest && <CustomModal    //for lessor
                open={open}
                onClose={handleClose}
                width="70%"
                height="auto"
                title="Chọn hợp đồng cho yêu cầu thuê"
                type="confirm"
                onConfirm={handleConfirm}
            >
                <Box position="relative">
                    <Typography sx={{ marginBottom: '10px' }}>
                        Ngày bắt đầu:
                        {new Date(selectedRequest.start_date).toLocaleDateString()}
                    </Typography>
                    <Typography>
                        Thời gian thuê:
                        {selectedRequest.rental_duration} tháng
                    </Typography>

                    <Box display="flex" alignItems="center">
                        <Typography sx={{ marginRight: '10px' }}>Chọn nhà cung cấp chữ ký số:</Typography>
                        <FormControl variant="outlined" className="w-1/5">
                            <Select
                                variant="outlined"
                                id="sign"
                                value={-1}
                                // onChange={(event: any) => setRole(event.target.value)}
                                sx={{
                                    borderRadius: '8px',
                                    marginBottom: '10px'
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 400,
                                        },
                                    },
                                }}
                            >
                                <MenuItem value={-1}>VNPT</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Stack direction="row" spacing={2}>
                        <Typography sx={{ marginRight: '10px' }}>Chọn hợp đồng: </Typography>
                        <Box sx={{ position: 'relative' }}>
                            <PdfUploader onFileSelect={setSelectedFile} />
                        </Box>
                    </Stack>
                    {loading && <LoadingBox />}
                </Box>
            </CustomModal>}

            {successModalOpen &&
                <Modal
                    open={successModalOpen}
                    onClose={() => setSuccessModalOpen(false)}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            width: '80%',
                        }}
                    >
                        <Typography variant="h6">Hợp đồng đã được ký thành công!</Typography>
                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button onClick={() => {
                                setSuccessModalOpen(false)
                                fetchBookingRequests();
                            }} variant="contained" color="primary">
                                Xác nhận
                            </Button>
                        </Box>
                    </Box>
                </Modal>}
        </Box>
    );
};
