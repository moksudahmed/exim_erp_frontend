import axios from 'axios';

//const API_URL = 'http://127.0.0.1:8000/api/v1/account';
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/accounting`;

export const getLedgerEntries = async (token) => {
  const response = await axios.get(`${API_URL}/ledger/`, {
    headers: { Authorization: `Bearer ${token}` },
  });  
  console.log(response);
  return response.data;
};

export const createFinancialPeriod = async (periodData) => {
  const response = await axios.post(`${API_URL}/financial-periods/`, periodData);
  return response.data;
};

export const closeFinancialPeriod = async (periodId, userId) => {
  const response = await axios.post(`${API_URL}/financial-periods/${periodId}/close/`, { user_id: userId });
  return response.data;
};

export const generateFinancialReport = async (reportData) => {
  const response = await axios.post(`${API_URL}/financial-reports/`, reportData);
  return response.data;
};

export const getAccountingSetting = async (key) => {
  const response = await axios.get(`${API_URL}/settings/${key}`);
  return response.data;
};

export const updateAccountingSetting = async (settingData) => {
  const response = await axios.put(`${API_URL}/settings/`, settingData);
  return response.data;
};