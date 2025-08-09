import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  Pagination,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Refresh,
  DateRange,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import TransactionCard from '../components/transactions/TransactionCard';
import DiagnosisPanel from '../components/diagnosis/DiagnosisPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { transactionAPI, handleApiError, mockTransactions } from '../services/api';
import toast from 'react-hot-toast';

const Transactions = () => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [diagnosisOpen, setDiagnosisOpen] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [failureTypeFilter, setFailureTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, searchTerm, statusFilter, failureTypeFilter]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      // Try to fetch from API, fallback to mock data
      try {
        const response = await transactionAPI.getTransactions({ limit: 100 });
        setTransactions(response.data);
      } catch (apiError) {
        console.warn('API not available, using mock data');
        // Generate more mock data for better demo
        const extendedMockData = [...mockTransactions];
        for (let i = 0; i < 20; i++) {
          extendedMockData.push({
            ...mockTransactions[i % mockTransactions.length],
            transaction_id: `TXN${String(i + 100).padStart(3, '0')}`,
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }
        setTransactions(extendedMockData);
      }
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
      setTransactions(mockTransactions);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.sender_vpa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.receiver_vpa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.failure_reason && transaction.failure_reason.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }

    // Failure type filter
    if (failureTypeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.failure_type === failureTypeFilter);
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  const handleDiagnose = (transaction) => {
    setSelectedTransaction(transaction);
    setDiagnosisOpen(true);
  };

  const handleCloseDiagnosis = () => {
    setDiagnosisOpen(false);
    setSelectedTransaction(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setFailureTypeFilter('all');
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Transaction ID', 'Amount', 'Sender', 'Receiver', 'Status', 'Failure Reason', 'Timestamp'],
      ...filteredTransactions.map(t => [
        t.transaction_id,
        t.amount,
        t.sender_vpa,
        t.receiver_vpa,
        t.status,
        t.failure_reason || '',
        t.timestamp
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Transactions exported successfully');
  };

  if (loading) {
    return <LoadingSpinner message="Loading transactions..." />;
  }

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const failureTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'insufficient_funds', label: 'Insufficient Funds' },
    { value: 'invalid_vpa', label: 'Invalid VPA' },
    { value: 'network_issue', label: 'Network Issue' },
    { value: 'bank_server_error', label: 'Bank Server Error' },
    { value: 'daily_limit_exceeded', label: 'Daily Limit Exceeded' },
    { value: 'authentication_failed', label: 'Authentication Failed' },
  ];

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
            Transactions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and diagnose UPI payment transactions
          </Typography>
        </Box>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterList />
                Filters
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={loadTransactions}
                >
                  Refresh
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={exportTransactions}
                >
                  Export
                </Button>
              </Box>
            </Box>

            <Grid container spacing={3}>
              {/* Search */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Status Filter */}
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="success">Success</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Failure Type Filter */}
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Failure Type</InputLabel>
                  <Select
                    value={failureTypeFilter}
                    label="Failure Type"
                    onChange={(e) => setFailureTypeFilter(e.target.value)}
                  >
                    {failureTypes.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Active Filters */}
            {(searchTerm || statusFilter !== 'all' || failureTypeFilter !== 'all') && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  Active filters:
                </Typography>
                {searchTerm && (
                  <Chip
                    label={`Search: ${searchTerm}`}
                    onDelete={() => setSearchTerm('')}
                    size="small"
                  />
                )}
                {statusFilter !== 'all' && (
                  <Chip
                    label={`Status: ${statusFilter}`}
                    onDelete={() => setStatusFilter('all')}
                    size="small"
                  />
                )}
                {failureTypeFilter !== 'all' && (
                  <Chip
                    label={`Type: ${failureTypes.find(t => t.value === failureTypeFilter)?.label}`}
                    onDelete={() => setFailureTypeFilter('all')}
                    size="small"
                  />
                )}
                <Button size="small" onClick={clearFilters}>
                  Clear All
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body1" color="text.secondary">
            Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
          </Typography>
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
            />
          )}
        </Box>
      </motion.div>

      {/* Transaction List */}
      {paginatedTransactions.length > 0 ? (
        <Box>
          {paginatedTransactions.map((transaction, index) => (
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
              No Transactions Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or search criteria
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Bottom Pagination */}
      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* Diagnosis Panel */}
      <DiagnosisPanel
        open={diagnosisOpen}
        onClose={handleCloseDiagnosis}
        transaction={selectedTransaction}
      />
    </Box>
  );
};

export default Transactions;