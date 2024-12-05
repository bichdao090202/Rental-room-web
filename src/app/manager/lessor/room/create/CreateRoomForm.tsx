'use client'

import React, { useState } from 'react';
import { Box, Button, TextField, Select, MenuItem, Typography, Paper, Grid, IconButton, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Preview as PreviewIcon } from '@mui/icons-material';
import AddressSelector from '@/component/AddressSelector';
import 'draft-js/dist/Draft.css';
import { useSession } from 'next-auth/react';
import { post } from '@/common/store/base.service';
import { useRouter } from 'next/navigation';
import { ReactSortable } from 'react-sortablejs';


interface Service {
    name: string;
    price: number;
    description: string;
}

interface BorrowedItem {
    name: string;
    price: number;
}

interface ImageFile {
    id: number;
    file_name: string;
    file_base64: string;
}

interface RoomFormData {
    title: string;
    acreage: number | '';
    price: number | '';
    description: string;
    owner_id: number;
    max_people: number | '';
    room_type: number;
    deposit: number | '';
    services: Service[];
    images: ImageFile[];
    ward_id: number | null;
    address_detail: string;
    borrowed_items: BorrowedItem[];
    date_submitted?: string;
}

export const ROOM_TYPES = [
    { id: 1, name: 'Căn hộ' },
    { id: 2, name: 'Ký túc xá' },
    { id: 3, name: 'Sleep box' },
];

export function getRoomTypeNameById(id: number): string {
    const roomType = ROOM_TYPES.find(room => room.id === id);
    return roomType ? roomType.name : "Chưa xác định";
}

