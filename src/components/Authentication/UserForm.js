import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from './styles/UserForm.module.css'; // Make sure this path is correct

const UserForm = ({ user, onSubmit, onClose, mode, isLoading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    reset(user || {});
  }, [user, reset]);

  const handleFormSubmit = (data) => {
    if (mode === 'edit' && user?.id) {
      onSubmit({ ...user, ...data });
    } else {
      onSubmit(data);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3>{mode === 'edit' ? 'Edit User' : 'Add New User'}</h3>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            {...register('username', { required: 'Username is required' })}
            placeholder="Enter username"
            className={errors.username ? styles.errorInput : ''}
          />
          {errors.username && (
            <span className={styles.errorMessage}>{errors.username.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            placeholder="Enter email"
            className={errors.email ? styles.errorInput : ''}
          />
          {errors.email && (
            <span className={styles.errorMessage}>{errors.email.message}</span>
          )}
        </div>

        {mode === 'add' && (
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              placeholder="Enter password"
              className={errors.password ? styles.errorInput : ''}
            />
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password.message}</span>
            )}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            {...register('role', { required: 'Role is required' })}
            className={errors.role ? styles.errorInput : ''}
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          {errors.role && (
            <span className={styles.errorMessage}>{errors.role.message}</span>
          )}
        </div>

        <div className={styles.formActions}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : mode === 'edit' ? 'Update User' : 'Add User'}
          </button>
          <button 
            type="button" 
            onClick={onClose}
            className={styles.cancelButton}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;