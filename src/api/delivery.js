import axios from 'axios';

// Base API URL from environment variable, fallback for development
const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/';
const API_URL = `${BASE_URL}api/v1/deliveries/`;

/**
 * Fetch deliveries.
 * If `sale_id` is provided, fetch deliveries for that specific sale.
 * Otherwise, fetch all deliveries.
 *
 * @param {string} token - Bearer token for authorization
 * @param {number|string} [sale_id] - Optional sale ID
 * @returns {Promise<Array>} - List of deliveries
 */
export const fetchDeliveries = async (token, sale_id = '') => {
  try {
    const url = sale_id ? `${API_URL}${sale_id}/` : API_URL;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data || !Array.isArray(response.data)) {
      console.warn('Unexpected response format:', response.data);
      return [];
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching deliveries:', error.message);
    throw new Error('Failed to fetch deliveries. Please try again later.');
  }
};

/**
 * Add a new delivery.
 *
 * @param {Object} delivery - Delivery object to add
 * @param {string} token - Bearer token for authorization
 * @returns {Promise<Object>} - Newly created delivery
 */
export const addDeliveries = async (delivery, token) => {
  try {
    const response = await axios.post(API_URL, delivery, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const detail = error.response.data?.detail;

      // Specific backend error for duplicates
      if (typeof detail === 'string' && detail.includes('already exists')) {
        throw new Error('A delivery record with these details already exists.');
      }

      console.error('API response error:', error.response.data);
      throw new Error(detail || 'Failed to add delivery. Please check your data.');
    }

    if (error.request) {
      console.error('No response from server:', error.request);
      throw new Error('Server is not responding. Please check your internet connection.');
    }

    console.error('Unexpected error:', error.message);
    throw new Error('An unexpected error occurred while adding delivery.');
  }
};
