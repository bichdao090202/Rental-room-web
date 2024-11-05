// interface Service {
//     name: string;
//     price: number;
//     description: string;
//     unit: string;
// }

// interface Asset {
//     name: string;
//     price: number;
//     quantity: number;
//     required: boolean;
// }

// interface RoomFormData {
//     acreage: number;
//     price: number;
//     description: string;
//     max_people: number;
//     room_type: number;
//     deposit: number;
//     services: Service[];
//     assets: Asset[];
//     mainImage: File | null;
//     subImages: File[];
//     address_id: string;
// }

// 'use client'

// import React, { useState } from 'react';
// import {
//     Box,
//     Button,
//     TextField,
//     Select,
//     MenuItem,
//     Typography,
//     Paper,
//     Grid,
//     IconButton,
//     FormControl,
//     InputLabel,
//     Card,
//     CardContent,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Divider,
// } from '@mui/material';
// import { Add as AddIcon, Delete as DeleteIcon, Preview as PreviewIcon } from '@mui/icons-material';
// import AddressSelector from '@/component/AddressSelector';


// const ROOM_TYPES = [
//     { id: 1, name: 'Căn hộ' },
//     { id: 2, name: 'Ký túc xá' },
//     { id: 3, name: 'Sleep box' },
// ];

// const CreateRoomForm: React.FC = () => {
//     const [formData, setFormData] = useState<RoomFormData>({
//         acreage: 0,
//         price: 0,
//         description: '',
//         max_people: 1,
//         room_type: 1,
//         deposit: 0,
//         services: [],
//         assets: [],
//         mainImage: null,
//         subImages: [],
//         address_id: '',
//     });

//     const [newService, setNewService] = useState<Service>({
//         name: '',
//         price: 0,
//         description: '',
//         unit: '',
//     });

//     const [newAsset, setNewAsset] = useState<Asset>({
//         name: '',
//         price: 0,
//         quantity: 1,
//         required: false,
//     });

//     const [isPreviewOpen, setIsPreviewOpen] = useState(false);

//     const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//         const value = e.target.value.replace(/\n/g, '\\n');
//         setFormData((prev) => ({
//             ...prev,
//             description: value,
//         }));
//     };

//     const handleAddService = () => {
//         if (newService.name && newService.description) {
//             setFormData((prev) => ({
//                 ...prev,
//                 services: [...prev.services, newService],
//             }));
//             setNewService({
//                 name: '',
//                 price: 0,
//                 description: '',
//                 unit: '',
//             });
//         }
//     };

//     const handleDeleteService = (index: number) => {
//         setFormData((prev) => ({
//             ...prev,
//             services: prev.services.filter((_, i) => i !== index),
//         }));
//     };

//     const handleAddAsset = () => {
//         if (newAsset.name) {
//             setFormData((prev) => ({
//                 ...prev,
//                 assets: [...prev.assets, newAsset],
//             }));
//             setNewAsset({
//                 name: '',
//                 price: 0,
//                 quantity: 1,
//                 required: false,
//             });
//         }
//     };

//     const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
//         const files = Array.from(e.target.files || []);
//         if (isMain && files.length > 0) {
//             setFormData((prev) => ({
//                 ...prev,
//                 mainImage: files[0],
//             }));
//         } else {
//             setFormData((prev) => ({
//                 ...prev,
//                 subImages: [...prev.subImages, ...files],
//             }));
//         }
//     };

//     const handleAddressChange = (addressId: string) => {
//         setFormData((prev) => ({
//             ...prev,
//             address_id: addressId,
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         console.log(formData);
//     };

//     return (
//         <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
//             <Typography variant="h4">Tạo Phòng</Typography>
//             <Divider sx={{ my: 2 }} />

//             <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                     <TextField
//                         fullWidth
//                         label="Diện tích (m²)"
//                         name="acreage"
//                         type="number"
//                         value={formData.acreage}
//                         onChange={handleTextChange}
//                     />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                     <TextField
//                         fullWidth
//                         label="Giá (VNĐ)"
//                         name="price"
//                         type="number"
//                         value={formData.price}
//                         onChange={handleTextChange}
//                     />
//                 </Grid>

//                 <Grid item xs={12}>
//                     <TextField label="Tiêu đề" fullWidth />
//                 </Grid>

