import React, { useState, useEffect } from 'react';
import { 
  Container, 
  TextField, 
  Select, 
  MenuItem, 
  Button, 
  Grid, 
  Typography, 
  Link,
  SelectChangeEvent
} from '@mui/material';

interface BankOption {
  bank_code: string;
  bank_name: string;
}

interface ProductType {
  key: string;
  value: string;
}

interface VNPayFormProps {
  contentPaymentDefault: string;
  productTypeList: ProductType[];
  bankList: BankOption[];
}

const VNPayForm: React.FC<VNPayFormProps> = (
//   { 
//   contentPaymentDefault, 
//   productTypeList, 
//   bankList 
// }
) => {
  const [amount, setAmount] = useState<string>('10000');
  const [contentPayment, setContentPayment] = useState<string>("contentPaymentDefault");
  const [productType, setProductType] = useState<string>('other');
  const [bankCode, setBankCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('vi');
  const [paymentUrl, setPaymentUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, isRedirect: boolean) => {
    e.preventDefault();
    const formData = {
      amountInput: amount,
      contentPayment,
      productTypeSelect: productType,
      bankSelect: bankCode,
      langSelect: language,
    };

    try {
      const response = await fetch(isRedirect ? '/' : '/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (isRedirect) {
        // Redirect to the payment URL
        window.location.href = await response.text();
      } else {
        // Set the payment URL for display
        const data = await response.json();
        setPaymentUrl(data.url);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <form onSubmit={(e) => handleSubmit(e, true)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Số tiền"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nội dung thanh toán"
              multiline
              rows={3}
              value={contentPayment}
              onChange={(e) => setContentPayment(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Select
              fullWidth
              value={productType}
              onChange={(e: SelectChangeEvent) => setProductType(e.target.value)}
              displayEmpty
            >
              <MenuItem value="other">Khác</MenuItem>
              
              {/* {productTypeList.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.key}
                </MenuItem>
              ))} */}
            </Select>
          </Grid>
          <Grid item xs={12} md={4}>
            <Select
              fullWidth
              value={bankCode}
              onChange={(e: SelectChangeEvent) => setBankCode(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Không chọn</MenuItem>
              {/* {bankList.map((bank) => (
                <MenuItem key={bank.bank_code} value={bank.bank_code}>
                  {bank.bank_code} - {bank.bank_name}
                </MenuItem>
              ))} */}
            </Select>
          </Grid>
          <Grid item xs={12} md={4}>
            <Select
              fullWidth
              value={language}
              onChange={(e: SelectChangeEvent) => setLanguage(e.target.value)}
            >
              <MenuItem value="vi">Tiếng Việt</MenuItem>
              <MenuItem value="en">English</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={(e) => handleSubmit(e as any, false)}
            >
              Tạo URL
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button fullWidth variant="contained" color="secondary" type="submit">
              Thanh toán redirect
            </Button>
          </Grid>
        </Grid>
      </form>

      {paymentUrl && (
        <Typography variant="body1" style={{ marginTop: '2rem' }}>
          <Link href={paymentUrl} target="_blank" rel="noopener noreferrer">
            {paymentUrl}
          </Link>
        </Typography>
      )}
    </Container>
  );
};

export default VNPayForm;