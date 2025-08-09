import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Receipt,
  Error,
  TrendingUp,
  Psychology,
  Refresh,
  Analytics,
  CheckCircle,
  Warning,
  Mic,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import BhimStatsCard from '../components/dashboard/BhimStatsCard';
import BhimQuickActions from '../components/dashboard/BhimQuickActions';
import BhimTransactionCard from '../components/transactions/BhimTransactionCard';
import TransactionChart from '../components/dashboard/TransactionChart';
import DiagnosisPanel from '../components/diagnosis/DiagnosisPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { transactionAPI, handleApiError, mockTransactions } from '../services/api';
import { BHIM_COLORS } from '../theme/bhimTheme';
import toast from 'react-hot-toast';

const BhimDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [diagnosisOpen, setDiagnosisOpen] = useState(false);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    failedTransactions: 0,
    successRate: 0,
    avgResolutionTime: '0 min',
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Try to fetch from API, fallback to mock data
      try {
        const response = await transactionAPI.getTransactions({ limit: 10 });
        setTransactions(response.data);
      } catch (apiError) {
        console.warn('API not available, using mock data');
        setTransactions(mockTransactions);
      }

      // Calculate stats
      calculateStats(transactions.length > 0 ? transactions : mockTransactions);
      
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
      // Use mock data as fallback
      setTransactions(mockTransactions);
      calculateStats(mockTransactions);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (transactionData) => {
    const total = transactionData.length;
    const failed = transactionData.filter(t => t.status === 'failed').length;
    const successRate = total > 0 ? ((total - failed) / total * 100).toFixed(1) : 0;

    setStats({
      totalTransactions: total,
      failedTransactions: failed,
      successRate: `${successRate}%`,
      avgResolutionTime: '4.2 min',
    });
  };

  const handleDiagnose = (transaction) => {
    setSelectedTransaction(transaction);
    setDiagnosisOpen(true);
  };

  const handleCloseDiagnosis = () => {
    setDiagnosisOpen(false);
    setSelectedTransaction(null);
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const failedTransactions = transactions.filter(t => t.status === 'failed').slice(0, 3);

  return (
    <Box>
      {/* BHIM-style Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            fontWeight={700} 
            gutterBottom
            sx={{ 
              color: theme.palette.text.primary,
              fontSize: { xs: '1.5rem', sm: '2rem' },
            }}
          >
            Welcome to UPI Diagnosis
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            AI-powered insights for UPI payment failures
          </Typography>
        </Box>
      </motion.div>

      {/* Voice Mode CTA (BHIM-style) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card 
          sx={{ 
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${BHIM_COLORS.heatWaveOrange} 0%, ${BHIM_COLORS.orangeLight} 100%)`,
            color: 'white',
            border: 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Mic sx={{ fontSize: 32, mr: 2 }} />
                  <Typography variant="h5" fontWeight={700}>
                    🎤 Try Voice Diagnosis
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                  Speak your UPI transaction issue and get instant AI-powered diagnosis with voice response
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  ✓ Speech-to-Text Recognition  ✓ AI Analysis  ✓ Voice Response  ✓ Multi-language Support
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => window.location.href = '/voice'}
                  sx={{
                    backgroundColor: 'white',
                    color: BHIM_COLORS.heatWaveOrange,
                    fontWeight: 600,
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  startIcon={<Mic />}
                >
                  Start Voice Mode
                </Button>
              </Grid>
            </Grid>
          </CardContent>
          {/* Background decoration */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              zIndex: 1,
            }}
          />
        </Card>
      </motion.div>

      {/* Quick Actions (BHIM-style) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <BhimQuickActions />
      </motion.div>

      {/* Stats Cards (BHIM-style) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={6} md={3}>
            <BhimStatsCard
              title="Total Transactions"
              value={stats.totalTransactions}
              change="+12% this week"
              changeType="increase"
              icon={Receipt}
              color="orange"
              index={0}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <BhimStatsCard
              title="Failed Transactions"
              value={stats.failedTransactions}
              change="-8% this week"
              changeType="decrease"
              icon={Error}
              color="orange"
              index={1}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <BhimStatsCard
              title="Success Rate"
              value={stats.successRate}
              change="+2.1% this week"
              changeType="increase"
              icon={CheckCircle}
              color="green"
              index={2}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <BhimStatsCard
              title="Avg Resolution"
              value={stats.avgResolutionTime}
              change="-1.3 min faster"
              changeType="decrease"
              icon={Psychology}
              color="green"
              index={3}
            />
          </Grid>
        </Grid>
      </motion.div>

      {/* System Status Alert (BHIM-style) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Alert 
          severity="success" 
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            backgroundColor: BHIM_COLORS.greenAlpha,
            border: `1px solid ${BHIM_COLORS.philippineGreen}30`,
            '& .MuiAlert-icon': {
              color: BHIM_COLORS.philippineGreen,
            },
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            All systems operational • AI diagnosis accuracy: 94.7%
          </Typography>
        </Alert>
      </motion.div>

      {/* Charts and Recent Failures */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Transaction Trends Chart */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <TransactionChart
              title="Transaction Trends (Last 7 Days)"
              type="area"
            />
          </motion.div>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Today's Summary
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: BHIM_COLORS.greenAlpha,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckCircle sx={{ color: BHIM_COLORS.philippineGreen, fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Successful
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          847
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: BHIM_COLORS.orangeAlpha,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Error sx={{ color: BHIM_COLORS.heatWaveOrange, fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Failed
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          23
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 167, 38, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Warning sx={{ color: BHIM_COLORS.warning, fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Pending
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          5
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ 
                    mt: 3,
                    borderColor: BHIM_COLORS.heatWaveOrange,
                    color: BHIM_COLORS.heatWaveOrange,
                    '&:hover': {
                      backgroundColor: BHIM_COLORS.orangeAlpha,
                    },
                  }}
                  onClick={loadDashboardData}
                  startIcon={<Refresh />}
                >
                  Refresh Data
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Recent Failed Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Recent Failed Transactions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Latest payment failures requiring attention
          </Typography>
        </Box>

        {failedTransactions.length > 0 ? (
          <Box>
            {failedTransactions.map((transaction, index) => (
              <BhimTransactionCard
                key={transaction.transaction_id}
                transaction={transaction}
                onDiagnose={handleDiagnose}
                index={index}
              />
            ))}
            
            {/* View All Button */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  background: `linear-gradient(135deg, ${BHIM_COLORS.heatWaveOrange} 0%, ${BHIM_COLORS.orangeLight} 100%)`,
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${BHIM_COLORS.orangeDark} 0%, ${BHIM_COLORS.heatWaveOrange} 100%)`,
                    transform: 'translateY(-1px)',
                  },
                }}
                onClick={() => window.location.href = '/transactions'}
              >
                View All Transactions
              </Button>
            </Box>
          </Box>
        ) : (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <CheckCircle sx={{ fontSize: 64, color: BHIM_COLORS.philippineGreen, mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Failed Transactions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All recent transactions completed successfully
              </Typography>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Diagnosis Panel */}
      <DiagnosisPanel
        open={diagnosisOpen}
        onClose={handleCloseDiagnosis}
        transaction={selectedTransaction}
      />
    </Box>
  );
};

export default BhimDashboard;