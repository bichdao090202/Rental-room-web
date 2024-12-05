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
  deposit: number;
  services?: Service[] | null;
  images: string[];
  borrowed_items:any[] | null;
  max_people: number|null;
  room_type: number;
  status: number;
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
  monthly_price: number,
  canceled_by: User,
  date_rent: Date,
  date_pay: Date,
  pay_mode: number,
  payment: number,
  is_enable: boolean,
  startRentDate?: Date;
  rentalDuration?: number;
  status: number;
  price?: number;
  deposit?: number;
  chargeableServices?: ChargeableService[];
  pdfPath: string;
  invoices: any;
  start_date: Date;

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
