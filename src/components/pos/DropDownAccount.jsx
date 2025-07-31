import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import style from './styles/POS.module.css';

const DropDownAccount = ({ accounts, selectedAccount, setSelectedAccount }) => {
  const [inputValue, setInputValue] = useState('');

  const formattedAccounts = accounts.map((account) => ({
    label: account.account_name,
    account_id: account.subsidiary_account_id,
    client_id: account.client_id
  }));

  const filterAccounts = (input) =>
    formattedAccounts.filter((acc) =>
      acc.label.toLowerCase().includes(input.toLowerCase())
    );

  const promiseOptions = (input) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterAccounts(input));
      }, 300);
    });

  return (
    <div className={`${style.formField} ${style.productField}`}>
      <label htmlFor="account">Account</label>
      <AsyncSelect
        cacheOptions
        defaultOptions={formattedAccounts}
        loadOptions={promiseOptions}
        onInputChange={(value) => setInputValue(value)}
        onChange={(option) => setSelectedAccount(option)}
        isClearable
        value={selectedAccount}
      />
    </div>
  );
};

export default DropDownAccount;
