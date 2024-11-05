'use client'

import { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Divider,
    MenuItem,
    Grid,
    CircularProgress,
    Alert
} from '@mui/material';
import CustomModal from '@/common/components/modal';
import { post, signPost } from '@/common/store/base.service';
import { getSession, useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';

interface ChangePasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface DigitalSignatureForm {
    provider: string;
    userId: string;
}

interface ValidationErrors {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    userId?: string;
}

export default function Page() {
    // State for change password
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    const [passwordForm, setPasswordForm] = useState<ChangePasswordForm>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordErrors, setPasswordErrors] = useState<ValidationErrors>({});

    const [signatureForm, setSignatureForm] = useState<DigitalSignatureForm>({
        provider: '',
        userId: ''
    });
    const [isSignatureValid, setIsSignatureValid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const providers = [
        { value: 'VNPT', label: 'VNPT' },
        { value: 'VIETTEL', label: 'Viettel' },
    ];

    const validatePasswordForm = () => {
        const errors: ValidationErrors = {};

        if (!passwordForm.currentPassword) {
            errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
        }

        if (!passwordForm.newPassword) {
            errors.newPassword = 'Vui lòng nhập mật khẩu mới';
        } else if (passwordForm.newPassword.length < 8) {
            errors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự';
        }

        if (!passwordForm.confirmPassword) {
            errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
        } else if (passwordForm.confirmPassword !== passwordForm.newPassword) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChangePassword = async () => {
        if (!validatePasswordForm()) return;

        setIsLoading(true);
        try {

            setModalMessage('Đổi mật khẩu thành công!');
            setShowSuccessModal(true);
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckSignature = async () => {
        if (!signatureForm.userId || !signatureForm.provider) {
            setPasswordErrors({ userId: 'Vui lòng nhập đầy đủ thông tin' });
            return;
        }

        await fetch('http://54.253.233.87:8010/sign/get_certificate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                provider: signatureForm.provider,
                user_id: signatureForm.userId
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        setIsLoading(true);
        try {
            const body = {
                provider: signatureForm.provider,
                user_id: signatureForm.userId
            }
            console.log(body);


            // const response = await post(`http://54.253.233.87:8010/sign/get_certificate`, body, false)
            //   const response = await signPost(`get_certificate`,body)
            //   console.log(response);      
            //   await new Promise(resolve => setTimeout(resolve, 1000));
            setIsSignatureValid(true);
        } catch (error) {
            setIsSignatureValid(false);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSignature = async () => {
        setIsLoading(true);
        try {
            const body = {
                service_type: signatureForm.provider,
                user_id: session?.user.id,
                cccd_number: signatureForm.userId
            }
            console.log(body);
            

            setModalMessage('Thêm chữ ký số thành công!');
            setShowSuccessModal(true);
            setSignatureForm({
                provider: '',
                userId: ''
            });
            setIsSignatureValid(null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Tài khoản
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Đổi mật khẩu
                        </Typography>
                        <Box component="form" sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Mật khẩu hiện tại"
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                error={!!passwordErrors.currentPassword}
                                helperText={passwordErrors.currentPassword}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Mật khẩu mới"
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                error={!!passwordErrors.newPassword}
                                helperText={passwordErrors.newPassword}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Xác nhận mật khẩu mới"
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                error={!!passwordErrors.confirmPassword}
                                helperText={passwordErrors.confirmPassword}
                            />
                            <Button
                                variant="contained"
                                onClick={handleChangePassword}
                                disabled={isLoading}
                                sx={{ mt: 2 }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Đổi mật khẩu'}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Thêm chữ ký số
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                select
                                fullWidth
                                margin="normal"
                                label="Nhà cung cấp"
                                value={signatureForm.provider}
                                onChange={(e) => setSignatureForm({ ...signatureForm, provider: e.target.value })}
                            >
                                {providers.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="User ID"
                                value={signatureForm.userId}
                                onChange={(e) => setSignatureForm({ ...signatureForm, userId: e.target.value })}
                                error={!!passwordErrors.userId}
                                helperText={passwordErrors.userId}
                            />
                            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleCheckSignature}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <CircularProgress size={24} /> : 'Kiểm tra'}
                                </Button>
                                {isSignatureValid && (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleAddSignature}
                                        disabled={isLoading}
                                    >
                                        Thêm chữ ký
                                    </Button>
                                )}
                            </Box>
                            {isSignatureValid !== null && (
                                <Alert
                                    severity={isSignatureValid ? "success" : "error"}
                                    sx={{ mt: 2 }}
                                >
                                    {isSignatureValid ? "Chữ ký số hợp lệ." : "Chữ ký số không hợp lệ."}
                                </Alert>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Success Modal */}
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