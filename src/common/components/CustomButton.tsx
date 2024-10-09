import React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { SxProps, Theme } from '@mui/system';

interface CustomButtonProps {
  label?: string;
  icon?: React.ReactNode;
  color?: string;
  textColor?: string;
  borderRadius?: number;
  padding?: string;
  onClick: () => void;
  type?: 'confirm' | 'information' | 'cancel' | 'normal' | 'system' | 'circular';
  notificationCount?: number;
  radius?: number;
  height?: number;
  width?: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  icon,
  color,
  textColor,
  borderRadius = 6,
  padding = '14px 28px',
  onClick,
  type,
  notificationCount,
  radius = 48,
  height,
  width,
}) => {
  const getButtonStyles = (): SxProps<Theme> => {
    switch (type) {
      case 'confirm':
        return { backgroundColor: color || '#007bff', color: textColor || '#ffffff' };
      case 'information':
        return { backgroundColor: color || '#28a745', color: textColor || '#ffffff' };
      case 'cancel':
        return { backgroundColor: color || '#dc3545', color: textColor || '#ffffff' };
      case 'normal':
        return { borderColor: '#1C3988', color: textColor || '#000000', backgroundColor: color || '#ffffff' };
      case 'system':
        return { backgroundColor: '#1C3988', color: textColor || '#ffffff' };
      default:
        return { backgroundColor: color || '#ffffff', color: textColor || '#000000' };
    }
  };

  const renderButtonContent = () => (
    <>
      {icon && <span>{icon}</span>}
      {label && <span>{label}</span>}
    </>
  );

  if (type === 'circular') {
    return (
      <Badge
        badgeContent={notificationCount}
        color="error"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        overlap="circular"
      >
        <IconButton
          onClick={onClick}
          sx={{
            backgroundColor: color || 'transparent',
            color: textColor || '#ffffff',
            width: radius,
            height: radius,
          }}
        >
          {icon}
        </IconButton>
      </Badge>
    );
  }

  return (
    <Button
      variant={type === 'normal' ? 'outlined' : 'contained'}
      onClick={onClick}
      sx={{
        ...getButtonStyles(),
        borderRadius: borderRadius,
        padding: padding,
        minWidth: width || 'auto',
        height: height || 'auto',
      }}
    >
      {renderButtonContent()}
    </Button>
  );
};

export default CustomButton;
