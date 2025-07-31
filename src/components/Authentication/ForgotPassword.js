import React, { useState } from 'react';
import AuthForm from './AuthForm';
import styles from './styles/AuthForm.module.css';

const ForgotPassword = ({ onForgotPassword }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onForgotPassword({ email });
  };

  return (
    <AuthForm title="Forgot Password" onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
    </AuthForm>
  );
};

export default ForgotPassword;
