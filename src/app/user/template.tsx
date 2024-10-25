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
        title: 'Thông tin',
        key: '/user/info',
        
    },
    {
        title: 'Tài khoản',
        key: '/user/account',
        
    },
    {
        title: 'Giao dịch',
        key: '/user/transaction',
        
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
                            width: 'calc(100vw - 250px)',
                            marginLeft: { sm: '200px' },
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