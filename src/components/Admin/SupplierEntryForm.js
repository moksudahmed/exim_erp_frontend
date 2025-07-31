import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  message,
  Divider,
  Row,
  Col,
  Space  // Added Space component
} from 'antd';
import {
  ShopOutlined,
  BankOutlined,
  PhoneOutlined,
  HomeOutlined,
  SaveOutlined,
  CloseOutlined,
  IdcardOutlined,
  ContactsOutlined,
  GlobalOutlined,
  UserOutlined  // Added UserOutlined icon
} from '@ant-design/icons';
import { addClient } from '../../api/client';

const { Title, Text } = Typography;
const { Option } = Select;

const SupplierEntryForm = ({ branches = [], onClose }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneFormat, setPhoneFormat] = useState('01XXXXXXXXX');

  const validateContactNumber = (_, value) => {
    if (!value) return Promise.reject('Contact number is required');
    
    const digitsOnly = value.replace(/\D/g, '');
    
    if (digitsOnly.length !== 11) {
      return Promise.reject('Exactly 11 digits required (e.g. 01712345678)');
    }
    
    if (!/^01[3-9]\d{8}$/.test(digitsOnly)) {
      return Promise.reject('Must start with 013-019');
    }
    
    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      const cleanedContactNo = values.contact_no.replace(/\D/g, '');

      const payload = {
        person: {
          title: values.title,
          first_name: values.first_name,
          last_name: values.last_name,
          contact_no: cleanedContactNo,
        },
        client: {
          client_type: 'SUPPLIER', // Changed to SUPPLIER
          registration_date: new Date().toISOString().split('T')[0],
          businesses_id: 1,
        },
        account: {
          account_name: values.account_name,
          account_no: values.account_no,
          address: values.address,
          branch: values.branch,
          account_holder: values.account_holder,
          type: 'Supplier', // Changed to Supplier
        },
      };
      
      await addClient(payload);
      message.success('Supplier registered successfully!');
      handleCancel();
    } catch (error) {
      console.error('Submit Error:', error);
      message.error(error.response?.data?.message || 'Registration failed. Please check your entries.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    if (onClose) onClose();
  };

  const formatPhoneNumber = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) return;
    
    let formatted = value;
    
    if (value.length > 3) {
      formatted = value.slice(0, 3) + '-' + value.slice(3);
    }
    if (value.length > 7) {
      formatted = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
    }
    
    form.setFieldsValue({ contact_no: formatted });
    setPhoneFormat(value.length > 0 ? value.replace(/\d(?=\d{4})/g, 'X') : '01XXXXXXXXX');
  };

  return (
    <Card
      bordered={false}
      style={{
        maxWidth: 800,
        margin: '0 auto',
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden'
      }}
      bodyStyle={{ padding: 32 }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ color: '#fa8c16', marginBottom: 8 }}>
          <ShopOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
          New Supplier Registration
        </Title>
        <Text type="secondary">
          Complete all sections to register a new supplier account
        </Text>
      </div>

      <Divider orientation="left" orientationMargin={0} style={{ marginTop: 0 }}>
        <Text strong style={{ fontSize: 14, color: '#595959' }}>Supplier Information</Text>
      </Divider>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
      >
        <Row gutter={24}>
          <Col xs={24} sm={8}>
            <Form.Item
              name="title"
              label={<Text strong>Title</Text>}
              rules={[{ required: true, message: 'Please select a title' }]}
            >
              <Select 
                placeholder="Select title"
                suffixIcon={<UserOutlined />}
                size="large"
                allowClear
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
                message: 'Please enter first name',
                whitespace: true,
                min: 2
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
                message: 'Please enter last name',
                whitespace: true,
                min: 2
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
              label={
                <Space>
                  <Text strong>Contact Number</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>(Format: {phoneFormat})</Text>
                </Space>
              }
              rules={[
                { required: true, message: 'Contact number is required' },
                { validator: validateContactNumber }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="017-XXXX-XXXX" 
                size="large"
                maxLength={13}
                onChange={formatPhoneNumber}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" orientationMargin={0} style={{ margin: '24px 0 16px' }}>
          <Text strong style={{ fontSize: 14, color: '#595959' }}>Business Information</Text>
        </Divider>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="company_name"
              label={<Text strong>Company Name</Text>}
              rules={[{ 
                required: true, 
                message: 'Please enter company name',
                whitespace: true,
                min: 3
              }]}
            >
              <Input 
                prefix={<ShopOutlined />} 
                placeholder="Company Name" 
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="account_no"
              label={<Text strong>Account Number</Text>}
              rules={[{ 
                required: false, 
                message: 'Please enter account number',
                whitespace: true,
                min: 5
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
                message: 'Please enter account holder name',
                whitespace: true,
                min: 3
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
              rules={[{ required: true, message: 'Please select a branch' }]}
            >
              <Select 
                placeholder="Select Branch" 
                size="large"
                showSearch
                optionFilterProp="children"
                allowClear
              >
                {branches.map(branch => (
                  <Option key={branch.id} value={branch.branchname}>
                    {branch.branchname}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="business_type"
              label={<Text strong>Business Type</Text>}
              rules={[{ required: true, message: 'Please select business type' }]}
            >
              <Select 
                placeholder="Select Business Type" 
                size="large"
              >
                <Option value="Manufacturer">Manufacturer</Option>
                <Option value="Distributor">Distributor</Option>
                <Option value="Wholesaler">Wholesaler</Option>
                <Option value="Importer">Importer</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="tax_id"
              label={<Text strong>Tax ID/VAT Number</Text>}
              rules={[{ 
                required: true, 
                message: 'Please enter tax ID',
                whitespace: true
              }]}
            >
              <Input 
                placeholder="Tax Identification Number" 
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="address"
              label={<Text strong>Business Address</Text>}
              rules={[{ 
                required: true, 
                message: 'Please enter address',
                whitespace: true,
                min: 10
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

        <Divider style={{ margin: '16px 0 24px' }} />

        <Row justify="end" gutter={16}>
          <Col>
            <Button
              type="default"
              onClick={handleCancel}
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
              style={{ 
                width: 150,
                background: '#fa8c16',
                borderColor: '#fa8c16',
                boxShadow: '0 2px 6px rgba(250, 140, 22, 0.3)'
              }}
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

export default SupplierEntryForm;