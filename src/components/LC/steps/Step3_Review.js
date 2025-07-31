import React from 'react';
import { Button, Descriptions, List, Space } from 'antd';
import dayjs from 'dayjs';
import { addLC } from '../../../api/lc';

const Step3_Review = ({ data, onPrev, token, banks }) => {
  const handleSubmit = async () => {
    const payment = data.margin_payments?.[0];

    if (!payment) {
      console.error('No margin payment found!');
      return;
    }

    // Find bank from list using bank_name string
    const matchedBank = banks.find(
      (bank) => bank.account_name === payment.bank_name
    );

    if (!matchedBank) {
      console.error('Bank not found for name:', payment.bank_name);
      return;
    }

    const payload = {
      lc: data.lc,
      margin_payment: {
        amount: payment.amount,
        payment_date: payment.payment_date,
        account_id: matchedBank.subsidiary_account_id,
        reference: payment.reference,
      },
    };

    console.log('Final Submission Payload:', payload);

    await addLC(payload);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD') : date;
  };

  return (
    <div>
      <Descriptions title="LC Details" bordered column={1}>
        <Descriptions.Item label="LC Number">{data?.lc?.lc_number || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Applicant">{data?.lc?.applicant || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Beneficiary">{data?.lc?.beneficiary || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Currency">{data?.lc?.currency || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Amount">{data?.lc?.amount || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Issue Date">{formatDate(data?.lc?.issue_date)}</Descriptions.Item>
        <Descriptions.Item label="Expiry Date">{formatDate(data?.lc?.expiry_date)}</Descriptions.Item>
      </Descriptions>

      <List
        header={<b>Margin Payments</b>}
        bordered
        dataSource={data?.margin_payments || []}
        renderItem={(item, idx) => (
          <List.Item key={idx}>
            <Space wrap>
              {idx + 1}. Date: {formatDate(item.payment_date)} | Amount: {item.amount} | Bank: {item.bank_name || 'N/A'} | Ref: {item.reference || 'N/A'}
            </Space>
          </List.Item>
        )}
        style={{ marginTop: 20 }}
      />

      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <Button onClick={onPrev} style={{ marginRight: 8 }}>
          Previous
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Step3_Review;
