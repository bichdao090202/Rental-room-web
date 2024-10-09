import { Label } from "@mui/icons-material";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Rental room web",
	description: "Giúp bạn thuê trọ tiện lợi",
  version: "0.0.1",
	navItems: [
		{
			label: "Trang chủ",
			href: "/",
		},
    {
      label: "Danh mục",
      href: "/categery",
      subItems: [
        {
          label: "Căn hộ",
          href: "/categery/apartment",
        },
        {
          label: "Phòng trọ",
          href: "/categery/room",
        },
      ],
    },
    {
      label: "Tìm kiếm",
      href: "/search",
    },
    {
      label: "Liên hệ",
      href: "/contact",
    },
    {
      label: "Giới thiệu",
      href: "/about",
    }
	],
  userMenu: [
		{ //Thông tin cá nhân , Phương thức thanh toán
			label: "Tài khoản",
			href: "/",
		},
    {
      label: "Quản lý tin đăng",
      href: "/",
    },
    {
      label: "Quản lý thuê phòng",
      href: "/manager/renter/booking-request",
    },
    {
      label: "Hỗ trợ và liên hệ",
      href: "/",
    },
    
	],
};