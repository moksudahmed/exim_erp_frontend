import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid
} from '@mui/material';

const LCStep3GoodsShipped = ({ onNext }) => {
  const [formData, setFormData] = useState({
    lcNumber: '',
    shipmentDate: '',
    blNumber: '',
    shippingCompany: '',
    portOfLoading: '',
    portOfDischarge: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Goods Shipment Data:', formData);
    if (onNext) onNext();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        Step 3: Goods Shipped
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
            label="Shipment Date"
            name="shipmentDate"
            InputLabelProps={{ shrink: true }}
            value={formData.shipmentDate}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Bill of Lading Number"
            name="blNumber"
            value={formData.blNumber}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Shipping Company"
            name="shippingCompany"
            value={formData.shippingCompany}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Port of Loading"
            name="portOfLoading"
            value={formData.portOfLoading}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Port of Discharge"
            name="portOfDischarge"
            value={formData.portOfDischarge}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Save and Continue
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LCStep3GoodsShipped;
