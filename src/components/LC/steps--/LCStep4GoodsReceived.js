import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid
} from '@mui/material';

const LCStep4GoodsReceived = ({ onNext }) => {
  const [formData, setFormData] = useState({
    lcNumber: '',
    receivedDate: '',
    warehouseLocation: '',
    receivedBy: '',
    remarks: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Goods Received Data:', formData);
    if (onNext) onNext();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        Step 4: Goods Received
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
            label="Received Date"
            name="receivedDate"
            InputLabelProps={{ shrink: true }}
            value={formData.receivedDate}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Warehouse Location"
            name="warehouseLocation"
            value={formData.warehouseLocation}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Received By"
            name="receivedBy"
            value={formData.receivedBy}
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
            Confirm Goods Received
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LCStep4GoodsReceived;
