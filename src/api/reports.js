import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/reports/type`;

export const getBalanceSheet = async (token, asOfDate, type) => {
  try {
    const response = await axios.get(`${API_URL}/${type}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { as_of: asOfDate },
    });    
    return response.data;
  } catch (error) {
    console.error('Error fetching trial balance:', error);
    throw error;
  }
};
