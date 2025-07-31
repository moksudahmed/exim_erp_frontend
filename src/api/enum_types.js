import axios from 'axios';

//const API_URL = 'http://127.0.0.1:8000/api/v1/enum_type';
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/enum_type`;

export const fetchAccountTypes = async (token) => {
  const response = await axios.get(`${API_URL}/account-types`, {
    headers: { Authorization: `Bearer ${token}` },
  });    
  return response.data;
};

export const fetchAccountAction = async (token) => {
  const response = await axios.get(`${API_URL}/account-action`, {
    headers: { Authorization: `Bearer ${token}` },
  });    
  console.log(response.data);
  return response.data;
};


export const fetchPaymentStatus = async (token) => {
  const response = await axios.get(`${API_URL}/payment-status`, {
    headers: { Authorization: `Bearer ${token}` },
  });    
  return response.data;
};
