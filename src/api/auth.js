import axios from 'axios';
import qs from 'qs';

const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/auth/`;


export const login = async (credentials) => {  
  const response = await axios.post(`${API_URL}login`, qs.stringify(credentials), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  
  return response.data;
};

export const register = async (userInfo) => {
  await axios.post(`${API_URL}register`, userInfo);
};

export const createUser = async (data, token) => {
  console.log(data);
  try {
    const res = await axios.post(`${API_URL}create-user`,
      {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
      },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("✅ User created successfully:", res.data);
    return res.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ Server error:", error.response.data);
    } else if (error.request) {
      console.error("❌ Network error: No response received", error.request);
    } else {
      console.error("❌ Unexpected error:", error.message);
    }
  }
};
export const fetchUsers = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });  
  return response.data;
};

export const forgotPassword = async (userInfo) => {
  // Implement forgot password logic if needed
};


export const updateUser = async (id, data, token) => {
  console.log(data);
  return fetch(`${API_URL}update-user/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
};

export const deleteUser = async (id, token) => {
  return fetch(`/api/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const resetPassword = async (id, newPassword, token) => {
  return fetch(`${API_URL}reset-password/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ newPassword }),
  });
};

// Frontend:
export const assignRole = async (id, role, token) => {
    return fetch(`${API_URL}assign-role/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ role }),
  });
};
