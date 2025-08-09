import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = 40, 
  message = 'Loading...', 
  fullScreen = false,
  color = 'primary' 
}) => {
  const containerProps = fullScreen 
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999,
      }
    : {};

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={fullScreen ? '100vh' : '200px'}
      {...containerProps}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CircularProgress 
          size={size} 
          color={color}
          thickness={4}
          sx={{
            mb: 2,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
      </motion.div>
      
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            textAlign="center"
          >
            {message}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default LoadingSpinner;