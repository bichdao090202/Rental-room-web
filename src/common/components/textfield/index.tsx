'use client';

import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';

export interface IInput {
    className?: string;
    title: string;
    required?: boolean;
    refs?: any;
    type?: string;
    multiline?: boolean;
    rows?: number;
}

const Input: React.FC<IInput> =({ className, title, required, refs, type, multiline, rows, }) => {
    return (
        <Box className="pr-2">
            <Typography variant="h3">
                <b>{title}</b>
            </Typography>

            <TextField
                className={className}
                variant="outlined"
                placeholder={title}
                fullWidth
                required={required}
                {...refs}
                type={type}
                multiline={multiline}
                rows={rows}
            />
        </Box>
    );
};

export default Input;