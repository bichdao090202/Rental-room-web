'use client'
import Loading from "@/app/loading";
import CustomModal from "@/common/components/modal";
import { get, post } from "@/common/store/base.service";
import { Box, Card, Checkbox, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
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
            setContract(result);
        } catch (error) {
            console.error('Error fetching contract:', error);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, [contractId]);

    useEffect(() => {
        if (contract?.status === 7) {
            const total = contract?.borrowed_items
                .filter((item: any) => selectedItems.includes(item.id))
                .reduce((acc: number, item: any) => acc + item.price, 0);
            setTotalDamage(total || 0);
        } else if (contract?.status === 3) {
            const total = contract?.damaged_items.reduce((acc: number, item: any) => acc + item.price, 0);
            setTotalDamage(total || 0);
        }
    }, [selectedItems, contract]);

    const handleCheckboxChange = (itemId: number) => {
        setSelectedItems(prevSelectedItems =>
            prevSelectedItems.includes(itemId)
                ? prevSelectedItems.filter(id => id !== itemId)
                : [...prevSelectedItems, itemId]
        );
    };

    if (!contract) {
        return <Loading />;
    }

    const handleConfirm = async () => {
        const body = {
            contract_id: contract.id,
            borrowed_items: selectedItems
        };
        const res = await post(`contracts/liquidity`, body);
        if (res.status === "SUCCESS") setOpenAlert(true);
    };

    const closeModal = () => {
        setOpenAlert(false);
        onClose();
    };

    return (
        <CustomModal
            open={true}
            onClose={onClose}
            width="70%"
            height="auto"
            title="Thanh lý hợp đồng"
            type="confirm"
            onConfirm={contract?.status === 7 ? handleConfirm : undefined}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    {contract?.status === 7
                        ? "Danh sách vật dụng mất/hư hỏng"
                        : "Danh sách vật dụng thiệt hại"}
                </Typography>
                <Typography variant="body2" color="darkgray" sx={{ pb: 1, mb: 3 }}>
                    {contract?.status === 7
                        ? "Vui lòng chọn các vật dụng cần thanh toán thiệt hại"
                        : ""}
                </Typography>

                <Card variant="outlined" sx={{ mb: 3 }}>
                    <List>
                        {(contract?.status === 7 ? contract?.borrowed_items : contract?.damaged_items).map((item: any) => (
                            <ListItem
                                key={item.id}
                                secondaryAction={
                                    <Typography variant="subtitle1">
                                        {item.price.toLocaleString()} VNĐ
                                    </Typography>
                                }
                            >
                                {contract?.status === 7 && (
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleCheckboxChange(item.id)}
                                        />
                                    </ListItemIcon>
                                )}
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
                    <Typography variant="h6">Tổng thiệt hại:</Typography>
                    <Typography variant="h5" fontWeight="bold">
                        {totalDamage.toLocaleString()} VNĐ
                    </Typography>
                </Paper>
            </Box>

            {openAlert && (
                <CustomModal
                    open={true}
                    onClose={closeModal}
                    width="70%"
                    height="auto"
                    title="Thông báo"
                    type="alert"
                >
                    Yêu cầu xử lý thành công
                </CustomModal>
            )}
        </CustomModal>
    );
}
