import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
} from '@mui/material';

const LCStep6FinalPayment = ({ onNext }) => {
  const [formData, setFormData] = useState({
    lcNumber: '',
    paymentDate: '',
    paymentAmount: '',
    paidTo: '',
    remarks: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('L/C Final Payment Data:', formData);
    if (onNext) onNext(); // proceed to next step if applicable
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        Step 6: Final Payment
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
            label="Payment Date"
            name="paymentDate"
            InputLabelProps={{ shrink: true }}
            value={formData.paymentDate}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Payment Amount"
            name="paymentAmount"
            type="number"
            value={formData.paymentAmount}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Paid To (Supplier)"
            name="paidTo"
            value={formData.paidTo}
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
            Confirm Final Payment
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LCStep6FinalPayment;
