'use client'
import { useState } from 'react';
import { TextField, Button, CircularProgress, Box, Grid, Paper, Typography } from '@mui/material';
import CustomModal from '@/common/components/modal';
import { get } from '@/common/store/base.service';
import Loading from '@/app/loading';
import LoadingBox from '@/common/components/LoadingBox';

interface ChangePasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ValidationErrors {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const ChangePasswordModal = ({ open, onClose, onSuccess }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [passwordForm, setPasswordForm] = useState<ChangePasswordForm>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordErrors, setPasswordErrors] = useState<ValidationErrors>({});

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
            onSuccess();
            onClose();
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

    return (
        <CustomModal open={open} onClose={onClose} title="Đổi mật khẩu" type='confirm' onConfirm={handleChangePassword} width={'550px'}>
            <Box component="form" sx={{ mt: 2 }}>
                {isLoading && (
                    <LoadingBox />
                )}
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
            </Box>
        </CustomModal>
    );
};