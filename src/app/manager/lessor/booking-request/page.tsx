'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button, Stack, CircularProgress, Modal } from '@mui/material';
import SmallCard from '@/common/components/card/SmallCard';
import { HeadCell } from '@/common/components/card/headCell';
import CustomModal from '@/common/components/modal';
import PdfUploader from '@/common/components/PdfUploader';
import { get } from '@/common/store/base.service';

interface BookingRequest {
    id: number;
    created_at: string;
    updated_at: string;
    renter_id: number;
    lessor_id: number;
    room_id: number;
    room: {
        id: number;
        title: string;
        price: number;
        images: string[];
    };
    request_date: string;
    status: string;
    note: string;
    message_from_renter: string;
    start_date: string;
    rental_duration: number;
}

export default function Page() {
    const mockBookingRequests: BookingRequest[] = [
        {
            id: 1,
            created_at: "2023-09-01T10:00:00Z",
            updated_at: "2023-09-01T10:00:00Z",
            renter_id: 101,
            lessor_id: 201,
            room_id: 1,
            room: {
                id: 1,
                title: "Cozy Room in the City Center",
                price: 5000000,
                images: [
                    "https://www.wilsonhomes.com.au/sites/default/files/styles/blog_hero_banner/public/My%20project%20-%202023-06-20T095818.329%20%281%29_0.jpg?itok=UbtVbhT0",
                ],
            },
            request_date: "2023-10-01T12:00:00Z",
            status: "PROCESSING",
            note: "Looking forward to renting this room.",
            message_from_renter: "Please let me know if the room is available.",
            start_date: "2023-10-15T12:00:00Z",
            rental_duration: 12,
        },
        {
            id: 2,
            created_at: "2023-09-05T15:00:00Z",
            updated_at: "2023-09-05T15:00:00Z",
            renter_id: 102,
            lessor_id: 202,
            room_id: 2,
            room: {
                id: 2,
                title: "Spacious Room with a View",
                price: 6000000,
                images: [
                    "https://www.wilsonhomes.com.au/sites/default/files/styles/blog_hero_banner/public/My%20project%20-%202023-06-20T095818.329%20%281%29_0.jpg?itok=UbtVbhT0",
                ],
            },
            request_date: "2023-10-02T12:00:00Z",
            status: "SUCCESS",
            note: "Excited to move in!",
            message_from_renter: "I will be available for a visit.",
            start_date: "2023-10-20T12:00:00Z",
            rental_duration: 6,
        },
        {
            id: 2,
            created_at: "2023-09-05T15:00:00Z",
            updated_at: "2023-09-05T15:00:00Z",
            renter_id: 102,
            lessor_id: 202,
            room_id: 2,
            room: {
                id: 2,
                title: "Spacious Room with a View",
                price: 6000000,
                images: [
                    "https://www.wilsonhomes.com.au/sites/default/files/styles/blog_hero_banner/public/My%20project%20-%202023-06-20T095818.329%20%281%29_0.jpg?itok=UbtVbhT0",
                ],
            },
            request_date: "2023-10-02T12:00:00Z",
            status: "FAILURE",
            note: "Excited to move in!",
            message_from_renter: "I will be available for a visit.",
            start_date: "2023-10-20T12:00:00Z",
            rental_duration: 6,
        },
    ];

    const headCells: HeadCell[] = [
        { id: 'status', label: 'Trạng thái' },
        { id: 'note', label: 'Ghi chú' },
        { id: 'start_date', label: 'Ngày bắt đầu' },
        { id: 'rental_duration', label: 'Thời gian thuê' },
        { id: 'message_from_renter', label: 'Tin nhắn từ khách hàng' },
        {
            id: 'action', label: "Action",
            render: (row: BookingRequest) =>
            (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {(
                        <Button onClick={handleOpen} variant="contained" color="success" >
                            Đồng ý
                        </Button>
                    )}

                    {true && (
                        <Button variant="contained" color="error" >
                            Từ chối
                        </Button>
                    )}

                    <Button variant="contained" color="primary" >
                        Chi tiết
                    </Button>
                </Box>
            )
        }
    ]

    const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(mockBookingRequests);
    const [loadingPage, setLoadingPage] = useState(false);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [responseFile, setResponseFile] = useState('');
    const [successModalOpen, setSuccessModalOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleConfirm = async () => {
        setLoading(true);
        const fileBase64 = await getBase64FromPdf();
        await handleSignDoc(fileBase64);
        setLoading(false);
        setSuccessModalOpen(true);
    };

    const handleSignDoc = async (fileBase64: string) => {
        const response = await fetch("http://ec2-13-236-165-0.ap-southeast-2.compute.amazonaws.com:3006/signPdfBase64ImageDisplay", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: "083202010950",
                checkCertValid: true,
                serialNumber: "5404fffeb7033fb316d672201beb028e",
                dataDisplay: "Test",
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
                    fileImageBase64: process.env.fileImageBase64,
                    widthRectangle: 100
                }
            }),
        });

        if (response.ok) {
            const data = await response.json();
            setResponseFile(data.fileBase64);
        } else {
            console.error("Error fetching API");
        }
    };

    const getBase64FromPdf = async () => {
        return "SGVsbG8=";
    };

    useEffect(() => {
        const fetchBookingRequests = async () => {
            try {
                const res = await get(`booking-requests`);
                const result = res.data;
                console.log(result);                
                if (result.status === 'SUCCESS') {
                    setBookingRequests(result.data);
                }
            } catch (error) {
                console.error('Error fetching booking requests:', error);
            } finally {
                setLoadingPage(false);
            }
        };
        // fetchBookingRequests();
    }, []);

    if (loadingPage) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '70vw' }}>
            <Typography variant="h4" gutterBottom >
                Danh sách yêu cầu thuê
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {bookingRequests.map((request) => (
                    <SmallCard
                        dataSource={{
                            image: request.room.images?.[0] || '',
                            title: request.room.title,
                            status: request.status,
                            note: request.note,
                            start_date: new Date(request.start_date).toLocaleDateString(),
                            rental_duration: request.rental_duration,
                            message_from_renter: request.message_from_renter,
                        }}
                        headCells={headCells}
                        onButtonClick={(actionType) => {
                            console.log(`${actionType} clicked for request ID: ${request.id}`);
                        }}
                    />
                ))}
            </Box>
            <CustomModal
                open={open}
                onClose={handleClose}
                width="70%"
                height="auto"
                title="Ký hợp đồng"
                type="confirm"
                onConfirm={handleConfirm}
            >
                <Box position="relative">
                    <Stack direction="row" spacing={2}>
                        <Typography>Chọn hợp đồng: </Typography>
                        <Box sx={{ position: 'relative' }}>
                            <PdfUploader />
                        </Box>
                    </Stack>
                    {loading && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                zIndex: 10,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    )}
                </Box>
            </CustomModal>

            {/* Modal thông báo thành công */}
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
                    <iframe
                        src={`data:application/pdf;base64,${responseFile}`}
                        width="100%"
                        height="600px"
                        title="Signed Document"
                    />
                    <Button onClick={() => setSuccessModalOpen(false)} variant="contained" sx={{ mt: 2 }}>
                        Đóng
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};
