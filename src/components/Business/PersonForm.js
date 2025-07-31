// src/components/PersonForm.js
import React, { useState } from 'react';
import axios from 'axios';

const PersonForm = () => {
  const [form, setForm] = useState({
    title: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    client_id: '',
    fathers_name: '',
    mothers_name: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/persons/', form);
      alert('Person added with ID: ' + response.data.person_id);
    } catch (err) {
      alert('Error: ' + err.response?.data?.detail || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" onChange={handleChange} />
      <input name="first_name" placeholder="First Name" onChange={handleChange} required />
      <input name="last_name" placeholder="Last Name" onChange={handleChange} required />
      <input type="date" name="date_of_birth" onChange={handleChange} required />
      <input name="gender" placeholder="Gender" onChange={handleChange} />
      <input name="client_id" placeholder="Client ID" type="number" onChange={handleChange} />
      <input name="fathers_name" placeholder="Father's Name" onChange={handleChange} />
      <input name="mothers_name" placeholder="Mother's Name" onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default PersonForm;
