import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close,
  Psychology,
  CheckCircle,
  Error,
  Warning,
  Info,
  ContentCopy,
  Share,
  Refresh,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { transactionAPI, handleApiError } from '../../services/api';
import toast from 'react-hot-toast';

const DiagnosisPanel = ({ open, onClose, transaction }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (open && transaction) {
      performDiagnosis();
    }
  }, [open, transaction]);

  const performDiagnosis = async () => {
    setLoading(true);
    setDiagnosis(null);
    setActiveStep(0);

    try {
      const response = await transactionAPI.diagnoseTransaction(transaction);
      setDiagnosis(response.data);
      
      // Animate through steps
      setTimeout(() => setActiveStep(1), 1000);
      setTimeout(() => setActiveStep(2), 2000);
      setTimeout(() => setActiveStep(3), 3000);
      
      toast.success('Diagnosis completed successfully');
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
      console.error('Diagnosis failed:', apiError);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  const getConfidenceLabel = (score) => {
    if (score >= 0.8) return 'High Confidence';
    if (score >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const diagnosisSteps = [
    {
      label: 'Analyzing Transaction',
      description: 'Processing transaction data and failure patterns',
      icon: <Psychology />,
    },
    {
      label: 'AI Diagnosis',
      description: 'Generating intelligent insights and recommendations',
      icon: <Psychology />,
    },
    {
      label: 'Solution Mapping',
      description: 'Identifying actionable resolution steps',
      icon: <CheckCircle />,
    },
    {
      label: 'Complete',
      description: 'Diagnosis ready with recommendations',
      icon: <CheckCircle />,
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          minHeight: fullScreen ? '100vh' : '600px',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: theme.palette.gradient?.primary || theme.palette.primary.main,
          color: 'white',
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Psychology sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              AI Diagnosis
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Transaction: {transaction?.transaction_id}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Loading State */}
        {loading && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
              <Typography variant="h6" gutterBottom>
                Analyzing Transaction...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our AI is processing the failure patterns and generating insights
              </Typography>
            </motion.div>

            {/* Progress Steps */}
            <Box sx={{ mt: 4, maxWidth: 400, mx: 'auto' }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {diagnosisSteps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: index <= activeStep ? theme.palette.primary.main : theme.palette.grey[300],
                            color: 'white',
                            fontSize: 12,
                          }}
                        >
                          {index < activeStep ? <CheckCircle sx={{ fontSize: 16 }} /> : index + 1}
                        </Box>
                      )}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {step.label}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>
        )}

        {/* Diagnosis Results */}
        {diagnosis && !loading && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ p: 4 }}>
                {/* Confidence Score */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Diagnosis Results
                  </Typography>
                  <Chip
                    label={`${getConfidenceLabel(diagnosis.confidence_score)} (${Math.round(diagnosis.confidence_score * 100)}%)`}
                    color={getConfidenceColor(diagnosis.confidence_score)}
                    variant="filled"
                  />
                </Box>

                {/* Main Diagnosis */}
                <Alert
                  severity="info"
                  icon={<Psychology />}
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  <Typography variant="body1" fontWeight={500} gutterBottom>
                    Root Cause Analysis
                  </Typography>
                  <Typography variant="body2">
                    {diagnosis.diagnosis}
                  </Typography>
                </Alert>

                {/* User Guidance */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Info color="primary" />
                    What You Should Do
                  </Typography>
                  <Alert severity="success" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      {diagnosis.user_guidance}
                    </Typography>
                  </Alert>
                </Box>

                {/* Resolution Steps */}
                {diagnosis.resolution_steps && diagnosis.resolution_steps.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle color="success" />
                      Step-by-Step Solution
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      {diagnosis.resolution_steps.map((step, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              bgcolor: theme.palette.primary.main,
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 12,
                              fontWeight: 600,
                              flexShrink: 0,
                              mt: 0.5,
                            }}
                          >
                            {index + 1}
                          </Box>
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {step}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Technical Details */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning color="warning" />
                    Technical Details
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: theme.palette.grey[50],
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {diagnosis.technical_details}
                    </Typography>
                  </Box>
                </Box>

                {/* Additional Info */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Estimated Resolution Time
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {diagnosis.estimated_resolution_time}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Contact Support
                    </Typography>
                    <Chip
                      label={diagnosis.contact_support ? 'Recommended' : 'Not Required'}
                      color={diagnosis.contact_support ? 'warning' : 'success'}
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </AnimatePresence>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        {diagnosis && (
          <>
            <Button
              startIcon={<ContentCopy />}
              onClick={() => copyToClipboard(JSON.stringify(diagnosis, null, 2))}
              variant="outlined"
            >
              Copy Details
            </Button>
            <Button
              startIcon={<Refresh />}
              onClick={performDiagnosis}
              variant="outlined"
              disabled={loading}
            >
              Re-analyze
            </Button>
          </>
        )}
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DiagnosisPanel;