import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  Chip,
  Alert,
  Button,
  Switch,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import {
  MonitorHeart,
  Speed,
  TrendingUp,
  Warning,
  CheckCircle,
  Error,
  Pause,
  PlayArrow,
  Refresh,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const RealTimeMonitor = () => {
  const theme = useTheme();
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [metrics, setMetrics] = useState({
    transactionsPerSecond: 0,
    failureRate: 0,
    avgResponseTime: 0,
    activeConnections: 0,
    systemLoad: 0,
  });
  const [alerts, setAlerts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const intervalRef = useRef();

  useEffect(() => {
    if (isMonitoring) {
      startMonitoring();
    } else {
      stopMonitoring();
    }

    return () => stopMonitoring();
  }, [isMonitoring]);

  const startMonitoring = () => {
    intervalRef.current = setInterval(() => {
      updateMetrics();
      updateChartData();
      checkForAlerts();
    }, 2000); // Update every 2 seconds
  };

  const stopMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const updateMetrics = () => {
    // Simulate real-time metrics
    const newMetrics = {
      transactionsPerSecond: Math.floor(Math.random() * 50) + 20,
      failureRate: Math.random() * 5,
      avgResponseTime: Math.floor(Math.random() * 200) + 100,
      activeConnections: Math.floor(Math.random() * 100) + 200,
      systemLoad: Math.random() * 100,
    };

    setMetrics(newMetrics);
  };

  const updateChartData = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();

    setChartData(prevData => {
      const newData = [
        ...prevData,
        {
          time: timeString,
          tps: metrics.transactionsPerSecond,
          failureRate: metrics.failureRate,
          responseTime: metrics.avgResponseTime,
        }
      ].slice(-20); // Keep only last 20 data points

      return newData;
    });
  };

  const checkForAlerts = () => {
    const newAlerts = [];

    if (metrics.failureRate > 3) {
      newAlerts.push({
        id: Date.now(),
        type: 'error',
        title: 'High Failure Rate',
        message: `Failure rate is ${metrics.failureRate.toFixed(1)}% (threshold: 3%)`,
        timestamp: new Date(),
      });
    }

    if (metrics.avgResponseTime > 300) {
      newAlerts.push({
        id: Date.now() + 1,
        type: 'warning',
        title: 'High Response Time',
        message: `Average response time is ${metrics.avgResponseTime}ms (threshold: 300ms)`,
        timestamp: new Date(),
      });
    }

    if (metrics.systemLoad > 80) {
      newAlerts.push({
        id: Date.now() + 2,
        type: 'warning',
        title: 'High System Load',
        message: `System load is ${metrics.systemLoad.toFixed(1)}% (threshold: 80%)`,
        timestamp: new Date(),
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prevAlerts => [...newAlerts, ...prevAlerts].slice(0, 10));
    }
  };

  const getStatusColor = (value, thresholds) => {
    if (value > thresholds.critical) return 'error';
    if (value > thresholds.warning) return 'warning';
    return 'success';
  };

  const MetricCard = ({ title, value, unit, icon: Icon, thresholds, format = (v) => v }) => {
    const status = getStatusColor(value, thresholds);
    
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {title}
              </Typography>
              <Icon sx={{ color: `${status}.main`, fontSize: 24 }} />
            </Box>
            
            <Typography variant="h4" fontWeight={700} color={`${status}.main`} gutterBottom>
              {format(value)}
              <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                {unit}
              </Typography>
            </Typography>
            
            {/* Status indicator */}
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: `${status}.main`,
                animation: status === 'error' ? 'pulse 1s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                  '100%': { opacity: 1 },
                },
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Real-Time System Monitor
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Live system performance and health metrics
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isMonitoring}
                onChange={(e) => setIsMonitoring(e.target.checked)}
                color="primary"
              />
            }
            label="Live Monitoring"
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => {
              setChartData([]);
              setAlerts([]);
            }}
          >
            Clear Data
          </Button>
        </Box>
      </Box>

      {/* Status Indicator */}
      <Alert
        severity={isMonitoring ? 'success' : 'warning'}
        sx={{ mb: 3, borderRadius: 2 }}
        icon={isMonitoring ? <MonitorHeart /> : <Pause />}
      >
        <Typography variant="body2" fontWeight={500}>
          {isMonitoring ? 'Real-time monitoring is active' : 'Monitoring is paused'}
        </Typography>
      </Alert>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="Transactions/sec"
            value={metrics.transactionsPerSecond}
            unit="TPS"
            icon={Speed}
            thresholds={{ warning: 40, critical: 60 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="Failure Rate"
            value={metrics.failureRate}
            unit="%"
            icon={Error}
            thresholds={{ warning: 2, critical: 5 }}
            format={(v) => v.toFixed(1)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="Response Time"
            value={metrics.avgResponseTime}
            unit="ms"
            icon={TrendingUp}
            thresholds={{ warning: 200, critical: 300 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="Active Connections"
            value={metrics.activeConnections}
            unit=""
            icon={CheckCircle}
            thresholds={{ warning: 300, critical: 400 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <MetricCard
            title="System Load"
            value={metrics.systemLoad}
            unit="%"
            icon={Warning}
            thresholds={{ warning: 70, critical: 90 }}
            format={(v) => v.toFixed(1)}
          />
        </Grid>
      </Grid>

      {/* Real-time Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Performance Timeline
                  </Typography>
                  {isMonitoring && (
                    <Chip
                      label="LIVE"
                      color="success"
                      size="small"
                      sx={{
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': { opacity: 1 },
                          '50%': { opacity: 0.7 },
                          '100%': { opacity: 1 },
                        },
                      }}
                    />
                  )}
                </Box>
              }
            />
            <CardContent>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <XAxis 
                      dataKey="time" 
                      stroke={theme.palette.text.secondary}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke={theme.palette.text.secondary}
                      fontSize={12}
                    />
                    <ReferenceLine y={3} stroke={theme.palette.error.main} strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="tps"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      dot={false}
                      name="TPS"
                    />
                    <Line
                      type="monotone"
                      dataKey="failureRate"
                      stroke={theme.palette.error.main}
                      strokeWidth={2}
                      dot={false}
                      name="Failure Rate %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Warning color="warning" />
                  <Typography variant="h6" fontWeight={600}>
                    Live Alerts
                  </Typography>
                </Box>
              }
            />
            <CardContent sx={{ maxHeight: 300, overflow: 'auto' }}>
              <AnimatePresence>
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert
                        severity={alert.type}
                        sx={{ mb: 2, borderRadius: 2 }}
                      >
                        <Typography variant="body2" fontWeight={500} gutterBottom>
                          {alert.title}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {alert.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {alert.timestamp.toLocaleTimeString()}
                        </Typography>
                      </Alert>
                    </motion.div>
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      No alerts - system is healthy
                    </Typography>
                  </Box>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RealTimeMonitor;