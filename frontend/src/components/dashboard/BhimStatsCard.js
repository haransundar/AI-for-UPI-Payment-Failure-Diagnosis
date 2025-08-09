import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { BHIM_COLORS } from '../../theme/bhimTheme';

const BhimStatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  color = 'orange',
  index = 0 
}) => {
  const theme = useTheme();

  const getColorScheme = () => {
    switch (color) {
      case 'green':
        return {
          main: BHIM_COLORS.philippineGreen,
          light: BHIM_COLORS.greenLight,
          alpha: BHIM_COLORS.greenAlpha,
        };
      case 'orange':
      default:
        return {
          main: BHIM_COLORS.heatWaveOrange,
          light: BHIM_COLORS.orangeLight,
          alpha: BHIM_COLORS.orangeAlpha,
        };
    }
  };

  const getTrendIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp sx={{ fontSize: 16, color: BHIM_COLORS.philippineGreen }} />;
      case 'decrease':
        return <TrendingDown sx={{ fontSize: 16, color: BHIM_COLORS.heatWaveOrange }} />;
      default:
        return <TrendingFlat sx={{ fontSize: 16, color: theme.palette.text.secondary }} />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return BHIM_COLORS.philippineGreen;
      case 'decrease':
        return BHIM_COLORS.heatWaveOrange;
      default:
        return theme.palette.text.secondary;
    }
  };

  const colorScheme = getColorScheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <Card
        sx={{
          height: '100%',
          borderRadius: 3,
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${theme.palette.divider}`,
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out',
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${colorScheme.alpha} 100%)`,
          '&:hover': {
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
            borderColor: colorScheme.main,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ 
                  mb: 1, 
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {title}
              </Typography>
              
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: colorScheme.main,
                  fontSize: { xs: '1.75rem', sm: '2rem' },
                }}
              >
                {value}
              </Typography>

              {change && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {getTrendIcon()}
                  <Typography
                    variant="body2"
                    sx={{
                      color: getChangeColor(),
                      fontWeight: 500,
                      fontSize: '0.75rem',
                    }}
                  >
                    {change}
                  </Typography>
                </Box>
              )}
            </Box>

            {Icon && (
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: colorScheme.alpha,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${colorScheme.main}20`,
                }}
              >
                <Icon 
                  sx={{ 
                    fontSize: 28, 
                    color: colorScheme.main,
                  }} 
                />
              </Box>
            )}
          </Box>

          {/* BHIM-style progress indicator */}
          <Box
            sx={{
              width: '100%',
              height: 4,
              backgroundColor: theme.palette.divider,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, ${colorScheme.main} 0%, ${colorScheme.light} 100%)`,
                borderRadius: 2,
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BhimStatsCard;