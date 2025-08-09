import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
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
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import { motion } from 'framer-motion';
import StatsCard from '../components/dashboard/StatsCard';
import {
  TrendingUp,
  Error,
  Speed,
  Psychology,
} from '@mui/icons-material';

const Analytics = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('7d');

  // Mock analytics data
  const failureDistribution = [
    { name: 'Insufficient Funds', value: 35, color: '#F44336' },
    { name: 'Network Issues', value: 25, color: '#FF9800' },
    { name: 'Invalid VPA', value: 20, color: '#2196F3' },
    { name: 'Bank Server Error', value: 12, color: '#9C27B0' },
    { name: 'Authentication Failed', value: 8, color: '#4CAF50' },
  ];

  const hourlyFailures = [
    { hour: '00', failures: 5 },
    { hour: '01', failures: 3 },
    { hour: '02', failures: 2 },
    { hour: '03', failures: 1 },
    { hour: '04', failures: 2 },
    { hour: '05', failures: 4 },
    { hour: '06', failures: 8 },
    { hour: '07', failures: 15 },
    { hour: '08', failures: 25 },
    { hour: '09', failures: 35 },
    { hour: '10', failures: 42 },
    { hour: '11', failures: 38 },
    { hour: '12', failures: 45 },
    { hour: '13', failures: 40 },
    { hour: '14', failures: 35 },
    { hour: '15', failures: 30 },
    { hour: '16', failures: 28 },
    { hour: '17', failures: 32 },
    { hour: '18', failures: 38 },
    { hour: '19', failures: 35 },
    { hour: '20', failures: 30 },
    { hour: '21', failures: 25 },
    { hour: '22', failures: 18 },
    { hour: '23', failures: 12 },
  ];

  const resolutionTrends = [
    { date: 'Mon', avgTime: 4.2, resolved: 85 },
    { date: 'Tue', avgTime: 3.8, resolved: 92 },
    { date: 'Wed', avgTime: 5.1, resolved: 78 },
    { date: 'Thu', avgTime: 3.5, resolved: 95 },
    { date: 'Fri', avgTime: 4.8, resolved: 88 },
    { date: 'Sat', avgTime: 3.2, resolved: 96 },
    { date: 'Sun', avgTime: 3.9, resolved: 90 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: theme.palette.background.paper,
            p: 2,
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color, mb: 0.5 }}
            >
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Deep insights into payment failure patterns and AI diagnosis performance
            </Typography>
          </Box>
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </motion.div>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Failure Rate"
            value="12.3%"
            change="-2.1% from last period"
            changeType="decrease"
            icon={Error}
            color="error"
            index={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Avg Resolution Time"
            value="4.2 min"
            change="-0.8 min from last period"
            changeType="decrease"
            icon={Speed}
            color="success"
            index={1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="AI Accuracy"
            value="94.7%"
            change="+1.2% from last period"
            changeType="increase"
            icon={Psychology}
            color="primary"
            index={2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Auto-Resolved"
            value="68.5%"
            change="+5.3% from last period"
            changeType="increase"
            icon={TrendingUp}
            color="secondary"
            index={3}
          />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Failure Distribution */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight={600}>
                    Failure Type Distribution
                  </Typography>
                }
              />
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={failureDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {failureDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                
                {/* Legend */}
                <Box sx={{ mt: 2 }}>
                  {failureDistribution.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          bgcolor: item.color,
                          borderRadius: '50%',
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {item.value}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Hourly Failure Pattern */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight={600}>
                    Hourly Failure Pattern
                  </Typography>
                }
              />
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={hourlyFailures}>
                      <defs>
                        <linearGradient id="failureGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.palette.error.main} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={theme.palette.error.main} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                      <XAxis 
                        dataKey="hour" 
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                      />
                      <YAxis 
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="failures"
                        stroke={theme.palette.error.main}
                        fill="url(#failureGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3}>
        {/* Resolution Trends */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight={600}>
                    Resolution Performance Trends
                  </Typography>
                }
              />
              <CardContent>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer>
                    <LineChart data={resolutionTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                      <XAxis 
                        dataKey="date" 
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                      />
                      <YAxis 
                        yAxisId="time"
                        orientation="left"
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                      />
                      <YAxis 
                        yAxisId="percentage"
                        orientation="right"
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        yAxisId="percentage"
                        dataKey="resolved"
                        fill={theme.palette.success.main}
                        opacity={0.3}
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        yAxisId="time"
                        type="monotone"
                        dataKey="avgTime"
                        stroke={theme.palette.primary.main}
                        strokeWidth={3}
                        dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: theme.palette.primary.main, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;