import React, { useState, useEffect } from 'react';
import UserForm from './UserForm';
import styles from './styles/UserManagement.module.css';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  assignRole
} from '../../api/auth';
import ResetPasswordModal from './ResetPasswordModal';

const UserManagement = ({ token, isAuthenticated }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formMode, setFormMode] = useState(null); // null means no form showing
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        if (isAuthenticated && token) {
          const fetchedUsers = await fetchUsers(token);
          setUsers(fetchedUsers);
        }
      } catch (error) {
        setError('Failed to load users. Please try again.');
        console.error('Failed to load users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [isAuthenticated, token]);

  // Add user
  const handleAddUser = async (userData) => {
    try {
      setIsLoading(true);
      const newUser = await createUser(userData, token);
      setUsers(prev => [...prev, newUser]);
      setFormMode(null);
    } catch (error) {
      setError(`Add user failed: ${error.message}`);
      console.error('Add user failed:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user
  const handleUpdateUser = async (userData) => {
    try {
      setIsLoading(true);
      const updatedUser = await updateUser(userData.id, userData, token);
      setUsers(prev =>
        prev.map(user => (user.id === updatedUser.id ? updatedUser : user))
      );
      setFormMode(null);
    } catch (error) {
      setError(`Update user failed: ${error.message}`);
      console.error('Update user failed:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      setIsLoading(true);
      await deleteUser(token, userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      setError(`Delete user failed: ${error.message}`);
      console.error('Delete user failed:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const openResetPasswordModal = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const handlePasswordReset = async (newPassword) => {
    try {
      setIsLoading(true);
      await resetPassword(selectedUserId, newPassword, token);
      alert('Password has been reset successfully');
    } catch (error) {
      setError(`Reset password failed: ${error.message}`);
      console.error('Reset password failed:', error.message);
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  // Assign role via dropdown
  const handleAssignRole = async (userId, newRole) => {
    if (!newRole) return;
    try {
      setIsLoading(true);
      const updatedUser = await assignRole(userId, newRole, token);
      setUsers(prev =>
        prev.map(user => (user.id === userId ? updatedUser : user))
      );
    } catch (error) {
      setError(`Assign role failed: ${error.message}`);
      console.error('Assign role failed:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setFormMode('edit');
    setSelectedUser(user);
  };

  return (
    <div className={styles.userManagementContainer}>
      <header className={styles.header}>
        <h2 className={styles.title}>User Management</h2>
        <button
          className={styles.addButton}
          onClick={() => {
            setSelectedUser(null);
            setFormMode('add');
          }}
        >
          Add New User
        </button>
      </header>

      {error && <div className={styles.errorAlert}>{error}</div>}
      {isLoading && <div className={styles.loadingIndicator}>Loading...</div>}

      {formMode && (
        <div className={styles.formOverlay}>
          <UserForm
            mode={formMode}
            user={selectedUser}
            onSubmit={formMode === 'edit' ? handleUpdateUser : handleAddUser}
            onClose={() => setFormMode(null)}
            isLoading={isLoading}
          />
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleAssignRole(user.id, e.target.value)}
                      disabled={isLoading}
                    >
                      <option value="">Select role</option>
                      <option value="basic-user">Basic User</option>
                      <option value="admin">Admin</option>
                      <option value="super-admin">Super Admin</option>
                      <option value="sale-representative">Sale Representative</option>
                    </select>
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        user.status === 'active' ? styles.active : styles.inactive
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.resetButton}`}
                      onClick={() => openResetPasswordModal(user.id)}
                    >
                      Reset Password
                    </button>
                    <ResetPasswordModal
                      visible={showModal}
                      onClose={() => setShowModal(false)}
                      onSubmit={handlePasswordReset}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className={styles.noUsers}>
                  {isLoading ? 'Loading users...' : 'No users found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
