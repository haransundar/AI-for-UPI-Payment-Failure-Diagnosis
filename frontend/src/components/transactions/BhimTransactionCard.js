import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  Divider,
  Button,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  AccountBalance,
  Person,
  Schedule,
  Error,
  CheckCircle,
  Psychology,
  Refresh,
  Warning,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { BHIM_COLORS } from '../../theme/bhimTheme';

const BhimTransactionCard = ({ transaction, onDiagnose, index = 0 }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMM, HH:mm');
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return {
          color: BHIM_COLORS.philippineGreen,
          bgColor: BHIM_COLORS.greenAlpha,
          icon: <CheckCircle sx={{ fontSize: 20 }} />,
          label: 'Success',
        };
      case 'failed':
      case 'failure':
        return {
          color: BHIM_COLORS.heatWaveOrange,
          bgColor: BHIM_COLORS.orangeAlpha,
          icon: <Error sx={{ fontSize: 20 }} />,
          label: 'Failed',
        };
      case 'pending':
        return {
          color: BHIM_COLORS.warning,
          bgColor: 'rgba(255, 167, 38, 0.1)',
          icon: <Schedule sx={{ fontSize: 20 }} />,
          label: 'Pending',
        };
      default:
        return {
          color: theme.palette.text.secondary,
          bgColor: theme.palette.action.hover,
          icon: <Warning sx={{ fontSize: 20 }} />,
          label: 'Unknown',
        };
    }
  };

  const statusConfig = getStatusConfig(transaction.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${theme.palette.divider}`,
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Transaction Avatar */}
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: statusConfig.bgColor,
                  color: statusConfig.color,
                }}
              >
                {statusConfig.icon}
              </Avatar>
              
              <Box>
                <Typography variant="body1" fontWeight={600} sx={{ color: theme.palette.text.primary }}>
                  {transaction.transaction_id}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(transaction.timestamp)}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                sx={{ 
                  color: statusConfig.color,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                {formatAmount(transaction.amount)}
              </Typography>
              <IconButton onClick={handleExpand} size="small">
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
          </Box>

          {/* Status and Basic Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Chip
              label={statusConfig.label}
              sx={{
                backgroundColor: statusConfig.bgColor,
                color: statusConfig.color,
                fontWeight: 600,
                fontSize: '0.75rem',
                border: `1px solid ${statusConfig.color}30`,
              }}
              size="small"
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {transaction.sender_vpa} → {transaction.receiver_vpa}
              </Typography>
            </Box>
          </Box>

          {/* Failure Reason (if failed) */}
          {transaction.failure_reason && (
            <Box 
              sx={{ 
                p: 2, 
                borderRadius: 2, 
                backgroundColor: BHIM_COLORS.orangeAlpha,
                border: `1px solid ${BHIM_COLORS.heatWaveOrange}30`,
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Error sx={{ color: BHIM_COLORS.heatWaveOrange, fontSize: 18 }} />
                <Typography variant="body2" fontWeight={600} sx={{ color: BHIM_COLORS.heatWaveOrange }}>
                  Failure Reason
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                {transaction.failure_reason}
              </Typography>
            </Box>
          )}

          {/* Expanded Details */}
          <Collapse in={expanded}>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Sender Bank
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {transaction.sender_bank}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Receiver Bank
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {transaction.receiver_bank}
                </Typography>
              </Box>

              {transaction.error_code && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Error Code
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {transaction.error_code}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Retry Count
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {transaction.retry_count || 0}
                </Typography>
              </Box>
            </Box>

            {/* BHIM-style Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Psychology />}
                onClick={() => onDiagnose(transaction)}
                sx={{
                  background: `linear-gradient(135deg, ${BHIM_COLORS.heatWaveOrange} 0%, ${BHIM_COLORS.orangeLight} 100%)`,
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${BHIM_COLORS.orangeDark} 0%, ${BHIM_COLORS.heatWaveOrange} 100%)`,
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                AI Diagnosis
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                sx={{
                  borderColor: BHIM_COLORS.philippineGreen,
                  color: BHIM_COLORS.philippineGreen,
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    backgroundColor: BHIM_COLORS.greenAlpha,
                    borderColor: BHIM_COLORS.greenDark,
                  },
                }}
              >
                Retry
              </Button>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BhimTransactionCard;