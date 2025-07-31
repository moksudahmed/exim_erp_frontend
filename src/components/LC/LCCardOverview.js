import React from 'react';
import { Card, Descriptions } from 'antd';

const LCCardOverview = ({ lcData }) => {
  // Ensure lcData is an array with at least one object
 // console.log(lcData);
  if (lcData.length === 0) return null;

  const lc = lcData;

  return (
    <Card title="Letter of Credit Overview" bordered>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="LC No.">{lc.lc_number}</Descriptions.Item>
        <Descriptions.Item label="Applicant">{lc.applicant}</Descriptions.Item>
        <Descriptions.Item label="Beneficiary">{lc.beneficiary}</Descriptions.Item>
        <Descriptions.Item label="Currency">{lc.currency}</Descriptions.Item>
        <Descriptions.Item label="Amount">{lc.amount}</Descriptions.Item>
        <Descriptions.Item label="Issue Date">{lc.issue_date}</Descriptions.Item>
        <Descriptions.Item label="Expiry Date">{lc.expiry_date}</Descriptions.Item>
        <Descriptions.Item label="Status">{lc.status}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default LCCardOverview;
