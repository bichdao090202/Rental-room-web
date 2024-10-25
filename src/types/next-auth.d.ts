import { DefaultSession } from "next-auth"

interface Address {
    id: number;
    detail: string;
    ward_name: string;
    district_name: string;
    province_name: string;
}

interface UserInfo {
    id: number;
    full_name: string;
    email: string;
    img_url: string;
    phone: string;
    role: string | null;
    refresh_token: string;
    identity_number: string;
    address: Address;
}

declare module "next-auth" {
    interface User extends UserInfo {
        accessToken: string;
        refreshToken: string;
    }

    interface Session {
        user: User & DefaultSession["user"];
        expires: string;
        error?: string;
        accessToken: string;
    }
}
