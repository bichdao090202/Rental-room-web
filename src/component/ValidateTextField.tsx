"use client"

import React, { useId, useState } from 'react';
import { FormControl, FormHelperText, TextField, TextFieldProps } from "@mui/material";

export interface ValidateTextFieldProps extends TextFieldProps<'outlined'> {
  type: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
  error?: boolean;
  endadornment?: React.ReactNode;
  errorText?: string;
}

export function ValidateTextField({ type, name, label, placeholder, value, onChange, required, error, errorText, ...props }: ValidateTextFieldProps) {
  const id = useId();
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
      <TextField
        id={id}
        type={type}
        name={name}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        onBlur={handleBlur}
        error={touched && error}
        aria-describedby={id}
        {...props}
      />
      <FormHelperText sx={{ color: 'red' }} id={id}>{touched && error ? (errorText ?? 'Error') : ''}</FormHelperText>
    </FormControl>
  )
}