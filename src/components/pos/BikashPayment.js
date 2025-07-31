import React, { useState } from 'react';
import style from './styles/POS.module.css';

const  BikashPayment = ({bikashNumber, setBikasNumber})=>{

const handleChequeNumberChange = (event) => {
        setBikasNumber(event.target.value);
};
return(
        <div className={style.cardSection}>
           <label htmlFor="bikashNumber" className={style.cardLabel}>Bikash Number</label>
           <input
              type="text"
              id="bikashNumber"
              value={bikashNumber}
              onChange={handleChequeNumberChange}
              className={style.cardInput}
            />
        </div>
            
);
}

export default  BikashPayment;