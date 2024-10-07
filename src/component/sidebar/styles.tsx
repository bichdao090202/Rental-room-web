

import { css } from '@emotion/react';

export const sidebarTheme = css({
  '& .MuiListItemButton-root': {
    color: 'grey',
    borderLeft: '4px solid white',
    '&:hover': {
      borderLeft: '4px solid #4B49AC',
      fontWeight: 700,

      '& .MuiTypography-root': {
        fontWeight: 700,
      },
    },
    '& .MuiListItemIcon-root': {
      minWidth: '35px',
    },
  },
  '& .Mui-selected': {
    borderLeft: `4px solid `,
    background: 'white !important',
    '&:hover': {
      background: 'white',
    },
    '& .MuiTypography-root': {
      fontWeight: 700,
    },
  },
});
