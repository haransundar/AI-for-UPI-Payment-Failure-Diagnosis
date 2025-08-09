import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { motion } from 'framer-motion';

const TransactionChart = ({ data, title = 'Transaction Trends', type = 'line' }) => {
  const theme = useTheme();

  const chartData = data || [
    { name: 'Mon', success: 120, failed: 15, total: 135 },
    { name: 'Tue', success: 98, failed: 22, total: 120 },
    { name: 'Wed', success: 145, failed: 18, total: 163 },
    { name: 'Thu', success: 167, failed: 12, total: 179 },
    { name: 'Fri', success: 189, failed: 25, total: 214 },
    { name: 'Sat', success: 156, failed: 19, total: 175 },
    { name: 'Sun', success: 134, failed: 16, total: 150 },
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

  const renderChart = () => {
    if (type === 'area') {
      return (
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3} />
              <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.error.main} stopOpacity={0.3} />
              <stop offset="95%" stopColor={theme.palette.error.main} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis 
            dataKey="name" 
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
            dataKey="success"
            stackId="1"
            stroke={theme.palette.success.main}
            fill="url(#successGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="failed"
            stackId="1"
            stroke={theme.palette.error.main}
            fill="url(#errorGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      );
    }

    return (
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis 
          dataKey="name" 
          stroke={theme.palette.text.secondary}
          fontSize={12}
        />
        <YAxis 
          stroke={theme.palette.text.secondary}
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="success"
          stroke={theme.palette.success.main}
          strokeWidth={3}
          dot={{ fill: theme.palette.success.main, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: theme.palette.success.main, strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="failed"
          stroke={theme.palette.error.main}
          strokeWidth={3}
          dot={{ fill: theme.palette.error.main, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: theme.palette.error.main, strokeWidth: 2 }}
        />
      </LineChart>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
          }
          sx={{ pb: 1 }}
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              {renderChart()}
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TransactionChart;