'use client';

import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Theme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export interface ISidebar extends React.ComponentPropsWithoutRef<'div'> {
  items: any[];
}

const Sidebar: React.FC<ISidebar> = ({ items }) => {
  const pathname = usePathname();
  const router = useRouter();

  const SidebarItem = ({
    item,
    depthStep = 3.5,
    depth = 0.5,
  }: {
    item: any;
    depthStep?: number;
    depth?: number;
  }) => {
    const { title, items, key, icon: Icon } = item;
    const isSelected = pathname === key;
    const isParent = Array.isArray(items) && items.length > 0;

    const handleClick = () => {
      if (!isParent) {
        router.push(key);
      }
    };

    return (
      <>
        <ListItemButton
          onClick={handleClick}
          selected={isSelected}
          // sx={{
          //   pl: depth * depthStep,
          //   borderBottom: '1px solid',
          //   borderColor: 'rgba(0, 0, 0, 0.06)',
          //   py: isParent ? 1.5 : 1,
          //   '&.Mui-selected': {
          //     backgroundColor: 'rgba(0, 0, 0, 0.04)',
          //     borderRight: '4px solid',
          //     borderRightColor: 'primary.main',
          //     '&:hover': {
          //       backgroundColor: 'rgba(0, 0, 0, 0.08)',
          //     },
          //   },
          // }}
        sx={{
          pl: depth * depthStep,
          py: 1,
          transition: 'all 0.3s',
          borderRadius: '0 20px 20px 0',
          mx: 1,
          margin: '4px 16px 4px 0',
        }}
        >
          {Icon && (
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: 'primary.main',
                '& svg': {
                  color: 'primary.main'
                }
              }}
            >
              <Icon size={18} />
            </ListItemIcon>
          )}
          <ListItemText
            primary={title}
            sx={{
              '& .MuiTypography-root': {
                fontSize: depth === 0.5 ? 19 : 15,
                fontWeight: depth === 0.5 ? 550 : (isSelected ? 500 : 400),
                transition: 'font-weight 0.3s'
              }
            }}
          />
        </ListItemButton>
        {Array.isArray(items) ? (
          <List disablePadding dense>
            {items.map((subItem, index) => (
              <SidebarItem
                key={`${subItem.key}${index}`}
                item={subItem}
                depth={depth + 1}
                depthStep={depthStep}
              />
            ))}
          </List>
        ) : null}
      </>
    );
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      // sx={(theme: Theme) => ({
      //   '& .MuiDrawer-paper': {
      //     boxSizing: 'border-box',
      //     width: 220,
      //     backgroundColor: '#f8f9fa',
      //     color: theme.palette.text.primary,
      //     marginTop: '70px',
      //     height: 'calc(100% - 70px)',
      //     borderRight: '1px solid',
      //     boxShadow: '0 0 20px rgba(0,0,0,0.05)',
      //     borderColor: 'rgba(0, 0, 0, 0.12)',
      //   },
      // })}
    sx={(theme: Theme) => ({
      '& .MuiDrawer-paper': {
        boxSizing: 'border-box',
        width: 200,
        backgroundColor: '#f8f9fa',
        color: theme.palette.text.primary,
        marginTop: '70px',
        height: 'calc(100% - 70px)',
        borderRight: '1px solid',
        borderColor: 'divider',
      },
    })}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {items.map((sidebarItem: any, index: number) => (
            <SidebarItem
              key={`${sidebarItem.key}-${index}`}
              item={sidebarItem}
            />
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;