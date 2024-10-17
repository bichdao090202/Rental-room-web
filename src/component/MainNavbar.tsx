"use client";

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { siteConfig } from '@/config/site';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { stringAvatar } from '@/common/utils/helpers';
import { Tooltip } from '@mui/material';
import { usersSelectors } from '@/common/store/user/users.selectors';
import { userAction } from '@/common/store/user/users.actions';

interface MainNavbarProps {
  toggleSidebar?: () => void;
}

const MainNavbar: React.FC<MainNavbarProps> = ({ toggleSidebar }) => {
  // const { data: session } = useSession();
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openSubMenu, setOpenSubMenu] = React.useState<number | null>(null);
  const user = usersSelectors.useUserInformation();
  const { data: session } = useSession();

  const handleClickNavItem = (href: string) => {
    window.location.href = href;
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setOpenSubMenu(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenSubMenu(null);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleClickNavMenu = (href: string) => {
    href && router.push(href);
    setAnchorElNav(null);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Rental
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {siteConfig.navItems.map((item, index) => (
                <MenuItem key={index} onClick={() => handleClickNavMenu(item.href)}>
                  <Typography textAlign="center">{item.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {siteConfig.name}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/* {siteConfig.navItems.map((item, index) => (
              <Button
                key={index}
                onClick={() => handleClickNavMenu(item.href)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {item.label}
              </Button>
            ))} */}
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

          <Box sx={{ flexGrow: 0 }}>
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
                    <Avatar alt="User Avatar" />
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
      </Container>
    </AppBar>
  )
}

export default MainNavbar;