//                 <Grid item xs={12}>
//                     <TextField
//                         fullWidth
//                         label="Mô tả"
//                         name="description"
//                         multiline
//                         rows={4}
//                         value={formData.description.replace(/\\n/g, '\n')}
//                         onChange={handleDescriptionChange}
//                     />
//                 </Grid>

//                 <Grid item xs={12}>
//                     <Typography variant="h6" gutterBottom>
//                         Địa chỉ
//                     </Typography>
//                     <AddressSelector />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                     <TextField
//                         fullWidth
//                         label="Người ở tối đa"
//                         name="max_people"
//                         type="number"
//                         value={formData.max_people}
//                         onChange={handleTextChange}
//                     />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                     <FormControl fullWidth>
//                         <InputLabel>Loại phòng</InputLabel>
//                         <Select
//                             name="room_type"
//                             label="Loại phòng"
//                             value={formData.room_type}
//                             onChange={(e) => handleTextChange(e as any)}
//                         >
//                             {ROOM_TYPES.map((type) => (
//                                 <MenuItem key={type.id} value={type.id}>
//                                     {type.name}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>

//                 <Grid item xs={12}>
//                     <TextField
//                         fullWidth
//                         label="Tiền cọc"
//                         name="deposit"
//                         type="number"
//                         value={formData.deposit}
//                         onChange={handleTextChange}
//                     />
//                 </Grid>

//                 <Grid item xs={12}>
//                     <Paper sx={{ p: 2 }}>
//                         <Typography variant="h6" gutterBottom>
//                             Dịch vụ tính phí
//                         </Typography>
//                         <Grid container spacing={2}>
//                             <Grid item xs={12} md={4}>
//                                 <TextField
//                                     fullWidth
//                                     label="Tên (Điện, nước, xe...)"
//                                     value={newService.name}
//                                     onChange={(e) => setNewService({ ...newService, name: e.target.value })}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={2}>
//                                 <TextField
//                                     fullWidth
//                                     label="Giá"
//                                     type="number"
//                                     value={newService.price}
//                                     onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={4}>
//                                 <TextField
//                                     fullWidth
//                                     label="Đơn vị đo (Kwh, chiếc...)"
//                                     value={newService.description}
//                                     onChange={(e) => setNewService({ ...newService, description: e.target.value })}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={2}>
//                                 <Button
//                                     fullWidth
//                                     variant="contained"
//                                     startIcon={<AddIcon />}
//                                     onClick={handleAddService}
//                                 >
//                                     Thêm
//                                 </Button>
//                             </Grid>
//                         </Grid>

//                         <TableContainer sx={{ mt: 2 }}>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>Tên</TableCell>
//                                         <TableCell>Giá</TableCell>
//                                         <TableCell>Đơn vị đo</TableCell>
//                                         <TableCell></TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {formData.services.map((service, index) => (
//                                         <TableRow key={index}>
//                                             <TableCell>{service.name}</TableCell>
//                                             <TableCell>{service.price}</TableCell>
//                                             <TableCell>{service.description}</TableCell>
//                                             <TableCell>
//                                                 <IconButton onClick={() => handleDeleteService(index)}>
//                                                     <DeleteIcon />
//                                                 </IconButton>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </Paper>
//                 </Grid>

//                 <Grid item xs={12}>
//                     <Paper sx={{ p: 2 }}>
//                         <Typography variant="h6" gutterBottom>
//                             Tài sản đi kèm
//                         </Typography>
//                         <Grid container spacing={2}>
//                             <Grid item xs={12} md={5}>
//                                 <TextField
//                                     fullWidth
//                                     label="Tài sản (chìa khóa, tủ, kệ,...)"
//                                     value={newAsset.name}
//                                     onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={2}>
//                                 <TextField
//                                     fullWidth
//                                     label="Giá trị"
//                                     type="number"
//                                     value={newAsset.price}
//                                     onChange={(e) => setNewAsset({ ...newAsset, price: Number(e.target.value) })}
//                                 />
//                             </Grid>
                            
//                             <Grid item xs={12} md={2}>
//                                 <Button
//                                     fullWidth
//                                     variant="contained"
//                                     startIcon={<AddIcon />}
//                                     onClick={handleAddAsset}
//                                 >
//                                     Thêm
//                                 </Button>
//                             </Grid>
//                         </Grid>

