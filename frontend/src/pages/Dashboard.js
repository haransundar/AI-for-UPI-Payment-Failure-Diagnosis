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
} from '@mui/material';
import {
  Receipt,
  Error,
  TrendingUp,
  Psychology,
  Refresh,
  Analytics,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import StatsCard from '../components/dashboard/StatsCard';
import TransactionChart from '../components/dashboard/TransactionChart';
import TransactionCard from '../components/transactions/TransactionCard';
import DiagnosisPanel from '../components/diagnosis/DiagnosisPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { transactionAPI, handleApiError, mockTransactions } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const theme = useTheme();
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
      avgResolutionTime: '5.2 min',
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

  const failedTransactions = transactions.filter(t => t.status === 'failed').slice(0, 5);

  return (
    <Box>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time insights into UPI payment failures and AI-powered diagnostics
          </Typography>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Transactions"
            value={stats.totalTransactions}
            change="+12% from last week"
            changeType="increase"
            icon={Receipt}
            color="primary"
            index={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Failed Transactions"
            value={stats.failedTransactions}
            change="-8% from last week"
            changeType="decrease"
            icon={Error}
            color="error"
            index={1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Success Rate"
            value={stats.successRate}
            change="+2.1% from last week"
            changeType="increase"
            icon={TrendingUp}
            color="success"
            index={2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Avg Resolution Time"
            value={stats.avgResolutionTime}
            change="-1.3 min from last week"
            changeType="decrease"
            icon={Psychology}
            color="secondary"
            index={3}
          />
        </Grid>
      </Grid>

      {/* Charts and Recent Failures */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Transaction Trends Chart */}
        <Grid item xs={12} lg={8}>
          <TransactionChart
            title="Transaction Trends (Last 7 Days)"
            type="area"
          />
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Quick Actions
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Analytics />}
                    fullWidth
                    sx={{
                      background: theme.palette.gradient?.primary || theme.palette.primary.main,
                      py: 1.5,
                    }}
                  >
                    View Analytics
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Psychology />}
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Bulk Diagnosis
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    fullWidth
                    onClick={loadDashboardData}
                    sx={{ py: 1.5 }}
                  >
                    Refresh Data
                  </Button>
                </Box>

                {/* System Status */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    System Status
                  </Typography>
                  <Alert severity="success" sx={{ borderRadius: 2 }}>
                    All systems operational
                  </Alert>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Recent Failed Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
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
              <TransactionCard
                key={transaction.transaction_id}
                transaction={transaction}
                onDiagnose={handleDiagnose}
                index={index}
              />
            ))}
          </Box>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
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

export default Dashboard;