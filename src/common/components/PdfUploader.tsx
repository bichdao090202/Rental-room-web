'use client'
import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';

interface PdfUploaderProps {
  onFileSelect: (file: File | null) => void;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ onFileSelect }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      onFileSelect(file); 
    } else {
      onFileSelect(null); 
    }
  };

  const handleOpenPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <div>
      <input
        accept="application/pdf"
        style={{ display: 'none' }}
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
          <Button variant="contained" color="primary" onClick={handleOpenPdf}>
            Xem
          </Button>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
