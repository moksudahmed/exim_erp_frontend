import { configureStore } from '@reduxjs/toolkit';
import accountingReducer from './accountingSlice'; // Import your slice

const store = configureStore({
  reducer: {
    accounting: accountingReducer, // Add your reducer(s)
  },
});

export default store;