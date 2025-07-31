import React from 'react';
import styles from './styles/ManageSales.module.css';

const ManageCustomers = ({ customers }) => {
  
  const handleEditClick = (customer) => {
  
  };

  return (
    <div className={styles.manageSales}>
      <h2>Manage customers</h2>
      <table className={styles.salesTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Contact NO</th>  
            <th>Actions</th>          
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>
                {customer.name}
              </td>
              <td>{customer.contact_info}</td>              
              <td>
                  <button className={styles.editButton} onClick={() => handleEditClick(customer)}>Edit</button>
                              
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCustomers;
