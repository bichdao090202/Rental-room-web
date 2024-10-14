'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button, Stack, CircularProgress, Modal, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import SmallCard, { HeadCell } from '@/common/components/card/SmallCard';
import CustomModal from '@/common/components/modal';
import PdfUploader from '@/common/components/PdfUploader';
import { get, put } from '@/common/store/base.service';
import { BookingRequest } from '@/types';
import { base64ToFile, formatDay, getBase64FromPdf } from '@/common/utils/helpers';
import { usersSelectors } from '@/common/store/user/users.selectors';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import OpenPdfButton from '@/common/components/OpenPdfButton';

export default function Page() {
    const headCells: HeadCell[] = [
        { id: 'status', label: 'Trạng thái' },
        // { id: 'note', label: 'Ghi chú' },
        { id: 'start_date', label: 'Ngày bắt đầu' },
        { id: 'rental_duration', label: 'Thời gian thuê' },
        { id: 'message_from_renter', label: 'Tin nhắn từ khách hàng' },
        {
            id: 'action', label: "Action",
            render: (row: BookingRequest) =>
            (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {row.note == "Waiting for landlord approval" && (
                        <Button onClick={() => {
                            setOpen(true);
                            setSelectedRequest(row);
                        }} variant="contained" color="success" >
                            Đồng ý
                        </Button>
                    )}

                    {true && (
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
                        router.push(`/room/${row.id}`)
                    }}>
                        Xem phòng
                    </Button>
                </Box>
            )
        }
    ]

    const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
    const [loadingPage, setLoadingPage] = useState(false);
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [responseFile, setResponseFile] = useState<File | null>(null);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
    const user = usersSelectors.useUserInformation();
    const [filebase64, setFilebase64] = useState<string>();

    const handleClose = () => setOpen(false);
    const handleConfirm = async () => {
        setLoading(true);
        const fileBase64 = await getBase64FromPdf(selectedFile!);
        await handleSignDoc(fileBase64!);
        setLoading(false);
        setOpen(false)
        setSuccessModalOpen(true);
    };

    const updateBookingRequest = async (basa64) => {
        if (!selectedRequest) return;

        const updatedRequest = {
            ...selectedRequest,
            note: "Waiting for renter to sign and pay",            
            message_from_lessor: basa64!,
        };

        console.log(updatedRequest)

        const res = await put(`booking-requests/${selectedRequest.id}`, updatedRequest);
        console.log(res);

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
        const response = await fetch("https://mallard-fluent-lightly.ngrok-free.app/signPdfBase64ImageDisplay", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (response.ok) {
            const file = base64ToFile(data.signedFileBase64, "DocumentSigned.pdf");
            setFilebase64(data.signedFileBase64)
            setResponseFile(file);
            updateBookingRequest(data.signedFileBase64);
        } else {
            console.error("Server error");
        }
       

        // const file = base64ToFile(fileBase64, "DocumentSigned.pdf");
        // setFilebase64(fileBase64)
        // setResponseFile(file);
        // updateBookingRequest();
    };

    useEffect(() => {
        const fetchBookingRequests = async () => {
            try {
                const res = await get(`booking-requests?lessor_id=${user?.id}`);
                const result = res.data;
                console.log(res);
                setBookingRequests(result);
            } catch (error) {
                console.error('Error fetching booking requests:', error);
            }

        };
        fetchBookingRequests();
    }, []);

    useEffect(() => {
        if (responseFile) {
            const fileUrl = URL.createObjectURL(responseFile);
            return () => URL.revokeObjectURL(fileUrl);
        }
    }, [responseFile]);

    if (loadingPage) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    const openPdfInNewTab = () => {
        if (responseFile) {
            const fileUrl = URL.createObjectURL(responseFile);
            const newTab = window.open(fileUrl, '_blank');
            if (newTab) {
                newTab.focus();
            }
            setTimeout(() => URL.revokeObjectURL(fileUrl), 100);
        }
    };

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
                            // start_date: new Date(request.start_date).toLocaleDateString(),
                            start_date: request.start_date,
                            rental_duration: request.rental_duration,
                            message_from_renter: request.message_from_renter,
                            message_from_lessor: request.message_from_lessor,
                            id: request.id,
  renter_id: request.renter_id,
  lessor_id: request.lessor_id,
  room_id: request.room.id,
                        }}
                        headCells={headCells}
                        onButtonClick={(actionType) => {
                            console.log(`${actionType} clicked for request ID: ${request.id}`);
                        }}
                    />
                ))}
            </Box>
            {selectedRequest && <CustomModal
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
            </CustomModal>}

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
                        <Button onClick={() => setSuccessModalOpen(false)} variant="contained" color="primary">
                            Xác nhận
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};