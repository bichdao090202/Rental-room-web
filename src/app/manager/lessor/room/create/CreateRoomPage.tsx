// 'use client'
// import React, { useState } from 'react';
// import {
//   Box, TextField, Typography, Button, Divider, IconButton,
//   Select, MenuItem, Grid, Checkbox, FormControlLabel, InputAdornment
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import AddressSelector from '@/component/AddressSelector';
// import { getBase64FromFile } from '@/common/utils/helpers';

// const CreateRoomPage: React.FC = () => {
//   const [acreage, setAcreage] = useState<number | undefined>();
//   const [price, setPrice] = useState<number | undefined>();
//   const [title, setTitle] = useState<string>('');
//   const [description, setDescription] = useState<string>('');
//   const [dateSubmitted, setDateSubmitted] = useState<string>('2023-02-01');
//   const [ownerId, setOwnerId] = useState<number>(1);
//   const [maxPeople, setMaxPeople] = useState<number | undefined>();
//   const [roomType, setRoomType] = useState<number>(2);
//   const [deposit, setDeposit] = useState<number | undefined>();
//   const [services, setServices] = useState<{ name: string; price: number; description: string }[]>([]);
//   const [assets, setAssets] = useState<{ name: string; price: number; quantity: number; mandatory: boolean }[]>([]);
//   const [addressId, setAddressId] = useState<number | null>(null); // address ID từ AddressSelector
//   const [images, setImages] = useState<File[]>([]);

//   // Thêm service row
//   const handleAddService = () => {
//     setServices([...services, { name: '', price: 0, description: '' }]);
//   };

//   const handleRemoveService = (index: number) => {
//     setServices(services.filter((_, i) => i !== index));
//   };

//   // Thêm asset row
//   const handleAddAsset = () => {
//     setAssets([...assets, { name: '', price: 0, quantity: 1, mandatory: false }]);
//   };

//   const handleRemoveAsset = (index: number) => {
//     setAssets(assets.filter((_, i) => i !== index));
//   };

//   // Xử lý chọn ảnh và gán ảnh chính vào vị trí 0
//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files ? Array.from(e.target.files) : [];
//     setImages(files);
//   };

//   // Submit form
//   const handleSubmit = async () => {
//     const imagesBase64 = await Promise.all(images.map(async (file) => ({
//       file_name: file.name,
//       file_base64: await getBase64FromFile(file) as string,
//     })));

//     const requestData = {
//       acreage,
//       price,
//       title,
//       description: description.replace(/\n/g, '\\n'), // Chuyển xuống dòng thành \n
//       date_submitted: dateSubmitted,
//       owner_id: ownerId,
//       max_people: maxPeople,
//       room_type: roomType,
//       deposit,
//       services: services.map((service) => ({ ...service, unit: 'VNĐ' })),
//       assets,
//       address_id: addressId,
//       images: imagesBase64
//     };

//     console.log('Data for submission:', requestData);
//   };

//   return (
//     <Box padding={2}>
//       <Typography variant="h4">Tạo Phòng</Typography>
//       <Divider sx={{ my: 2 }} />

//       {/* Các thông tin cơ bản của phòng */}
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//           <TextField label="Diện tích (m²)" fullWidth type="number" value={acreage} onChange={(e) => setAcreage(parseInt(e.target.value))} />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField label="Giá (VNĐ)" fullWidth type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value))} />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField label="Tiêu đề" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             label="Mô tả"
//             fullWidth
//             multiline
//             rows={4}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </Grid>
//       </Grid>

//       {/* Chọn địa chỉ */}
//       <Box mt={2}>
//         <Typography variant="h6">Địa chỉ</Typography>
//         <AddressSelector />
//       </Box>

//       {/* Danh sách dịch vụ */}
//       <Box mt={2}>
//         <Typography variant="h6">Dịch vụ</Typography>
//         {services.map((service, index) => (
//           <Grid container spacing={2} key={index}>
//             <Grid item xs={4}>
//               <TextField label="Tên dịch vụ" fullWidth value={service.name} onChange={(e) => {
//                 const updatedServices = [...services];
//                 updatedServices[index].name = e.target.value;
//                 setServices(updatedServices);
//               }} />
//             </Grid>
//             <Grid item xs={3}>
//               <TextField label="Giá" fullWidth type="number" value={service.price} onChange={(e) => {
//                 const updatedServices = [...services];
//                 updatedServices[index].price = parseInt(e.target.value) || 0;
//                 setServices(updatedServices);
//               }} />
//             </Grid>
//             <Grid item xs={4}>
//               <TextField label="Đơn vị đo" fullWidth value={service.description} onChange={(e) => {
//                 const updatedServices = [...services];
//                 updatedServices[index].description = e.target.value;
//                 setServices(updatedServices);
//               }} />
//             </Grid>
//             <Grid item xs={1}>
//               <IconButton onClick={() => handleRemoveService(index)}><RemoveIcon /></IconButton>
//             </Grid>
//           </Grid>
//         ))}
//         <Button startIcon={<AddIcon />} onClick={handleAddService}>Thêm dịch vụ</Button>
//       </Box>

//       {/* Danh sách tài sản */}
//       <Box mt={2}>
//         <Typography variant="h6">Tài sản</Typography>
//         {assets.map((asset, index) => (
//           <Grid container spacing={2} key={index}>
//             <Grid item xs={3}>
//               <TextField label="Tên tài sản" fullWidth value={asset.name} onChange={(e) => {
//                 const updatedAssets = [...assets];
//                 updatedAssets[index].name = e.target.value;
//                 setAssets(updatedAssets);
//               }} />
//             </Grid>
//             <Grid item xs={3}>
//               <TextField label="Giá trị" fullWidth type="number" value={asset.price} onChange={(e) => {
//                 const updatedAssets = [...assets];
//                 updatedAssets[index].price = parseInt(e.target.value) || 0;
//                 setAssets(updatedAssets);
//               }} />
//             </Grid>
//             <Grid item xs={2}>
//               <TextField label="Số lượng" fullWidth type="number" value={asset.quantity} onChange={(e) => {
//                 const updatedAssets = [...assets];
//                 updatedAssets[index].quantity = parseInt(e.target.value) || 1;
//                 setAssets(updatedAssets);
//               }} />
//             </Grid>
//             <Grid item xs={2}>
//               <FormControlLabel control={
//                 <Checkbox checked={asset.mandatory} onChange={(e) => {
//                   const updatedAssets = [...assets];
//                   updatedAssets[index].mandatory = e.target.checked;
//                   setAssets(updatedAssets);
//                 }} />
//               } label="Bắt buộc" />
//             </Grid>
//             <Grid item xs={1}>
//               <IconButton onClick={() => handleRemoveAsset(index)}><RemoveIcon /></IconButton>
//             </Grid>
//           </Grid>
//         ))}
//         <Button startIcon={<AddIcon />} onClick={handleAddAsset}>Thêm tài sản</Button>
//       </Box>

//       {/* Ảnh */}
//       <Box mt={2}>
//         <Typography variant="h6">Ảnh</Typography>
//         <Button variant="contained" component="label">
//           Chọn ảnh
//           <input type="file" hidden multiple onChange={handleImageChange} />
//         </Button>
//         <Typography>Ảnh chính là ảnh đầu tiên trong danh sách.</Typography>
//       </Box>

//       {/* Submit và Xem trước */}
//       <Box mt={4}>
//         <Button variant="contained" color="primary" onClick={handleSubmit}>Tạo phòng</Button>
//       </Box>
//     </Box>
//   );
// };

// export default CreateRoomPage;
