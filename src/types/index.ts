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
  district_name: string;
  province_name: string;
  ward_name: string;
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
  deposit: number;
  services?: Service[] | null;
  images: string[];
  bookingRequests?: any[] | null;
}

export interface Service {
  id: number,
  name: string,
  price: number,
  description: string
}

interface User {
  id: number;
  full_name: string;
  email: string;
}

export interface Contract {
  id: number;
  renter: User;
  lessor: User;
  room?: Room;
  name: string;
  content: string;
  dateComplete?: Date;
  datePay?: Date;
  "monthly_price": number,
  "canceled_by": User,
  "date_rent": Date,
  "date_pay": Date,
  "pay_mode": number,
  "payment": number,
  "is_enable": boolean,
  startRentDate?: Date;
  rentalDuration?: number;
  status: number;
  price?: number;
  deposit?: number;
  chargeableServices?: ChargeableService[];
  pdfPath: string;
  invoices: any;

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

// export const contracts: Contract[] = [
//   {
//     id: 1,
//     renterId: 1,
//     landlordId: 2,
//     room: {
//       id: 1,
//       title: "Cho thuê căn hộ 2 phòng ngủ",
//       images: ["https://via.placeholder.com/150"],
//       address: {
//         id: 2,
//         detail: "456 Lý Thái Tổ",
//         districtName: "Quận 3",
//         provinceName: "TP. Hồ Chí Minh",
//         wardName: ""
//       },
//       description: "Căn nhà trọ tọa lạc tại vị trí đắc địa, gần trung tâm thành phố, thuận tiện di chuyển đến các khu vực lân cận. Phòng rộng khoảng 20m², được thiết kế hiện đại với cửa sổ lớn đón ánh sáng tự nhiên, giúp không gian luôn thoáng mát và sáng sủa. Nội thất bao gồm giường, tủ quần áo, bàn làm việc, và máy lạnh đã được lắp đặt sẵn, sẵn sàng để bạn dọn vào ở ngay.\nKhu vực an ninh, yên tĩnh, có bảo vệ 24/7 và hệ thống camera giám sát, đảm bảo an toàn tuyệt đối. Dịch vụ tiện ích đi kèm như Internet tốc độ cao, bãi đậu xe rộng rãi cho cả xe máy và xe đạp, cùng với khu vực bếp chung sạch sẽ và đầy đủ dụng cụ nấu nướng.\nGiá thuê chỉ từ 3.500.000 VNĐ/tháng, bao gồm nước sinh hoạt. Điện tính riêng theo mức tiêu thụ với giá hợp lý. Chủ nhà thân thiện, dễ chịu, hỗ trợ tận tình. Căn phòng lý tưởng này phù hợp cho các bạn sinh viên hoặc người đi làm đang tìm kiếm không gian sống thoải mái, tiện nghi.",
//       owner_id: 1,
//       price: 3000000,
//       deposit: 3000000

//     },
//     name: "Hợp đồng thuê phòng 1",
//     content: "Nội dung hợp đồng thuê phòng...",
//     dateComplete: new Date(),
//     datePay: new Date(),
//     startRentDate: new Date(),
//     rentalDuration: 12,
//     status: "Active",
//     price: 5000000,
//     deposit: 2000000,
//     chargeableServices: [
//       { name: "Internet", price: 200000 },
//       { name: "Dọn phòng", price: 50000 },
//     ],
//     pdfPath: "/path/to/contract.pdf",
//   },
// ];

// export const bookingRequests: BookingRequest[] = [
//   {
//     id: 1,
//     renter_id: 1,
//     lessor_id: 2,
//     room: {
//       id: 1,
//       title: "Cho thuê phòng trọ tiện nghi",
//       images: ["https://via.placeholder.com/150"],
//       address: {
//         id: 1,
//         detail: "123 Nguyễn Trãi",
//         districtName: "Quận 1",
//         provinceName: "TP. Hồ Chí Minh",
//         wardName: ""
//       },

//       deposit: 3000000,
//       description: "Căn nhà trọ tọa lạc tại vị trí đắc địa, gần trung tâm thành phố, thuận tiện di chuyển đến các khu vực lân cận. Phòng rộng khoảng 20m², được thiết kế hiện đại với cửa sổ lớn đón ánh sáng tự nhiên, giúp không gian luôn thoáng mát và sáng sủa. Nội thất bao gồm giường, tủ quần áo, bàn làm việc, và máy lạnh đã được lắp đặt sẵn, sẵn sàng để bạn dọn vào ở ngay.\nKhu vực an ninh, yên tĩnh, có bảo vệ 24/7 và hệ thống camera giám sát, đảm bảo an toàn tuyệt đối. Dịch vụ tiện ích đi kèm như Internet tốc độ cao, bãi đậu xe rộng rãi cho cả xe máy và xe đạp, cùng với khu vực bếp chung sạch sẽ và đầy đủ dụng cụ nấu nướng.\nGiá thuê chỉ từ 3.500.000 VNĐ/tháng, bao gồm nước sinh hoạt. Điện tính riêng theo mức tiêu thụ với giá hợp lý. Chủ nhà thân thiện, dễ chịu, hỗ trợ tận tình. Căn phòng lý tưởng này phù hợp cho các bạn sinh viên hoặc người đi làm đang tìm kiếm không gian sống thoải mái, tiện nghi.",
//       owner_id: 1,
//       price: 3000000
//     },
//     request_date: new Date(),
//     status: "Processing",
//     note: "Waiting for landlord approval",
//     message_from_renter: "Tôi muốn thuê trọ của bạn",
//     message_from_lessor: undefined,
//     start_date: new Date(),
//     rental_duration: 3,
//     response_date: new Date(),
//     contract_id: undefined,
//   },
// ];

interface BankCard {
  bankName: string;
  cardNumber: string;
  cardHolder: string;
  issueDate: string;
  otpPassword: string;
}

const bankCard: BankCard = {
  bankName: 'NCB',
  cardNumber: '9704198526191432198',
  cardHolder: 'NGUYEN VAN A',
  issueDate: '07/15',
  otpPassword: '123456',
};

const mockroom: Room = {
  id: 1,
  title: 'Phòng 101',
  address: {
    id: 1,
    detail: '123 Đường ABC',
    district_name: 'Quận 1',
    province_name: 'TP.HCM',
    ward_name: 'Phường Bến Nghé',
  },
  price: 5000000,
  description: 'Phòng rộng rãi, thoáng mát, gần trung tâm.',
  owner_id: 1001,
  deposit: 3000000,
  images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyWQtw2z4U9W_mIx80C5TvMWGYzut4mK-lXw&s'],
}

const mockBookingRequest = {
  id: 1,
  renter_id: 1001,
  lessor_id: 2001,
  room: mockroom,
  request_date: new Date('2024-10-01'),
  status: 'waiting',
  note: 'Chờ chủ nhà phê duyệt',
  message_from_renter: 'Tôi muốn thuê phòng này trong 6 tháng.',
  message_from_lessor: 'Vui lòng cung cấp thông tin thêm về bạn.',
  start_date: new Date('2024-11-01'),
  rental_duration: 6,
  response_date: new Date('2024-10-05'),
  contract_id: 301,
}
