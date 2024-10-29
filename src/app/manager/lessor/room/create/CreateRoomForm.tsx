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

// // CreateRoomPage.tsx
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
//         // Handle form submission logic here
//         console.log(formData);
//     };

//     return (
//         <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
//             <Typography variant="h4" gutterBottom>
//                 Create New Room
//             </Typography>

//             <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                     <TextField
//                         fullWidth
//                         label="Acreage (m²)"
//                         name="acreage"
//                         type="number"
//                         value={formData.acreage}
//                         onChange={handleTextChange}
//                     />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                     <TextField
//                         fullWidth
//                         label="Price"
//                         name="price"
//                         type="number"
//                         value={formData.price}
//                         onChange={handleTextChange}
//                     />
//                 </Grid>

//                 <Grid item xs={12}>
//                     <TextField
//                         fullWidth
//                         label="Description"
//                         name="description"
//                         multiline
//                         rows={4}
//                         value={formData.description.replace(/\\n/g, '\n')}
//                         onChange={handleDescriptionChange}
//                     />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                     <TextField
//                         fullWidth
//                         label="Max People"
//                         name="max_people"
//                         type="number"
//                         value={formData.max_people}
//                         onChange={handleTextChange}
//                     />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                     <FormControl fullWidth>
//                         <InputLabel>Room Type</InputLabel>
//                         <Select
//                             name="room_type"
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
//                         label="Deposit"
//                         name="deposit"
//                         type="number"
//                         value={formData.deposit}
//                         onChange={handleTextChange}
//                     />
//                 </Grid>

//                 {/* Services Section */}
//                 <Grid item xs={12}>
//                     <Paper sx={{ p: 2 }}>
//                         <Typography variant="h6" gutterBottom>
//                             Services
//                         </Typography>
//                         <Grid container spacing={2}>
//                             <Grid item xs={12} md={3}>
//                                 <TextField
//                                     fullWidth
//                                     label="Service Name"
//                                     value={newService.name}
//                                     onChange={(e) => setNewService({ ...newService, name: e.target.value })}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={2}>
//                                 <TextField
//                                     fullWidth
//                                     label="Price"
//                                     type="number"
//                                     value={newService.price}
//                                     onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={3}>
//                                 <TextField
//                                     fullWidth
//                                     label="Description"
//                                     value={newService.description}
//                                     onChange={(e) => setNewService({ ...newService, description: e.target.value })}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={2}>
//                                 <TextField
//                                     fullWidth
//                                     label="Unit"
//                                     value={newService.unit}
//                                     onChange={(e) => setNewService({ ...newService, unit: e.target.value })}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={2}>
//                                 <Button
//                                     fullWidth
//                                     variant="contained"
//                                     startIcon={<AddIcon />}
//                                     onClick={handleAddService}
//                                 >
//                                     Add
//                                 </Button>
//                             </Grid>
//                         </Grid>

//                         <TableContainer sx={{ mt: 2 }}>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>Name</TableCell>
//                                         <TableCell>Price</TableCell>
//                                         <TableCell>Description</TableCell>
//                                         <TableCell>Unit</TableCell>
//                                         <TableCell>Actions</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {formData.services.map((service, index) => (
//                                         <TableRow key={index}>
//                                             <TableCell>{service.name}</TableCell>
//                                             <TableCell>{service.price}</TableCell>
//                                             <TableCell>{service.description}</TableCell>
//                                             <TableCell>{service.unit}</TableCell>
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

//                 {/* Assets Section */}
//                 <Grid item xs={12}>
//                     <Paper sx={{ p: 2 }}>
//                         <Typography variant="h6" gutterBottom>
//                             Assets
//                         </Typography>
//                         {/* Add Asset Form */}
//                         <Grid container spacing={2}>
//                             <Grid item xs={12} md={3}>
//                                 <TextField
//                                     fullWidth
//                                     label="Asset Name"
//                                     value={newAsset.name}
//                                     onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={2}>
//                                 <TextField
//                                     fullWidth
//                                     label="Price"
//                                     type="number"
//                                     value={newAsset.price}
//                                     onChange={(e) => setNewAsset({ ...newAsset, price: Number(e.target.value) })}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={2}>
//                                 <TextField
//                                     fullWidth
//                                     label="Quantity"
//                                     type="number"
//                                     value={newAsset.quantity}
//                                     onChange={(e) => setNewAsset({ ...newAsset, quantity: Number(e.target.value) })}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} md={2}>
//                                 <FormControl fullWidth>
//                                     <InputLabel>Required</InputLabel>
//                                     <Select
//                                         value={newAsset.required}
//                                         onChange={(e) => setNewAsset({ ...newAsset, required: Boolean(e.target.value) })}
//                                     >
//                                         {/* <MenuItem value={true}>Yes</MenuItem>
//                                         <MenuItem value={false}>No</MenuItem> */}
//                                     </Select>
//                                 </FormControl>
//                             </Grid>
//                             <Grid item xs={12} md={2}>
//                                 <Button
//                                     fullWidth
//                                     variant="contained"
//                                     startIcon={<AddIcon />}
//                                     onClick={handleAddAsset}
//                                 >
//                                     Add
//                                 </Button>
//                             </Grid>
//                         </Grid>

//                         {/* Assets Table */}
//                         <TableContainer sx={{ mt: 2 }}>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>Name</TableCell>
//                                         <TableCell>Price</TableCell>
//                                         <TableCell>Quantity</TableCell>
//                                         <TableCell>Required</TableCell>
//                                         <TableCell>Actions</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {formData.assets.map((asset, index) => (
//                                         <TableRow key={index}>
//                                             <TableCell>{asset.name}</TableCell>
//                                             <TableCell>{asset.price}</TableCell>
//                                             <TableCell>{asset.quantity}</TableCell>
//                                             <TableCell>{asset.required ? 'Yes' : 'No'}</TableCell>
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

//                 {/* Image Upload Section */}
//                 <Grid item xs={12}>
//                     <Paper sx={{ p: 2 }}>
//                         <Typography variant="h6" gutterBottom>
//                             Images
//                         </Typography>
//                         <Grid container spacing={2}>
//                             <Grid item xs={12} md={6}>
//                                 <Button
//                                     variant="contained"
//                                     component="label"
//                                     fullWidth
//                                 >
//                                     Upload Main Image
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
//                                             style={{ maxWidth: '100%', height: 'auto' }}
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
//                                     Upload Sub Images
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

//                 {/* Address Selector */}
//                 <Grid item xs={12}>
//                     <Paper sx={{ p: 2 }}>
//                         <Typography variant="h6" gutterBottom>
//                             Address
//                         </Typography>
//                         <AddressSelector  />
//                     </Paper>
//                 </Grid>
//             </Grid>

//             {/* Action Buttons */}
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