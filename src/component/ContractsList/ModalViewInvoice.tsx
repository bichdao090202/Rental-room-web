'use client'
import CustomModal from "@/common/components/modal";
import { useState } from "react";

interface ViewInvoiceModalProps {
    onClose: () => void;
    invoice: number;
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
            invoiceId: {invoice}
        </CustomModal>
    )
}