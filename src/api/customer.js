import axios from 'axios';

//const API_URL = 'http://127.0.0.1:8000/api/v1/account';
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/customer`;


export const fetchCustomers = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });  
  console.log(response);
  return response.data;
};

export const addCustomer = async (customer, token) => {
  try {   
    const response = await axios.post(API_URL, customer, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with a status outside the 2xx range
      const detail = error.response.data?.detail;

      // Handle duplicate account_name error from backend
      if (typeof detail === 'string' && detail.includes("already exists")) {
        throw new Error(`Customer with name "${customer.name}" already exists.`);
      }

      console.error('API error:', error.response.data);
      throw new Error(detail || 'Failed to add account');
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response from server:', error.request);
      throw new Error('No response from server. Please check your connection and try again.');
    } else {
      // Other unexpected errors
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};


export const fetchCustomersPayment = async (token) => {
  const response = await axios.get(`${API_URL}/customer-payments`, {
    headers: { Authorization: `Bearer ${token}` },
  });  
  console.log(response);
  return response.data;
};

export const fetchCustomerPaymentInfo = async (token, query = '') => {
  console.log(query);
  const response = await axios.get(`${API_URL}/customer-payments/${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchCustomerDue = async (token, query = '') => {
  const response = await axios.get(`${API_URL}/customer-due${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchCustomerSummary = async (token, query = '') => {
  const response = await axios.get(`${API_URL}/customer-summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchCustomerRecord = async (token, query = '') => {
  const response = await axios.get(`${API_URL}/${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};