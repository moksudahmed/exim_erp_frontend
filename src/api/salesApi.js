import axios from 'axios';

//const API_URL = 'http://127.0.0.1:8000/api/v1/sales/';
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/businesses`;
//const API_URL = `${apiUrl}api/v1/sales/`;
export const useGetSaleDetails2 = async (token) => {
  const response = await axios.get(`${API_URL}/1/sales/153`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const fetchSalesData = async (token) => {
  const response = await axios.get(`${API_URL}/1/sales/153`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Sale Data");
  console.log(response.data);
  return response.data;
};