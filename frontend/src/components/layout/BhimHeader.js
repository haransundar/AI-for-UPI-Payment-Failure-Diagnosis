import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Search,
  MoreVert,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { BHIM_COLORS } from '../../theme/bhimTheme';

const BhimHeader = ({ title = 'UPI Diagnosis', onMenuClick, showMenuButton = true }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${BHIM_COLORS.heatWaveOrange} 0%, ${BHIM_COLORS.orangeLight} 100%)`,
        boxShadow: '0px 2px 12px rgba(255, 121, 9, 0.3)',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, sm: 70 }, px: { xs: 2, sm: 3 } }}>
        {/* Left Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {showMenuButton && !isMobile && (
            <motion.div
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1 }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={onMenuClick}
                sx={{ 
                  mr: 2,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </motion.div>
          )}

          {/* BHIM-style Logo/Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                UP
              </Avatar>
            </motion.div>
            
            <Box>
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  lineHeight: 1.2,
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.7rem',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                AI-Powered Diagnosis
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
          >
            <IconButton
              color="inherit"
              aria-label="search"
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Search />
            </IconButton>
          </motion.div>

          {/* Notifications */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
          >
            <IconButton
              color="inherit"
              aria-label="notifications"
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Notifications />
            </IconButton>
          </motion.div>

          {/* More Options (Mobile) */}
          {isMobile && (
            <motion.div
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1 }}
            >
              <IconButton
                color="inherit"
                aria-label="more options"
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <MoreVert />
              </IconButton>
            </motion.div>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default BhimHeader;