import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
  Grid,
  Alert,
  LinearProgress,
  Chip,
  Divider,
  TextField,
  useTheme,
} from '@mui/material';
import {
  CloudDownload,
  Storage,
  PlayArrow,
  Info,
  Analytics,
  Refresh,
  CheckCircle,
  Error,
  Warning,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { datasetAPI, handleApiError } from '../../services/api';
import { BHIM_COLORS } from '../../theme/bhimTheme';
import toast from 'react-hot-toast';

const DatasetManager = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(100);
  const [simulationRunning, setSimulationRunning] = useState(false);

  useEffect(() => {
    loadDatasetInfo();
    loadStatistics();
  }, []);

  const loadDatasetInfo = async () => {
    try {
      const response = await datasetAPI.getDatasetInfo();
      setDatasetInfo(response.data);
    } catch (error) {
      console.error('Failed to load dataset info:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await datasetAPI.getDatasetStatistics();
      if (response.data.status === 'success') {
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleLoadDataset = async () => {
    setLoading(true);
    try {
      const response = await datasetAPI.loadHuggingFaceDataset();
      toast.success(response.data.message);
      setStatistics(response.data.statistics);
      await loadDatasetInfo();
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIngestToMongoDB = async () => {
    setLoading(true);
    try {
      const response = await datasetAPI.ingestToMongoDB();
      toast.success(response.data.message);
      await loadStatistics();
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateRealtime = async () => {
    setSimulationRunning(true);
    try {
      const response = await datasetAPI.simulateRealtime(speedMultiplier);
      toast.success(response.data.message);
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    } finally {
      setSimulationRunning(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

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
            Dataset Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage Hugging Face UPI transaction dataset integration
          </Typography>
        </Box>
      </motion.div>

      {/* Dataset Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Dataset Information
                </Typography>
              </Box>
            }
            action={
              datasetInfo?.status === 'loaded' ? (
                <Chip
                  label="Loaded"
                  color="success"
                  icon={<CheckCircle />}
                />
              ) : (
                <Chip
                  label="Not Loaded"
                  color="default"
                  icon={<Warning />}
                />
              )
            }
          />
          <CardContent>
            {datasetInfo ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Dataset Name
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {datasetInfo.dataset_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Source
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {datasetInfo.source}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {datasetInfo.description}
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Alert severity="info">
                Loading dataset information...
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight={600}>
                Dataset Actions
              </Typography>
            }
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<CloudDownload />}
                  onClick={handleLoadDataset}
                  disabled={loading}
                  sx={{
                    background: `linear-gradient(135deg, ${BHIM_COLORS.heatWaveOrange} 0%, ${BHIM_COLORS.orangeLight} 100%)`,
                    py: 1.5,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${BHIM_COLORS.orangeDark} 0%, ${BHIM_COLORS.heatWaveOrange} 100%)`,
                    },
                  }}
                >
                  Load Dataset
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Storage />}
                  onClick={handleIngestToMongoDB}
                  disabled={loading || !statistics}
                  sx={{
                    background: `linear-gradient(135deg, ${BHIM_COLORS.philippineGreen} 0%, ${BHIM_COLORS.greenLight} 100%)`,
                    py: 1.5,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${BHIM_COLORS.greenDark} 0%, ${BHIM_COLORS.philippineGreen} 100%)`,
                    },
                  }}
                >
                  Ingest to MongoDB
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Refresh />}
                  onClick={loadStatistics}
                  disabled={loading}
                  sx={{
                    borderColor: BHIM_COLORS.heatWaveOrange,
                    color: BHIM_COLORS.heatWaveOrange,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: BHIM_COLORS.orangeAlpha,
                    },
                  }}
                >
                  Refresh Stats
                </Button>
              </Grid>
            </Grid>

            {loading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Processing dataset...
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics Card */}
      {statistics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card sx={{ mb: 3, borderRadius: 3 }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Analytics color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Dataset Statistics
                  </Typography>
                </Box>
              }
            />
            <CardContent>
              <Grid container spacing={3}>
                {/* Transaction Counts */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} color="primary.main">
                      {formatNumber(statistics.total_transactions)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Transactions
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} sx={{ color: BHIM_COLORS.philippineGreen }}>
                      {formatNumber(statistics.successful_transactions)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Successful
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} sx={{ color: BHIM_COLORS.heatWaveOrange }}>
                      {formatNumber(statistics.failed_transactions)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Failed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} color="warning.main">
                      {formatNumber(statistics.pending_transactions)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Success/Failure Rates */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={600} sx={{ color: BHIM_COLORS.philippineGreen }}>
                      {statistics.success_rate.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Success Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={600} sx={{ color: BHIM_COLORS.heatWaveOrange }}>
                      {statistics.failure_rate.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Failure Rate
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Amount Statistics */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                      {formatCurrency(statistics.amount_statistics.min_amount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Min Amount
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                      {formatCurrency(statistics.amount_statistics.max_amount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Max Amount
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                      {formatCurrency(statistics.amount_statistics.avg_amount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Amount
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                      {formatCurrency(statistics.amount_statistics.total_amount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Amount
                    </Typography>
                  </Box>
                </Grid>

                {/* Failure Type Distribution */}
                {statistics.failure_type_distribution && Object.keys(statistics.failure_type_distribution).length > 0 && (
                  <>
                    <Grid item xs={12}>
                      <Divider />
                      <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 2 }}>
                        Failure Type Distribution
                      </Typography>
                    </Grid>
                    {Object.entries(statistics.failure_type_distribution).map(([type, count]) => (
                      <Grid item xs={12} sm={6} md={4} key={type}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Typography>
                          <Chip
                            label={formatNumber(count)}
                            size="small"
                            sx={{
                              backgroundColor: BHIM_COLORS.orangeAlpha,
                              color: BHIM_COLORS.heatWaveOrange,
                            }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Real-time Simulation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card sx={{ borderRadius: 3 }}>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PlayArrow color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Real-time Simulation
                </Typography>
              </Box>
            }
          />
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Speed Multiplier"
                  type="number"
                  value={speedMultiplier}
                  onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
                  helperText="1.0 = real-time, 100.0 = 100x faster"
                  disabled={simulationRunning}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<PlayArrow />}
                  onClick={handleSimulateRealtime}
                  disabled={simulationRunning || !statistics}
                  sx={{
                    background: `linear-gradient(135deg, ${BHIM_COLORS.philippineGreen} 0%, ${BHIM_COLORS.greenLight} 100%)`,
                    py: 1.5,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${BHIM_COLORS.greenDark} 0%, ${BHIM_COLORS.philippineGreen} 100%)`,
                    },
                  }}
                >
                  {simulationRunning ? 'Simulation Running...' : 'Start Simulation'}
                </Button>
              </Grid>
            </Grid>

            {simulationRunning && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Replaying transactions at {speedMultiplier}x speed...
                </Typography>
              </Box>
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
              Real-time simulation replays dataset transactions by timestamp, simulating live transaction flow for demonstration purposes.
            </Alert>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default DatasetManager;