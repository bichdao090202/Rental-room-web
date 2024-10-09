'use client'
import React from 'react';
import { Card, CardHeader, CardContent, CardActions, Typography, Box, Avatar, Button } from '@mui/material';

interface HeadCell {
    id: string;
    label: string;
    render?: (value: any) => React.ReactNode;
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

const SmallCard: React.FC<SmallCardProps> = ({ dataSource, headCells, onButtonClick }) => {
    return (
        <Card sx={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', border: '1px solid', borderColor:'gray', paddingX: '10px', paddingY:'5px' }}>
            {dataSource.image && (
                <Avatar
                    src={dataSource.image}
                    alt="Image"
                    variant="square"
                    sx={{ width: 150, height: '100%', objectFit: 'cover' }}
                />
            )}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', pl: 2 }}>
                <Typography variant="h5" sx={{ mb: 1, textAlign: 'left' }}>{dataSource.title}</Typography>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 0 }}>
                    {headCells.map((cell) => (
                        cell.render ? "" :
                            <Box key={cell.id} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>{cell.label}:</Typography>
                                <Typography variant="body2">
                                    {dataSource[cell.id]}
                                </Typography>
                            </Box>
                    ))}
                </CardContent>
            </Box>
            <CardActions sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                {headCells.map((cell) => (
                    <Box key={cell.id} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                        {cell.render ? cell.render(dataSource[cell.id]) : ""}
                    </Box>
                ))}
            </CardActions>
        </Card>
    );
};

export default SmallCard;
