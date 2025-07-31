import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Card, 
  Typography, 
  DatePicker,
  Radio,
  message,
  Steps,
  Row,
  Col
} from 'antd';
import { 
  UserOutlined, 
  IdcardOutlined, 
  BankOutlined,
  SolutionOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { addClient } from '../../api/client';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;

const ClientEntryForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [clientType, setClientType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  const clientTypes = [
    { value: 'CUSTOMER', label: 'Customer' },
    { value: 'SUPPLIER', label: 'Supplier' },
    { value: 'EMPLOYEE', label: 'Agent' },
  ];

  const handleNext = () => {
    form.validateFields()
      .then(() => setCurrentStep(currentStep + 1))
      .catch(err => console.log('Validation Failed:', err));
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      
      const payload = {
        person: {
          title: values.title,
          first_name: values.first_name,
          last_name: values.last_name,
          contact_no: values.contact_no,
          gender: values.gender
        },
        client: {
          client_type: clientType,
          registration_date: dayjs(values.registration_date).format('YYYY-MM-DD'),
          businesses_id: 1
        },
        account: {
          account_id: values.account_id,
          account_name: values.account_name,
          account_no: values.account_no,
          address: values.address,
          branch: values.branch,
          account_holder: values.account_holder,
          type: values.account_type
        }
      };

      await addClient(payload);
      message.success('Client created successfully!');
      form.resetFields();
      setCurrentStep(0);
      setClientType('');
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to create client. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card bordered={false} className="form-step-card">
            <div className="step-header">
              <SolutionOutlined className="step-icon" />
              <Title level={4} className="step-title">Select Client Type</Title>
              <Text type="secondary">Choose the category for this client</Text>
            </div>
            
            <div className="client-type-cards">
              {clientTypes.map(type => (
                <Card
                  key={type.value}
                  hoverable
                  className={`type-card ${clientType === type.value ? 'selected' : ''}`}
                  onClick={() => setClientType(type.value)}
                >
                  <div className="type-content">
                    <div className="type-icon">
                      {type.value === 'CUSTOMER' && <UserOutlined />}
                      {type.value === 'SUPPLIER' && <BankOutlined />}
                      {type.value === 'EMPLOYEE' && <IdcardOutlined />}
                    </div>
                    <Text strong>{type.label}</Text>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        );
      
      case 1:
        return (
          <Card bordered={false} className="form-step-card">
            <div className="step-header">
              <UserOutlined className="step-icon" />
              <Title level={4} className="step-title">Personal Information</Title>
              <Text type="secondary">Enter the client's personal details</Text>
            </div>
            
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="title"
                  label="Title"
                  rules={[{ required: true, message: 'Please select title' }]}
                >
                  <Select placeholder="Select title">
                    <Option value="Mr.">Mr.</Option>
                    <Option value="Mrs.">Mrs.</Option>
                    <Option value="Ms.">Ms.</Option>
                    <Option value="Dr.">Dr.</Option>
                  </Select>
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="first_name"
                  label="First Name"
                  rules={[{ required: true, message: 'Please enter first name' }]}
                >
                  <Input placeholder="Enter first name" />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="last_name"
                  label="Last Name"
                  rules={[{ required: true, message: 'Please enter last name' }]}
                >
                  <Input placeholder="Enter last name" />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="contact_no"
                  label="Contact Number"
                  rules={[{ required: true, message: 'Please enter contact number' }]}
                >
                  <Input placeholder="Enter phone number" />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[{ required: true, message: 'Please select gender' }]}
                >
                  <Radio.Group>
                    <Radio value="Male">Male</Radio>
                    <Radio value="Female">Female</Radio>
                    <Radio value="Other">Other</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        );
      
      case 2:
        return (
          <Card bordered={false} className="form-step-card">
            <div className="step-header">
              <BankOutlined className="step-icon" />
              <Title level={4} className="step-title">Account Information</Title>
              <Text type="secondary">Enter the client's financial details</Text>
            </div>
            
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="account_name"
                  label="Account Name"
                  rules={[{ required: true, message: 'Please enter account name' }]}
                >
                  <Input placeholder="Enter account name" />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="account_no"
                  label="Account Number"
                  rules={[{ required: true, message: 'Please enter account number' }]}
                >
                  <Input placeholder="Enter account number" />
                </Form.Item>
              </Col>
              
              <Col span={24}>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true, message: 'Please enter address' }]}
                >
                  <Input.TextArea placeholder="Enter full address" rows={3} />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="branch"
                  label="Branch"
                  rules={[{ required: true, message: 'Please enter branch' }]}
                >
                  <Input placeholder="Enter branch name" />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="account_holder"
                  label="Account Holder"
                  rules={[{ required: true, message: 'Please enter account holder' }]}
                >
                  <Input placeholder="Enter account holder name" />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="account_type"
                  label="Account Type"
                  rules={[{ required: true, message: 'Please select account type' }]}
                >
                  <Select placeholder="Select account type">
                    <Option value="Savings">Savings Account</Option>
                    <Option value="Checking">Checking Account</Option>
                    <Option value="Business">Business Account</Option>
                  </Select>
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="account_id"
                  label="Account ID"
                  rules={[{ required: true, message: 'Please enter account ID' }]}
                >
                  <Input placeholder="Enter account ID" />
                </Form.Item>
              </Col>
              
              <Col span={24}>
                <Form.Item
                  name="registration_date"
                  label="Registration Date"
                  rules={[{ required: true, message: 'Please select registration date' }]}
                  initialValue={dayjs()}
                >
                  <DatePicker className="w-full" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="client-form-container">
      <Card className="form-card">
        <Title level={3} className="form-title">New Client Registration</Title>
        <Text type="secondary" className="form-subtitle">
          Complete all steps to register a new client
        </Text>
        
        <Steps current={currentStep} className="form-steps">
          <Step title="Type" />
          <Step title="Personal" />
          <Step title="Account" />
        </Steps>
        
        <Form
          form={form}
          layout="vertical"
          className="client-form"
          initialValues={{ registration_date: dayjs() }}
        >
          {renderStepContent()}
          
          <div className="form-actions">
            {currentStep > 0 && (
              <Button
                onClick={handlePrev}
                icon={<ArrowLeftOutlined />}
                disabled={isSubmitting}
              >
                Previous
              </Button>
            )}
            
            {currentStep < 2 ? (
              <Button
                type="primary"
                onClick={handleNext}
                icon={<ArrowRightOutlined />}
                disabled={!clientType && currentStep === 0}
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Submit Registration
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ClientEntryForm;