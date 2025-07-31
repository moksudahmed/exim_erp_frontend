import React from 'react';
import styles from './styles/AuthForm.module.css';

const AuthForm = ({ title, children, onSubmit }) => {
  return (
    <div className={styles.authContainer}>
      <h2 className={styles.title}>{title}</h2>
      <form onSubmit={onSubmit} className={styles.form}>
        {children}
        <button type="submit" className={styles.submitButton}>Submit</button>
      </form>
    </div>
  );
};

export default AuthForm;
