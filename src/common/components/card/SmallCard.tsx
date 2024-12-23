'use client'
import React from 'react';
import { Card, CardHeader, CardContent, CardActions, Typography, Box, Avatar, Button } from '@mui/material';
import { formatCurrency, formatDay } from '@/common/utils/helpers';

export interface HeadCell {
    id: string;
    label: string;
    render?: (value: any) => React.ReactNode;
    type?: 'string' | 'number' | 'date' | 'render' | 'money';
}

interface SmallCardProps {
    dataSource: {
        image?: string;
        title: string;
        [key: string]: any;
    };
    headCells: HeadCell[];
    onButtonClick?: (actionType: string) => void;
}

const formatValue = (value:any) => {
    if (typeof value === 'number') {
      return value.toString();
    } else if (value instanceof Date) {
      return formatDay( value);
    } else if (typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return formatDay(date);
      }
      return value;
    }
    return String(value);
  };

const SmallCard: React.FC<SmallCardProps> = ({ dataSource, headCells, onButtonClick }) => {
    return (
        <Card sx={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', border: '1px solid', borderColor: 'gray', paddingX: '10px', paddingY: '5px' }}>
            {dataSource.image && (
                <Avatar
                    src={dataSource.image}
                    alt="Image"
                    variant="square"
                    sx={{ width: '20%', minWidth: '150px', height: '100%', objectFit: 'cover' }}
                />
            )}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', pl: 2 }}>
                <Typography variant="h6" sx={{ mb: 1, textAlign: 'left', fontWeight:'bold' }}>{dataSource.title}</Typography>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 0 }}>
                    {headCells.map((cell) => (
                        cell.label=='Action' ? "" :
                            <Box key={cell.id} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <Typography variant="body2" sx={{ mr: 1 }}>
                                    <b>{cell.label + ': '}  </b>

                                    {!cell.type  && formatValue(dataSource[cell.id])}

                                    {
                                        cell.type === 'money' && formatCurrency(dataSource[cell.id])
                                    }
                                    
                                    {
                                        cell.type === 'date' && formatDay(dataSource[cell.id])
                                    }

                                    {
                                        cell.type === 'render' && cell.render && cell.render(dataSource)
                                    }
                
                                </Typography>
                                <Typography variant="body2">
                                </Typography>
                            </Box>
                    ))}
                </CardContent>
            </Box>
            <CardActions sx={{ display: 'flex', flexDirection: 'column', width: '20%', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                {headCells.map((cell) => (
                    <Box key={cell.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                        {cell.render && cell.type!='render' ? cell.render(dataSource) : ""}
                    </Box>
                ))}
            </CardActions>
        </Card>
    );
};

export default SmallCard;
