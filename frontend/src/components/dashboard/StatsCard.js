import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
} from '@mui/icons-material';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  color = 'primary',
  index = 0 
}) => {
  const theme = useTheme();

  const getTrendIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main }} />;
      case 'decrease':
        return <TrendingDown sx={{ fontSize: 16, color: theme.palette.error.main }} />;
      default:
        return <TrendingFlat sx={{ fontSize: 16, color: theme.palette.text.secondary }} />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return theme.palette.success.main;
      case 'decrease':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, fontWeight: 500 }}
              >
                {title}
              </Typography>
              
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: theme.palette.text.primary,
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
                    }}
                  >
                    {change}
                  </Typography>
                </Box>
              )}
            </Box>

            {Icon && (
              <Avatar
                sx={{
                  bgcolor: `${theme.palette[color].main}20`,
                  color: theme.palette[color].main,
                  width: 56,
                  height: 56,
                }}
              >
                <Icon sx={{ fontSize: 28 }} />
              </Avatar>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;