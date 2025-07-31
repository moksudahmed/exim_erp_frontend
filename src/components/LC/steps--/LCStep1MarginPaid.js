import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { addLC, getLCByNumber } from '../../../api/lc';

const LCStep1MarginPaid = ({ onNext, banks, suppliers, token }) => {
  const [formData, setFormData] = useState({
    lcNumber: '',
    applicantName: '',
    totalAmount: '',
    marginAmount: '',
    marginDate: '',
    paymentMethod: '',
    bankId:''
  });

  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadError, setLoadError] = useState('');

  const paymentMethods = ['Cash', 'Bank Transfer', 'Cheque', 'Mobile Banking'];

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
        applicantName: lc.applicant_name || '',
        totalAmount: lc.total_amount || '',
        marginAmount: lc.margin_amount || '',
        marginDate: lc.issue_date ? lc.issue_date.split('T')[0] : '',
        paymentMethod: lc.payment_method || '',
      }));

      setSelectedSupplierId(lc.supplier_id || '');
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
      applicant_name: formData.applicantName,
      issue_date: formData.marginDate,
      bank_id: formData.bankId, // TODO: Replace with dynamic bank ID if available
      supplier_id: selectedSupplierId,
      margin_amount: parseFloat(formData.marginAmount),
      total_amount: parseFloat(formData.totalAmount),
      status: 'OPEN',
      businesses_id: 1, // TODO: Replace with dynamic business ID if available
    };

    setIsLoading(true);
    try {
      await addLC(payload, token);
      setShowSuccess(true);
      if (onNext) onNext();

      // Reset form
      setFormData({
        lcNumber: '',
        applicantName: '',
        totalAmount: '',
        marginAmount: '',
        marginDate: '',
        paymentMethod: '',
      });
      setSelectedSupplierId('');
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
          Step 1: L/C Margin Payment Entry
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
            <TextField
              required
              fullWidth
              label="Applicant Name"
              name="applicantName"
              value={formData.applicantName}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Total Amount"
              name="totalAmount"
              type="number"
              inputProps={{ min: 0 }}
              value={formData.totalAmount}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Margin Amount"
              name="marginAmount"
              type="number"
              inputProps={{ min: 0 }}
              value={formData.marginAmount}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required variant="outlined">
              <InputLabel id="supplier-label">Supplier</InputLabel>
              <Select
                labelId="supplier-label"
                label="Supplier"
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
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
              label="Date of Payment"
              name="marginDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.marginDate}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required variant="outlined">
              <InputLabel id="payment-method-label">Payment Method</InputLabel>
              <Select
                labelId="payment-method-label"
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
          L/C record submitted successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default LCStep1MarginPaid;