const CreateRoomForm: React.FC = () => {
    const { data: session } = useSession();

    const defaultFormData1: RoomFormData = {
        title: 'Phòng trọ tiện nghi trung tâm thành phố',
        acreage: 25,
        price: 3000000,
        description: 'Phòng sạch sẽ, thoáng mát, gần chợ và trường học. Thích hợp cho sinh viên và người đi làm.',
        owner_id: session?.user?.id ? Number(session.user.id) : 0,
        max_people: 3,
        room_type: 1,
        deposit: 1000000,
        services: [
            { name: 'Wi-Fi', price: 100000, description: 'Internet tốc độ cao' },
            { name: 'Giữ xe', price: 50000, description: 'Phí giữ xe máy' },
            { name: 'Vệ sinh', price: 20000, description: 'Dịch vụ dọn vệ sinh hàng tuần' },
        ],
        images: [],
        ward_id: 1,
        address_detail: '123 Đường Nguyễn Văn Cừ, Quận 5, TP.HCM',
        borrowed_items: [
            { name: 'Giường', price: 500000 },
            { name: 'Tủ quần áo', price: 300000 },
            { name: 'Bàn học', price: 100000 },
        ],
        // date_submitted: new Date().toISOString().split('T')[0],
    };

    const defaultFormData2: RoomFormData = {
        title: '',
        acreage: '',
        price: '',
        description: '',
        owner_id: session?.user?.id ? Number(session.user.id) : 0,
        max_people: '',
        room_type: 1,
        deposit: '',
        services: [],
        images: [],
        ward_id: null,
        address_detail: '',
        borrowed_items: [],
        date_submitted: new Date().toISOString().split('T')[0],
    };

    const [formData, setFormData] = useState<RoomFormData>(defaultFormData1);

    const [newService, setNewService] = useState<Service>({
        name: '',
        price: 0,
        description: '',
    });

    const [newBorrowedItem, setNewBorrowedItem] = useState<BorrowedItem>({
        name: '',
        price: 0,
    });

    const [selectedLocation, setSelectedLocation] = useState<{
        province_id: number | null;
        district_id: number | null;
        ward_id: number | null
    }>({
        province_id: null,
        district_id: null,
        ward_id: null,
    });

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value === '' ? '' : Number(value),
        }));
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value.replace(/\n/g, '\\n');
        setFormData((prev) => ({
            ...prev,
            description: value,
        }));
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            title: e.target.value,
        }));
    }

    const handleAddressDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            address_detail: e.target.value,
        }));
    }

    const handleAddService = () => {
        if (newService.name && newService.description) {
            setFormData((prev) => ({
                ...prev,
                services: [...prev.services, newService],
            }));
            setNewService({
                name: '',
                price: 0,
                description: '',
            });
        }
    };

    const handleDeleteService = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            services: prev.services.filter((_, i) => i !== index),
        }));
    };

    const handleAddBorrowedItem = () => {
        if (newBorrowedItem.name) {
            setFormData((prev) => ({
                ...prev,
                borrowed_items: [...prev.borrowed_items, newBorrowedItem],
            }));
            setNewBorrowedItem({
                name: '',
                price: 0,
            });
        }
    };

    const handleDeleteBorrowedItem = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            borrowed_items: prev.borrowed_items.filter((_, i) => i !== index),
        }));
    };
    let nextId = 0;
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        const imagePromises = files.map(file => {
            return new Promise<ImageFile>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        id: nextId++,
                        file_name: file.name,
                        file_base64: (reader.result as string).split(',')[1]
                    });
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(imagePromises).then(imageFiles => {
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...imageFiles],
            }));
        });
    };

    const handleDeleteImage = (id: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(image => image.id !== id), // Loại bỏ ảnh có id tương ứng
        }));
    };
    

    const handleLocationChange = (location: {
        province_id: number | null;
        district_id: number | null;
        ward_id: number | null
    }) => {
        setSelectedLocation(location);
        setFormData((prev) => ({
            ...prev,
            ward_id: location.ward_id,
        }));
    };

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);

        const res = await post('rooms', formData);
        if (res.status == "SUCCESS") {
            alert("Tạo phòng thành công");
            router.push(`/room/${res.data.id}`);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            <Typography variant="h4">Tạo Phòng</Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField label="Tiêu đề" fullWidth name="title" value={formData.title} spellCheck={false}
                        onChange={handleTitleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Diện tích (m²)" name="acreage" type="number" value={formData.acreage}
                        onChange={handleTextChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Giá (VNĐ)" name="price" type="number" value={formData.price}
                        onChange={handleTextChange} />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth label="Mô tả" name="description" multiline rows={4} value={formData.description.replace(/\\n/g, '\n')} spellCheck={false}
                        onChange={handleDescriptionChange} />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Địa chỉ</Typography>
                    <AddressSelector onLocationChange={handleLocationChange} />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Địa chỉ chi tiết"
                        name="address_detail"
                        value={formData.address_detail}
                        onChange={handleAddressDetailChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Người ở tối đa" name="max_people" type="number" value={formData.max_people}
                        onChange={handleTextChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Loại phòng</InputLabel>
                        <Select name="room_type" label="Loại phòng" value={formData.room_type}
                            onChange={(e) => handleTextChange(e as any)}>
                            {ROOM_TYPES.map((type) => (
                                <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth label="Tiền cọc" name="deposit" type="number" value={formData.deposit} onChange={handleTextChange} />
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Dịch vụ tính phí</Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth label="Tên dịch vụ" value={newService.name}
                                    onChange={(e) => setNewService({ ...newService, name: e.target.value })} />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField fullWidth label="Giá" type="number" value={newService.price}
                                    onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth label="Đơn vị" value={newService.description}
                                    onChange={(e) => setNewService({ ...newService, description: e.target.value })} />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button fullWidth variant="contained" startIcon={<AddIcon />}
                                    onClick={handleAddService}>Thêm</Button>
                            </Grid>
                        </Grid>
                        <TableContainer sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tên</TableCell>
                                        <TableCell>Giá</TableCell>
                                        <TableCell>Đơn vị</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formData.services.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">Chưa có</TableCell>
                                        </TableRow>)
                                        :
                                        (
                                            formData.services.map((service, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{service.name}</TableCell>
                                                    <TableCell>{service.price}</TableCell>
                                                    <TableCell>{service.description}</TableCell>
                                                    <TableCell>
                                                        <IconButton onClick={() => handleDeleteService(index)}><DeleteIcon /></IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Tài sản đi kèm</Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={5}>
                                <TextField fullWidth label="Tên tài sản" value={newBorrowedItem.name}
                                    onChange={(e) => setNewBorrowedItem({ ...newBorrowedItem, name: e.target.value })} />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField fullWidth label="Giá trị" type="number" value={newBorrowedItem.price}
                                    onChange={(e) => setNewBorrowedItem({ ...newBorrowedItem, price: Number(e.target.value) })} />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={handleAddBorrowedItem}>Thêm</Button>
                            </Grid>
                        </Grid>
                        <TableContainer sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tài sản</TableCell>
                                        <TableCell>Giá trị</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formData.borrowed_items.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">Chưa có</TableCell>
                                        </TableRow>
                                    ) : (
                                        formData.borrowed_items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.price}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleDeleteBorrowedItem(index)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
    <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
            Hình ảnh
        </Typography>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                >
                    Chọn ảnh
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                    />
                </Button>
            </Grid>
            {formData.images.length > 0 && (
                <Grid item xs={12}>
                    <ReactSortable
                        list={formData.images.map((img, index) => ({
                            id: img.id, 
                            file_name: img.file_name,
                            file_base64: img.file_base64
                        }))}
                        setList={(newList) => {
                            setFormData(prev => ({
                                ...prev,
                                images: newList.map((item: { id: number; file_name: string; file_base64: string }) => ({
                                    id: item.id, 
                                    file_name: item.file_name,
                                    file_base64: item.file_base64
                                }))
                            }));
                        }}
                        style={{ display: 'flex', flexWrap: 'wrap' }}
                        animation={200}  
                    >
                        {formData.images.map((image, index) => (
                            <Grid item xs={4} key={index} sx={{ position: 'relative', p: 1 }}>
                                <img
                                    src={`data:image/jpeg;base64,${image.file_base64}`}
                                    alt={`Uploaded ${image.file_name}`}
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                    }}
                                />
                                {/* Nút xoá hình ảnh */}
                                <IconButton
                                    onClick={() => handleDeleteImage(image.id)}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        ))}
                    </ReactSortable>
                </Grid>
            )}
        </Grid>
    </Paper>
</Grid>


                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                    // onClick={() => setIsPreviewOpen(true)}
                    >
                        Hủy
                    </Button>

                    <Button variant='contained' onClick={handleSubmit}>
                        Tạo phòng
                    </Button>
                </Box>

            </Grid>
        </Box>
    );

}
export default CreateRoomForm;