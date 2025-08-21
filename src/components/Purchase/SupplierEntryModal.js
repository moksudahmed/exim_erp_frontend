import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Typography,
  message
} from 'antd';
import {
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
  const [formData, setFormData] = useState({});

  const resetForm = () => {
    form.resetFields();
    setCurrentStep(0);
    setIsSubmitting(false);
    setFormData({});
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleNext = () => {
    const fieldNames = steps[currentStep].fieldNames || [];
    form.validateFields(fieldNames)
      .then((values) => {
        setFormData(prev => ({ ...prev, ...values }));
        setCurrentStep(currentStep + 1);
      })
      .catch((err) => {
        console.log('Validation error:', err);
        message.error('Please fill all required fields correctly');
      });
  };

  const handlePrev = () => {
    form.validateFields(steps[currentStep].fieldNames)
      .then((values) => {
        setFormData(prev => ({ ...prev, ...values }));
        setCurrentStep(currentStep - 1);
      })
      .catch((err) => {
        console.log('Validation error:', err);
      });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const finalValues = await form.validateFields();
      const allValues = { ...formData, ...finalValues };
      
      const contactNo = allValues.contact_no || '';
      const cleanedContactNo = contactNo.replace(/\D/g, '');
      
      if (cleanedContactNo.length !== 12) {
        message.error('Contact number must be exactly 12 digits');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        person: {
          title: allValues.title || '',
          first_name: allValues.first_name || '',
          last_name: allValues.last_name || '',
          contact_no: cleanedContactNo
        },
        client: {
          client_type: 'SUPPLIER',
          registration_date: allValues.registration_date ? 
            allValues.registration_date.format('YYYY-MM-DD') : 
            new Date().toISOString().split('T')[0],
          businesses_id: 1,
        },
        account: {
          account_name: allValues.account_name || '',
          account_no: allValues.account_no || '',
          address: allValues.address || '',
          branch: allValues.branch || '',
          account_holder: allValues.account_holder || '',
          type: 'Supplier',
        },
      };
      
      await addClient(payload, token);
      message.success('Supplier created successfully!');
      resetForm();
      
      // Call onSuccess without passing any arguments to avoid the error
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (err) {
      console.error('Failed to add supplier:', err);
      message.error('Failed to add supplier. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateContactNumber = (_, value) => {
    try {
      if (!value) {
        return Promise.reject('Contact number is required');
      }
      
      const digitsOnly = value.replace(/\D/g, '');
      
      if (digitsOnly.length !== 12) {
        return Promise.reject('Contact number must be exactly 12 digits');
      }
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject('Invalid contact number format');
    }
  };

  const formatContactNumber = (value) => {
    if (!value) return '';
    
    const digitsOnly = value.replace(/\D/g, '');
    
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
    const formattedValue = formatContactNumber(inputValue);
    form.setFieldsValue({ contact_no: formattedValue });
  };

  const steps = [
    {
      title: 'Personal Info',
      fieldNames: ['title', 'first_name', 'last_name', 'contact_no'],
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
                <Option value="M/S.">M/S.</Option>
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
        </Row>
      )
    },
    {
      title: 'Account Info',
      fieldNames: ['account_name', 'account_no', 'address', 'branch', 'account_holder', 'registration_date'],
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
          ...formData,
          registration_date: formData.registration_date || dayjs()
        }}
        preserve={false}
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