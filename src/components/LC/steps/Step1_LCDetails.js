import React from 'react';
import { 
  Form, 
  Input, 
  DatePicker, 
  InputNumber, 
  Button, 
  Select, 
  Card,
  Row,
  Col,
  Typography
} from 'antd';
import { 
  ArrowRightOutlined,
  IdcardOutlined,
  UserOutlined,
  GlobalOutlined,
  DollarOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const Step1_LCDetails = ({ data, onNext }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      issue_date: values.issue_date ? dayjs(values.issue_date).format('YYYY-MM-DD') : null,
      expiry_date: values.expiry_date ? dayjs(values.expiry_date).format('YYYY-MM-DD') : null,
    };

    onNext({ lc: formattedValues });
  };

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        backgroundColor: '#fff'
      }}
      bodyStyle={{ padding: '32px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={4} style={{ color: '#1890ff', fontWeight: 600, marginBottom: '8px' }}>
          Letter of Credit Details
        </Title>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          Please provide the basic information for the Letter of Credit
        </Text>
      </div>

      <Form
        layout="vertical"
        form={form}
        initialValues={{
          ...data?.lc,
          issue_date: data?.lc?.issue_date ? dayjs(data.lc.issue_date) : null,
          expiry_date: data?.lc?.expiry_date ? dayjs(data.lc.expiry_date) : null,
        }}
        onFinish={onFinish}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item 
              name="lc_number" 
              label={<Text strong>LC Reference Number</Text>}
              rules={[{ required: true, message: 'LC number is required' }]}
            >
              <Input 
                prefix={<IdcardOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} 
                placeholder="Enter LC reference number" 
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item 
              name="applicant" 
              label={<Text strong>Applicant Name</Text>}
              rules={[{ required: true, message: 'Applicant name is required' }]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} 
                placeholder="Enter applicant name" 
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item 
              name="beneficiary" 
              label={<Text strong>Beneficiary Name</Text>}
            >
              <Input 
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} 
                placeholder="Enter beneficiary name" 
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item 
              name="currency" 
              label={<Text strong>Currency</Text>}
              rules={[{ required: true, message: 'Currency is required' }]}
            >
              <Select 
                placeholder="Select currency"
                size="large"
                suffixIcon={<GlobalOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              >
                <Option value="USD">USD - US Dollar</Option>
                <Option value="EUR">EUR - Euro</Option>
                <Option value="GBP">GBP - British Pound</Option>
                <Option value="JPY">JPY - Japanese Yen</Option>
                <Option value="BDT">BDT - Bangladeshi Taka</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item 
              name="amount" 
              label={<Text strong>Amount</Text>}
              rules={[{ 
                required: true, 
                message: 'Amount is required',
                type: 'number',
                min: 1,
                message: 'Amount must be greater than 0'
              }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0}
                step={0.01}
                placeholder="Enter amount"
                size="large"
                prefix={<DollarOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item 
              name="issue_date" 
              label={<Text strong>Issue Date</Text>}
              rules={[{ required: true, message: 'Issue date is required' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                size="large"
                suffixIcon={<CalendarOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item 
              name="expiry_date" 
              label={<Text strong>Expiry Date (Optional)</Text>}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                size="large"
                suffixIcon={<CalendarOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: '40px', textAlign: 'right' }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large"
            icon={<ArrowRightOutlined />}
            style={{
              padding: '0 32px',
              height: '42px',
              fontWeight: 500,
              borderRadius: '4px',
              boxShadow: '0 2px 6px rgba(24, 144, 255, 0.3)'
            }}
          >
            Continue to Margin Payments
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Step1_LCDetails;