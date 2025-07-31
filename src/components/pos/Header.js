import React, { useState } from 'react';
import style from './styles/POS.module.css';

const Header = ({orderDetails}) =>{
    return(
        <div className={style.orderHeader}>
          <div className={style.orderTitle}>Order #185</div>
          <div className={style.orderDetails}>
            Table 5 | {orderDetails.diningType} | {orderDetails.guestCount} Guest
            {orderDetails.guestCount > 1 ? 's' : ''}
          </div>
        </div>
    );
}

export default Header;