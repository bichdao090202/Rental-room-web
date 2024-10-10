// 'use client';

// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import {
//   Box,
//   Collapse,
//   Divider,
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Typography,
// } from '@mui/material';
// import { usePathname } from 'next/navigation';
// import { useRouter } from 'next/navigation';
// import React from 'react';

// export interface ISidebar extends React.ComponentPropsWithoutRef<'div'> {
//   items: any;
//   collapseMenu: boolean;
// }

// const Sidebar: React.FC<ISidebar> = ({ items, collapseMenu }) => {
//   const pathName = usePathname();
//   const router = useRouter();

//   const SidebarItem = ({
//     item,
//     depthStep,
//     depth,
//   }: {
//     item: any;
//     depthStep: number;
//     depth: number;
//   }) => {
//     const { title, items, icon, key } = item;
//     const [collapsed, setCollapsed] = React.useState(true);

//     const toggleCollapse = () => {
//       setCollapsed((prevValue: boolean) => !prevValue);
//     };

//     const handleClick = (keyName: string) => {
//       if (Array.isArray(items)) {
//         toggleCollapse();
//       } else {
//         router.push(keyName);
//       }
//     };

//     let expandIcon;
//     if (Array.isArray(items) && items.length) {
//       expandIcon = collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />;
//     }

//     return (
//       <>
//         <ListItemButton
//           onClick={() => handleClick(key)}
//           selected={pathName === key}
//           sx={{ pl: depth * depthStep }}
//         >
//           {icon && <ListItemIcon>{icon}</ListItemIcon>}
//           <ListItemText primary={title} />
//           {expandIcon}
//         </ListItemButton>

//         <Collapse in={!collapsed} timeout="auto" unmountOnExit>
//           {Array.isArray(items) ? (
//             <List disablePadding dense>
//               {items.map((subItem: any, index: number) => (
//                 <SidebarItem
//                   key={`${subItem.title}${index}`}
//                   item={subItem}
//                   depth={depth + 1}
//                   depthStep={depthStep}
//                 />
//               ))}
//             </List>
//           ) : null}
//         </Collapse>
//       </>
//     );
//   };

//   return (
//     <Drawer
//       open={!collapseMenu}
//       variant="persistent"
//       anchor="left"
//       sx={{
//         [`& .MuiDrawer-paper`]: {
//           boxSizing: 'border-box',
//           paddingTop: 10,
//           minWidth: '200px',
//           maxWidth: '16vw',
//         },
//       }}
//     >
//       <Box className="overflow-auto">
//         <Typography variant="h6" className='font-bold text-center'>
//           MANAGEMENT
//         </Typography>
//         <List
//           sx={{
//             maxWidth: 360,
//             bgcolor: 'background.paper',
//           }}
//           component="nav"
//           aria-labelledby="nested-list-subheader"
//         >
//           {items.map((sidebarItem: any, index: number) => (
//             <SidebarItem
//               key={`${sidebarItem.title}${index}`}
//               item={sidebarItem}
//               depthStep={3.5}
//               depth={0.5}
//             />
//           ))}
//         </List>
//       </Box>
//     </Drawer>
//   );
// };
// export default Sidebar;

'use client';

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Theme,
} from '@mui/material';
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
    depthStep,
    depth,
  }: {
    item: any;
    depthStep: number;
    depth: number;
  }) => {
    const { title, items, key } = item;
    const isSelected = pathname === key;

    const handleClick = () => {
      router.push(key);
    };

    return (
      <>
        <ListItemButton
          onClick={handleClick}
          selected={isSelected}
          sx={() => ({
            pl: depth * depthStep,
            '&.Mui-selected': {
              backgroundColor: '#d3d3d3',
              '&:hover': {
                backgroundColor: 'gray',
              },
            },
          })}
        >
          <ListItemText primary={title} />
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
      sx={(theme: Theme) => ({
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 250,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          marginTop: '70px', 
          height: 'calc(100% - 70px)', 
        },
      })}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          sx={(theme: Theme) => ({
            width: '100%',
            maxWidth: 360,
            '& .MuiListItemButton-root': {
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            },
          })}
        >
          {items.map((sidebarItem: any, index: number) => (
            <SidebarItem
              key={`${sidebarItem.key}${index}`}
              item={sidebarItem}
              depthStep={3.5}
              depth={0.5}
            />
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;