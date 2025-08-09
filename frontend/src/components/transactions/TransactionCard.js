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
  useTheme,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  AccountBalance,
  Person,
  Schedule,
  Error,
  Refresh,
  Psychology,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import StatusChip from '../common/StatusChip';

const TransactionCard = ({ transaction, onDiagnose, index = 0 }) => {
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
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const getFailureTypeColor = (failureType) => {
    switch (failureType) {
      case 'insufficient_funds':
        return 'error';
      case 'invalid_vpa':
        return 'warning';
      case 'network_issue':
        return 'info';
      case 'bank_server_error':
        return 'error';
      case 'daily_limit_exceeded':
        return 'warning';
      case 'authentication_failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getFailureTypeLabel = (failureType) => {
    switch (failureType) {
      case 'insufficient_funds':
        return 'Insufficient Funds';
      case 'invalid_vpa':
        return 'Invalid VPA';
      case 'network_issue':
        return 'Network Issue';
      case 'bank_server_error':
        return 'Bank Server Error';
      case 'daily_limit_exceeded':
        return 'Daily Limit Exceeded';
      case 'authentication_failed':
        return 'Authentication Failed';
      default:
        return failureType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        sx={{
          mb: 2,
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: theme.shadows[4],
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                {transaction.transaction_id}
              </Typography>
              <StatusChip status={transaction.status} size="small" />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" fontWeight={700} color="primary">
                {formatAmount(transaction.amount)}
              </Typography>
              <IconButton onClick={handleExpand} size="small">
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
          </Box>

          {/* Basic Info */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              <Person sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  From
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {transaction.sender_vpa}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              <AccountBalance sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  To
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {transaction.receiver_vpa}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              <Schedule sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Time
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {formatDate(transaction.timestamp)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Failure Info */}
          {transaction.failure_reason && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Error sx={{ color: theme.palette.error.main, fontSize: 20 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Failure Reason
                </Typography>
                <Typography variant="body2" fontWeight={500} color="error">
                  {transaction.failure_reason}
                </Typography>
              </Box>
              {transaction.failure_type && (
                <Chip
                  label={getFailureTypeLabel(transaction.failure_type)}
                  color={getFailureTypeColor(transaction.failure_type)}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          )}

          {/* Expanded Details */}
          <Collapse in={expanded}>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
              {transaction.error_code && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Error Code
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {transaction.error_code}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Retry Count
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {transaction.retry_count || 0}
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Psychology />}
                onClick={() => onDiagnose(transaction)}
                sx={{
                  background: theme.palette.gradient?.secondary || theme.palette.secondary.main,
                  '&:hover': {
                    background: theme.palette.gradient?.secondary || theme.palette.secondary.dark,
                  },
                }}
              >
                AI Diagnosis
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                color="primary"
              >
                Retry Transaction
              </Button>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TransactionCard;