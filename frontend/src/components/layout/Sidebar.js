import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard,
  Receipt,
  Analytics,
  Settings,
  Help,
  Notifications,
  AccountCircle,
  LightMode,
  DarkMode,
  Mic,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';

const DRAWER_WIDTH = 280;

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Dashboard, path: '/' },
  { id: 'transactions', label: 'Transactions', icon: Receipt, path: '/transactions' },
  { id: 'analytics', label: 'Analytics', icon: Analytics, path: '/analytics' },
  { id: 'voice', label: 'Voice Mode', icon: Mic, path: '/voice' },
  { id: 'notifications', label: 'Notifications', icon: Notifications, path: '/notifications' },
];

const bottomMenuItems = [
  { id: 'profile', label: 'Profile', icon: AccountCircle, path: '/profile' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  { id: 'help', label: 'Help & Support', icon: Help, path: '/help' },
];

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.gradient?.primary || theme.palette.primary.main,
        color: 'white',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              fontSize: '1.5rem',
            }}
          >
            UP
          </Avatar>
        </motion.div>
        <Typography variant="h6" fontWeight="bold">
          UPI Diagnosis
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          AI-Powered Platform
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

      {/* Main Navigation */}
      <Box sx={{ flex: 1, py: 2 }}>
        <List>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItem disablePadding sx={{ px: 2, mb: 1 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    color: 'white',
                    backgroundColor: isActive(item.path) 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

      {/* Bottom Navigation */}
      <Box sx={{ py: 2 }}>
        <List>
          {/* Theme Toggle */}
          <ListItem disablePadding sx={{ px: 2, mb: 1 }}>
            <ListItemButton
              onClick={toggleTheme}
              sx={{
                borderRadius: 2,
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </ListItemIcon>
              <ListItemText 
                primary={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              />
            </ListItemButton>
          </ListItem>

          {bottomMenuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ px: 2, mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  color: 'white',
                  backgroundColor: isActive(item.path) 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  <item.icon />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            border: 'none',
            boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            border: 'none',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;