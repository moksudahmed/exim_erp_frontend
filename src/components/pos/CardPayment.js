import React, { useState } from 'react';
import style from './styles/POS.module.css';

const  CardPayment = ({setCardNumber, cardNumber})=>{

const handleCardNumberChange = (event) => {
        setCardNumber(event.target.value);
};
return(
        <div className={style.cardSection}>
           <label htmlFor="cardNumber" className={style.cardLabel}>Card Number</label>
           <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className={style.cardInput}
            />
        </div>
            
);
}

export default  CardPayment;