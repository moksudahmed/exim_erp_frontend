import axios from 'axios';

//const API_URL = 'http://127.0.0.1:8000/api/v1/cash-register/';
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/cash-register/`;

export const fetchCashRegister = async (token) => {
    
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response.data);
  return response.data;
};

export const addCashRegister = async (log, token) => {  
    console.log(log);
  const response = await axios.post(API_URL, log, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateCashRegister = async (logId, updatedLog, token) => {
  const response = await axios.put(`${API_URL}${logId}`, updatedLog, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteCashRegister = async (logId, token) => {
  await axios.delete(`${API_URL}${logId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


