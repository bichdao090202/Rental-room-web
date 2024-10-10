import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type UserType = {
  email?: string | null | undefined;
  image?: string | null | undefined;
  name?: string | null | undefined;
}

export type SignOutType = {
  callbackUrl?: string;
  redirect?: boolean
}

export interface ChargeableService {
  name: string;
  price: number;
}

export interface Address {
  id: number;
  detail: string;
  districtName: string;
  provinceName: string;
  wardName: string;
}

export interface Room {
  id: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  title: string;
  address: Address;
  acreage?: number | null;
  price: number;
  description: string;
  dateSubmitted?: string | null;
  owner_id: number;
  maxPeople?: number | null;
  roomType?: number | null;
  deposit?: number | null;
  services?: string[] | null;
  images: string[];
  bookingRequests?: any[] | null;
}

export interface Contract {
  id: number;
  renterId: number;
  landlordId: number;
  room?: Room;
  name: string;
  content: string;
  dateComplete?: Date;
  datePay?: Date;
  startRentDate?: Date;
  rentalDuration?: number;
  status: string;
  price?: number;
  deposit?: number;
  chargeableServices?: ChargeableService[];
  pdfPath: string;
}

export interface BookingRequest {
  id: number;
  renter_id: number;
  lessor_id: number;
  room: Room;
  request_date: Date;
  status: string;
  note: string;
  message_from_renter: string;
  message_from_lessor?: string;
  start_date: Date;
  rental_duration: number;
  response_date?: Date;
  contract_id?: number;
}

export const contracts: Contract[] = [
  {
    id: 1,
    renterId: 1,
    landlordId: 2,
    room: {
      id: 1,
      title: "Cho thuê căn hộ 2 phòng ngủ",
      images: ["https://via.placeholder.com/150"],
      address: {
        id: 2,
        detail: "456 Lý Thái Tổ",
        districtName: "Quận 3",
        provinceName: "TP. Hồ Chí Minh",
        wardName: ""
      },
      description: "Căn nhà trọ tọa lạc tại vị trí đắc địa, gần trung tâm thành phố, thuận tiện di chuyển đến các khu vực lân cận. Phòng rộng khoảng 20m², được thiết kế hiện đại với cửa sổ lớn đón ánh sáng tự nhiên, giúp không gian luôn thoáng mát và sáng sủa. Nội thất bao gồm giường, tủ quần áo, bàn làm việc, và máy lạnh đã được lắp đặt sẵn, sẵn sàng để bạn dọn vào ở ngay.\nKhu vực an ninh, yên tĩnh, có bảo vệ 24/7 và hệ thống camera giám sát, đảm bảo an toàn tuyệt đối. Dịch vụ tiện ích đi kèm như Internet tốc độ cao, bãi đậu xe rộng rãi cho cả xe máy và xe đạp, cùng với khu vực bếp chung sạch sẽ và đầy đủ dụng cụ nấu nướng.\nGiá thuê chỉ từ 3.500.000 VNĐ/tháng, bao gồm nước sinh hoạt. Điện tính riêng theo mức tiêu thụ với giá hợp lý. Chủ nhà thân thiện, dễ chịu, hỗ trợ tận tình. Căn phòng lý tưởng này phù hợp cho các bạn sinh viên hoặc người đi làm đang tìm kiếm không gian sống thoải mái, tiện nghi.",
      owner_id: 1,
      price: 3000000

    },
    name: "Hợp đồng thuê phòng 1",
    content: "Nội dung hợp đồng thuê phòng...",
    dateComplete: new Date(),
    datePay: new Date(),
    startRentDate: new Date(),
    rentalDuration: 12,
    status: "Active",
    price: 5000000,
    deposit: 2000000,
    chargeableServices: [
      { name: "Internet", price: 200000 },
      { name: "Dọn phòng", price: 50000 },
    ],
    pdfPath: "/path/to/contract.pdf",
  },
];

export const bookingRequests: BookingRequest[] = [
  {
    id: 1,
    renter_id: 1,
    lessor_id: 2,
    room: {
      id: 1,
      title: "Cho thuê phòng trọ tiện nghi",
      images: ["https://via.placeholder.com/150"],
      address: {
        id: 1,
        detail: "123 Nguyễn Trãi",
        districtName: "Quận 1",
        provinceName: "TP. Hồ Chí Minh",
        wardName: ""
      },
      description: "Căn nhà trọ tọa lạc tại vị trí đắc địa, gần trung tâm thành phố, thuận tiện di chuyển đến các khu vực lân cận. Phòng rộng khoảng 20m², được thiết kế hiện đại với cửa sổ lớn đón ánh sáng tự nhiên, giúp không gian luôn thoáng mát và sáng sủa. Nội thất bao gồm giường, tủ quần áo, bàn làm việc, và máy lạnh đã được lắp đặt sẵn, sẵn sàng để bạn dọn vào ở ngay.\nKhu vực an ninh, yên tĩnh, có bảo vệ 24/7 và hệ thống camera giám sát, đảm bảo an toàn tuyệt đối. Dịch vụ tiện ích đi kèm như Internet tốc độ cao, bãi đậu xe rộng rãi cho cả xe máy và xe đạp, cùng với khu vực bếp chung sạch sẽ và đầy đủ dụng cụ nấu nướng.\nGiá thuê chỉ từ 3.500.000 VNĐ/tháng, bao gồm nước sinh hoạt. Điện tính riêng theo mức tiêu thụ với giá hợp lý. Chủ nhà thân thiện, dễ chịu, hỗ trợ tận tình. Căn phòng lý tưởng này phù hợp cho các bạn sinh viên hoặc người đi làm đang tìm kiếm không gian sống thoải mái, tiện nghi.",
      owner_id: 1,
      price: 3000000
    },
    request_date: new Date(),
    status: "Processing",
    note: "Waiting for landlord approval",
    message_from_renter: "Tôi muốn thuê trọ của bạn",
    message_from_lessor: undefined,
    start_date: new Date(),
    rental_duration: 3,
    response_date: new Date(),
    contract_id: undefined,
  },
];