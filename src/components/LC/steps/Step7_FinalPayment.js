import React from 'react';
import { Card, Form, Input, DatePicker, InputNumber, Button, Select, Space, message } from 'antd';
import dayjs from 'dayjs';
import { addLCFinalPayments } from '../../../api/lc'; // adjust to your actual API path

const { Option } = Select;

const PaymentForm = ({ data, token, accounts = [], onSuccess }) => {
  const [form] = Form.useForm();
  console.log(data);
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        lc_id: data.id,
        payment_date: values.payment_date.format('YYYY-MM-DD'),
        amount: parseFloat(values.amount),
        payment_method: values.payment_method,
        account_id: values.account_id || null,
        reference_no: values.reference_no,
        remarks: values.remarks || null
      };

      await addLCFinalPayments(payload, token);
      message.success('L/C Payment submitted successfully!');
      if (onSuccess) onSuccess(payload);
    } catch (error) {
      message.error('Please complete all required fields correctly.');
    }
  };

  return (
    <Card title="L/C Payment Information">
      <Form form={form} layout="vertical">
        <Form.Item label="Payment Date" name="payment_date" rules={[{ required: true, message: 'Payment date is required' }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Amount is required' }]}>
          <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
        </Form.Item>

        <Form.Item label="Payment Method" name="payment_method" rules={[{ required: true, message: 'Payment method is required' }]}>
          <Select placeholder="Select payment method">
            <Option value="BANK_TRANSFER">Bank Transfer</Option>
            <Option value="CASH">Cash</Option>
            <Option value="CHEQUE">Cheque</Option>
            <Option value="OTHER">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Account (Optional)" name="account_id">
          <Select placeholder="Select account (if applicable)" allowClear>
            {accounts.map(account => (
              <Option key={account.id} value={account.id}>
                {account.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Reference No." name="reference_no" rules={[{ required: true, message: 'Reference number is required' }]}>
          <Input placeholder="Enter reference number" />
        </Form.Item>

        <Form.Item label="Remarks (Optional)" name="remarks">
          <Input.TextArea rows={3} placeholder="Enter any remarks" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
            <Button onClick={() => form.resetFields()}>Reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PaymentForm;
