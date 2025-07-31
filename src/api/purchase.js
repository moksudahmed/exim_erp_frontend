import axios from 'axios';

//const API_URL = 'http://127.0.0.1:8000/api/v1/purchase_orders/';
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/purchase_orders/`;

export const fetchPurchaseOrders = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });  
  return response.data;
};

export const addPurchaseOrders = async (payload, token) => {  
  console.log(payload);
  const response = await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const onReceivePurchaseOrders = async (orderId, token) => { 
  const response =await axios.post(`${API_URL}${orderId}/receive`,{    
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;  
};
export const onCompletePurchaseOrders = async (orderId, token) => { 
  const response =await axios.post(`${API_URL}${orderId}/completed`,{    
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;  
};

export const onCancelPurchaseOrders = async (orderId, token) => { 
  const response =await axios.post(`${API_URL}${orderId}/cancel`,{    
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;  
};  

export const getPurchaseOrder = async (orderId, token) => {
  const response = await axios.get(`${API_URL}${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });  
  return response.data;
};

export const updatePurchaseOrders = async (productId, updatedProduct, token) => {
  const response = await axios.put(`${API_URL}${productId}`, updatedProduct, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deletePurchaseOrders = async (productId, token) => {
  await axios.delete(`${API_URL}${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getReceivedOrder = async (token) => {
  const response = await axios.get(`${API_URL}received/`, {
    headers: { Authorization: `Bearer ${token}` },
  });    
  return response.data;
};
