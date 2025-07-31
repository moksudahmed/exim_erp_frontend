import React, { useState } from 'react';
import AuthForm from './AuthForm';
import styles from './styles/AuthForm.module.css';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // State to hold error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onLogin({ username, password });  // Try logging in
    } catch (error) {
      setError(error.message);  // Set the error state if login fails
    }
  };

  return (
    <AuthForm title="Login" onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label>User Name:</label>
        <input
          type="username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}  {/* Display error message */}
      <div className={styles.linkGroup}>
        <Link to="/register">Don't have an account? Register</Link>
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
    </AuthForm>
  );
};

export default Login;
