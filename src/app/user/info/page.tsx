'use client'

import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Avatar,
    Grid,
    Paper,
    IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { getSession } from 'next-auth/react';
import axios from 'axios';

interface UserData {
    email: string;
    full_name: string;
    id: number;
    identity_number: string;
    img_url: string;
    phone: string;
}

const Input = styled('input')({
    display: 'none',
});

export default function Home() {
    const [user, setUser] = useState<UserData | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState<UserData | null>(null);
    const [previewImage, setPreviewImage] = useState<string>('');

    const fetchUser = async () => {
        const session = await getSession();
        if (!session) return;
        try {
            const response = await axios.get(`http://54.253.233.87:3006/api/v1/users/${session.user.id}`, {
                headers: {
                    Authorization: `${session.accessToken}`
                }
            });
            const userData: UserData = response.data.data;
            console.log(userData);
            setUser(userData);
            setEditedUser(userData);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditMode(false);
        setEditedUser(user);
        setPreviewImage('');
    };

    const handleSave = async () => {
        try {
            // Implement API call to save user data
            setUser(editedUser);
            setEditMode(false);
            // Reset preview image after successful save
            if (previewImage) {
                // Update user's img_url with the new image URL after upload
            }
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!user || !editedUser) return null;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1">
                        Thông tin cá nhân
                    </Typography>
                    {!editMode ? (
                        <Button
                            startIcon={<EditIcon />}
                            variant="contained"
                            onClick={handleEdit}
                        >
                            Chỉnh sửa
                        </Button>
                    ) : (
                        <Box>
                            <Button
                                startIcon={<SaveIcon />}
                                variant="contained"
                                onClick={handleSave}
                                sx={{ mr: 1 }}
                            >
                                Lưu
                            </Button>
                            <Button
                                startIcon={<CancelIcon />}
                                variant="outlined"
                                onClick={handleCancel}
                            >
                                Hủy
                            </Button>
                        </Box>
                    )}
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <Avatar
                                src={previewImage || editedUser.img_url || '/placeholder.jpg'}
                                sx={{ width: 200, height: 200, mb: 2 }}
                            />
                            {editMode && (
                                <label htmlFor="icon-button-file">
                                    <Input
                                        accept="image/*"
                                        id="icon-button-file"
                                        type="file"
                                        onChange={handleImageChange}
                                    />
                                    <IconButton
                                        color="primary"
                                        aria-label="upload picture"
                                        component="span"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 20,
                                            right: 0,
                                            backgroundColor: 'white',
                                            '&:hover': { backgroundColor: '#f5f5f5' },
                                        }}
                                    >
                                        <PhotoCamera />
                                    </IconButton>
                                </label>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Họ và tên"
                                    name="full_name"
                                    value={editedUser.full_name}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={editedUser.email}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Số điện thoại"
                                    name="phone"
                                    value={editedUser.phone}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="CMND/CCCD"
                                    name="identity_number"
                                    value={editedUser.identity_number}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}