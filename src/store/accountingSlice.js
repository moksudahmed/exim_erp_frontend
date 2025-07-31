import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getLedgerEntries,
  createFinancialPeriod,
  closeFinancialPeriod,
  generateFinancialReport,
  getAccountingSetting,
  updateAccountingSetting
} from '../api/accounting';

import { fetchAccounts } from '../api/account';

export const fetchLedger = createAsyncThunk(
  'accounting/fetchLedger',
  async () => {
    const response = await getLedgerEntries();
    return response;
  }
);

export const fetchAccount = createAsyncThunk(
  'accounting/fetchAccounts',
  async () => {
    const response = await fetchAccounts();  // Use the renamed import
    return response;
  }
);

export const addFinancialPeriod = createAsyncThunk(
  'accounting/addFinancialPeriod',
  async (periodData) => {
    const response = await createFinancialPeriod(periodData);
    return response;
  }
);

const accountingSlice = createSlice({
  name: 'accounting',
  initialState: {
    ledger: [],
    periods: [],
    reports: [],
    settings: {},
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLedger.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLedger.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ledger = action.payload;
      })
      .addCase(fetchLedger.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addFinancialPeriod.fulfilled, (state, action) => {
        state.periods.push(action.payload);
      });
  }
});

export default accountingSlice.reducer;
