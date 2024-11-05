import React from 'react';
import { Modal, Box, Typography, Button, Divider } from '@mui/material';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  width?: number | string;
  height?: number | string;
  title: string;
  type?: 'confirm' | 'alert' | 'none';
  children: React.ReactNode;
  onConfirm?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  width = 400,
  height = 'auto',
  title,
  type = 'alert',
  children,
  onConfirm,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="custom-modal-title"
      aria-describedby="custom-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: width,
          height: height,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="custom-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box id="custom-modal-description" sx={{ mb: 2 }}>
          {children}
        </Box>
        {
          type != 'none' &&
          <Box display="flex" justifyContent="flex-end" gap={2}>
            {type === 'confirm' && (
              <Button variant="contained" color="primary" onClick={onConfirm}>
                Xác nhận
              </Button>
            )}
            <Button variant="outlined" onClick={onClose}>
              Đóng
            </Button>
          </Box>
        }

      </Box>
    </Modal>
  );
};

export default CustomModal;
