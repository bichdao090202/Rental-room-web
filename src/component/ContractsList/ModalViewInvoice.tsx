'use client'
import CustomModal from "@/common/components/modal";
import { formatDatetime } from "@/common/utils/helpers";
import { useState } from "react";

interface ViewInvoiceModalProps {
    onClose: () => void;
    invoice: any;
}

export default function ModalViewInvoice({ onClose, invoice }: ViewInvoiceModalProps) {

    const handleConfirm = () => {
        onClose();
    }

    return (
        <CustomModal
            open={true}
            onClose={onClose}
            width="70%"
            height="auto"
            title="Xem thông tin hóa đơn"
            type="confirm"
            onConfirm={handleConfirm}

        >
             <div>
                <p><strong>ID:</strong> {invoice.id}</p>
                <p><strong>Mã hợp đồng:</strong> {invoice.contract_id}</p>
                <p><strong>Tổng tiền:</strong> {invoice.amount.toLocaleString()} VND</p>
                <p><strong>Thời gian:</strong> {formatDatetime(new Date(invoice.created_at))}</p>
                <p><strong>Danh sách dịch vụ:</strong> {invoice.service_demands || 'N/A'}</p>
            </div>
        </CustomModal>
    )
}