//                         <TableContainer sx={{ mt: 2 }}>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>Tài sản</TableCell>
//                                         <TableCell>Giá trị</TableCell>
//                                         <TableCell></TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {formData.assets.map((asset, index) => (
//                                         <TableRow key={index}>
//                                             <TableCell>{asset.name}</TableCell>
//                                             <TableCell>{asset.price}</TableCell>
//                                             <TableCell>
//                                                 <IconButton onClick={() => {
//                                                     setFormData((prev) => ({
//                                                         ...prev,
//                                                         assets: prev.assets.filter((_, i) => i !== index),
//                                                     }));
//                                                 }}>
//                                                     <DeleteIcon />
//                                                 </IconButton>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </Paper>
//                 </Grid>

//                 <Grid item xs={12}>
//                     <Paper sx={{ p: 2 }}>
//                         <Typography variant="h6" gutterBottom>
//                             Hình ảnh
//                         </Typography>
//                         <Grid container spacing={2}>
//                             <Grid item xs={12} md={6}>
//                                 <Button
//                                     variant="contained"
//                                     component="label"
//                                     fullWidth
//                                 >
//                                     Chọn ảnh chính
//                                     <input
//                                         type="file"
//                                         hidden
//                                         accept="image/*"
//                                         onChange={(e) => handleImageUpload(e, true)}
//                                     />
//                                 </Button>
//                                 {formData.mainImage && (
//                                     <Box sx={{ mt: 2 }}>
//                                         <img
//                                             src={URL.createObjectURL(formData.mainImage)}
//                                             alt="Main"
//                                             style={{ maxWidth: '100%', height: '300px' }}
//                                         />
//                                     </Box>
//                                 )}
//                             </Grid>
//                             <Grid item xs={12} md={6}>
//                                 <Button
//                                     variant="contained"
//                                     component="label"
//                                     fullWidth
//                                 >
//                                     Chọn ảnh phụ
//                                     <input
//                                         type="file"
//                                         hidden
//                                         accept="image/*"
//                                         multiple
//                                         onChange={(e) => handleImageUpload(e, false)}
//                                     />
//                                 </Button>
//                                 <Grid container spacing={1} sx={{ mt: 2 }}>
//                                     {formData.subImages.map((image, index) => (
//                                         <Grid item xs={4} key={index}>
//                                             <img
//                                                 src={URL.createObjectURL(image)}
//                                                 alt={`Sub ${index + 1}`}
//                                                 style={{ maxWidth: '100%', height: 'auto' }}
//                                             />
//                                         </Grid>
//                                     ))}
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                     </Paper>
//                 </Grid>
//             </Grid>

//             <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
//                 <Button
//                     variant="outlined"
//                     startIcon={<PreviewIcon />}
//                     onClick={() => setIsPreviewOpen(true)}
//                 >
//                     Preview
//                 </Button>
//             </Box>
//         </Box>
//     )
// }
// export default CreateRoomForm;


interface Service {
    name: string;
    price: number;
    description: string;
    unit: string;
}

interface Asset {
    name: string;
    price: number;
    quantity: number;
    required: boolean;
}

interface RoomFormData {
    acreage: number | '';
    price: number | '';
    description: string;
    max_people: number | '';
    room_type: number;
    deposit: number | '';
    services: Service[];
    assets: Asset[];
    mainImage: File | null;
    subImages: File[];
    address_id: string;
}

'use client'

import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    Typography,
    Paper,
    Grid,
    IconButton,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Preview as PreviewIcon } from '@mui/icons-material';
import AddressSelector from '@/component/AddressSelector';

const ROOM_TYPES = [
    { id: 1, name: 'Căn hộ' },
    { id: 2, name: 'Ký túc xá' },
    { id: 3, name: 'Sleep box' },
];

