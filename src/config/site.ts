export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Hệ thống cho thuê nhà trọ",
	description: "Giúp bạn thuê trọ tiện lợi",
  openGraph: {
    image: "/logo.png", 
    alt: "Hệ thống cho thuê nhà trọ Logo",
  },
  version: "0.0.1",
  logo: "/logo.png",
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
		{ 
			label: "Tài khoản",
			href: "/user/info",
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