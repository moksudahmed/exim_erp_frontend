import React from 'react';
import { Card, Form, InputNumber, DatePicker, Button, Space } from 'antd';
import dayjs from 'dayjs';

const Step6_Realization = ({ data, onNext, onPrev }) => {
  const [form] = Form.useForm();
  const handleFinish = values => {
    onNext({ realization: { realized_amount: values.realized_amount, realization_date: values.realization_date.format('YYYY-MM-DD') }});
  };

  return (
    <Card title="Step 6: Realization">
      <Form form={form} initialValues={data.realization} onFinish={handleFinish}>
        <Form.Item name="realized_amount" label="Realized Amount" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="realization_date" label="Realization Date" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button onClick={onPrev}>Previous</Button>
            <Button type="primary" htmlType="submit">Next</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Step6_Realization;
