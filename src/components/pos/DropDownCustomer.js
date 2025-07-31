import React, { useState } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import style from './styles/POS.module.css';

const DropDownCustomer = ({ customers, selectedCustomer, setSelectedCustomer }) => {
  const [inputValue, setInputValue] = useState('');

  const formattedCustomers = customers.map((customer) => ({
    label: customer.account_name,
    value: customer.client_id,
  }));
  
  const filterCustomers = (input) =>
    formattedCustomers.filter((c) =>
      c.label.toLowerCase().includes(input.toLowerCase())
    );

  const promiseOptions = (input) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterCustomers(input));
      }, 300);
    });

  return (
    <div className={`${style.formField} ${style.productField}`}>
      <label htmlFor="customer">Customer</label>
      <AsyncCreatableSelect
        cacheOptions
        defaultOptions={formattedCustomers}
        loadOptions={promiseOptions}
        onInputChange={(value) => setInputValue(value)}
        onChange={(option) => setSelectedCustomer(option)}
        isClearable
        value={selectedCustomer}
      />
    </div>
  );
};

export default DropDownCustomer;
