import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.detail || error.message || 'API request failed');
      }
    );
  }

  async getTransactions(limit = 100, failureType = null) {
    const params = { limit };
    if (failureType) {
      params.failure_type = failureType;
    }
    
    return await this.client.get('/transactions', { params });
  }

  async diagnoseTransaction(transaction) {
    return await this.client.post('/diagnose', transaction);
  }

  async getFailureTypes() {
    return await this.client.get('/failure-types');
  }

  async healthCheck() {
    return await this.client.get('/health');
  }
}

export const apiService = new ApiService();