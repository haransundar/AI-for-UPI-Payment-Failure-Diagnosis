import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Alert,
  Divider,
  Link,
} from '@mui/material';
import { Security, Gavel, Info } from '@mui/icons-material';

const ComplianceNotice = ({ open, onAccept, onDecline }) => {
  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Security color="primary" sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Regulatory Compliance Notice
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Important information about data usage and compliance
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 0 }}>
        {/* RBI Compliance */}
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={500} gutterBottom>
            Reserve Bank of India (RBI) Compliance
          </Typography>
          <Typography variant="body2">
            This platform operates in accordance with RBI guidelines for digital payment systems. 
            All transaction data is processed securely and in compliance with Payment and Settlement Systems Act, 2007.
          </Typography>
        </Alert>

        {/* NPCI Guidelines */}
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={500} gutterBottom>
            NPCI UPI Guidelines
          </Typography>
          <Typography variant="body2">
            This diagnostic platform adheres to National Payments Corporation of India (NPCI) 
            guidelines for UPI ecosystem participants. Transaction analysis is performed for 
            diagnostic purposes only and does not process actual payments.
          </Typography>
        </Alert>

        {/* Data Privacy */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Gavel color="primary" />
            Data Privacy & Security
          </Typography>
          <Typography variant="body2" paragraph>
            • All transaction data is encrypted in transit and at rest
          </Typography>
          <Typography variant="body2" paragraph>
            • Personal identifiable information (PII) is masked and protected
          </Typography>
          <Typography variant="body2" paragraph>
            • Data retention follows RBI guidelines for payment system operators
          </Typography>
          <Typography variant="body2" paragraph>
            • Access controls ensure only authorized personnel can view sensitive data
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* User Responsibilities */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Info color="primary" />
            User Responsibilities
          </Typography>
          <Typography variant="body2" paragraph>
            By using this platform, you acknowledge that:
          </Typography>
          <Typography variant="body2" paragraph>
            • You have appropriate authorization to access transaction data
          </Typography>
          <Typography variant="body2" paragraph>
            • You will not misuse or share sensitive information
          </Typography>
          <Typography variant="body2" paragraph>
            • You understand this is a diagnostic tool, not a payment processor
          </Typography>
          <Typography variant="body2" paragraph>
            • You will report any security concerns immediately
          </Typography>
        </Box>

        {/* Legal Links */}
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            For more information, please review:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Link href="https://www.rbi.org.in" target="_blank" rel="noopener">
              RBI Guidelines
            </Link>
            <Link href="https://www.npci.org.in" target="_blank" rel="noopener">
              NPCI Policies
            </Link>
            <Link href="/privacy-policy" target="_blank">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" target="_blank">
              Terms of Service
            </Link>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onDecline}
          variant="outlined"
          color="error"
        >
          Decline
        </Button>
        <Button
          onClick={onAccept}
          variant="contained"
          color="primary"
        >
          Accept & Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComplianceNotice;