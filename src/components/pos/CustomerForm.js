import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Space, 
  message 
} from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  HomeOutlined,
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const CustomerForm = ({ onSave, onClose }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      const newCustomer = {
        id: Math.floor(Math.random() * 10000), // simulate customer ID
        name: values.name,
        contact_info: values.phone,
        address: values.address,
        user_id: 1
      };

      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      onSave(newCustomer);
      message.success('Customer added successfully');
      onClose();
    } catch (error) {
      message.error('Failed to add customer');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      bordered={false}
      style={{
        width: '400px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Title level={4} style={{ marginBottom: '8px' }}>
          Add New Customer
        </Title>
        <p style={{ color: '#666', margin: 0 }}>
          Please fill in the customer details
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[
            { required: true, message: 'Please enter customer name' },
            { min: 3, message: 'Name must be at least 3 characters' }
          ]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="John Doe" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: 'Please enter phone number' },
            { pattern: /^[0-9+\- ]+$/, message: 'Please enter a valid phone number' }
          ]}
        >
          <Input 
            prefix={<PhoneOutlined />} 
            placeholder="+1 234 567 8900" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[
            { required: true, message: 'Please enter address' },
            { min: 10, message: 'Address must be at least 10 characters' }
          ]}
        >
          <Input.TextArea
            prefix={<HomeOutlined />}
            placeholder="123 Main St, City, Country"
            rows={3}
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
          <Space size="middle" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="default"
              onClick={onClose}
              icon={<CloseOutlined />}
              size="large"
              style={{ width: '120px' }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              loading={isSubmitting}
              style={{ width: '120px' }}
            >
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CustomerForm;