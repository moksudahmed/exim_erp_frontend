import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
} from '@mui/material';

const LCStep5Realize = ({ onNext }) => {
  const [formData, setFormData] = useState({
    lcNumber: '',
    realizationDate: '',
    bankName: '',
    realizedAmount: '',
    remarks: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('L/C Realization Data:', formData);
    if (onNext) onNext(); // move to next step if provided
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        Step 5: Realize L/C Payment
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="L/C Number"
            name="lcNumber"
            value={formData.lcNumber}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            type="date"
            label="Realization Date"
            name="realizationDate"
            InputLabelProps={{ shrink: true }}
            value={formData.realizationDate}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Bank Name"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Realized Amount"
            name="realizedAmount"
            type="number"
            value={formData.realizedAmount}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Confirm Realization
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LCStep5Realize;
