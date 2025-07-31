import React, { useState } from 'react'; 
import style from './styles/POS.module.css';
import Payment from './Payment';

const OrderSummary = ({
  subTotalAmount,
  totalDiscount,
  discount,
  totalAmount,
  vat,
  vatAmount,
  grossAmount,
  handleTotalDiscountChange
}) => {
  const [inputValue, setInputValue] = useState(discount.toString());

  // Handle input changes and ensure the value is updated and applied immediately
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    const discountValue = parseFloat(value) || 0; // Convert the input value to a number
    handleTotalDiscountChange(discountValue); // Pass the discount value to the parent function immediately
  };

  return (
    
      <table className={style.orderSummaryTable}>
        <thead>
           {/*<tr>
            <th>Credits</th>
            <th>$0.00</th>
          </tr>
         <tr>
            <th>Balance Due</th>
            <th>$0.00</th>
          </tr>*/}
          <tr>
            <th>Subtotal</th>
            <th>${subTotalAmount.toFixed(2)}</th>
          </tr>
          <tr>
            <th>Total Discounts</th>
            <th>
              <input
                type="number"
                value={inputValue}
                className={style.discountInput}
                min="0"
                onChange={handleInputChange} // Update and apply discount as user types
              />
            </th>
          </tr>
          <tr>
            <th>Discount Applied</th>
            <th>-${totalDiscount.toFixed(2)}</th>
          </tr>
          <tr>
            <th>Gross Total</th>
            <th>${grossAmount.toFixed(2)}</th>
          </tr>
          <tr>
            <th>VAT {vat}%</th>
            <th>(${vatAmount.toFixed(2)})</th>
          </tr>
          <tr className={style.totalRow}>
            <th>Net Total</th>
            <th>${totalAmount.toFixed(2)}</th>
          </tr>
        </thead>
      </table>   
  );
};

export default OrderSummary;
