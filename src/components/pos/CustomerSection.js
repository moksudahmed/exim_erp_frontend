import style from './styles/POS.module.css';
import DropDownCustomer from './DropDownCustomer';
import CustomerForm from './CustomerForm';
import { addClient } from '../../api/client';
import { fetchCustomerDue } from '../../api/customer';
import React, { useState, useEffect } from 'react';

const CustomerSection = ({
  token,
  customers,
  setCustomers,
  selectedCustomer,
  setSelectedCustomer,
  setCustomerDue
}) => {
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isSavingCustomer, setIsSavingCustomer] = useState(false);

  const handleCustomerSave = async (newCustomerData) => {
    setIsSavingCustomer(true);
    try {
      const payload = {
        person: {
          title: 'Mr.',
          first_name: newCustomerData.name,
          last_name: '',
          contact_no: newCustomerData.contact_info,
          gender: ''
        },
        client: {
          client_type: 'CUSTOMER',
          registration_date: new Date().toISOString().split('T')[0], // Only date part
          businesses_id: 1
        },
        account: {
          account_id: 2,
          account_name: newCustomerData.name,
          address: newCustomerData.address,
          branch: 'Borosora',
          account_holder: newCustomerData.name,
          type: 'Customer'
        }
      };

      const savedCustomer = await addClient(payload, token);
      setCustomers((prev) => [...prev, savedCustomer]);
      setSelectedCustomer({ value: savedCustomer.id, label: savedCustomer.first_name });
      setIsCustomerModalOpen(false);
    } catch (error) {
      console.error('Failed to add customer:', error);
    } finally {
      setIsSavingCustomer(false);
    }
  };

  useEffect(() => {
    const loadCustomerDue = async () => {
      try {
        if (token && selectedCustomer?.value) {
          const data = await fetchCustomerDue(token, selectedCustomer);
          setCustomerDue(data);
        }
      } catch (error) {
        console.error('Error loading customer due:', error.message);
      }
    };

    loadCustomerDue();
  }, [token, selectedCustomer, setCustomerDue]);

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
