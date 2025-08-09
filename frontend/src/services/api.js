import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for loading states
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const transactionAPI = {
  // Get all transactions with optional filters
  getTransactions: (params = {}) => {
    return api.get('/transactions', { params });
  },

  // Get transaction by ID
  getTransaction: (id) => {
    return api.get(`/transactions/${id}`);
  },

  // Diagnose a transaction failure
  diagnoseTransaction: (transactionData) => {
    return api.post('/diagnose', transactionData);
  },

  // Get failure types for filtering
  getFailureTypes: () => {
    return api.get('/failure-types');
  },

  // Health check
  healthCheck: () => {
    return api.get('/health');
  },
};

// Utility functions for API calls
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.detail || 'Server error occurred',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error - please check your connection',
      status: 0,
      data: null,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
      data: null,
    };
  }
};

// Enhanced API endpoints for Hugging Face dataset
export const datasetAPI = {
  // Load Hugging Face dataset
  loadHuggingFaceDataset: () => {
    return api.post('/dataset/load-huggingface');
  },

  // Ingest dataset to MongoDB
  ingestToMongoDB: () => {
    return api.post('/dataset/ingest-to-mongodb');
  },

  // Get dataset statistics
  getDatasetStatistics: () => {
    return api.get('/dataset/statistics');
  },

  // Get dataset information
  getDatasetInfo: () => {
    return api.get('/dataset/info');
  },

  // Simulate real-time replay
  simulateRealtime: (speedMultiplier = 100) => {
    return api.post(`/dataset/simulate-realtime?speed_multiplier=${speedMultiplier}`);
  },
};

// Mock data for development/demo (fallback when API is not available)
export const mockTransactions = [
  {
    transaction_id: 'UPI20240115000001',
    amount: 1500.00,
    sender_vpa: 'user1234@paytm',
    receiver_vpa: 'merchant567@phonepe',
    sender_bank: 'HDFC',
    receiver_bank: 'ICICI',
    timestamp: new Date().toISOString(),
    status: 'failed',
    failure_reason: 'Insufficient balance in account',
    error_code: 'E001',
    retry_count: 2,
    failure_type: 'insufficient_funds',
    metadata: {
      original_issue_type: 'Insufficient Funds',
      original_description: 'Account balance is insufficient for this transaction',
      dataset_source: 'huggingface_deepakjoshi1606',
    },
  },
  {
    transaction_id: 'UPI20240115000002',
    amount: 750.00,
    sender_vpa: 'customer@phonepe',
    receiver_vpa: 'shop@googlepay',
    sender_bank: 'SBI',
    receiver_bank: 'AXIS',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'failed',
    failure_reason: 'Invalid VPA provided',
    error_code: 'E002',
    retry_count: 1,
    failure_type: 'invalid_vpa',
    metadata: {
      original_issue_type: 'Invalid VPA',
      original_description: 'The provided VPA is not valid or does not exist',
      dataset_source: 'huggingface_deepakjoshi1606',
    },
  },
  {
    transaction_id: 'UPI20240115000003',
    amount: 2250.00,
    sender_vpa: 'buyer@googlepay',
    receiver_vpa: 'seller@phonepe',
    sender_bank: 'KOTAK',
    receiver_bank: 'PNB',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'failed',
    failure_reason: 'Network timeout occurred',
    error_code: 'E003',
    retry_count: 3,
    failure_type: 'network_issue',
    metadata: {
      original_issue_type: 'Network Issue',
      original_description: 'Transaction failed due to network connectivity issues',
      dataset_source: 'huggingface_deepakjoshi1606',
    },
  },
];

export default api;