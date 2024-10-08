// "use client";

// import { AdminPanelSettings, Home, Person } from "@mui/icons-material";
// import { Box, Grid } from "@mui/material";
// import { useRouter } from "next/navigation";
// import { siteConfig } from "@/config/site";
// import Sidebar from "@/component/sidebar";
// import ManagerTemplate from './template';

// const items = [
//     {
//         title: 'Thuê',
//         key: '/rent',
//         items: [
//             {
//                 title: 'Yêu cầu thuê',
//                 key: '/manager/renter',
//             },
//             {
//                 title: 'Hợp đồng',
//                 key: '/manager/renter',
//             },
//         ],
//     },
//     {
//         title: 'Cho thuê',
//         key: '/lease',
//         items: [
//             {
//                 title: 'Yêu cầu thuê',
//                 key: '/manager/landlord',
//             },
//             {
//                 title: 'Hợp đồng',
//                 key: '/manager/landlord',
//             },
//             {
//                 title: 'Phòng trọ',
//                 key: '/manager/landlord',
//             },
//         ],
//     },
// ];

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
import { Box } from '@mui/material';
import Sidebar from '@/component/sidebar';
import MainNavbar from '@/component/MainNavbar';

const items = [
    {
        title: 'Thuê',
        key: '/rent',
        items: [
            {
                title: 'Yêu cầu thuê',
                key: '/manager/renter',
            },
            {
                title: 'Hợp đồng',
                key: '/manager/renter',
            },
        ],
    },
    {
        title: 'Cho thuê',
        key: '/lease',
        items: [
            {
                title: 'Yêu cầu thuê',
                key: '/manager/landlord',
            },
            {
                title: 'Hợp đồng',
                key: '/manager/landlord',
            },
            {
                title: 'Phòng trọ',
                key: '/manager/landlord',
            },
        ],
    },
];

export default function Template({ children }: { children: React.ReactNode }) {
    const [collapseMenu, setCollapseMenu] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);


    useEffect(() => {
        const storedExpandedMenus = localStorage.getItem('expandedMenus');
        if (storedExpandedMenus) {
            setExpandedMenus(JSON.parse(storedExpandedMenus));
        }
    }, []);

    const handleMenuToggle = (key: string) => {
        setExpandedMenus((prevExpanded) => {
            const newExpanded = prevExpanded.includes(key)
                ? prevExpanded.filter((item) => item !== key)
                : [...prevExpanded, key];

            // Lưu trạng thái mới vào localStorage
            localStorage.setItem('expandedMenus', JSON.stringify(newExpanded));
            return newExpanded;
        });
    };
    const toggleSidebar = () => {
        setCollapseMenu((prev) => !prev);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column'}}>
            <Box><MainNavbar toggleSidebar={toggleSidebar} /></Box>
            <Box sx={{ display: 'flex' }} >
                <Box sx={{ display: 'flex' }}>
                    <Sidebar
                        items={items}
                        collapseMenu={collapseMenu}
                        expandedMenus={expandedMenus}
                        onMenuToggle={handleMenuToggle}
                    />
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            p: 3,
                            width: { sm: `calc(100% - ${collapseMenu ? '0px' : '250px'})` },
                            marginLeft: { sm: collapseMenu ? '0px' : '250px' },
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