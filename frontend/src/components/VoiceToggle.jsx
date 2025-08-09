import React, { useState } from 'react';
import { Fab, Tooltip, useTheme } from '@mui/material';
import { Mic, MicOff } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BHIM_COLORS } from '../theme/bhimTheme';

const VoiceToggle = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  
  const isVoiceMode = location.pathname === '/voice';

  const handleToggle = () => {
    if (isVoiceMode) {
      navigate('/');
    } else {
      navigate('/voice');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        style={{
          position: 'fixed',
          bottom: theme.spacing(3),
          right: theme.spacing(3),
          zIndex: theme.zIndex.speedDial,
        }}
      >
        <Tooltip 
          title={isVoiceMode ? "Exit Voice Mode" : "Enter Voice Mode"} 
          placement="left"
          arrow
        >
          <Fab
            color="primary"
            onClick={handleToggle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
              background: isVoiceMode 
                ? `linear-gradient(135deg, ${BHIM_COLORS.philippineGreen} 0%, #2E7D32 100%)`
                : `linear-gradient(135deg, ${BHIM_COLORS.heatWaveOrange} 0%, ${BHIM_COLORS.orangeLight} 100%)`,
              color: 'white',
              width: 64,
              height: 64,
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              '&:hover': {
                background: isVoiceMode 
                  ? `linear-gradient(135deg, #2E7D32 0%, ${BHIM_COLORS.philippineGreen} 100%)`
                  : `linear-gradient(135deg, ${BHIM_COLORS.orangeDark} 0%, ${BHIM_COLORS.heatWaveOrange} 100%)`,
                transform: 'scale(1.1)',
                boxShadow: '0 12px 35px rgba(0,0,0,0.2)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: isVoiceMode ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: '0 0 0 0 rgba(46, 125, 50, 0.7)',
                },
                '70%': {
                  boxShadow: '0 0 0 10px rgba(46, 125, 50, 0)',
                },
                '100%': {
                  boxShadow: '0 0 0 0 rgba(46, 125, 50, 0)',
                },
              },
            }}
          >
            <motion.div
              animate={{ 
                scale: isHovered ? 1.2 : 1,
                rotate: isVoiceMode ? 360 : 0 
              }}
              transition={{ duration: 0.3 }}
            >
              {isVoiceMode ? (
                <MicOff sx={{ fontSize: 28 }} />
              ) : (
                <Mic sx={{ fontSize: 28 }} />
              )}
            </motion.div>
          </Fab>
        </Tooltip>
        
        {/* Voice Mode Indicator */}
        {isVoiceMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'absolute',
              top: -45,
              right: 0,
              backgroundColor: BHIM_COLORS.philippineGreen,
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            }}
          >
            🎤 Voice Active
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceToggle;