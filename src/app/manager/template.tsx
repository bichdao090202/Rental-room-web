// "use client";

// import { AdminPanelSettings, Home, Person } from "@mui/icons-material";
// import { Box, Grid } from "@mui/material";
// import { useRouter } from "next/navigation";
// import { siteConfig } from "@/config/site";
// import Sidebar from "@/component/sidebar";
// import ManagerTemplate from './template';

// export default function Template({ children }: { children: React.ReactNode }) {
//     const router = useRouter();
//     return (
//         <Box sx={{ display: 'flex' }}>
//             <Grid container>
//                 <Grid item xs={2}>
//                     <Sidebar items={items} collapseMenu={false} />
//                 </Grid>
//                 <Grid item xs={10} marginLeft={'200px'}>
//                     {children}
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// }
'use client'

import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import Sidebar from '@/component/Sidebar';
import MainNavbar from '@/component/MainNavbar';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingBox from '@/common/components/LoadingBox';

const items = [
    {
        title: 'Thuê',
        key: '/renter',
        items: [
            {
                title: 'Yêu cầu thuê',
                key: '/manager/renter/booking-request',
            },
            {
                title: 'Hợp đồng',
                key: '/manager/renter/contract',
            },
        ],
    },
    {
        title: 'Cho thuê',
        key: '/lessor',
        items: [
            {
                title: 'Yêu cầu thuê',
                key: '/manager/lessor/booking-request',
            },
            {
                title: 'Hợp đồng',
                key: '/manager/lessor/contract',
            },
            {
                title: 'Phòng trọ',
                key: '/manager/lessor/room',
            },
        ],
    },
];

export default function Template({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession();
            if (!session || !session.user) {
                router.push('/auth/login');
            } else {
                setIsLoading(false);
            }
        };
        checkSession();
    }, []);

    if (isLoading) {
        return (
            <LoadingBox />
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box><MainNavbar /></Box>
            <Box sx={{ display: 'flex' }} >
                <Box sx={{ display: 'flex' }}>
                    <Sidebar
                        items={items}
                    />
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            p: 3,
                            width: { sm: `calc(100% - '250px'})` },
                            marginLeft: { sm: '250px' },
                            transition: 'margin 0.2s ease-in-out',
                        }}
                    >
                        {children}
                    </Box>
                </Box>

            </Box>
        </Box>
    );
}