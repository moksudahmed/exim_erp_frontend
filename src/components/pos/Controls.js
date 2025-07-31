import React, { useState } from 'react';
import style from './styles/POS.module.css';

const Controls =() =>{
    return (
        <div className={style.orderControls}>
          <button className={style.controlButton}>Tab</button>
          <button className={style.controlButton}>+ Item</button>
          <button className={style.controlButton}>Split</button>
          <button className={style.controlButton}>Cancel</button>
          <button className={style.controlButton}>Hold</button>
          <button className={style.controlButton}>Send</button>
        </div>
    );
}

export default Controls;