import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import BhimHeader from './BhimHeader';
import Sidebar from './Sidebar';
import BhimBottomNavigation from './BhimBottomNavigation';
import VoiceToggle from '../VoiceToggle';
import { BHIM_COLORS } from '../../theme/bhimTheme';

const DRAWER_WIDTH = 280;

const BhimLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* BHIM-style Header */}
      <BhimHeader 
        onMenuClick={handleDrawerToggle}
        showMenuButton={!isMobile}
      />

      {/* Desktop Sidebar (hidden on mobile) */}
      {!isMobile && (
        <Sidebar 
          open={mobileOpen} 
          onClose={handleDrawerToggle}
        />
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { 
            xs: '100%', 
            md: `calc(100% - ${DRAWER_WIDTH}px)` 
          },
          ml: { 
            xs: 0, 
            md: `${DRAWER_WIDTH}px` 
          },
          mt: { xs: '64px', sm: '70px' },
          mb: { xs: '70px', md: 0 }, // Space for bottom nav on mobile
          minHeight: 'calc(100vh - 70px)',
          backgroundColor: theme.palette.background.default,
          // BHIM-style background pattern
          backgroundImage: isMobile ? 'none' : `
            radial-gradient(circle at 20% 80%, ${BHIM_COLORS.orangeAlpha} 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${BHIM_COLORS.greenAlpha} 0%, transparent 50%)
          `,
        }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            maxWidth: '1400px',
            mx: 'auto',
            // BHIM-style content spacing
            '& > *:not(:last-child)': {
              mb: { xs: 2, sm: 3 },
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Mobile Bottom Navigation (BHIM-style) */}
      <BhimBottomNavigation />

      {/* Voice Mode Toggle (Floating Action Button) */}
      <VoiceToggle />

      {/* Toast Notifications (BHIM-style) */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: '12px',
            boxShadow: theme.shadows[3],
            border: `1px solid ${theme.palette.divider}`,
            fontSize: '0.875rem',
            fontWeight: 500,
          },
          success: {
            iconTheme: {
              primary: BHIM_COLORS.philippineGreen,
              secondary: BHIM_COLORS.white,
            },
            style: {
              border: `1px solid ${BHIM_COLORS.philippineGreen}`,
            },
          },
          error: {
            iconTheme: {
              primary: BHIM_COLORS.heatWaveOrange,
              secondary: BHIM_COLORS.white,
            },
            style: {
              border: `1px solid ${BHIM_COLORS.heatWaveOrange}`,
            },
          },
        }}
      />
    </Box>
  );
};

export default BhimLayout;