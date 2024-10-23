'use client'
import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box, Tooltip, IconButton } from '@mui/material';
import SmallCard from '@/common/components/card/SmallCard';
import { EditNoteRounded, Padding } from '@mui/icons-material';
import CustomButton from '@/common/components/CustomButton';

export default function Page() {
  const dataSource = {
    image: 'https://via.placeholder.com/150',
    title: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
  };
  
  const headCells = [
    { id: 'firstName', label: 'First Name' },
    { id: 'lastName', label: 'Last Name' },
    {
      id: 'action', label: 'Action', sortable: false,
      render: () => (true ? (
        <Button>Update</Button>
      ) : "")
    }
  ];
  
  const handleButtonClick = (actionType: string) => {
    console.log(`Action performed: ${actionType}`);
  };
  
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', width: '70vw' }}>
      <Typography variant="h4">Danh sách yêu cầu thuê</Typography>

      <SmallCard dataSource={dataSource} headCells={headCells} onButtonClick={handleButtonClick} />
    </Container>
  );
};
