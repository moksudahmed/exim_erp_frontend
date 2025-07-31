import style from './styles/POS.module.css';
import DropDownCustomer from './DropDownCustomer';
import CustomerForm from './CustomerForm';
import { addCustomer, fetchCustomerDue} from '../../api/customer';
import React, { useState, useEffect } from 'react';

const CustomerSection = ({ token, customers,setCustomers, selectedCustomer, setSelectedCustomer, setCustomerDue, subsidiaryAccounts, selectedClient, setSelectedClient}) => {
  
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isSavingCustomer, setIsSavingCustomer] = useState(false);

  const handleCustomerSave = async (newCustomerData) => {
    setIsSavingCustomer(true);
    try {
      const savedCustomer = await addCustomer(newCustomerData, token);
      setCustomers((prev) => [...prev, savedCustomer]);
      setSelectedCustomer({ value: savedCustomer.id, label: savedCustomer.name });
      setIsCustomerModalOpen(false);
    } catch (error) {
      console.error('Failed to add customer:', error);
    } finally {
      setIsSavingCustomer(false);
    }
  };

  useEffect(() => {
        const loadCustomers = async () => {
          try {
            if (token) {
              const data = await fetchCustomerDue(token, selectedCustomer);
             setCustomerDue(data);
             console.log(selectedCustomer);
            }
          } catch (error) {
            console.error('Error loading customers:', error.message);
          }
        };      
        loadCustomers();
      }, [token]);

  return (
    <div className={style.inlineForm} style={{ display: 'flex', alignItems: 'center' }}>
      <DropDownCustomer
        customers={customers}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
      />
      <div className={style.customerButtonField} style={{ marginLeft: '10px' }}>
        <button
          type="button"
          className={style.customerButton}
          onClick={() => setIsCustomerModalOpen(true)}
        >
          {selectedCustomer ? `Customer: ${selectedCustomer.label}` : 'Add Customer'}
        </button>
      </div>

      {isCustomerModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <CustomerForm
            onSave={handleCustomerSave}
            onClose={() => setIsCustomerModalOpen(false)}
            isLoading={isSavingCustomer}
          />
        </div>
      )}
    </div>
  );
};

export default CustomerSection;
