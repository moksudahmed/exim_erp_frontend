import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  DatePicker,
  message,
  Space,
  Divider,
  Row,
  Col
} from 'antd';
import {
  UserOutlined,
  BankOutlined,
  PhoneOutlined,
  HomeOutlined,
  SaveOutlined,
  CloseOutlined,
  IdcardOutlined,
  ContactsOutlined
} from '@ant-design/icons';
import { addClient } from '../../api/client';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const CustomerEntryForm = ({ branches = [], onClose }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateContactNumber = (_, value) => {
    try {
      if (!value) {
        return Promise.reject('Contact number is required');
      }
      
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      
      // Check if the cleaned value has exactly 11 digits
      if (digitsOnly.length !== 11) {
        return Promise.reject('Contact number must be exactly 11 digits');
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Validation Error:', error);
      return Promise.reject('Invalid contact number format');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      // Clean the contact number before submission
      const cleanedContactNo = values.contact_no.replace(/\D/g, '');

      const payload = {
        person: {
          title: values.title,
          first_name: values.first_name,
          last_name: values.last_name,
          contact_no: cleanedContactNo,
        },
        client: {
          client_type: 'CUSTOMER',
          registration_date: new Date().toISOString().split('T')[0],
          businesses_id: 1,
        },
        account: {
          account_name: values.account_name,
          account_no: values.account_no,
          address: values.address,
          branch: values.branch,
          account_holder: values.account_holder,
          type: 'Customer',
        },
      };
      
      await addClient(payload);
      message.success('Customer registered successfully!');
      form.resetFields();
      if (onClose) onClose();
    } catch (error) {
      console.error('Submit Error:', error);
      message.error(error.response?.data?.message || 'Failed to register customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      bordered={false}
      style={{
        maxWidth: 800,
        margin: '0 auto',
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}
      bodyStyle={{ padding: 32 }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ color: '#1890ff', marginBottom: 8 }}>
          <ContactsOutlined style={{ marginRight: 8 }} />
          New Customer Registration
        </Title>
        <Text type="secondary">
          Complete all sections to register a new customer account
        </Text>
      </div>

      <Divider orientation="left" orientationMargin={0}>
        <Text strong style={{ fontSize: 14 }}>Personal Information</Text>
      </Divider>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{ registration_date: dayjs() }}
      >
        <Row gutter={24}>
          <Col xs={24} sm={8}>
            <Form.Item
              name="title"
              label={<Text strong>Title</Text>}
              rules={[{ required: true, message: 'Required' }]}
            >
              <Select 
                placeholder="Select title"
                suffixIcon={<UserOutlined />}
                size="large"
              >
                <Option value="Mr.">Mr.</Option>
                <Option value="Mrs.">Mrs.</Option>
                <Option value="Ms.">Ms.</Option>
                <Option value="Dr.">Dr.</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              name="first_name"
              label={<Text strong>First Name</Text>}
              rules={[{ 
                required: true, 
                message: 'Required',
                whitespace: true
              }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="First Name" 
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              name="last_name"
              label={<Text strong>Last Name</Text>}
              rules={[{ 
                required: true, 
                message: 'Required',
                whitespace: true
              }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Last Name" 
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="contact_no"
              label={<Text strong>Contact Number (11 digits)</Text>}
              rules={[
                { required: true, message: 'Required' },
                { validator: validateContactNumber }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="01XXXXXXXXX" 
                size="large"
                maxLength={14} // Allows for spaces/dashes if needed
                onChange={(e) => {
                  // Format the number as user types (optional)
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 11) {
                    const formatted = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
                    form.setFieldsValue({ contact_no: formatted });
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" orientationMargin={0}>
          <Text strong style={{ fontSize: 14 }}>Account Information</Text>
        </Divider>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="account_name"
              label={<Text strong>Account Name</Text>}
              rules={[{ 
                required: true, 
                message: 'Required',
                whitespace: true
              }]}
            >
              <Input 
                prefix={<BankOutlined />} 
                placeholder="Account Name" 
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="account_no"
              label={<Text strong>Account Number</Text>}
              rules={[{ 
                required: true, 
                message: 'Required',
                whitespace: true
              }]}
            >
              <Input 
                prefix={<IdcardOutlined />} 
                placeholder="Account Number" 
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="account_holder"
              label={<Text strong>Account Holder</Text>}
              rules={[{ 
                required: true, 
                message: 'Required',
                whitespace: true
              }]}
            >
              <Input 
                placeholder="Account Holder Name" 
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="branch"
              label={<Text strong>Branch</Text>}
              rules={[{ required: true, message: 'Required' }]}
            >
              <Select 
                placeholder="Select Branch" 
                size="large"
                showSearch
                optionFilterProp="children"
              >
                {branches.map(branch => (
                  <Option key={branch.id} value={branch.branchname}>
                    {branch.branchname}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="address"
              label={<Text strong>Address</Text>}
              rules={[{ 
                required: true, 
                message: 'Required',
                whitespace: true
              }]}
            >
              <Input.TextArea
                placeholder="123 Main St, City, Country"
                rows={3}
                showCount
                maxLength={200}
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Row justify="end" gutter={16}>
          <Col>
            <Button
              type="default"
              onClick={onClose}
              icon={<CloseOutlined />}
              size="large"
              style={{ width: 120 }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              style={{ width: 150 }}
              loading={isSubmitting}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default CustomerEntryForm;