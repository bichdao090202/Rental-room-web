import React from 'react';
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    Typography,
} from '@mui/material';
import { Controller, Control, FieldError } from 'react-hook-form';

interface CustomFormControlProps {
    name: string;
    control: Control<any>;
    label: string;
    error?: FieldError | undefined;
    startAdornment?: React.ReactNode;
    placeholder?: string;
    [key: string]: any;
}

const CustomFormControl: React.FC<CustomFormControlProps> = ({
                                                                 name,
                                                                 control,
                                                                 label,
                                                                 error,
                                                                 startAdornment,
                                                                 placeholder,
                                                                 ...rest
                                                             }) => {
    return (
        <FormControl fullWidth variant="outlined" error={!!error}>
            <InputLabel htmlFor={name}>{label}</InputLabel>
            <Controller
                name={name}
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <OutlinedInput
                        {...field}
                        id={name}
                        label={label}
                        placeholder={placeholder}
                        startAdornment={startAdornment && (
                            <InputAdornment position="start">
                                {startAdornment}
                            </InputAdornment>
                        )}
                        {...rest}
                    />
                )}
            />
            {error && (
                <Typography color="error" variant="caption">
                    {error.message}
                </Typography>
            )}
        </FormControl>
    );
};

export default CustomFormControl;
