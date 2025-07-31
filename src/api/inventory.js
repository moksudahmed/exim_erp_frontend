import axios from 'axios';

//const API_URL = 'http://127.0.0.1:8000/api/v1/inventory/';
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/inventory/`;

export const fetchInventory = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  return response.data;
};

export const addInventory = async (product, token) => {  
  const response = await axios.post(API_URL, product, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const onUpdateInventory = async (payload, token) => {
  const response = await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });  
  return response.data;
};

export const onDeductDamaged = async (payload, token) => {
  const response = await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });  
  return response.data;
};

export const updateInventory = async (productId, updatedProduct, token) => {
  const response = await axios.put(`${API_URL}${productId}`, updatedProduct, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteInventory = async (productId, token) => {
  await axios.delete(`${API_URL}${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


