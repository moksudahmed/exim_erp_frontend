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
  CloseOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { addClient } from '../../api/client';

const { Title, Text } = Typography;
const { Option } = Select;

const SupplierEntryModal = ({ visible, onClose, onSuccess }) => {
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
    form.validateFields()
      .then(() => setCurrentStep(currentStep + 1))
      .catch((err) => console.log('Validation error:', err));
  };

  const handlePrev = () => setCurrentStep(currentStep - 1);

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
          client_type: 'SUPPLIER',
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
      message.success('Supplier created successfully!');
      resetForm();
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to add supplier:', err);
      message.error('Failed to add supplier. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: 'Personal Info',
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
              label="Contact Number"
              rules={[{ required: true, message: 'Please enter contact number' }]}
            >
              <Input placeholder="Enter contact number" />
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
                <Radio value="Other">Other</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      )
    },
    {
      title: 'Account Info',
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
              initialValue={dayjs()}
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
        initialValues={{ registration_date: dayjs() }}
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
