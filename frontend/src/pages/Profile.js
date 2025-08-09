import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Person,
  Email,
  Phone,
  Business,
  Security,
  Notifications,
  Palette,
  Language,
  History,
  Psychology,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Profile = () => {
  const theme = useTheme();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@upi-diagnosis.com',
    phone: '+91 98765 43210',
    organization: 'UPI Diagnosis Platform',
    role: 'System Administrator',
    joinDate: '2024-01-15',
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    autoRefresh: true,
    language: 'en',
  });

  const handleSave = () => {
    setEditing(false);
    // Save profile logic here
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset changes logic here
  };

  const recentActivity = [
    {
      id: 1,
      action: 'Diagnosed transaction TXN001',
      timestamp: '2 hours ago',
      type: 'diagnosis',
    },
    {
      id: 2,
      action: 'Updated notification settings',
      timestamp: '1 day ago',
      type: 'settings',
    },
    {
      id: 3,
      action: 'Exported transaction report',
      timestamp: '2 days ago',
      type: 'export',
    },
    {
      id: 4,
      action: 'Logged into system',
      timestamp: '3 days ago',
      type: 'login',
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'diagnosis':
        return <Psychology sx={{ color: theme.palette.primary.main }} />;
      case 'settings':
        return <Security sx={{ color: theme.palette.secondary.main }} />;
      case 'export':
        return <History sx={{ color: theme.palette.success.main }} />;
      default:
        return <Person sx={{ color: theme.palette.text.secondary }} />;
    }
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
            Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account settings and preferences
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Personal Information
                  </Typography>
                  {!editing ? (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => setEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>

                {/* Profile Avatar */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '2rem',
                      mr: 3,
                    }}
                  >
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={600}>
                      {profile.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {profile.role}
                    </Typography>
                    <Chip
                      label="Active"
                      color="success"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>

                {/* Profile Fields */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={profile.name}
                      disabled={!editing}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: theme.palette.text.secondary }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={profile.email}
                      disabled={!editing}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: theme.palette.text.secondary }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={profile.phone}
                      disabled={!editing}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: theme.palette.text.secondary }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Organization"
                      value={profile.organization}
                      disabled={!editing}
                      onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                      InputProps={{
                        startAdornment: <Business sx={{ mr: 1, color: theme.palette.text.secondary }} />,
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Preferences
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                      />
                    }
                    label="Email Notifications"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                    Receive email alerts for critical system events
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                      />
                    }
                    label="Push Notifications"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                    Get real-time notifications in your browser
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoRefresh}
                        onChange={(e) => setSettings({ ...settings, autoRefresh: e.target.checked })}
                      />
                    }
                    label="Auto Refresh Dashboard"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Automatically refresh dashboard data every 30 seconds
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Account Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Account Statistics
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    Jan 2024
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Diagnoses Run
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    1,247
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Success Rate
                  </Typography>
                  <Typography variant="body2" fontWeight={500} color="success.main">
                    94.7%
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Last Login
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    Today, 9:30 AM
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Recent Activity
                </Typography>
                
                <List sx={{ p: 0 }}>
                  {recentActivity.map((activity, index) => (
                    <ListItem key={activity.id} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {getActivityIcon(activity.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={500}>
                            {activity.action}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {activity.timestamp}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;