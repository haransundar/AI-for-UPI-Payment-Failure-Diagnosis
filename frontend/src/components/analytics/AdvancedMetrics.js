import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  Chip,
  LinearProgress,
  useTheme,
  Alert,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Psychology,
  Speed,
  Warning,
  CheckCircle,
  Timeline,
  Analytics,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ReferenceLine,
} from 'recharts';
import PermissionGate, { PERMISSIONS } from '../security/PermissionGate';

const AdvancedMetrics = () => {
  const theme = useTheme();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    loadAdvancedMetrics();
  }, [timeRange]);

  const loadAdvancedMetrics = async () => {
    setLoading(true);
    try {
      // Simulate advanced analytics API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMetrics({
        // AI Performance Metrics
        aiAccuracy: {
          current: 94.7,
          trend: +2.3,
          confidence: 98.2,
          predictions: 1247,
        },
        
        // Failure Prediction
        predictiveInsights: {
          riskScore: 23,
          predictedFailures: 45,
          preventedFailures: 12,
          accuracy: 87.3,
        },
        
        // System Performance
        systemHealth: {
          apiLatency: 145,
          uptime: 99.97,
          errorRate: 0.03,
          throughput: 2847,
        },
        
        // Business Impact
        businessMetrics: {
          resolutionTime: 4.2,
          customerSatisfaction: 4.6,
          costSavings: 2.3,
          efficiency: 78.5,
        },
        
        // Anomaly Detection
        anomalies: [
          {
            type: 'spike',
            severity: 'medium',
            description: 'Unusual increase in network timeouts',
            timestamp: new Date(Date.now() - 3600000),
            impact: 'medium',
          },
          {
            type: 'pattern',
            severity: 'low',
            description: 'New failure pattern detected in HDFC transactions',
            timestamp: new Date(Date.now() - 7200000),
            impact: 'low',
          },
        ],
        
        // Predictive Timeline
        timeline: [
          { time: '00:00', predicted: 12, actual: 15, confidence: 85 },
          { time: '04:00', predicted: 8, actual: 6, confidence: 92 },
          { time: '08:00', predicted: 25, actual: 28, confidence: 78 },
          { time: '12:00', predicted: 42, actual: 39, confidence: 88 },
          { time: '16:00', predicted: 35, actual: 33, confidence: 91 },
          { time: '20:00', predicted: 28, actual: null, confidence: 87 },
        ],
      });
    } catch (error) {
      console.error('Failed to load advanced metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Loading Advanced Analytics...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  const MetricCard = ({ title, value, unit, trend, icon: Icon, color = 'primary' }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {title}
            </Typography>
            <Icon sx={{ color: `${color}.main`, fontSize: 24 }} />
          </Box>
          
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {value}
            <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 1 }}>
              {unit}
            </Typography>
          </Typography>
          
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend > 0 ? (
                <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
              )}
              <Typography
                variant="body2"
                sx={{ color: trend > 0 ? 'success.main' : 'error.main', fontWeight: 500 }}
              >
                {Math.abs(trend)}% vs last period
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <PermissionGate permission={PERMISSIONS.VIEW_DETAILED_ANALYTICS}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Advanced Analytics & AI Insights
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Machine learning powered insights and predictive analytics
          </Typography>
        </Box>

        {/* AI Performance Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="AI Accuracy"
              value={metrics.aiAccuracy.current}
              unit="%"
              trend={metrics.aiAccuracy.trend}
              icon={Psychology}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="System Uptime"
              value={metrics.systemHealth.uptime}
              unit="%"
              trend={0.02}
              icon={CheckCircle}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Avg Response Time"
              value={metrics.systemHealth.apiLatency}
              unit="ms"
              trend={-12}
              icon={Speed}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Risk Score"
              value={metrics.predictiveInsights.riskScore}
              unit="/100"
              trend={-5}
              icon={Warning}
              color="warning"
            />
          </Grid>
        </Grid>

        {/* Predictive Analytics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Timeline color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Failure Prediction Timeline
                    </Typography>
                  </Box>
                }
                action={
                  <Chip
                    label={`${metrics.predictiveInsights.accuracy}% Accuracy`}
                    color="success"
                    variant="outlined"
                  />
                }
              />
              <CardContent>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={metrics.timeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                      <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
                      <YAxis stroke={theme.palette.text.secondary} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 8,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke={theme.palette.primary.main}
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        name="Predicted Failures"
                      />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke={theme.palette.secondary.main}
                        strokeWidth={3}
                        name="Actual Failures"
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
                    <Analytics color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Anomaly Detection
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                {metrics.anomalies.map((anomaly, index) => (
                  <Alert
                    key={index}
                    severity={anomaly.severity === 'high' ? 'error' : anomaly.severity === 'medium' ? 'warning' : 'info'}
                    sx={{ mb: 2, borderRadius: 2 }}
                  >
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                      {anomaly.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {anomaly.timestamp.toLocaleTimeString()} • Impact: {anomaly.impact}
                    </Typography>
                  </Alert>
                ))}
                
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  View All Anomalies
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Business Impact Metrics */}
        <Card>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight={600}>
                Business Impact Analysis
              </Typography>
            }
          />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="success.main" gutterBottom>
                    {metrics.businessMetrics.resolutionTime}min
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Resolution Time
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{ mt: 1, borderRadius: 1 }}
                    color="success"
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
                    {metrics.businessMetrics.customerSatisfaction}/5
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customer Satisfaction
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={92}
                    sx={{ mt: 1, borderRadius: 1 }}
                    color="primary"
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="secondary.main" gutterBottom>
                    ₹{metrics.businessMetrics.costSavings}M
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Cost Savings
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={68}
                    sx={{ mt: 1, borderRadius: 1 }}
                    color="secondary"
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="warning.main" gutterBottom>
                    {metrics.businessMetrics.efficiency}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Operational Efficiency
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={78}
                    sx={{ mt: 1, borderRadius: 1 }}
                    color="warning"
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </PermissionGate>
  );
};

export default AdvancedMetrics;