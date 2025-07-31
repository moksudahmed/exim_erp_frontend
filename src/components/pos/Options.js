
import React, { useState } from 'react';
import style from './styles/POS.module.css';


const Options = ({handleNoSale,  handleGuestCountChange, handleDiningTypeChange, totalAmount, handleCompleteOrder}) =>{
  
  const handleOrder = (event) => {
    //event.preventDefault();
    handleCompleteOrder(event.target.value);
  };

    
    return(

          
        <div className={style.paymentSection}>
          <button
            className={style.payButton}
            onClick={() => handleGuestCountChange(1)}
          >
            
          </button>
          <button
            className={style.payButton}
            onClick={() => handleDiningTypeChange('Dine-In')}
          >
            
          </button>
          <button className={style.payButton} onClick={handleNoSale}>
            No Sale
          </button>
          <button className={style.payButton} onClick={handleNoSale}>
            Hold
          </button>
          <button className={style.payButton} onClick={handleNoSale}>
            Split
          </button>
          
          <button className={style.payButton} onClick={handleNoSale}>
            Cancel
          </button>
          <button
            className={style.payButton}
            onClick={handleCompleteOrder}
          >
            Pay (${totalAmount.toFixed(2)})
          </button>
        </div>
    );
}

export default Options;