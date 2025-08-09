import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
  Tabs,
  Tab,
  Badge,
  Avatar,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Notifications,
  Error,
  Warning,
  Info,
  CheckCircle,
  Delete,
  MarkAsUnread,
  Settings,
  Clear,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const NotificationsPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'error',
      title: 'High Failure Rate Alert',
      message: 'Transaction failure rate has exceeded 15% in the last hour. Immediate attention required.',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      read: false,
      priority: 'high',
    },
    {
      id: 2,
      type: 'warning',
      title: 'Bank Server Degradation',
      message: 'HDFC Bank API response time has increased by 200%. Monitor for potential issues.',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      read: false,
      priority: 'medium',
    },
    {
      id: 3,
      type: 'info',
      title: 'AI Model Update',
      message: 'Diagnosis accuracy improved to 94.7% with the latest model deployment.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: true,
      priority: 'low',
    },
    {
      id: 4,
      type: 'success',
      title: 'System Recovery',
      message: 'Network connectivity issues have been resolved. All systems operational.',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      read: true,
      priority: 'medium',
    },
    {
      id: 5,
      type: 'warning',
      title: 'Daily Limit Threshold',
      message: '80% of users have reached their daily transaction limits. Consider policy review.',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      read: false,
      priority: 'medium',
    },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'error':
        return <Error sx={{ color: theme.palette.error.main }} />;
      case 'warning':
        return <Warning sx={{ color: theme.palette.warning.main }} />;
      case 'success':
        return <CheckCircle sx={{ color: theme.palette.success.main }} />;
      default:
        return <Info sx={{ color: theme.palette.info.main }} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 1:
        return notifications.filter(n => !n.read);
      case 2:
        return notifications.filter(n => n.read);
      default:
        return notifications;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = getFilteredNotifications();

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
              Notifications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Stay updated with system alerts and important events
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={() => {/* Mark all as read */}}
            >
              Mark All Read
            </Button>
            <Button
              variant="outlined"
              startIcon={<Settings />}
            >
              Settings
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Notification Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
          >
            <Tab 
              label={
                <Badge badgeContent={notifications.length} color="primary">
                  All
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={unreadCount} color="error">
                  Unread
                </Badge>
              } 
            />
            <Tab label="Read" />
          </Tabs>
        </Card>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          {filteredNotifications.length > 0 ? (
            <List sx={{ p: 0 }}>
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ListItem
                    sx={{
                      py: 2,
                      px: 3,
                      backgroundColor: notification.read 
                        ? 'transparent' 
                        : theme.palette.action.hover,
                      borderLeft: notification.read 
                        ? 'none' 
                        : `4px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        backgroundColor: theme.palette.action.selected,
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: 'transparent',
                          width: 40,
                          height: 40,
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.priority}
                            size="small"
                            color={getPriorityColor(notification.priority)}
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(notification.timestamp, 'MMM dd, yyyy HH:mm')}
                          </Typography>
                        </Box>
                      }
                    />
                    
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          edge="end"
                          aria-label="mark as unread"
                          size="small"
                        >
                          <MarkAsUnread />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  {index < filteredNotifications.length - 1 && <Divider />}
                </motion.div>
              ))}
            </List>
          ) : (
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Notifications sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activeTab === 1 
                  ? "You're all caught up! No unread notifications."
                  : activeTab === 2 
                  ? "No read notifications to display."
                  : "No notifications available at the moment."
                }
              </Typography>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </Box>
  );
};

export default NotificationsPage;