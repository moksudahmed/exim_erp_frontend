import React from 'react';
import {
  Form,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Input,
  Button,
  Table,
  Card,
  Typography,
  Space,
  Divider,
  Select,
} from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  BankOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const Step2_MarginPayments = ({ data, onNext, onPrev, banks }) => {
  const [form] = Form.useForm();

  const columns = [
    {
      title: <Text strong>Payment Date</Text>,
      dataIndex: 'payment_date',
      key: 'payment_date',
      render: (date) => date ? dayjs(date).format('DD MMM YYYY') : 'N/A',
      align: 'center',
    },
    {
      title: <Text strong>Amount</Text>,
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <Text>${parseFloat(amount).toFixed(2)}</Text>,
      align: 'right',
    },
    {
      title: <Text strong>Bank</Text>,
      dataIndex: 'bank_name',
      key: 'bank_name',
      render: (text) => text || '—',
    },
    {
      title: <Text strong>Reference</Text>,
      dataIndex: 'reference',
      key: 'reference',
      render: (text) => text || '—',
    },
  ];

  const onFinish = (values) => {
    const payments = values.margin_payments.map((p) => ({
      ...p,
      payment_date: p.payment_date ? p.payment_date.format('YYYY-MM-DD') : null,
    }));
    onNext({ margin_payments: payments });
  };

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        backgroundColor: '#fff',
      }}
      bodyStyle={{ padding: '32px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={4} style={{ color: '#1890ff', fontWeight: 600 }}>
          Margin Payments
        </Title>
        <Text type="secondary">Record all margin payments associated with this LC</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          margin_payments: data.margin_payments?.map((p) => ({
            ...p,
            payment_date: p.payment_date ? dayjs(p.payment_date) : null,
          })) || [{}],
        }}
      >
        <Form.List name="margin_payments">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  style={{ marginBottom: '16px' }}
                  bodyStyle={{ padding: '16px' }}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12} md={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'payment_date']}
                        label={<Text strong>Payment Date</Text>}
                        rules={[{ required: true, message: 'Required' }]}
                      >
                        <DatePicker
                          style={{ width: '100%' }}
                          suffixIcon={<CalendarOutlined />}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'amount']}
                        label={<Text strong>Amount</Text>}
                        rules={[{ required: true, message: 'Required' }]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          min={0}
                          step={0.01}
                          prefix={<DollarOutlined />}
                          placeholder="0.00"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'bank_name']}
                        label={<Text strong>Bank Name</Text>}
                      >
                        <Select
                          placeholder="Select Bank"
                          allowClear
                          suffixIcon={<BankOutlined />}
                        >
                          {banks?.map((bank) => (
                            <Select.Option
                              key={bank.subsidiary_account_id}
                              value={bank.account_name}
                            >
                              {bank.account_name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={5}>
                      <Form.Item
                        {...restField}
                        name={[name, 'reference']}
                        label={<Text strong>Reference</Text>}
                      >
                        <Input
                          placeholder="Enter reference"
                          prefix={<FileTextOutlined />}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={2} md={1} style={{ textAlign: 'center' }}>
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                        style={{ marginTop: '30px' }}
                      />
                    </Col>
                  </Row>
                </Card>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Another Payment
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {data.margin_payments && data.margin_payments.length > 0 && (
          <>
            <Divider orientation="left">
              <Text strong>Payment Summary</Text>
            </Divider>
            <Table
              columns={columns}
              dataSource={data.margin_payments.map((item, index) => ({
                ...item,
                key: index,
              }))}
              pagination={false}
              size="middle"
              bordered
            />
          </>
        )}

        <Row justify="space-between" style={{ marginTop: '24px' }}>
          <Col>
            <Button
              size="large"
              onClick={onPrev}
              icon={<ArrowLeftOutlined />}
            >
              Back to LC Details
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<ArrowRightOutlined />}
            >
              Review & Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default Step2_MarginPayments;
