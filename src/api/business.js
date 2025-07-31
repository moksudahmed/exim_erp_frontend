import axios from 'axios';

//const API_URL = 'http://127.0.0.1:8000/api/v1/account';
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/business`;


export const fetchBusiness = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });  
  console.log(response);
  return response.data;
};

export const fetchBranches = async (token) => {
  const response = await axios.get(`${API_URL}/branch/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchWarehouses = async (token) => {
  const response = await axios.get(`${API_URL}/warehouses/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addBranche = async (branch, token) => {
  try {   
    const response = await axios.post(`${API_URL}/branch/`, branch, {
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
        throw new Error(`Branch with name "${branch.branchname}" already exists.`);
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

export const fetchCustomers = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });  
  console.log(response);
  return response.data;
};

export const fetchProducts = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  return response.data;
};
export const addAccount = async (account, token) => {
  try {   
    const response = await axios.post(API_URL, account, {
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
        throw new Error(`Account with name "${account.account_name}" already exists.`);
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

export const updateProduct = async (productId, updatedProduct, token) => {
  const response = await axios.put(`${API_URL}${productId}`, updatedProduct, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteProduct = async (productId, token) => {
  await axios.delete(`${API_URL}${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
