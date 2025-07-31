import axios from 'axios';

//const API_URL = 'http://127.0.0.1:8000/api/v1/sales/';
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/sales/`;

export const fetchSales = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addSaleWithTransaction = async (saleData, transactionData, token) => {
  try {
    const payload = {
      sale: saleData,
      transaction: transactionData,
    };

    const response = await axios.post(`http://127.0.0.1:8000/api/v1/sales/sale-with-transaction`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data; // contains { sale, transaction }
  } catch (error) {
    console.error('Error adding sale with transaction:', error);
    throw error.response?.data || { message: 'An unexpected error occurred.' };
  }
};

export const addSale = async (sale, token) => {
  try {    
    const response = await axios.post(API_URL, sale, {
      headers: { Authorization: `Bearer ${token}` },
    });       
    return response.data;
  } catch (error) {
    let message = "An unexpected error occurred.";

    if (error.response) {
      // Server responded with a status code outside the 2xx range
      message = error.response.data?.detail || `Error ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      message = "No response from the server.";
    } else {
      // Something else happened
      message = error.message;
    }
    //console.error(message);
    alert(message); // Show the alert with the error message
    throw new Error(message); // Rethrow in case calling code needs to handle it
  }
};
export const updateSale2 = async (saleId, updatedSale, token) => {
  const response = await axios.put(`${API_URL}${saleId}`, updatedSale, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
export const updateSale = async (updatedSale, token) => {

  const response = await fetch(`${apiUrl}api/v1/sales/${updatedSale.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 🔒 Secure API request
    },
    body: JSON.stringify(updatedSale),
  });  
  /*if (!response.ok) {
    throw new Error(`Failed to update sale. Status: ${response.status}`);
  }*/
  return response;
};


export const deleteSale = async (saleId, token) => {
  await axios.delete(`${API_URL}${saleId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
