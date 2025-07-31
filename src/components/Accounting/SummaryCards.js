import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

const SummaryCards = () => {
  const summaryData = [
    { title: 'Total Income', value: '$50,000' },
    { title: 'Total Expenses', value: '$30,000' },
    { title: 'Net Profit', value: '$20,000' },
    { title: 'Pending Payments', value: '$5,000' },
  ];

  return (
    <Grid container spacing={4} sx={{ marginBottom: '20px' }}>
      {summaryData.map((item, index) => (
        <Grid item xs={12} md={3} key={index}>
          <Paper
            elevation={3}
            sx={{
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#f5f5f5',
              borderRadius: '10px',
            }}
          >
            <Typography variant="h6" gutterBottom>
              {item.title}
            </Typography>
            <Typography variant="h4" color="primary">
              {item.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;