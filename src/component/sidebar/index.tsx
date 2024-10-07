'use client';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  css,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Typography } from '@mui/material';

export interface ISidebar extends React.ComponentPropsWithoutRef<'div'> {
  justify?: 'items-center' | 'items-start';
  items: any;
  collapseMenu: boolean;
}

const Sidebar: React.FC<ISidebar> = ({
  items,
  collapseMenu,
}) => {
  let pathName = usePathname();
  const router = useRouter();

  if (pathName && pathName.split('/').length > 3) {
    pathName = `/${pathName.split('/')[1]}/${pathName.split('/')[2]}`;
  }

  const SidebarItem = ({
    item,
    depthStep,
    depth,
  }: {
    item: any;
    depthStep: number;
    depth: number;
  }) => {
    const { title, items, icon, key, permission } = item;
    const groupKeys = key?.split(',');

    const [collapsed, setCollapsed] = React.useState(
      !groupKeys?.includes(`/${pathName?.split('/')[1]}`),
    );

    const toggleCollapse = () => {
      setCollapsed((prevValue: boolean) => !prevValue);
    };

    const handleClick = (keyName: string) => {
      if (Array.isArray(items)) {
        toggleCollapse();
      } else {
        router.push(keyName);
      }
    };

    let expandIcon;
    if (Array.isArray(items) && items.length) {
      expandIcon = !collapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />;
    }

    return (
      <>
        <ListItemButton
          onClick={() => handleClick(key)}
          selected={pathName === key}
          sx={{ pl: depth * depthStep }}
        >
          {icon && <ListItemIcon>{icon}</ListItemIcon>}

          <ListItemText primary={title} />
          {expandIcon}
        </ListItemButton>
        {key === '/' && <Divider />}

        <Collapse in={!collapsed} timeout="auto" unmountOnExit>
          {Array.isArray(items) ? (
            <List disablePadding dense>
              {items.map((subItem, index) => {
                return (
                  <SidebarItem
                    key={`${subItem.id}${index}`}
                    item={subItem}
                    depth={depth + 1}
                    depthStep={depthStep}
                  />
                );
              })}
            </List>
          ) : null}
        </Collapse>
      </>
    );
  };

  return (
    <Drawer
      open={!collapseMenu}
      variant="persistent"
      anchor="left"
      sx={{
        [`& .MuiDrawer-paper`]: {
          boxSizing: 'border-box',
          paddingTop: 10,
          minWidth: '200px',
          maxWidth: '16vw',
        },
      }}
    >
      <Box className="overflow-auto">
        <Typography variant="h6" className='font-bold text-center'>
          MANAGEMENT
        </Typography>
        {
          <List
            className="w-full"
            sx={{
              maxWidth: 360,
              bgcolor: 'background.paper',
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            {items.map((sidebarItem: any, index: number) => {
              return (
                <SidebarItem
                  key={`${sidebarItem.title}${index}`}
                  item={sidebarItem}
                  depthStep={3.5}
                  depth={0.5}
                />
              );
            })}
          </List>
        }
      </Box>
    </Drawer>
  );
};

export default Sidebar;
