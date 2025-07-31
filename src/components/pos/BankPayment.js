import React, { useState } from 'react';
import style from './styles/POS.module.css';

const  BankPayment = ({chequeNumber, setChequeNumber})=>{

const handleChequeNumberChange = (event) => {
        setChequeNumber(event.target.value);
};
return(
        <div className={style.cardSection}>
           <label htmlFor="chequeNumber" className={style.cardLabel}>Cheque Number</label>
           <input
              type="text"
              id="chequeNumber"
              value={chequeNumber}
              onChange={handleChequeNumberChange}
              className={style.cardInput}
            />
        </div>
            
);
}

export default  BankPayment;