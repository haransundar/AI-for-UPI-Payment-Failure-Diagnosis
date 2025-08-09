import React, { createContext, useContext, useState, useEffect } from 'react';
import { Box, Alert, Button } from '@mui/material';
import { Lock, Warning } from '@mui/icons-material';

// Permission levels and roles
export const PERMISSIONS = {
  // Transaction permissions
  VIEW_TRANSACTIONS: 'view_transactions',
  EXPORT_TRANSACTIONS: 'export_transactions',
  DIAGNOSE_TRANSACTIONS: 'diagnose_transactions',
  
  // Analytics permissions
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_DETAILED_ANALYTICS: 'view_detailed_analytics',
  EXPORT_REPORTS: 'export_reports',
  
  // System permissions
  MANAGE_USERS: 'manage_users',
  SYSTEM_SETTINGS: 'system_settings',
  AUDIT_LOGS: 'audit_logs',
  
  // Notification permissions
  MANAGE_NOTIFICATIONS: 'manage_notifications',
  SEND_ALERTS: 'send_alerts',
};

export const ROLES = {
  VIEWER: {
    name: 'Viewer',
    permissions: [
      PERMISSIONS.VIEW_TRANSACTIONS,
      PERMISSIONS.VIEW_ANALYTICS,
    ]
  },
  ANALYST: {
    name: 'Analyst',
    permissions: [
      PERMISSIONS.VIEW_TRANSACTIONS,
      PERMISSIONS.EXPORT_TRANSACTIONS,
      PERMISSIONS.DIAGNOSE_TRANSACTIONS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_DETAILED_ANALYTICS,
      PERMISSIONS.EXPORT_REPORTS,
    ]
  },
  OPERATOR: {
    name: 'Operator',
    permissions: [
      PERMISSIONS.VIEW_TRANSACTIONS,
      PERMISSIONS.EXPORT_TRANSACTIONS,
      PERMISSIONS.DIAGNOSE_TRANSACTIONS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_DETAILED_ANALYTICS,
      PERMISSIONS.EXPORT_REPORTS,
      PERMISSIONS.MANAGE_NOTIFICATIONS,
      PERMISSIONS.SEND_ALERTS,
    ]
  },
  ADMIN: {
    name: 'Administrator',
    permissions: Object.values(PERMISSIONS)
  }
};

// Permission Context
const PermissionContext = createContext();

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

export const PermissionProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('ANALYST'); // Default role
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user permissions from API
    const loadUserPermissions = async () => {
      try {
        // In real implementation, fetch from API
        const mockUserData = {
          role: 'ANALYST',
          customPermissions: [], // Additional permissions beyond role
        };
        
        const rolePermissions = ROLES[mockUserData.role]?.permissions || [];
        const allPermissions = [...rolePermissions, ...mockUserData.customPermissions];
        
        setUserRole(mockUserData.role);
        setPermissions(allPermissions);
      } catch (error) {
        console.error('Failed to load user permissions:', error);
        // Fallback to minimal permissions
        setPermissions([PERMISSIONS.VIEW_TRANSACTIONS]);
      } finally {
        setLoading(false);
      }
    };

    loadUserPermissions();
  }, []);

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList) => {
    return permissionList.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (permissionList) => {
    return permissionList.every(permission => permissions.includes(permission));
  };

  const value = {
    userRole,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    loading,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

// Permission Gate Component
const PermissionGate = ({ 
  permission, 
  permissions, 
  requireAll = false,
  fallback,
  children 
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermissions();

  if (loading) {
    return null; // Or loading spinner
  }

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  if (!hasAccess) {
    if (fallback) {
      return fallback;
    }

    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert 
          severity="warning" 
          icon={<Lock />}
          sx={{ 
            borderRadius: 2,
            '& .MuiAlert-message': {
              width: '100%',
              textAlign: 'center'
            }
          }}
        >
          <Box>
            <Box sx={{ mb: 1 }}>
              <Warning sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
            </Box>
            <Box>
              <strong>Access Restricted</strong>
            </Box>
            <Box sx={{ mt: 1, color: 'text.secondary' }}>
              You don't have permission to access this feature.
              Contact your administrator if you need access.
            </Box>
          </Box>
        </Alert>
      </Box>
    );
  }

  return children;
};

export default PermissionGate;