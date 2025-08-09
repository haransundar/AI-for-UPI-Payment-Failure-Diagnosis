import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Security, Smartphone, Email } from '@mui/icons-material';
import { motion } from 'framer-motion';

const TwoFactorAuth = ({ open, onClose, onVerify, method = 'sms' }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newCode.every(digit => digit !== '') && !loading) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (verificationCode = code.join('')) => {
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification logic
      if (verificationCode === '123456') {
        onVerify(true);
      } else {
        setError('Invalid verification code. Please try again.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendCooldown(30);
    setError('');
    
    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success message or handle response
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    }
  };

  const getMethodIcon = () => {
    switch (method) {
      case 'email':
        return <Email color="primary" />;
      case 'app':
        return <Smartphone color="primary" />;
      default:
        return <Smartphone color="primary" />;
    }
  };

  const getMethodText = () => {
    switch (method) {
      case 'email':
        return 'your email address';
      case 'app':
        return 'your authenticator app';
      default:
        return 'your mobile number';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Security sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Two-Factor Authentication
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter the 6-digit code sent to {getMethodText()}
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 2 }}>
        {/* Code Input Fields */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
          {code.map((digit, index) => (
            <TextField
              key={index}
              inputRef={el => inputRefs.current[index] = el}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                },
              }}
              sx={{
                width: 48,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
              disabled={loading}
            />
          ))}
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Resend Code */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Didn't receive the code?
          </Typography>
          <Button
            variant="text"
            onClick={handleResend}
            disabled={resendCooldown > 0 || loading}
            startIcon={getMethodIcon()}
          >
            {resendCooldown > 0 
              ? `Resend in ${resendCooldown}s` 
              : 'Resend Code'
            }
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          fullWidth
        >
          Cancel
        </Button>
        <Button
          onClick={() => handleVerify()}
          variant="contained"
          disabled={loading || code.some(digit => digit === '')}
          fullWidth
          startIcon={loading && <CircularProgress size={16} />}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TwoFactorAuth;