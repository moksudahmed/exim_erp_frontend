import axios from 'axios';

//const API_URL = 'http://127.0.0.1:8000/api/v1/general-ledger';
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/journal-entries`;

export const fetchLedger = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response.data);
  return response.data;
};

export const saveJournalItems = async (token, payload) => {  
  const response = await axios.post(`${API_URL}/ledger-with-entry/`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addLedger = async (log, token) => {  
    console.log(log);
  const response = await axios.post(API_URL, log, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateLedger = async (logId, updatedLog, token) => {
  const response = await axios.put(`${API_URL}${logId}`, updatedLog, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteLedger = async (logId, token) => {
  await axios.delete(`${API_URL}${logId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


