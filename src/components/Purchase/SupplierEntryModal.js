import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Button,
  Row,
  Col,
  Typography,
  message
} from 'antd';
import {
  BankOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  PhoneOutlined,
  CloseOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { addClient } from '../../api/client';

const { Title, Text } = Typography;
const { Option } = Select;

const SupplierEntryModal = ({ visible, onClose, onSuccess, token }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    form.resetFields();
    setCurrentStep(0);
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleNext = () => {
    // Validate only the current step's fields
    const fieldNames = steps[currentStep].fieldNames || [];
    form.validateFields(fieldNames)
      .then(() => setCurrentStep(currentStep + 1))
      .catch((err) => {
        console.log('Validation error:', err);
        message.error('Please fill all required fields correctly');
      });
  };

  const handlePrev = () => setCurrentStep(currentStep - 1);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate all fields first
      const values = await form.validateFields();
      console.log('Form values:', values);
      
      // Safely handle contact number with null check
      const contactNo = values.contact_no || '';
      const cleanedContactNo = contactNo.replace(/\D/g, '');
      
      // Validate contact number length
      /*if (cleanedContactNo.length !== 12) {
        message.error('Contact number must be exactly 12 digits');
        setIsSubmitting(false);
        return;
      }*/

      const payload = {
        person: {
          title: values.title || '',
          first_name: values.first_name || '',
          last_name: values.last_name || '',
          contact_no: cleanedContactNo,
          gender: values.gender || ''
        },
        client: {
          client_type: 'SUPPLIER',
          registration_date: values.registration_date ? values.registration_date.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0],
          businesses_id: 1,
        },
        account: {
          account_name: values.account_name || '',
          account_no: values.account_no || '',
          address: values.address || '',
          branch: values.branch || '',
          account_holder: values.account_holder || '',
          type: values.account_type || 'Supplier',
        },
      };
      
      console.log('Submitting payload:', payload);
      await addClient(payload, token);
      message.success('Supplier created successfully!');
      resetForm();
      onSuccess?.(payload);
      onClose();
    } catch (err) {
      console.error('Failed to add supplier:', err);
      if (err.errorFields) {
        message.error('Please fill all required fields correctly');
      } else {
        message.error('Failed to add supplier. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateContactNumber = (_, value) => {
    try {
      if (!value) {
        return Promise.reject('Contact number is required');
      }
      
      // Remove all non-digit characters for validation
      const digitsOnly = value.replace(/\D/g, '');
      
      // Check if the cleaned value has exactly 12 digits
      if (digitsOnly.length !== 12) {
        return Promise.reject('Contact number must be exactly 12 digits');
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Validation Error:', error);
      return Promise.reject('Invalid contact number format');
    }
  };

  const formatContactNumber = (value) => {
    if (!value) return '';
    
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Format as XXX-XXXX-XXXX if we have enough digits
    if (digitsOnly.length <= 3) {
      return digitsOnly;
    } else if (digitsOnly.length <= 7) {
      return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    } else {
      return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 7)}-${digitsOnly.slice(7, 12)}`;
    }
  };

  const handleContactNumberChange = (e) => {
    const inputValue = e.target.value;
    
    // Format the displayed value
    const formattedValue = formatContactNumber(inputValue);
    
    // Update the form value
    form.setFieldsValue({ contact_no: formattedValue });
  };

  const steps = [
    {
      title: 'Personal Info',
      fieldNames: ['title', 'first_name', 'last_name', 'contact_no', 'gender'],
      content: (
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

          <Col span={12}>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="contact_no"
              label={<Text strong>Contact Number (12 digits)</Text>}
              rules={[
                { required: true, message: 'Contact number is required' },
                { validator: validateContactNumber }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="017-XXXX-XXXXXX" 
                size="large"
                maxLength={14}
                onChange={handleContactNumberChange}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select gender' }]}
            >
              <Radio.Group>
                <Radio value="Male">Male</Radio>
                <Radio value="Female">Female</Radio>
                
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      )
    },
    {
      title: 'Account Info',
      fieldNames: ['account_name', 'account_no', 'address', 'branch', 'account_holder', 'account_type', 'account_id', 'registration_date'],
      content: (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="account_name"
              label="Account Name"
              rules={[{ required: true, message: 'Please enter account name' }]}
            >
              <Input placeholder="Enter account name" />
            </Form.Item>
          </Col>

          <Col span={12}>
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
              <Input.TextArea placeholder="Enter address" rows={2} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="branch"
              label="Branch"
              rules={[{ required: true, message: 'Please enter branch' }]}
            >
              <Input placeholder="Enter branch" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="account_holder"
              label="Account Holder"
              rules={[{ required: true, message: 'Please enter account holder' }]}
            >
              <Input placeholder="Enter account holder name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="account_type"
              label="Account Type"
              rules={[{ required: true, message: 'Please select account type' }]}
            >
              <Select placeholder="Select type">
                <Option value="Savings">Savings</Option>
                <Option value="Checking">Checking</Option>
                <Option value="Business">Business</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
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
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </Col>
        </Row>
      )
    }
  ];

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      centered
      destroyOnClose
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>Add New Supplier</Title>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={handleCancel}
          />
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ 
          registration_date: dayjs(),
          account_type: 'Business'
        }}
        validateTrigger="onBlur"
      >
        {steps[currentStep].content}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          {currentStep > 0 && (
            <Button onClick={handlePrev} icon={<ArrowLeftOutlined />} disabled={isSubmitting}>
              Previous
            </Button>
          )}
          <div style={{ marginLeft: 'auto' }}>
            <Button
              onClick={handleCancel}
              style={{ marginRight: 8 }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                loading={isSubmitting}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                Submit Supplier
              </Button>
            )}
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default SupplierEntryModal;