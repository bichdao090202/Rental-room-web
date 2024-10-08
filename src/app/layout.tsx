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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
