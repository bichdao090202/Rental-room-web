import React from 'react';

import { Container, Typography, Grid, Box, Button, Stack, CircularProgress, Modal, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';

const base64ToFile = (base64: string, filename: string): File => {
  const base64Content = base64.split(',')[1] || base64;
  
  try {
    const byteCharacters = atob(base64Content);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteNumbers], { type: 'application/pdf' });
    return new File([blob], filename, { type: 'application/pdf' });
  } catch (error) {
    console.error('Error converting base64 to File:', error);
    throw error;
  }
};


const openPdfInNewTab = (file: File) => {
  const fileUrl = URL.createObjectURL(file);
  const a = document.createElement('a');  
  a.href = fileUrl;
  a.download = file.name;  
  document.body.appendChild(a); 
  a.click();  
  document.body.removeChild(a);
  const newTab = window.open(fileUrl, '_blank');
  if (newTab) {
    newTab.focus();
  }
  setTimeout(() => URL.revokeObjectURL(fileUrl), 100);
};

interface PdfViewerButtonProps {
  fileBase64: string;
  filename: string;
}

const OpenPdfButton: React.FC<PdfViewerButtonProps> = ({ fileBase64, filename }) => {
  const handleClick = () => {
    try {
      console.log(fileBase64);
      const file = base64ToFile(fileBase64, filename);
      openPdfInNewTab(file);
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Có lỗi xảy ra khi xử lý file PDF. Vui lòng thử lại.');
    }
  };

  return (
    <Button onClick={handleClick} variant="contained" color="success">
      Xem PDF
    </Button>
  );
};

export default OpenPdfButton;