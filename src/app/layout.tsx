import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Providers } from "./providers";


export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.logo,
        width: 90,
        height: 90,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={siteConfig.logo} type="image/png" />
        <title>{siteConfig.name}</title>
      </head>
      <body className={` antialiased`}>
        <Providers>
          <div className="m-7">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
