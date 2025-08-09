import React from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home,
  Receipt,
  Analytics,
  Notifications,
  Person,
  Mic,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BhimBottomNavigation = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // BHIM-style navigation items
  const navigationItems = [
    {
      label: 'Home',
      icon: <Home />,
      path: '/',
      value: 'home',
    },
    {
      label: 'Transactions',
      icon: <Receipt />,
      path: '/transactions',
      value: 'transactions',
    },
    {
      label: 'Voice',
      icon: <Mic />,
      path: '/voice',
      value: 'voice',
    },
    {
      label: 'Analytics',
      icon: <Analytics />,
      path: '/analytics',
      value: 'analytics',
    },
    {
      label: 'Profile',
      icon: <Person />,
      path: '/profile',
      value: 'profile',
    },
  ];

  const getCurrentValue = () => {
    const currentPath = location.pathname;
    const currentItem = navigationItems.find(item => 
      item.path === currentPath || 
      (item.path !== '/' && currentPath.startsWith(item.path))
    );
    return currentItem?.value || 'home';
  };

  const handleChange = (event, newValue) => {
    const selectedItem = navigationItems.find(item => item.value === newValue);
    if (selectedItem) {
      navigate(selectedItem.path);
    }
  };

  // Only show on mobile devices (BHIM-style)
  if (!isMobile) {
    return null;
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
      elevation={8}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <BottomNavigation
          value={getCurrentValue()}
          onChange={handleChange}
          showLabels
          sx={{
            height: 70,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 12px 8px',
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.75rem',
                  fontWeight: 600,
                },
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.7rem',
                fontWeight: 500,
                marginTop: 4,
              },
            },
          }}
        >
          {navigationItems.map((item) => (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              value={item.value}
              icon={
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.1 }}
                >
                  {item.icon}
                </motion.div>
              }
            />
          ))}
        </BottomNavigation>
      </motion.div>
    </Paper>
  );
};

export default BhimBottomNavigation;