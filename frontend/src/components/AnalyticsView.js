import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AnalyticsView = ({ transactions, failureTypes }) => {
  // Calculate success/failure ratio
  const successCount = transactions.filter(t => t.status === 'SUCCESS').length;
  const failureCount = transactions.filter(t => t.status === 'FAILED').length;
  const totalCount = transactions.length;

  const statusData = [
    { name: 'Success', value: successCount, color: '#4caf50' },
    { name: 'Failed', value: failureCount, color: '#f44336' }
  ];

  // Prepare failure types data for chart
  const failureTypeData = Object.entries(failureTypes).map(([type, count]) => ({
    name: type.replace('_', ' ').toUpperCase(),
    count,
    percentage: ((count / failureCount) * 100).toFixed(1)
  }));

  // Calculate average transaction amount
  const avgAmount = transactions.length > 0 
    ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length 
    : 0;

  // Calculate failure rate by amount range
  const amountRanges = [
    { range: '₹0-100', min: 0, max: 100 },
    { range: '₹101-1000', min: 101, max: 1000 },
    { range: '₹1001-10000', min: 1001, max: 10000 },
    { range: '₹10000+', min: 10001, max: Infinity }
  ];

  const amountAnalysis = amountRanges.map(({ range, min, max }) => {
    const rangeTransactions = transactions.filter(t => t.amount >= min && t.amount <= max);
    const rangeFailed = rangeTransactions.filter(t => t.status === 'FAILED').length;
    const failureRate = rangeTransactions.length > 0 
      ? ((rangeFailed / rangeTransactions.length) * 100).toFixed(1)
      : 0;
    
    return {
      range,
      total: rangeTransactions.length,
      failed: rangeFailed,
      failureRate: parseFloat(failureRate)
    };
  });

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Transaction Analytics
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {totalCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {((successCount / totalCount) * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Success Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {failureCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Failed Transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                ₹{avgAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg. Amount
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Success/Failure Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transaction Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Failure Types Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Failure Types Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={failureTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ff9800" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Failure Rate by Amount Range */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Failure Rate by Transaction Amount
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={amountAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'failureRate' ? `${value}%` : value,
                    name === 'failureRate' ? 'Failure Rate' : name === 'total' ? 'Total Transactions' : 'Failed Transactions'
                  ]}
                />
                <Legend />
                <Bar dataKey="total" fill="#2196f3" name="Total" />
                <Bar dataKey="failed" fill="#f44336" name="Failed" />
                <Bar dataKey="failureRate" fill="#ff9800" name="Failure Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsView;