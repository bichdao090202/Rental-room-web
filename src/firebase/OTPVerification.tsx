import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container, 
  InputAdornment 
} from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { handleVertifi } from './firebaseService'; // Đảm bảo import từ file của bạn

interface OTPVerificationProps {
  onVerificationComplete: (verificationId: string) => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ onVerificationComplete }) => {
  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendOTP = async () => {
    if (!phone || phone.length < 10) {
      alert('Vui lòng nhập số điện thoại hợp lệ');
      return;
    }

    setIsLoading(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+84${phone.replace(/^0/, '')}`;
      const confirmation = await handleVertifi(formattedPhone);
      
      if (confirmation) {
        setVerificationId(confirmation.verificationId);
        alert('Mã OTP đã được gửi');
      }
    } catch (error) {
      console.error('Lỗi gửi OTP:', error);
      alert('Không thể gửi mã OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!verificationId || otp.length !== 6) {
      alert('Vui lòng nhập đúng mã OTP 6 số');
      return;
    }

    try {
      // Giả sử onVerificationComplete sẽ xử lý việc xác thực cuối cùng
      onVerificationComplete(verificationId);
    } catch (error) {
      console.error('Lỗi xác thực OTP:', error);
      alert('Mã OTP không đúng');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box 
        sx={{ 
          marginTop: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <Typography component="h1" variant="h5">
          Xác Thực Số Điện Thoại
        </Typography>
        
        <Box sx={{ width: '100%', mt: 3 }}>
          <TextField
            fullWidth
            label="Số điện thoại"
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIphoneIcon />
                </InputAdornment>
              )
            }}
            placeholder="Nhập số điện thoại"
            sx={{ mb: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={sendOTP}
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
          </Button>

          {verificationId && (
            <>
              <TextField
                fullWidth
                label="Nhập mã OTP"
                variant="outlined"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputProps={{ maxLength: 6 }}
                placeholder="Nhập mã 6 số"
                sx={{ mb: 2 }}
              />

              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={verifyOTP}
              >
                Xác Thực
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Placeholder cho reCAPTCHA */}
      <div id="recaptcha" style={{ display: 'none' }}></div>
    </Container>
  );
};

export default OTPVerification;