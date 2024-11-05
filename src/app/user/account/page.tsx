'use client'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import { get } from '@/common/store/base.service';
import { ChangePasswordModal } from '@/component/modal/ChangePasswordModal';
import { AddSignatureModal } from '@/component/modal/AddSignatureModal';
import CustomModal from '@/common/components/modal';
interface Signature {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user_id: number;
    service_type: string;
    cccd_number: string;
}

export default function Page() {
    const { data: session, status } = useSession();
    const [signatures, setSignatures] = useState<Signature[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const fetchSignatures = async () => {
        try {
            const response = await get(`signatures?user_id=${session?.user.id}`);
            if (response.status === "SUCCESS") {
                setSignatures(response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user.id) {
            fetchSignatures();
        }
        fetchSignatures();
    }, [session?.user.id]);

    if (status === "loading" || isLoading) {
        return <p>Loading...</p>;
    }

    const handlePasswordSuccess = () => {
        setModalMessage('Đổi mật khẩu thành công!');
        setShowSuccessModal(true);
    };

    const handleSignatureSuccess = () => {
        setModalMessage('Thêm chữ ký số thành công!');
        setShowSuccessModal(true);
        fetchSignatures();
    };

    return (
        <Box sx={{maxWidth: "800", mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Tài khoản
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => setShowPasswordModal(true)}
                >
                    Đổi mật khẩu
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {/* <Paper sx={{ p: 3 }}> */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5">
                            Danh sách chữ ký số của bạn
                        </Typography>
                        <Button variant="contained" onClick={() => setShowSignatureModal(true)} >
                            Thêm chữ ký
                        </Button>
                    </Box>

                    {signatures.map((signature) => (
                        <Box key={signature.id} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                            <Typography>Nhà cung cấp: {signature.service_type}</Typography>
                            <Typography>ID: {signature.cccd_number}</Typography>
                        </Box>
                    ))}
                    {/* </Paper> */}
                </Grid>
            </Grid>

            <ChangePasswordModal
                open={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onSuccess={handlePasswordSuccess}
            />

            <AddSignatureModal
                open={showSignatureModal}
                onClose={() => setShowSignatureModal(false)}
                onSuccess={handleSignatureSuccess}
                userId={session!.user.id}
            />

            <CustomModal
                open={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Thông báo"
                type="confirm"
                onConfirm={() => setShowSuccessModal(false)}
            >
                <Typography>{modalMessage}</Typography>
            </CustomModal>
        </Box>
    );
}