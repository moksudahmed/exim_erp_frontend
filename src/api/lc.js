import axios from 'axios';

//const API_URL = 'http://127.0.0.1:8000/api/v1/account';
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/lc`;

export const addLC = async (lc, token) => {
  try {   
    console.log(lc);
    const response = await axios.post(API_URL, lc, {
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
        throw new Error(`Account with name already exists.`);
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
export const getLCByNumber = async (lcNumber, token) => {
  console.log(`${API_URL}/${lcNumber}`);
  const response = await fetch(`${API_URL}/${lcNumber}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  console.log('Fetched LC Record:', response);
  if (!response.ok) {
    throw new Error('L/C not found');
  }

  return await response.json();
};


export const fetchLC = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Fetched Clients:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error; // re-throw to handle in calling component
  }
};

export const fetchMarginPayment = async (lc_no, token) => {
  try {
    const { data } = await axios.get(`${API_URL}/margin-payment/${lc_no}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Fetched Clients:', data);
    return data;
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Error fetching clients';
    console.error('Fetch Clients Error:', message);
    throw new Error(message);
  }
};

export const addLCIssuance = async (payload, token) => {  
  console.log(payload);
  const response = await axios.post(`${API_URL}/issuance`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addGoodsShipment = async (payload, token) => {  
  console.log(payload);
  const response = await axios.post(`${API_URL}/goods-shipment`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addGoodsReceipt = async (payload, token) => {  
  console.log(payload);
  const response = await axios.post(`${API_URL}/lc-goods-receipts/`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addLCFinalPayments = async (payload, token) => {  
  console.log(payload);
  const response = await axios.post(`${API_URL}/lc-final-payments/`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
export const fetchGoodsShipment = async (lc_no, token) => {
  try {
    const { data } = await axios.get(`${API_URL}/goods-shipment/${lc_no}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Fetched Clients:', data);
    return data;
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Error fetching clients';
    console.error('Fetch Clients Error:', message);
    throw new Error(message);
  }
};

export const fetchClientsByType = async (type, token) => {
  try {
    const { data } = await axios.get(`${API_URL}/list/${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Fetched Clients:', data);
    return data;
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Error fetching clients';
    console.error('Fetch Clients Error:', message);
    throw new Error(message);
  }
};

export const fetchCustomerClientsPayment = async (clientId, token) => {
  try {
    const { data } = await axios.get(`${API_URL}/customer-payments/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Fetched Clients:', data);
    return data;
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Error fetching clients';
    console.error('Fetch Clients Error:', message);
    throw new Error(message);
  }
};

export const fetchClientsStatement = async (clientId, token) => {
  try {
    const { data } = await axios.get(`${API_URL}/single-client-statement/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Fetched Clients:', data);
    return data;
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Error fetching clients';
    console.error('Fetch Clients Error:', message);
    throw new Error(message);
  }
};
export const fetchSupplierStatement = async (supplierID, token) => {
  try {
    console.log(supplierID);
    const { data } = await axios.get(`${API_URL}/single-supplier-statement/${supplierID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Fetched Clients:', data);
    return data;
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Error fetching clients';
    console.error('Fetch Clients Error:', message);
    throw new Error(message);
  }
};

export const fetchAllClientsStatement = async (token) => {
  try {
    const { data } = await axios.get(`${API_URL}/client-statement/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Fetched Clients:', data);
    return data;
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Error fetching clients';
    console.error('Fetch Clients Error:', message);
    throw new Error(message);
  }
};
export const fetchCustomerSupplierPayment = async (clientId, token) => {
  try {
    const { data } = await axios.get(`${API_URL}/supplier-payments/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Fetched Clients:', data);
    return data;
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Error fetching clients';
    console.error('Fetch Clients Error:', message);
    throw new Error(message);
  }
};

export const addAccount2 = async (account, token) => {
  const response = await axios.post(API_URL, account, {
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

export const deleteClient = async (productId, token) => {
  await axios.delete(`${API_URL}${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
