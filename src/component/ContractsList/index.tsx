'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Button, Stack, CircularProgress, Modal, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SmallCard, { HeadCell } from '@/common/components/card/SmallCard';
import { get, post, put } from '@/common/store/base.service';
import { useRouter } from 'next/navigation';
import { getSession, useSession } from 'next-auth/react';
import { PaymentModal } from '../BookingRequestsList/PaymentModal';
import { ModalCancelContract } from './ModalCancelContract';
import { ModalOrder } from './ModalOrder';
import { SubmitHandler, useForm } from 'react-hook-form';
import CustomFormControl from '@/common/components/FormControl';
import ModalThanhKhoan from './ModalThanhKhoan';
import CustomModal from '@/common/components/modal';

interface FormInputs {
    duration: number;
    message: string;
    date: string;
}

export default function ContractsList({ type }: { type: 'renter' | 'lessor' }) {
    const [bookingRequests, setBookingRequests] = useState<any[]>([]);
    const router = useRouter();
    const [paymentModal, setPaymentModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [typeModal, setTypeModal] = useState<'cancel' | 'handle' | 'confirm'>('cancel');
    const [thanhKhoanModal, setThanhKhoanModal] = useState(false);
    const [contractId, setContractId] = useState(0);
    const [contract, setContract] = useState<any>();
    const { data: session } = useSession();
    const [defaultDate, setDefaultDate] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [message, setMessage] = useState('');


    const [orderModal, setOrderModal] = useState(false);

    const [openBookingModal, setOpenBookingModal] = useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        mode: 'onSubmit'
    });

    const handleOpenBookingModal = async () => {
        setOpenBookingModal(true)
    };
    const handleCloseBookingModal = () => setOpenBookingModal(false);


    const handleConfirm = async () => {
        setOpenAlert(false);

    }

    const closeModalConfirm = () => {
        setOpenAlert(false);
    }

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        const session = await getSession();
        console.log(contract);

        const body = {
            renter_id: session?.user?.id,
            lessor_id: contract?.lessor_id,
            room_id: contract?.room_id,
            status: "PROCESSING",
            note: "Waiting for landlord approval",
            message_from_renter: data.message,
            start_date: new Date(data.date).toISOString(),
            rental_duration: Number(data.duration),
        }
        console.log(body);


        const response = await post(`booking-requests`, body)
        if (response.status == "SUCCESS") {
            alert("Đã gửi yêu cầu đặt phòng thành công")
            setOpenBookingModal(false)
        }
        else
            alert("Thao tác thất bại, vui lòng thử lại")
    };

    function getStatusText(status: number) {
        switch (status) {
            // case 1:
            //     return 'Processing';
            // case 2:
            //     return 'Active';
            // case 3:
            //     return 'Finished';
            // case 4:
            //     return 'Failure';
            // case 5:
            //     return 'One-side cancel';
            // case 6:
            //     return 'Agreed cancel';
            // case 7:
            //     return 'Đang chờ thanh khoản';
            // default:
            //     return 'Unknown status';
            case 1:
                return "Đang xử lý";
            case 2:
                return "Đang có hiệu lực";

                case 8:
                return "Đã thanh khoản";
            case 3:
                return "Đã kết thúc";
            case 4:
                return "Thất bại";
            case 5:
                return "Hủy một phía";
            case 6:
                return "Hủy đồng thuận";
            case 7:
                return "Đang chờ thanh khoản";
            default:
                return "Trạng thái không xác định";
        }
    }

    function isLastMonth(startDate: Date, rentalDuration: number) {
        const start = new Date(startDate);
        const endDate = new Date(start);
        endDate.setMonth(start.getMonth() + rentalDuration - 1);

        const currentDate = new Date();
        return (
            currentDate.getMonth() === endDate.getMonth() &&
            currentDate.getFullYear() === endDate.getFullYear()
        );
    }

    const thanhKhoan = async (row: any) => {
        const res = await get(`contracts/${row.id}`);
        const result = res.data;
        const body = {
            ...result,
            status: 7,
            renter_id: row.renter_id,
            lessor_id: row.lessor_id,
            room_id: row.room_id,
            canceled_by: row.canceled_by,
        }
        const response = await put(`contracts/${row.id}`, body)
        if (response.status == "SUCCESS") {
            setOpenAlert(true);
            setMessage("Bạn đã gửi yêu cầu thanh khoản, vui lòng chờ chủ nhà xác nhận")
        }
    }

    const headCells: HeadCell[] = [
        { id: 'status', label: 'Trạng thái' },
        { id: 'start_date', label: 'Ngày bắt đầu' },
        { id: 'rental_duration', label: 'Thời gian thuê(tháng)' },
        // { id: 'message_from_renter', label: 'Tin nhắn từ khách hàng' },
        { id: 'monthly_price', label: 'Giá mỗi tháng' },
        { id: 'deposit', label: 'Tiền cọc' },
        {
            id: 'action', label: "Action",
            render: (row) =>
            (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {row.note == "Waiting for renter to sign and pay" && (
                        <Button variant="contained" color="primary" onClick={() => {
                            setPaymentModal(true);
                        }}>Thanh toán</Button>
                    )}

                    <Button variant="contained" color="primary" onClick={() => {
                        window.open(row.file_path, '_blank');
                    }}>
                        Xem pdf
                    </Button>

                    <Button variant="contained" color="info" onClick={() => {
                        setContractId(row.id);
                        setOrderModal(true);
                    }}> Xem hóa đơn</Button>

                    {
                        !isLastMonth(row.start_date, row.rental_duration) && row.canceled_by == null && row.status == "Đang có hiệu lực" && 
                        <Button variant="contained" color="error" onClick={() => {
                            setContractId(row.id);
                            setTypeModal('cancel');
                            setCancelModal(true);
                        }}>
                            Hủy hợp đồng
                        </Button>
                    }


                    {
                        // isLastMonth(row.start_date, row.rental_duration) && row.status == "Đang có hiệu lực" &&
                        type === 'renter' && row.status != "Đang chờ thanh khoản" && row.status != "Đã thanh khoản" &&
                        <Button variant="contained" color="warning" onClick={async () => {
                            // setOpenAlert(true);
                            // setMessage("Bạn thật sự muốn thanh khoản hợp đồng này?")
                            thanhKhoan(row)
                        }}>Thanh lý</Button>
                    }

{
                        type === 'renter' && row.status == "Đang chờ thanh khoản" && 
                        <Button variant="contained" color="warning" onClick={async () => {
                            setOpenAlert(true);
                            setMessage("Bạn đã gửi yêu cầu thanh lý, vui lòng chờ chủ nhà xác nhận")
                            // setContractId(row.id);
                            // setThanhKhoanModal(true);
                        }}>
                            <i>Chờ thanh lý</i>
                        </Button>
                    }

                    {
                        type === 'renter' && row.status == "Đã kết thúc" && 
                        <Button variant="contained" color="warning" onClick={async () => {
                            // setOpenAlert(true);
                            // setMessage("Bạn đã gửi yêu cầu thanh khoản, vui lòng chờ chủ nhà xác nhận")
                            setContractId(row.id);
                            setThanhKhoanModal(true);
                        }}>
                            Đã thanh lý
                        </Button>
                    }

                    {
                        type === 'lessor' && row.status == "Đang chờ thanh khoản"
                        &&
                        <Button variant="contained" color="warning" onClick={async () => {
                            setContractId(row.id);
                            setThanhKhoanModal(true);
                        }}>
                            Chờ thanh lý
                        </Button>
                    }


                    {
                        row.canceled_by == session?.user.id && row.pay_mode == 5 &&
                        <Button variant="outlined" color="primary" onClick={() => {
                            setContractId(row.id);
                            setTypeModal('cancel');
                            setCancelModal(true);
                        }}>
                            <i>Chờ phản hồi</i>
                        </Button>
                    }

                    {
                        row.canceled_by != session?.user.id && row.pay_mode == 5 &&
                        <Button variant="contained" color="primary" onClick={async () => {
                            setContractId(row.id);
                            setTypeModal('handle');
                            setCancelModal(true);
                        }}>
                            Yêu cầu hủy
                        </Button>
                    }

                    {
                        row.canceled_by != null && row.canceled_by == session?.user.id && row.pay_mode == 6 &&
                        <Button variant="contained" color="primary" onClick={() => {
                            setContractId(row.id);
                            setTypeModal('confirm');
                            setCancelModal(true);
                        }}> {`Xem phản hồi`}
                        </Button>
                    }

                    {
                        type == 'renter' && row.status == "Đang có hiệu lực" && row.status == "Đang có hiệu lực" &&
                        <Button variant="contained" color="success" onClick={() => {
                            setContract(row);
                            const date = new Date(row.date_rent);
                            date.setMonth(date.getMonth() + row.rental_duration);
                            date.setDate(date.getDate() + 1);
                            const formattedDate = date.toISOString().split('T')[0];
                            setDefaultDate(formattedDate);
                            handleOpenBookingModal();
                        }}> Gia hạn
                        </Button>
                    }



                </Box>
            )
        }
    ]

    const fetchBookingRequests = async () => {
        const session = await getSession();
        try {
            const path = type === 'renter' ? `contracts?renter_id=${session?.user?.id}` : `contracts?lessor_id=${session?.user?.id}`;
            const res = await get(path);
            const result = res.data;
            console.log(res);
            if (!result) return;
            const sortedResult = result.sort((a: any, b: any) => b.id - a.id);
            setBookingRequests(sortedResult);
        } catch (error) {
            console.error('Error fetching booking requests:', error);
        }
    };

    const handlePaymentModal = () => {
        setPaymentModal(false);
    };

    const handleCancelModal = () => {
        setCancelModal(false);
    };

    const handleOrderModal = () => {
        setOrderModal(false);
    };

    const handleThanhKhoanModal = () => {
        setThanhKhoanModal(false);
    }

    useEffect(() => {
        fetchBookingRequests();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="h4" gutterBottom >
                Danh sách hợp đồng
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {bookingRequests.map((request) => (
                    <SmallCard key={request.id}
                        dataSource={{
                            image: request.room.images?.[0] || '',
                            title: request.room.title,
                            status: getStatusText(request.status),
                            note: request.note,
                            date_rent: request.date_rent,
                            
                            message_from_renter: request.message_from_renter,
                            message_from_lessor: request.message_from_lessor,
                            id: request.id,
                            renter_id: request.renter.id,
                            lessor_id: request.lessor.id,
                            room_id: request.room.id,
                            monthly_price: request.monthly_price,
                            deposit: request.room.deposit,
                            payment_mode: request.payment_mode,
                            canceled_by: request.canceled_by?.id,
                            pay_mode: request.pay_mode,
                            file_path: request.file_path,
                            start_date: request.start_date,
                            rental_duration: request.rental_duration,
                        }}
                        headCells={headCells}
                    />

                ))}
            </Box>

            {openAlert &&
                <CustomModal
                    open={true}
                    onClose={closeModalConfirm}
                    width="70%"
                    height="auto"
                    title="Thanh khoản hợp đồng"
                    type="confirm"
                    onConfirm={handleConfirm}
                >
                    {message}
                </CustomModal>
            }


            {paymentModal && <PaymentModal onClose={handlePaymentModal} />}
            {cancelModal && <ModalCancelContract onClose={handleCancelModal} contractId={contractId} type={typeModal} />}
            {orderModal && <ModalOrder onClose={handleOrderModal} contractId={contractId} type={type} />}
            {thanhKhoanModal && <ModalThanhKhoan onClose={handleThanhKhoanModal} contractId={contractId} />}

            <Dialog open={openBookingModal} onClose={handleCloseBookingModal} component="form" onSubmit={handleSubmit(onSubmit)} >
                <DialogTitle>Yêu cầu thuê</DialogTitle>
                <DialogContent>
                    <Box className="max-w-lg mx-auto pt-5 bg-white rounded-lg space-y-5" >
                        <CustomFormControl
                            name="duration"
                            control={control}
                            type="number"
                            label="Thời gian thuê"
                            placeholder="Thời gian thuê (tháng)"
                            error={errors.duration}
                            rules={{
                                required: 'Trường này là bắt buộc',
                                min: { value: 1, message: 'Thời gian thuê tối thiểu là 1 tháng' }
                            }}
                        />
                        <CustomFormControl
                            name="message"
                            control={control}
                            type="text"
                            label="Tin nhắn"
                            placeholder="Tin nhắn cho chủ trọ"
                            error={errors.message}
                            rules={{ required: 'Trường này là bắt buộc' }}
                        />
                        <CustomFormControl
                            name="date"
                            control={control}
                            type="date"
                            label="Chọn ngày bắt đầu"
                            error={errors.date}
                            rules={{ required: 'Trường này là bắt buộc' }}
                            disable={true}
                            defaultValue={defaultDate}
                        />

                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseBookingModal}>Hủy</Button>
                    <Button type="submit" variant="contained" color="primary" >
                        Gửi yêu cầu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};