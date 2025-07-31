import React from 'react';
import { Card, Form, Input, DatePicker, Button, Space, InputNumber, message } from 'antd';
import dayjs from 'dayjs';
import { addLCIssuance } from '../../../api/lc';

const Step4_Issuance = ({ data, onNext, onPrev }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        lc_id: values.lc_id,
        issuing_bank: values.issuing_bank,
        issue_date: values.issue_date.format('YYYY-MM-DD'),
        remarks: values.remarks
      };
      await addLCIssuance(payload);
      message.success('L/C Issuance submitted successfully!');
      onNext({ issuance: payload }); // You can skip this if not part of a multi-step flow
    } catch (error) {
      message.error('Please complete all required fields before submitting.');
    }
  };

  return (
    <Card title="Step 4: L/C Issuance">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          lc_id: data?.issuance?.lc_id,
          issuing_bank: data?.issuance?.issuing_bank,
          issue_date: data?.issuance?.issue_date ? dayjs(data.issuance.issue_date) : null,
          remarks: data?.issuance?.remarks
        }}
      >
        <Form.Item
          name="lc_id"
          label="L/C ID"
          rules={[{ required: true, message: 'Please input L/C ID' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="issuing_bank" label="Issuing Bank">
          <Input placeholder="Enter issuing bank name" />
        </Form.Item>

        <Form.Item
          name="issue_date"
          label="Issue Date"
          rules={[{ required: true, message: 'Please select issue date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="remarks" label="Remarks">
          <Input placeholder="Enter remarks" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button onClick={onPrev}>Previous</Button>
            <Button type="primary" onClick={handleSubmit}>Submit</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Step4_Issuance;
