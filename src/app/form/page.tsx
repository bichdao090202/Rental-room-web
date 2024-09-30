"use client"
import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Button } from '@mui/material';
import VpnKeyRounded from '@mui/icons-material/VpnKeyRounded';
import CustomFormControl from "@/common/components/form_control";
import Box from "@mui/material/Box";

interface FormInputs {
    username: string;
    password: string;
}

const MyForm: React.FC = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>();

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        console.log(data);
    };

    return (
        <Box className="max-w-lg mx-auto p-8 pt-5 bg-white rounded-lg border border-gray-300 shadow-xl space-y-5" component="form" onSubmit={handleSubmit(onSubmit)}>
                <CustomFormControl
                    name="username"
                    control={control}
                    label="Username"
                    placeholder="Enter your username"
                    error={errors.username}
                />

                <CustomFormControl
                    name="password"
                    control={control}
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    startAdornment={<VpnKeyRounded/>}
                    error={errors.password}
                />

                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
        </Box>
    );
};

export default MyForm;
