import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Info,
  Warning,
  Support,
  Refresh
} from '@mui/icons-material';
import { format } from 'date-fns';

const DiagnosisPanel = ({ transaction, diagnosis, loading }) => {
  if (!transaction) {
    return (
      <Box textAlign="center" py={8}>
        <Info sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Select a transaction to view diagnosis
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click on any failed transaction from the dashboard to get AI-powered diagnosis
        </Typography>
      </Box>
    );
  }

  if (transaction.status === 'SUCCESS') {
    return (
      <Box textAlign="center" py={8}>
        <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h6" color="success.main">
          Transaction Successful
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This transaction completed successfully and doesn't require diagnosis
        </Typography>
      </Box>
    );
  }

  const getConfidenceColor = (score) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  const getConfidenceText = (score) => {
    if (score >= 0.8) return 'High';
    if (score >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        AI Diagnosis Panel
      </Typography>

      {/* Transaction Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Transaction Details
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
            <Chip label={`ID: ${transaction.transaction_id}`} variant="outlined" />
            <Chip label={`Amount: ₹${transaction.amount.toLocaleString('en-IN')}`} variant="outlined" />
            <Chip 
              label={transaction.status} 
              color="error" 
              icon={<Error />}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {format(new Date(transaction.timestamp), 'MMMM dd, yyyy at HH:mm')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            From: {transaction.sender_vpa} → To: {transaction.receiver_vpa}
          </Typography>
          {transaction.failure_reason && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {transaction.failure_reason}
            </Alert>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Analyzing transaction failure...
          </Typography>
        </Box>
      ) : diagnosis ? (
        <DiagnosisResults diagnosis={diagnosis} />
      ) : (
        <Alert severity="warning">
          Unable to generate diagnosis for this transaction
        </Alert>
      )}
    </Box>
  );
};co
nst DiagnosisResults = ({ diagnosis }) => {
  const getConfidenceColor = (score) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  const getConfidenceText = (score) => {
    if (score >= 0.8) return 'High';
    if (score >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <Box>
      {/* AI Diagnosis */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              AI Diagnosis
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                Confidence:
              </Typography>
              <Chip
                label={`${getConfidenceText(diagnosis.confidence_score)} (${Math.round(diagnosis.confidence_score * 100)}%)`}
                color={getConfidenceColor(diagnosis.confidence_score)}
                size="small"
              />
            </Box>
          </Box>
          <Typography variant="body1" paragraph>
            {diagnosis.diagnosis}
          </Typography>
        </CardContent>
      </Card>

      {/* User Guidance */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            What You Should Do
          </Typography>
          <Typography variant="body1" paragraph>
            {diagnosis.user_guidance}
          </Typography>
          
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Step-by-step Resolution:
          </Typography>
          <List dense>
            {diagnosis.resolution_steps.map((step, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircle color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={step} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Action Recommendations */}
      <Box display="flex" gap={2} mb={3}>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Refresh color={diagnosis.retry_recommended ? 'success' : 'disabled'} sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">
              Retry Transaction
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {diagnosis.retry_recommended ? 'Recommended' : 'Not Recommended'}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Support color={diagnosis.contact_support ? 'warning' : 'disabled'} sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">
              Contact Support
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {diagnosis.contact_support ? 'Required' : 'Not Required'}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Technical Details */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Technical Details
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {diagnosis.technical_details}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">
              <strong>Failure Type:</strong> {diagnosis.failure_type.replace('_', ' ').toUpperCase()}
            </Typography>
            <Typography variant="body2">
              <strong>Est. Resolution Time:</strong> {diagnosis.estimated_resolution_time}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DiagnosisPanel;