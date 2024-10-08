import {SVGProps} from "react";

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

export interface Property {
  id: number;
  title: string;
  image: string;
  address: string;
}

export interface Contract {
  id: number;
  renterId?: number;
  landlordId: number;
  property?: Property;
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
  request_id: number;
  renter_id: number;
  landlord_id: number;
  property: Property;
  request_date: Date;
  status: string;
  note: string;
  message_from_renter: string;
  message_from_landlord?: string;
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
    property: {
      id: 1,
      title: "Cho thuê căn hộ 2 phòng ngủ",
      image: "https://via.placeholder.com/150",
      address: "123 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh",
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
    request_id: 1,
    renter_id: 1,
    landlord_id: 2,
    property: {
      id: 1,
      title: "Cho thuê phòng trọ tiện nghi",
      image: "https://via.placeholder.com/150",
      address: "456 Lý Thái Tổ, Quận 3, TP. Hồ Chí Minh",
    },
    request_date: new Date(),
    status: "Processing",
    note: "Waiting for landlord approval",
    message_from_renter: "Tôi muốn thuê trọ của bạn",
    message_from_landlord: undefined,
    start_date: new Date(),
    rental_duration: 3,
    response_date: new Date(),
    contract_id: undefined,
  },
];