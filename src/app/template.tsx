"use client";

import { AdminPanelSettings, Home, Person } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import Footer from "@/component/Footer";
import MainNavbar from "@/component/MainNavbar";
import Sidebar from "@/component/sidebar";

const items = [
    {
        title: 'User',
        icon: <Person color="primary" />,
        key: '/user',
    },
    {
        title: 'Role',
        icon: <AdminPanelSettings color="primary" />,
        key: '/role',
    },
];

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
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <MainNavbar toggleSidebar={toggleSidebar} />
            {children}
            
        </Box>
    );
}
