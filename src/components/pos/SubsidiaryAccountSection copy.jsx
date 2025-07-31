import React, { useEffect, useState } from 'react';
import style from './styles/POS.module.css';
import DropDownAccount from './DropDownAccount';
import { fetchSubsidiaryAccounts } from '../../api/subsidiary_account';
import { fetchClientsByType } from '../../api/client';

const SubsidiaryAccountSection = ({ selectedAccount, setSelectedAccount, token }) => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const loadAccounts = async () => {
      try {       
        const data = await fetchClientsByType('CUSTOMER', token);    
        setAccounts(data); 
       
      } catch (error) {
        console.error('Failed to fetch subsidiary accounts:', error);
      }
    };

    loadAccounts();
  }, []);

  return (
    <div className={style.inlineForm} style={{ display: 'flex', alignItems: 'center' }}>
      <DropDownAccount
        accounts={accounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
      />
      <div className={style.customerButtonField} style={{ marginLeft: '10px' }}>
        <button type="button" className={style.customerButton}>
          {selectedAccount ? `Account: ${selectedAccount.label}` : 'Select Account'}
        </button>
      </div>
    </div>
  );
};

export default SubsidiaryAccountSection;
