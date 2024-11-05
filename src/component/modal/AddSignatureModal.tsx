import { useState } from 'react';
import { TextField, Button, CircularProgress, Box, MenuItem, Alert } from '@mui/material';
import { signPost } from '@/common/store/base.service';
import CustomModal from '@/common/components/modal';

interface DigitalSignatureForm {
    provider: string;
    userId: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userId: string;
}

export const AddSignatureModal = ({ open, onClose, onSuccess, userId }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [signatureForm, setSignatureForm] = useState<DigitalSignatureForm>({
        provider: '',
        userId: ''
    });
    const [isSignatureValid, setIsSignatureValid] = useState<boolean | null>(null);
    const [errors, setErrors] = useState<{ userId?: string }>({});

    const providers = [
        { value: 'VNPT', label: 'VNPT' },
        { value: 'VIETTEL', label: 'Viettel' },
    ];

    const handleCheckSignature = async () => {
        if (!signatureForm.userId || !signatureForm.provider) {
            setErrors({ userId: 'Vui lòng nhập đầy đủ thông tin' });
            return;
        }
        setIsLoading(true);
        try {
            const body = {
                provider: signatureForm.provider,
                user_id: signatureForm.userId
            };
            const response = await signPost('get_certificate', body);
            console.log(response);
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
                user_id: userId,
                cccd_number: signatureForm.userId
            };
            await signPost('signatures', body);
            onSuccess();
            onClose();
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
        <CustomModal open={open} onClose={onClose} title="Thêm chữ ký số" type='none' width={'600px'}>
            <Box sx={{ mt: 2 }}>
                {isLoading && <CircularProgress />}
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
                    error={!!errors.userId}
                    helperText={errors.userId}
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
        </CustomModal>
    );
};
