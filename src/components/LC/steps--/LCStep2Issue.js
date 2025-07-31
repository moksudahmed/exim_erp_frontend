import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { addLC, getLCByNumber } from '../../../api/lc';

const LCStep2Issue = ({ onNext, banks, suppliers, token }) => {
  const [formData, setFormData] = useState({
    lcNumber: '',
    supplierId: '',
    issueDate: '',
    lcAmount: '',
    bankId: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadError, setLoadError] = useState('');
  console.log(banks);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLCNumberBlur = async () => {
    if (!formData.lcNumber) return;

    try {
      const lc = await getLCByNumber(formData.lcNumber, token);

      setFormData((prev) => ({
        ...prev,
        issueDate: lc.issue_date ? lc.issue_date.split('T')[0] : '',
        lcAmount: lc.total_amount || '',
        supplierId: lc.supplier_id || '',
        bankId: lc.bank_id || '',
      }));

      setLoadError('');
    } catch (error) {
      console.error('Failed to fetch L/C record:', error);
      setLoadError('No L/C record found with this number.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      reference_no: formData.lcNumber,
      issue_date: formData.issueDate,
      supplier_id: formData.supplierId,
      bank_id: formData.bankId,
      total_amount: parseFloat(formData.lcAmount),
      margin_amount: 0.0, // Or adjust if available
      businesses_id: 1, // TODO: Use dynamic business ID
      status: 'OPEN',
    };

    setIsLoading(true);
    try {
      await addLC(payload, token);
      setShowSuccess(true);
      if (onNext) onNext();

      // Reset form
      setFormData({
        lcNumber: '',
        supplierId: '',
        issueDate: '',
        lcAmount: '',
        bankId: '',
      });
    } catch (error) {
      console.error('Error adding L/C:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleFormSubmit}
        noValidate
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: '#fdfdfd',
          boxShadow: 4,
          maxWidth: '900px',
          mx: 'auto',
        }}
      >
        <Typography variant="h5" fontWeight={600} color="primary" mb={3}>
          Step 2: Issue Letter of Credit (L/C)
        </Typography>

        {loadError && (
          <Box mt={2}>
            <Alert severity="error">{loadError}</Alert>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="L/C Number"
              name="lcNumber"
              value={formData.lcNumber}
              onChange={handleInputChange}
              onBlur={handleLCNumberBlur}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required variant="outlined">
              <InputLabel id="supplier-label">Supplier</InputLabel>
              <Select
                labelId="supplier-label"
                label="Supplier"
                name="supplierId"
                value={formData.supplierId}
                onChange={handleInputChange}
                disabled={isLoading}
              >
                <MenuItem value="">
                  <em>— Select Supplier —</em>
                </MenuItem>
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.client_id} value={supplier.client_id}>
                    {supplier.account_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              type="date"
              label="Issue Date"
              name="issueDate"
              InputLabelProps={{ shrink: true }}
              value={formData.issueDate}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              type="number"
              label="L/C Amount"
              name="lcAmount"
              inputProps={{ min: 0 }}
              value={formData.lcAmount}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required variant="outlined">
              <InputLabel id="bank-label">Issuing Bank</InputLabel>
              <Select
                labelId="bank-label"
                label="Issuing Bank"
                name="bankId"
                value={formData.bankId}
                onChange={handleInputChange}
                disabled={isLoading}
              >
                <MenuItem value="">
                  <em>— Select Bank —</em>
                </MenuItem>
                {banks.map((bank) => (
                  <MenuItem key={bank.subsidiary_account_id} value={bank.subsidiary_account_id}>
                    {bank.account_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading}
              sx={{ px: 5, py: 1.5, mt: 2 }}
            >
              {isLoading ? 'Submitting...' : 'Save & Continue'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          L/C issued successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default LCStep2Issue;
