// components/PdfUploader.tsx
'use client'
import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';

const PdfUploader: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); 

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; 

    if (file) {
      const url = URL.createObjectURL(file); 
      setPdfUrl(url);
    }
  };

  const handleOpenPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank'); // Mở file PDF trong tab mới
    }
  };

  return (
    <div>
      <input
        accept="application/pdf"
        style={{ display: 'none' }} // Ẩn input file
        id="file-upload"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button variant="contained" component="span" color="primary">
          Chọn File PDF
        </Button>
      </label>

      {pdfUrl && (
        <div style={{ marginTop: '16px' }}>
          <Typography variant="body1">
            Đã chọn: {pdfUrl.split('/').pop()}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenPdf}
          >
            Xem
          </Button>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
