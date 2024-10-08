// components/ContractCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Grid, Chip, Divider } from '@mui/material';
import { Contract } from '@/types';


interface ContractCardProps {
  contract: Contract;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract }) => {
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">{contract.name}</Typography>
        <Typography variant="body2">Status: {contract.status}</Typography>
        <Typography variant="body2">Rental Duration: {contract.rentalDuration} months</Typography>
        <Typography variant="body2">Price: {contract.price} VND</Typography>
        <Typography variant="body2">Deposit: {contract.deposit} VND</Typography>

        {contract.chargeableServices && (
          <>
            <Divider sx={{ marginY: 1 }} />
            <Typography variant="subtitle1">Chargeable Services:</Typography>
            {contract.chargeableServices.map((service, index) => (
              <Chip
                key={index}
                label={`${service.name}: ${service.price} VND`}
                variant="outlined"
                sx={{ marginRight: 0.5 }}
              />
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractCard;
