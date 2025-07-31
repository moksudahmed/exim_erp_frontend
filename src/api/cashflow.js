import axios from 'axios';

//const API_URL = 'http://127.0.0.1:8000/api/v1/cash_flow';
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/cash_flow`;

export const addCashFlow = async (log, token) => {      
  const response = await axios.post(API_URL, log, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateCashFlow = async (logId, updatedLog, token) => {
  const response = await axios.put(`${API_URL}${logId}`, updatedLog, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteCashFlow = async (logId, token) => {
  await axios.delete(`${API_URL}${logId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchCashFlowData = async (token) => {    
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });  
  return response.data;
};

export const fetchRegisterStatusData = async (token) => {    
  try {
    const response = await fetch(`${API_URL}/register-status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('Failed to fetch register status');
    }
    return data;
    
  } catch (error) {
    console.error('Failed to fetch register status:', error.message);
  }
};

export const addRegisterAction  = async (token, actionType, requestBody) => {    
  try {   
    const response = await fetch(`${API_URL}/${actionType}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });           

    if (!response.ok) {
      throw new Error('Failed to action register');
    }
    return response;
    
  } catch (error) {
    console.error('Failed to action register:', error.message);
  }
};
