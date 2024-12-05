export default function getRoomStatus(status: number): string {
    switch (status) {
        case 0:
            return "Chưa sẵn sàng"
        case 1:
            return "Sẵn sàng";
        case 2:
            return "Chưa sẵn sàng";
        case 3:
            return "Dang cho thuê";
        default:
            return "Đang thuê";
    }
}