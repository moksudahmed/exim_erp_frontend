import React from 'react';
import { Card, Form, Input, DatePicker, Button, Space, message } from 'antd';
import dayjs from 'dayjs';
import { addGoodsShipment } from '../../../api/lc';

const Step5_Shipment = ({ token, data, onNext, onPrev }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {      
      const values = await form.validateFields();
      const payload = {
        lc_id: data.id,
        shipment_date: values.shipment_date.format('YYYY-MM-DD'),
        bl_number: values.bl_number,
        shipping_company: values.shipping_company,
        port_of_loading: values.port_of_loading,
        port_of_discharge: values.port_of_discharge
      };
      await addGoodsShipment(payload, token);
      message.success('L/C Goods Shipment submitted successfully!');
      onNext({ shipment: payload }); // Pass to parent for state tracking
    } catch (error) {
      message.error('Please complete all required fields before submitting.');
    }
  };

  return (
    <Card title="Step 5: Shipment">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          shipment_date: data?.shipment?.shipment_date ? dayjs(data.shipment.shipment_date) : null,
          bl_number: data?.shipment?.bl_number,
          shipping_company: data?.shipment?.shipping_company,
          port_of_loading: data?.shipment?.port_of_loading,
          port_of_discharge: data?.shipment?.port_of_discharge
        }}
      >
        <Form.Item name="shipment_date" label="Shipment Date" rules={[{ required: true, message: 'Shipment date is required' }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="bl_number" label="BL Number" rules={[{ required: true, message: 'BL number is required' }]}>
          <Input placeholder="Enter BL number" />
        </Form.Item>

        <Form.Item name="shipping_company" label="Shipping Company" rules={[{ required: true, message: 'Shipping company is required' }]}>
          <Input placeholder="Enter shipping company" />
        </Form.Item>

        <Form.Item name="port_of_loading" label="Port of Loading" rules={[{ required: true, message: 'Port of loading is required' }]}>
          <Input placeholder="Enter port of loading" />
        </Form.Item>

        <Form.Item name="port_of_discharge" label="Port of Discharge" rules={[{ required: true, message: 'Port of discharge is required' }]}>
          <Input placeholder="Enter port of discharge" />
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

export default Step5_Shipment;
