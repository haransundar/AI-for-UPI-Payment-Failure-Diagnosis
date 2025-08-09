import React from 'react';
import { Chip } from '@mui/material';
import { 
  CheckCircle, 
  Error, 
  Warning, 
  HourglassEmpty,
  Cancel 
} from '@mui/icons-material';

const StatusChip = ({ status, size = 'medium' }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'resolved':
        return {
          label: 'Success',
          color: 'success',
          icon: <CheckCircle />,
        };
      case 'failed':
      case 'failure':
      case 'error':
        return {
          label: 'Failed',
          color: 'error',
          icon: <Error />,
        };
      case 'pending':
      case 'processing':
        return {
          label: 'Pending',
          color: 'warning',
          icon: <HourglassEmpty />,
        };
      case 'cancelled':
      case 'canceled':
        return {
          label: 'Cancelled',
          color: 'default',
          icon: <Cancel />,
        };
      case 'warning':
        return {
          label: 'Warning',
          color: 'warning',
          icon: <Warning />,
        };
      default:
        return {
          label: status || 'Unknown',
          color: 'default',
          icon: null,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      icon={config.icon}
      variant="filled"
      sx={{
        fontWeight: 500,
        '& .MuiChip-icon': {
          fontSize: size === 'small' ? '16px' : '18px',
        },
      }}
    />
  );
};

export default StatusChip;