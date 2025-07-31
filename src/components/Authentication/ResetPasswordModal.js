import React, { useState } from 'react';

const ResetPasswordModal = ({ visible, onClose, onSubmit }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!password.trim()) {
      alert('Password cannot be empty');
      return;
    }
    onSubmit(password);
    setPassword('');
  };

  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Reset Password</h3>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <div style={styles.actions}>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose} style={{ marginLeft: '10px' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '6px',
    width: '300px'
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
};

export default ResetPasswordModal;
