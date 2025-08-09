import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { format } from 'date-fns';

const TransactionDashboard = ({ 
  transactions, 
  onTransactionSelect, 
  selectedTransaction, 
  loading 
}) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.status.toLowerCase() === filter;
    const matchesSearch = !searchTerm || 
      transaction.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.sender_vpa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.receiver_vpa.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    return status === 'SUCCESS' ? 'success' : 'error';
  };

  const getFailureTypeColor = (failureType) => {
    const colors = {
      'insufficient_funds': '#ff5722',
      'incorrect_details': '#ff9800',
      'network_issue': '#2196f3',
      'bank_server_error': '#9c27b0',
      'daily_limit_exceeded': '#795548',
      'invalid_vpa': '#f44336',
      'timeout': '#607d8b',
      'authentication_failed': '#e91e63'
    };
    return colors[failureType] || '#757575';
  };

  if (loading && transactions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Transaction Dashboard
      </Typography>
      
      <Box mb={3} display="flex" gap={2}>
        <TextField
          label="Search transactions"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
        />
        
        <TextField
          select
          label="Filter by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="success">Success</MenuItem>
          <MenuItem value="failed">Failed</MenuItem>
        </TextField>
      </Box>

      {filteredTransactions.length === 0 ? (
        <Alert severity="info">
          No transactions found matching your criteria.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {filteredTransactions.map((transaction) => (
            <Grid item xs={12} md={6} lg={4} key={transaction.transaction_id}>
              <Card 
                className={`transaction-card ${
                  selectedTransaction?.transaction_id === transaction.transaction_id ? 'selected' : ''
                }`}
                onClick={() => onTransactionSelect(transaction)}
                elevation={2}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="div" noWrap>
                      {transaction.transaction_id}
                    </Typography>
                    <Chip
                      label={transaction.status}
                      color={getStatusColor(transaction.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {format(new Date(transaction.timestamp), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                  
                  <Typography variant="h6" color="primary" gutterBottom>
                    ₹{transaction.amount.toLocaleString('en-IN')}
                  </Typography>
                  
                  <Box mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      From: {transaction.sender_vpa}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      To: {transaction.receiver_vpa}
                    </Typography>
                  </Box>
                  
                  {transaction.status === 'FAILED' && transaction.failure_type && (
                    <Chip
                      label={transaction.failure_type.replace('_', ' ').toUpperCase()}
                      size="small"
                      sx={{ 
                        backgroundColor: getFailureTypeColor(transaction.failure_type),
                        color: 'white',
                        mt: 1
                      }}
                    />
                  )}
                  
                  {transaction.retry_count > 0 && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Retries: {transaction.retry_count}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TransactionDashboard;