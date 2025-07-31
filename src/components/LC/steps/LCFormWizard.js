import React, { useState, useEffect } from 'react';
import { Steps, Button, Divider, message } from 'antd';
import {
  FileTextOutlined,
  DollarOutlined,
  FileDoneOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';

import Step1_LCDetails from './Step1_LCDetails';
import Step2_MarginPayment from './Step2_MarginPayment';
import Step3_Review from './Step3_Review';
import Step4_Issuance from './Step4_Issuance';
import Step5_Shipment from './Step5_Shipment';
import Step6_GoodsReceipt from './Step6_GoodsReceipt';
import Step7_FinalPayment from './Step7_FinalPayment';

const { Step } = Steps;

const fullSteps = [
  { title: 'LC Details', content: Step1_LCDetails, stage: 'DRAFT', icon: <FileTextOutlined /> },
  { title: 'Margin Payment', content: Step2_MarginPayment, stage: 'SUBMITTED', icon: <DollarOutlined /> },
  { title: 'Review & Submit', content: Step3_Review, stage: 'UNDER_REVIEW', icon: <FileDoneOutlined /> },
  { title: 'Issuance', content: Step4_Issuance, stage: 'APPROVED', icon: <CheckCircleOutlined /> },
  { title: 'Shipment', content: Step5_Shipment, stage: 'ISSUED', icon: <FileTextOutlined /> },
  { title: 'Goods Receipt', content: Step6_GoodsReceipt, stage: 'GOODS_RECEIVED', icon: <FileDoneOutlined /> },
  { title: 'Final Payment', content: Step7_FinalPayment, stage: 'CLOSED', icon: <DollarOutlined /> }
];

const LCFormWizard = ({ banks, token, lcData, currentStage, marginPayment, warehouses }) => {
  const resolveCurrentStage = () => {
    const stage = (lcData?.status || currentStage || 'DRAFT').toUpperCase();
    const index = fullSteps.findIndex(step => step.stage === stage);
    return index >= 0 ? index : 0;
  };

  const [current, setCurrent] = useState(resolveCurrentStage());

  const [formData, setFormData] = useState({
    lc: {
      lcNumber: lcData?.lcNumber || '',
      applicant: lcData?.applicant || '',
      beneficiary: lcData?.beneficiary || '',
      issueDate: lcData?.issueDate || null,
      expiryDate: lcData?.expiryDate || null,
      amount: lcData?.amount || '',
      currency: lcData?.currency || 'USD',
      businessesId: lcData?.businessesId || 1
    },
    margin_payments: lcData?.margin_payments || [{ amount: '', paymentDate: null, accountId: '' }],
    issuance: lcData?.issuance || {},
    shipment: lcData?.shipment || {},
    goods_receipt: lcData?.goods_receipt || {},
    final_payment: lcData?.final_payment || {}
  });

  useEffect(() => {
    setCurrent(resolveCurrentStage());
  }, [lcData?.status, currentStage]);

  const next = () => setCurrent(prev => prev + 1);
  const prev = () => setCurrent(prev => prev - 1);

  const updateData = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    next();
  };

  const handleFinalSubmit = () => {
    console.log('Final formData:', formData);
    message.success('LC Application submitted successfully!');
    // Add API call here
  };

  const StepContent = fullSteps[current].content;

  return (
    <div style={{ padding: 24 }}>
      <Steps current={current} style={{ marginBottom: '40px' }} labelPlacement="vertical" responsive>
        {fullSteps.map((item) => (
          <Step key={item.title} title={<span style={{ fontWeight: 500 }}>{item.title}</span>} icon={item.icon} />
        ))}
      </Steps>

      <div style={{ minHeight: '300px' }}>
        <StepContent
          formData={formData}
          updateData={updateData}
          data={lcData}
          token={token}
          banks={banks}
          marginPayment={marginPayment}
          warehouses={warehouses}
          onNext={next}
          onPrev={prev}
        />
      </div>

      <Divider />

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        {current > 0 ? (
          <Button
            size="large"
            onClick={prev}
            icon={<ArrowLeftOutlined />}
            style={{ padding: '0 24px', height: '40px', fontWeight: 500 }}
          >
            Previous
          </Button>
        ) : <div />}

        {current < fullSteps.length - 1 ? (
          <Button
            type="primary"
            size="large"
            onClick={() => updateData(formData)}
            icon={<ArrowRightOutlined />}
            style={{
              padding: '0 24px',
              height: '40px',
              fontWeight: 500,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            Next Step
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            icon={<CheckCircleOutlined />}
            onClick={handleFinalSubmit}
            style={{
              padding: '0 32px',
              height: '40px',
              fontWeight: 500,
              background: '#52c41a',
              borderColor: '#52c41a',
              boxShadow: '0 2px 6px rgba(82, 196, 26, 0.3)'
            }}
          >
            Submit Application
          </Button>
        )}
      </div>
    </div>
  );
};

export default LCFormWizard;
