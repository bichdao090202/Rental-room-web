// 'use client'
// import React, { useState } from 'react';
// import { Container, Typography, Grid, Card, CardContent, Button, Modal, Box, Divider, Stack } from '@mui/material';
// import PdfUploader from '@/common/components/PdfUploader';
// import CustomModal from '@/common/components/modal';

// const LandlordDashboard = () => {
//     const [open, setOpen] = useState(false);
//     const handleOpen = () => setOpen(true);
//     const handleClose = () => setOpen(false);
//     const handleConfirm = () => {
//         setOpen(false);
//     };

//     const handleSignDoc = () => {

//     }

//     return (
//         <Box>
//             <Container>
//                 <Typography variant="h4">Landlord Dashboard</Typography>

//                 <Button variant="contained" color="primary" onClick={handleOpen}>
//                     Open Custom Modal
//                 </Button>
//                 <CustomModal
//                     open={open}
//                     onClose={handleClose}
//                     width="70%"
//                     height="auto"
//                     title="Ký hợp đồng"
//                     type="confirm"
//                     onConfirm={handleConfirm}
//                 >
//                     <Box position="relative">
//                         <Stack direction="row" spacing={2} >
//                             <Typography>Chọn hợp đồng: </Typography>
//                             <Box sx={{ position: 'relative' }}>
//                                 <PdfUploader />
//                             </Box>
//                         </Stack>
//                     </Box>
//                 </CustomModal>

//             </Container>
//         </Box>
//     );
// };

// export default LandlordDashboard;
'use client';
import React, { useState } from 'react';
import { Container, Typography, Button, Modal, Box, Stack, CircularProgress } from '@mui/material';
import PdfUploader from '@/common/components/PdfUploader';
import CustomModal from '@/common/components/modal';

const LandlordDashboard = () => {
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

    return (
        <Box>
            <Container>
                <Typography variant="h4">Landlord Dashboard</Typography>

                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Open Custom Modal
                </Button>

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
            </Container>
        </Box>
    );
};

export default LandlordDashboard;
