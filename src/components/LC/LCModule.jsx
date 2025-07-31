// src/components/lc/LifecycleProgress.jsx

import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';

import {
  Description as LcIcon,
  LocalShipping as ShippingIcon,
  MoveToInbox as ReceiveIcon,
  Inventory as InventoryIcon,
  Payment as PaymentIcon,
  AccountBalanceWallet as WalletIcon,
  CheckCircle as CompleteIcon
} from '@mui/icons-material';

const LC_STEPS = [
  { label: 'LC Creation', icon: <DescriptionIcon />, color: 'info' },
  { label: 'Margin Payment', icon: <WalletIcon />, color: 'primary' },
  { label: 'LC Issuance', icon: <LcIcon />, color: 'secondary' },
  { label: 'Shipment', icon: <ShippingIcon />, color: 'warning' },
  { label: 'Goods Receipt', icon: <ReceiveIcon />, color: 'success' },
  { label: 'Realization', icon: <InventoryIcon />, color: 'success' },
  { label: 'Final Payment', icon: <PaymentIcon />, color: 'error' },
];

const LifecycleProgress = ({ currentStep = 0, completedSteps = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getStepColor = (index, stepColor) => {
    if (completedSteps[index]) return 'success.main';
    if (currentStep === index) return `${stepColor}.main`;
    return 'action.disabled';
  };

  return (
    <Box mt={4} px={{ xs: 2, sm: 4 }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          fontWeight: 600, 
          color: 'primary.dark' 
        }}
      >
        L/C Lifecycle Progress
      </Typography>

      <Stepper 
        activeStep={currentStep} 
        alternativeLabel 
        nonLinear
        sx={{ mt: 4 }}
      >
        {LC_STEPS.map((step, index) => (
          <Step key={step.label} completed={completedSteps[index]}>
            <StepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: completedSteps[index]
                      ? 'success.light'
                      : currentStep === index
                      ? `${step.color}.light`
                      : 'background.paper',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: getStepColor(index, step.color),
                    border: `2px solid ${getStepColor(index, step.color)}`,
                    boxShadow:
                      currentStep === index
                        ? `0 0 0 4px ${theme.palette[step.color].light}80`
                        : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {completedSteps[index] ? <CompleteIcon fontSize="small" /> : step.icon}
                </Box>
              )}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: currentStep === index ? 700 : 500,
                  color: getStepColor(index, step.color),
                  fontSize: isMobile ? '0.7rem' : '0.85rem',
                  mt: 1,
                }}
              >
                {step.label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default LifecycleProgress;
