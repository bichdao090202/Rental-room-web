"use client";

import { AdminPanelSettings, Home, Person } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Box, Grid, ThemeProvider } from "@mui/material";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import Footer from "@/component/Footer";
import MainNavbar from "@/component/MainNavbar";
import Sidebar from "@/component/Sidebar";
import theme from "@/styles/theme";


export default function Template({ children }: { children: React.ReactNode }) {
    const [collapseMenu, setCollapseMenu] = useState(false);
    // const [session, setSession] = useState<any>(null);
    const router = useRouter();

    // useEffect(() => {
    //     const checkSession = async () => {
    //         const userSession = await getSession();
    //         if (!userSession) {
    //             router.push('/login');
    //         } else {
    //             setSession(userSession);
    //         }
    //     };
    //     checkSession();
    // }, [router]);

    const toggleSidebar = () => {
        setCollapseMenu((prev) => !prev);
    };

    // if (!session) {
    //     return null;
    // }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', flexDirection: 'column', paddingTop: '64px' }}>
                <MainNavbar toggleSidebar={toggleSidebar} />
                <Box sx={{ display: 'flex', flex: 1 , flexGrow: 1, }} >{children}</Box>
            </Box>
         </ThemeProvider>

    );
}
