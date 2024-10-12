'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button, Stack, CircularProgress, Modal } from '@mui/material';
import SmallCard, { HeadCell } from '@/common/components/card/SmallCard';
import CustomModal from '@/common/components/modal';
import PdfUploader from '@/common/components/PdfUploader';
import { get } from '@/common/store/base.service';
import { BookingRequest } from '@/types';
import { base64ToFile, getBase64FromPdf } from '@/common/utils/helpers';

export default function Page() {
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

    const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
    const [loadingPage, setLoadingPage] = useState(false);

    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [responseFile, setResponseFile] = useState<File | null>(null);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleConfirm = async () => {
        setLoading(true);
        const fileBase64 = await getBase64FromPdf(selectedFile!);
        await handleSignDoc(fileBase64!);
        setLoading(false);
        setSuccessModalOpen(true);
    };

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
        console.log(body);
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
            setResponseFile(file);
        } else {
            console.error("Server error");
        }
    };

    useEffect(() => {
        const fetchBookingRequests = async () => {
            try {
                const res = await get(`booking-requests`);
                const result = res.data;
                console.log(res);
                setBookingRequests(result);
                // if (result.status == "SUCCESS") {
                //     console.log(res);

                //     setBookingRequests(result);
                // }
            } catch (error) {
                console.error('Error fetching booking requests:', error);
            }

        };
        fetchBookingRequests();

    }, [bookingRequests]);

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
            </CustomModal>

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
                        <Button onClick={openPdfInNewTab} variant="contained" color="primary">
                            Mở File PDF
                        </Button>
                        <Button onClick={() => setSuccessModalOpen(false)} variant="outlined">
                            Đóng
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

// export default function Page() {
//     const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
//     const [loadingPage, setLoadingPage] = useState(false);
//     const [open, setOpen] = useState(true);
//     const [loading, setLoading] = useState(false);
//     const [responseFile, setResponseFile] = useState<File | null>(null);
//     const [successModalOpen, setSuccessModalOpen] = useState(false);
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const handleOpen = () => setOpen(true);
//     const handleClose = () => setOpen(false);
//     const handleConfirm = async () => {
//         setLoading(true);
//         const fileBase64 = await getBase64FromPdf(selectedFile!);
//         await handleSignDoc(fileBase64!);
//         setLoading(false);
//         setSuccessModalOpen(true);
//     };
//     const handleSignDoc = async (fileBase64: string) => {
//         const response = await fetch("https://mallard-fluent-lightly.ngrok-free.app/signPdfBase64ImageDisplay", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(body),
//         });
//         const data = await response.json();
//         console.log(data);
//         const file = base64ToFile(data.signedFileBase64,"DocumentSigned")
//         setResponseFile(file)

//     const openPdfInNewTab = () => {
//         if (responseFile) {
//             const pdfUrl = `data:application/pdf;base64,${responseFile}`;
//             window.open(pdfUrl, '_blank');
//         }
//     };

//     return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', width: '70vw' }}>

//             <CustomModal
//                 open={open}
//                 onClose={handleClose}
//                 width="70%"
//                 height="auto"
//                 title="Ký hợp đồng"
//                 type="confirm"
//                 onConfirm={handleConfirm}
//             >
//                 <Box position="relative">
//                     <Stack direction="row" spacing={2}>
//                         <Typography>Chọn hợp đồng: </Typography>
//                         <Box sx={{ position: 'relative' }}>
//                             <PdfUploader onFileSelect={setSelectedFile} />
//                         </Box>
//                     </Stack>
//                     {loading && (
//                         <Box
//                             sx={{
//                                 position: 'absolute',
//                                 top: 0,
//                                 left: 0,
//                                 right: 0,
//                                 bottom: 0,
//                                 backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                                 zIndex: 10,
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                             }}
//                         >
//                             <CircularProgress />
//                         </Box>
//                     )}
//                 </Box>
//             </CustomModal>

//             <Modal
//                 open={successModalOpen}
//                 onClose={() => setSuccessModalOpen(false)}
//             >
//                 <Box
//                     sx={{
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(-50%, -50%)',
//                         bgcolor: 'background.paper',
//                         boxShadow: 24,
//                         p: 4,
//                         width: '80%',
//                     }}
//                 >
//                     <Typography variant="h6">Hợp đồng đã được ký thành công!</Typography>
//                     <iframe
//                         src={`data:application/pdf;base64,${responseFile}`}
//                         width="100%"
//                         height="600px"
//                         title="Signed Document"
//                     />
//                     <Button onClick={openPdfInNewTab} variant="contained" sx={{ mt: 2 }}>
//                         Mở File PDF
//                     </Button>
//                     <Button onClick={() => setSuccessModalOpen(false)} variant="contained" sx={{ mt: 2 }}>
//                         Đóng
//                     </Button>
//                 </Box>
//             </Modal>
//         </Box>
//     );
// };
