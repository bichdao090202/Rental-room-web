"use client"
import React, { useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Button } from '@mui/material';
import VpnKeyRounded from '@mui/icons-material/VpnKeyRounded';
import CustomFormControl from "@/common/components/FormControl";
import Box from "@mui/material/Box";
import axios from 'axios';

interface FormInputs {
    username: string;
    password: string;
}

const MyForm: React.FC = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>();

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        console.log(data);
    };

    useEffect(() => {
        const fetchBookingRequests = async () => {
            try {
              const response = await axios.get(`http://ec2-13-236-165-0.ap-southeast-2.compute.amazonaws.com:3006/api/v1/booking-requests`);
                // const result = res.data;
                console.log(response);                
                
            } catch (error) {
                console.error('Error fetching booking requests:', error);
            } 
        };
        fetchBookingRequests();
      }, []);

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