const CreateRoomForm: React.FC = () => {
    const [formData, setFormData] = useState<RoomFormData>({
        acreage: '',
        price: '',
        description: '',
        max_people: '',
        room_type: 1,
        deposit: '',
        services: [],
        assets: [],
        mainImage: null,
        subImages: [],
        address_id: '',
    });

    const [newService, setNewService] = useState<Service>({
        name: '',
        price: 0,
        description: '',
        unit: '',
    });

    const [newAsset, setNewAsset] = useState<Asset>({
        name: '',
        price: 0,
        quantity: 1,
        required: false,
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
                unit: '',
            });
        }
    };

    const handleDeleteService = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            services: prev.services.filter((_, i) => i !== index),
        }));
    };

    const handleAddAsset = () => {
        if (newAsset.name) {
            setFormData((prev) => ({
                ...prev,
                assets: [...prev.assets, newAsset],
            }));
            setNewAsset({
                name: '',
                price: 0,
                quantity: 1,
                required: false,
            });
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
        const files = Array.from(e.target.files || []);
        if (isMain && files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                mainImage: files[0],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                subImages: [...prev.subImages, ...files],
            }));
        }
    };

    const handleAddressChange = (addressId: string) => {
        setFormData((prev) => ({
            ...prev,
            address_id: addressId,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            <Typography variant="h4">Tạo Phòng</Typography>
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Diện tích (m²)"
                        name="acreage"
                        type="number"
                        value={formData.acreage}
                        onChange={handleTextChange}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Giá (VNĐ)"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleTextChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField label="Tiêu đề" fullWidth />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Mô tả"
                        name="description"
                        multiline
                        rows={4}
                        value={formData.description.replace(/\\n/g, '\n')}
                        onChange={handleDescriptionChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Địa chỉ
                    </Typography>
                    <AddressSelector />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Người ở tối đa"
                        name="max_people"
                        type="number"
                        value={formData.max_people}
                        onChange={handleTextChange}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Loại phòng</InputLabel>
                        <Select
                            name="room_type"
                            label="Loại phòng"
                            value={formData.room_type}
                            onChange={(e) => handleTextChange(e as any)}
                        >
                            {ROOM_TYPES.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                    {type.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Tiền cọc"
                        name="deposit"
                        type="number"
                        value={formData.deposit}
                        onChange={handleTextChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Dịch vụ tính phí
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Tên (Điện, nước, xe...)"
                                    value={newService.name}
                                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    fullWidth
                                    label="Giá"
                                    type="number"
                                    value={newService.price}
                                    onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Đơn vị đo (Kwh, chiếc...)"
                                    value={newService.description}
                                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleAddService}
                                >
                                    Thêm
                                </Button>
                            </Grid>
                        </Grid>

                        <TableContainer sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tên</TableCell>
                                        <TableCell>Giá</TableCell>
                                        <TableCell>Đơn vị đo</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formData.services.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">Chưa có</TableCell>
                                        </TableRow>
                                    ) : (
                                        formData.services.map((service, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{service.name}</TableCell>
                                                <TableCell>{service.price}</TableCell>
                                                <TableCell>{service.description}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleDeleteService(index)}>
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
                            Tài sản đi kèm
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={5}>
                                <TextField
                                    fullWidth
                                    label="Tài sản (chìa khóa, tủ, kệ,...)"
                                    value={newAsset.name}
                                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    fullWidth
                                    label="Giá trị"
                                    type="number"
                                    value={newAsset.price}
                                    onChange={(e) => setNewAsset({ ...newAsset, price: Number(e.target.value) })}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleAddAsset}
                                >
                                    Thêm
                                </Button>
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
                                    {formData.assets.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">Chưa có</TableCell>
                                        </TableRow>
                                    ) : (
                                        formData.assets.map((asset, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{asset.name}</TableCell>
                                                <TableCell>{asset.price}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            assets: prev.assets.filter((_, i) => i !== index),
                                                        }));
                                                    }}>
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
                            <Grid item xs={12} md={6}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    fullWidth
                                >
                                    Chọn ảnh chính
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, true)}
                                    />
                                </Button>
                                {formData.mainImage && (
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src={URL.createObjectURL(formData.mainImage)}
                                            alt="Main"
                                            style={{ maxWidth: '100%', height: '300px' }}
                                        />
                                    </Box>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    fullWidth
                                >
                                    Chọn ảnh phụ
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleImageUpload(e, false)}
                                    />
                                </Button>
                                <Grid container spacing={1} sx={{ mt: 2 }}>
                                    {formData.subImages.map((image, index) => (
                                        <Grid item xs={4} key={index}>
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Sub ${index + 1}`}
                                                style={{ maxWidth: '100%', height: 'auto' }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<PreviewIcon />}
                    // onClick={() => setIsPreviewOpen(true)}
                >
                    Preview
                </Button>
            </Box>
        </Box>
    )
}
export default CreateRoomForm;