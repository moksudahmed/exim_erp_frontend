// src/services/api.js
import axios from 'axios';
import { message } from 'antd';

const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/account`;

// Create Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for handling errors
api.interceptors.response.use((response) => {
  return response.data;
}, (error) => {
  // Handle error responses
  if (error.response) {
    const { status, data } = error.response;
    
    // Unauthorized access
    if (status === 401) {
      message.error('Your session has expired. Please log in again.');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      window.location.href = '/login';
    }
    // Validation errors
    else if (status === 400 && data.detail) {
      if (Array.isArray(data.detail)) {
        data.detail.forEach(err => {
          message.error(`${err.loc[1]}: ${err.msg}`);
        });
      } else {
        message.error(data.detail);
      }
    }
    // Forbidden
    else if (status === 403) {
      message.error('You do not have permission to perform this action.');
    }
    // Not found
    else if (status === 404) {
      message.error('The requested resource was not found.');
    }
    // Server error
    else if (status >= 500) {
      message.error('A server error occurred. Please try again later.');
    }
    // Other errors
    else if (data.detail) {
      message.error(data.detail);
    }
  } 
  // Network error
  else if (error.message === 'Network Error') {
    message.error('Network error. Please check your internet connection.');
  } 
  // Timeout error
  else if (error.code === 'ECONNABORTED') {
    message.error('Request timed out. Please try again.');
  }
  
  return Promise.reject(error);
});

// API Functions

// ===================== Authentication =====================
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      username: email,
      password,
    });
    localStorage.setItem('access_token', response.access_token);
    return response;
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    localStorage.setItem('user_info', JSON.stringify(response));
    return response;
  },
  
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    localStorage.setItem('access_token', response.access_token);
    return response;
  },
};

// ===================== Accounts =====================
export const accountsAPI = {
  getAccounts: async (params = {}) => {
    return await api.get('/account', { params });
  },
  
  getAccount: async (id) => {
    return await api.get(`/account/${id}`);
  },
  
  createAccount: async (accountData) => {
    return await api.post('/account', accountData);
  },
  
  updateAccount: async (id, accountData) => {
    return await api.put(`/account/${id}`, accountData);
  },
  
  deactivateAccount: async (id) => {
    return await api.patch(`/account/${id}/deactivate`);
  },
  
  getAccountBalance: async (id, asOfDate) => {
    return await api.get(`/account/${id}/balance`, {
      params: { as_of: asOfDate }
    });
  },
};

// ===================== Journal Entries =====================
export const journalAPI = {
  createJournalEntry: async (entryData) => {
    return await api.post('/journal-entries', entryData);
  },
  
  getJournalEntries: async (params = {}) => {
    return await api.get('/journal-entries', { params });
  },
  
  getJournalEntry: async (id) => {
    return await api.get(`/journal-entries/${id}`);
  },
  
  updateJournalEntry: async (id, entryData) => {
    return await api.put(`/journal-entries/${id}`, entryData);
  },
  
  deleteJournalEntry: async (id) => {
    return await api.delete(`/journal-entries/${id}`);
  },
  
  getGeneralLedger: async (accountId, params = {}) => {
    return await api.get(`/accounts/${accountId}/ledger`, { params });
  },
};

// ===================== Financial Reports =====================
export const reportsAPI = {
  getTrialBalance: async (asOfDate) => {
    return await api.get('/reports/trial-balance', {
      params: { as_of: asOfDate }
    });
  },
  
  getBalanceSheet: async (asOfDate) => {
    return await api.get('/reports/balance-sheet', {
      params: { as_of: asOfDate }
    });
  },
  
  getIncomeStatement: async (startDate, endDate) => {
    return await api.get('/reports/income-statement', {
      params: { start_date: startDate, end_date: endDate }
    });
  },
  
  getCashFlowStatement: async (startDate, endDate) => {
    return await api.get('/reports/cash-flow', {
      params: { start_date: startDate, end_date: endDate }
    });
  },
  
  saveReport: async (reportData) => {
    return await api.post('/reports', reportData);
  },
  
  getSavedReports: async () => {
    return await api.get('/reports');
  },
};

// ===================== Tax Calculations =====================
export const taxAPI = {
  getTaxRates: async () => {
    return await api.get('/tax-rates');
  },
  
  createTaxRate: async (taxRateData) => {
    return await api.post('/tax-rates', taxRateData);
  },
  
  updateTaxRate: async (id, taxRateData) => {
    return await api.put(`/tax-rates/${id}`, taxRateData);
  },
  
  calculateTaxForJournalItem: async (journalItemId) => {
    return await api.post(`/journal-items/${journalItemId}/calculate-tax`);
  },
  
  getTaxLiability: async (startDate, endDate) => {
    return await api.get('/taxes/liability', {
      params: { start_date: startDate, end_date: endDate }
    });
  },
  
  getTaxSummary: async (period) => {
    return await api.get('/taxes/summary', {
      params: { period }
    });
  },
};

// ===================== System Operations =====================
export const systemAPI = {
  closeFinancialPeriod: async (periodId) => {
    return await api.post(`/periods/${periodId}/close`);
  },
  
  getFinancialPeriods: async () => {
    return await api.get('/periods');
  },
  
  createFinancialPeriod: async (periodData) => {
    return await api.post('/periods', periodData);
  },
  
  getSystemSettings: async () => {
    return await api.get('/settings');
  },
  
  updateSystemSettings: async (settingsData) => {
    return await api.put('/settings', settingsData);
  },
};

export default api;