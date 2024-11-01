'use client'
import Loading from "@/app/loading";
import CustomModal from "@/common/components/modal";
import { get, post, put } from "@/common/store/base.service";
import { formatDatetime } from "@/common/utils/helpers";
import { createTransaction } from "@/service/main/create_transaction";
import { Warning } from "@mui/icons-material";
import { Box, Card, CardContent, Checkbox, Chip, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { create } from "domain";
import { useEffect, useState } from "react";

interface ModalThanhKhoanProps {
    onClose: () => void;
    contractId: any;
}

export default function ModalThanhKhoan({ onClose, contractId }: ModalThanhKhoanProps) {
    const [contract, setContract] = useState<any>();
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [totalDamage, setTotalDamage] = useState<number>(0);
    const [openAlert, setOpenAlert] = useState(false);

    const fetchContracts = async () => {
        try {
            const res = await get(`contracts/${contractId}`);
            const result = res.data;
            console.log(res.data.borrowed_items);
            setContract(result);
        } catch (error) {
            console.error('Error fetching booking requests:', error);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, [contractId]);


    useEffect(() => {
        const total = contract?.borrowed_items
            .filter((item: any) => selectedItems.includes(item.id))
            .reduce((acc: number, item: any) => acc + item.price, 0);
        setTotalDamage(total || 0);
    }, [selectedItems, contract]);

    const handleCheckboxChange = (itemId: number) => {
        setSelectedItems(prevSelectedItems =>
            prevSelectedItems.includes(itemId)
                ? prevSelectedItems.filter(id => id !== itemId)
                : [...prevSelectedItems, itemId]
        );
    };

    if (!contract) {
        return (
            <Loading></Loading>
        )
    }

    const handleConfirm = async () => {
        const body = {
            contract_id: contract.id,
            borrowed_items: selectedItems
        }
        console.log(body)
        const res = await post(`contracts/liquidity`, body)
        if (res.status === "SUCCESS")
            setOpenAlert(true);
    }

    const closeModal = () => {
        setOpenAlert(false);
        onClose();
    }

    return (
        <CustomModal
            open={true}
            onClose={onClose}
            width="70%"
            height="auto"
            title="Thanh khoản hợp đồng"
            type="confirm"
            onConfirm={handleConfirm}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{
                }}>
                    Danh sách vật dùng mất/hư hỏng
                </Typography>
                <Typography variant="body2" color="darkgray" sx={{
                    pb: 1,
                    mb: 3,
                    size: '1.5rem',
                }}>
                    Vui lòng chọn các vật dụng cần thanh toán thiệt hại
                </Typography>

                <Card variant="outlined" sx={{ mb: 3 }}>
                    <List>
                        {contract.borrowed_items.map((item: any) => (
                            <ListItem
                                key={item.id}
                                secondaryAction={
                                    <Typography variant="subtitle1">
                                        {item.price.toLocaleString()} VNĐ
                                    </Typography>
                                }
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => handleCheckboxChange(item.id)}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.name}
                                    primaryTypographyProps={{ fontWeight: 500 }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Card>

                <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        bgcolor: 'gray.light',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h6">
                        Tổng thiệt hại:
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                        {totalDamage.toLocaleString()} VNĐ
                    </Typography>
                </Paper>
            </Box>

            {
                openAlert && <CustomModal
                    open={true}
                    onClose={closeModal}
                    width="70%"
                    height="auto"
                    title="Thông báo"
                    type="alert"
                >
                    Yêu cầu xử lý thành công
                </CustomModal>
            }

        </CustomModal>
    )
}



{/* <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Danh sách vật dùng mất/hư hỏng
                </Typography>

                <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.100' }}>
                                <TableCell padding="checkbox">
                                    <Checkbox disabled />
                                </TableCell>
                                <TableCell>Tên vật dụng</TableCell>
                                <TableCell align="right">Giá trị thiệt hại</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contract.borrowed_items.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleCheckboxChange(item.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell align="right">
                                        {item.price.toLocaleString()} VNĐ
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box
                    sx={{
                        bgcolor: '#fee2e2',
                        p: 2,
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Typography variant="h6">Tổng thiệt hại:</Typography>
                    <Typography variant="h5" color="error.main" fontWeight="bold">
                        {totalDamage.toLocaleString()} VNĐ
                    </Typography>
                </Box>
            </Box> */}
