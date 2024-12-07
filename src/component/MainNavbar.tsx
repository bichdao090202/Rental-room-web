"use client";

import { usersSelectors } from '@/common/store/user/users.selectors';
import { siteConfig } from '@/config/site';
import { Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

interface MainNavbarProps {
  toggleSidebar?: () => void;
}

const MainNavbar: React.FC<MainNavbarProps> = () => {
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openSubMenu, setOpenSubMenu] = React.useState<number | null>(null);
  const user = usersSelectors.useUserInformation();
  const { data: session } = useSession();
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setOpenSubMenu(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenSubMenu(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleClickNavMenu = (href: string) => {
    href && router.push(href);
    setAnchorElNav(null);
  };


  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed">      
      <Toolbar disableGutters sx={{display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1, display: 'flex', ml:"20px" }}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                mt: 2,
                display: 'flex',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Rental
            </Typography>
            {siteConfig.navItems.map((item, index) => (
              <Box
                key={index}
                onMouseEnter={(e) => item.subItems && handleMenuOpen(e, index)}
                onMouseLeave={handleMenuClose}
                sx={{ position: 'relative' }}
              >
                <Button
                  onClick={() => !item.subItems && handleClickNavMenu(item.href)}
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'block',
                    backgroundColor: openSubMenu === index ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                  }}
                >
                  {item.label}
                </Button>
                {item.subItems && (
                  <Menu
                    anchorEl={anchorEl}
                    open={openSubMenu === index}
                    onClose={handleMenuClose}
                    MenuListProps={{
                      className: 'submenu',
                      onMouseEnter: () => setOpenSubMenu(index),
                      onMouseLeave: handleMenuClose,
                    }}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    sx={{
                      '& .MuiPaper-root': {
                        backgroundColor: '#fff',
                        color: 'black',
                        minWidth: 160,
                        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
                        borderRadius: 2,
                      },
                    }}
                  >
                    {item.subItems.map((subItem, subIndex) => (
                      <MenuItem
                        key={subIndex}
                        onClick={() => {
                          handleClickNavMenu(subItem.href);
                          setAnchorEl(null);
                          setOpenSubMenu(null);
                        }}
                        sx={{
                          color: 'black',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        {subItem.label}
                      </MenuItem>
                    ))}
                  </Menu>
                )}
              </Box>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0,display: 'flex',  mr:"20px"}}>
            {true ? (
              <>
                {/* <Tooltip title={`${(session as any)?.userInformation?.firstName || ''} ${(session as any)?.userInformation?.lastName || ''}`}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {
                      (session as any)?.user?.image ?
                        <Avatar src={(session as any)?.user?.image || (session as any)?.userInformation?.avatar} alt="User Avatar" /> :
                        <Avatar {...stringAvatar(`${(session as any)?.userInformation?.firstName} ${(session as any)?.userInformation?.lastName}`)} />
                    }
                  </IconButton>
                </Tooltip> */}
                <Tooltip title={session ? `User ${session.user!.id}` : 'none'}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar src={(session as any)?.user?.img_url || (session as any)?.userInformation?.img_url} alt="User Avatar"  />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {session && siteConfig.userMenu.map((item, index) => (
                    <MenuItem key={index} onClick={() => handleClickNavMenu(item.href)}>
                      <Typography textAlign="right">{item.label}</Typography>
                    </MenuItem>
                  ))}
                  {
                    session ?
                      <MenuItem onClick={() => signOut({ callbackUrl: '/auth/login' })}>
                        <Typography textAlign="center">Đăng xuất</Typography>
                      </MenuItem> :
                      <MenuItem onClick={() => {
                        router.push('/auth/login')
                      }}>
                        <Typography textAlign="center">Đăng nhập</Typography>
                      </MenuItem>
                  }
                </Menu>
              </>
            ) : ""}
          </Box>
        </Toolbar>
    </AppBar>
  )
}

export default MainNavbar;