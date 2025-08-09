import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Psychology,
  Analytics,
  Receipt,
  Notifications,
  Download,
  Refresh,
  Search,
  Settings,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BHIM_COLORS } from '../../theme/bhimTheme';

const BhimQuickActions = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'diagnose',
      label: 'AI Diagnosis',
      icon: Psychology,
      color: BHIM_COLORS.heatWaveOrange,
      bgColor: BHIM_COLORS.orangeAlpha,
      action: () => navigate('/transactions'),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: Analytics,
      color: BHIM_COLORS.philippineGreen,
      bgColor: BHIM_COLORS.greenAlpha,
      action: () => navigate('/analytics'),
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: Receipt,
      color: BHIM_COLORS.heatWaveOrange,
      bgColor: BHIM_COLORS.orangeAlpha,
      action: () => navigate('/transactions'),
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Notifications,
      color: BHIM_COLORS.philippineGreen,
      bgColor: BHIM_COLORS.greenAlpha,
      action: () => navigate('/notifications'),
    },
    {
      id: 'export',
      label: 'Export',
      icon: Download,
      color: BHIM_COLORS.heatWaveOrange,
      bgColor: BHIM_COLORS.orangeAlpha,
      action: () => {},
    },
    {
      id: 'refresh',
      label: 'Refresh',
      icon: Refresh,
      color: BHIM_COLORS.philippineGreen,
      bgColor: BHIM_COLORS.greenAlpha,
      action: () => window.location.reload(),
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      color: BHIM_COLORS.heatWaveOrange,
      bgColor: BHIM_COLORS.orangeAlpha,
      action: () => navigate('/transactions'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: BHIM_COLORS.philippineGreen,
      bgColor: BHIM_COLORS.greenAlpha,
      action: () => navigate('/settings'),
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
          sx={{ 
            color: theme.palette.text.primary,
            mb: 3,
          }}
        >
          Quick Actions
        </Typography>

        <Grid container spacing={2}>
          {quickActions.map((action, index) => (
            <Grid item xs={3} sm={3} md={3} key={action.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  onClick={action.action}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: action.bgColor,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: action.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <action.icon
                      sx={{
                        fontSize: 24,
                        color: action.color,
                      }}
                    />
                  </Box>
                  
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                      textAlign: 'center',
                      fontSize: '0.7rem',
                      lineHeight: 1.2,
                    }}
                  >
                    {action.label}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BhimQuickActions;