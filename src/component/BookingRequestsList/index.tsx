'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button, Stack, CircularProgress, Modal, FormControl, Select, MenuItem } from '@mui/material';
import SmallCard, { HeadCell } from '@/common/components/card/SmallCard';
import { get, put } from '@/common/store/base.service';
import { BookingRequest, Room } from '@/types';
import { useRouter } from 'next/navigation';

import OpenPdfButton from '@/common/components/OpenPdfButton';
import { getSession, useSession } from 'next-auth/react';
import { Order, orderInit, PaymentModal } from '@/component/BookingRequestsList/PaymentModal';
import CustomModal from '@/common/components/modal';
import { base64ToFile, getBase64FromPdf } from '@/common/utils/helpers';
import PdfUploader from '@/common/components/PdfUploader';
import LoadingBox from '@/common/components/LoadingBox';

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

    const headCells: HeadCell[] = [
        { id: 'status', label: 'Trạng thái' },
        // { id: 'note', label: 'Ghi chú' },
        { id: 'start_date', label: 'Ngày bắt đầu' },
        { id: 'rental_duration', label: 'Thời gian thuê(tháng)' },
        { id: 'message_from_renter', label: 'Tin nhắn từ khách hàng' },
        { id: 'price', label: 'Giá' },
        {
            id: 'action', label: "Action",
            render: (row) =>
            (type === 'renter' ?
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {row.note == "Waiting for renter to sign and pay" && (
                        <Button variant="contained" color="success" onClick={() => {
                            setPaymentModal(true);
                            setOrder({
                                bookingRequestId: row.id,
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
                            console.log(row.id);
                        }}>Thanh toán</Button>
                    )}

                    {row.note === "Waiting for renter to sign and pay" && row.message_from_lessor && (
                        <OpenPdfButton
                            fileBase64={row.message_from_lessor}
                            filename={"SignDocument.pdf"}
                        />
                    )}

                    <Button variant="contained" color="primary" onClick={() => {
                        router.push(`/room/${row.room_id}`)
                    }}>
                        Xem phòng
                    </Button>

                    {row.status != 'Success' && (
                        <Button variant="contained" color="error" onClick={() => {

                        }}>
                            Hủy
                        </Button>
                    )}
                </Box>
                :
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {row.note == "Waiting for landlord approval" && (
                        <Button onClick={() => {
                            setOpen(true);
                            setSelectedRequest(row);
                        }} variant="contained" color="success" >
                            Đồng ý
                        </Button>
                    )}

                    {row.status != 'Success' && (
                        <Button variant="contained" color="error" >
                            Từ chối
                        </Button>
                    )}

                    {row.note === "Waiting for renter to sign and pay" && row.message_from_lessor && (
                        <OpenPdfButton
                            fileBase64={row.message_from_lessor}
                            filename={"SignDocument.pdf"}
                        />
                    )}

                    <Button variant="contained" color="primary" onClick={() => {
                        router.push(`/room/${row.room_id}`)
                    }}>
                        Xem phòng
                    </Button>
                </Box>
            )
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
        const fileBase64 = await getBase64FromPdf(selectedFile!);
        console.log('Đã giải mã file');

        await handleSignDoc(fileBase64!);
        setLoading(false);
        setOpen(false)
        setSuccessModalOpen(true);
    };

    const updateBookingRequest = async (basa64: any) => {
        console.log('Bắt đầu update booking request, chuẩn bị dữ liệu');
        if (!selectedRequest) return;

        const updatedRequest = {
            ...selectedRequest,
            note: "Waiting for renter to sign and pay",
            message_from_lessor: basa64!,
        };
        console.log('Đã chuẩn bị dữ liệu xong, bắt đầu gửi yêu cầu put');
        const res = await put(`booking-requests/${selectedRequest.id}`, updatedRequest);
        console.log('Xong, trả về kết quả, update ui');
        setBookingRequests(bookingRequests =>
            bookingRequests.map(obj => obj.id === selectedRequest.id ? res.data : obj)
        );
    }

    const handleSignDoc = async (fileBase64: string) => {
        const body = {
            userId: "083202010950",
            checkCertValid: true,
            serialNumber: "5404fffeb7033fb316d672201beb028e",
            dataDisplay: "Sign document",
            fileSignedResponseType: 1,
            docID: 131,
            fileBase64: fileBase64,
            timestampConfig: {
                useTimestamp: false,
                tsa_url: "",
                tsa_acc: "",
                tsa_pass: ""
            },
            displayImageConfigBO: {
                fileImageBase64: process.env.NEXT_PUBLIC_FILE_IMAGE_BASE64,
                widthRectangle: 100
            }
        }
        console.log('Đã chuẩn bị xong dữ liệu');
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
        const file = base64ToFile(fileBase64, "DocumentSigned.pdf");
        updateBookingRequest(fileBase64);
    };

    if (loadingPage) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    useEffect(() => {
        fetchBookingRequests();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '70vw' }}>
            <Typography variant="h4" gutterBottom >
                Danh sách yêu cầu thuê
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                        }}
                        headCells={headCells}
                    />
                ))}
            </Box>
            {paymentModal && <PaymentModal onClose={handlePaymentModal} order={order} />}

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
                                <MenuItem value={-1}>Viettel</MenuItem>
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
                            {/* <Button onClick={openPdfInNewTab} variant="contained" color="primary">
                            Mở File PDF
                        </Button> */}
                            {/* <Button onClick={() => setSuccessModalOpen(false)} variant="outlined">
                            Đóng
                        </Button> */}
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
