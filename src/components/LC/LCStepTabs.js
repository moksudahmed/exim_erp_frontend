import React from 'react';
import { Tabs, Card, Table, Tag, Space, Typography } from 'antd';
import { 
  DollarOutlined, 
  ContainerOutlined, 
  CalendarOutlined, 
  BankOutlined, 
  ShopOutlined,
  GlobalOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const LCStepTabs = ({ marginPayment = [], goodsShipment = [] }) => {
  // Margin Payment columns with enhanced styling
  const paymentColumns = [
    {
      title: (
        <Space>
          <CalendarOutlined />
          <Text strong>Payment Date</Text>
        </Space>
      ),
      dataIndex: 'payment_date',
      key: 'payment_date',
      render: (date) => <Text>{new Date(date).toLocaleDateString('en-GB')}</Text>,
      align: 'center',
      width: 150
    },
    {
      title: (
        <Space>
          <DollarOutlined />
          <Text strong>Amount</Text>
        </Space>
      ),
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
          {parseFloat(amount).toLocaleString('en-US', { 
            style: 'currency', 
            currency: 'BDT',
            minimumFractionDigits: 2 
          })}
        </Tag>
      ),
      align: 'right',
      width: 150
    },
    {
      title: (
        <Space>
          <BankOutlined />
          <Text strong>Account</Text>
        </Space>
      ),
      dataIndex: 'account_id',
      key: 'account_id',
      render: (id) => <Text code>{id}</Text>,
      align: 'center',
      width: 120
    },
    {
      title: <Text strong>Reference</Text>,
      dataIndex: 'reference',
      key: 'reference',
      render: (ref) => ref || <Text type="secondary">—</Text>,
      ellipsis: true
    },
  ];

  // Goods Shipment columns with enhanced styling
  const shipmentColumns = [
    {
      title: <Text strong>ID</Text>,
      dataIndex: 'shipment_id',
      key: 'shipment_id',
      render: (id) => <Text code>{id}</Text>,
      width: 100
    },
    {
      title: (
        <Space>
          <CalendarOutlined />
          <Text strong>Shipment Date</Text>
        </Space>
      ),
      dataIndex: 'shipment_date',
      key: 'shipment_date',
      render: (date) => <Text>{new Date(date).toLocaleDateString('en-GB')}</Text>,
      align: 'center',
      width: 150
    },
    {
      title: <Text strong>Bill Number</Text>,
      dataIndex: 'bl_number',
      key: 'bl_number',
      render: (num) => <Text strong>{num}</Text>
    },
    {
      title: (
        <Space>
          <ShopOutlined />
          <Text strong>Shipping Company</Text>
        </Space>
      ),
      dataIndex: 'shipping_company',
      key: 'shipping_company',
      render: (company) => company || <Text type="secondary">—</Text>
    },
    {
      title: (
        <Space>
          <GlobalOutlined />
          <Text strong>Port of Loading</Text>
        </Space>
      ),
      dataIndex: 'port_of_loading',
      key: 'port_of_loading',
      render: (port) => <Tag color="geekblue">{port}</Tag>,
      width: 180
    },
    {
      title: (
        <Space>
          <GlobalOutlined />
          <Text strong>Port of Discharge</Text>
        </Space>
      ),
      dataIndex: 'port_of_discharge',
      key: 'port_of_discharge',
      render: (port) => <Tag color="purple">{port}</Tag>,
      width: 180
    },
  ];

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        marginTop: '24px'
      }}
      title={
        <Title level={5} style={{ margin: 0 }}>
          Letter of Credit Lifecycle Actions
        </Title>
      }
      extra={<Text type="secondary">Detailed transaction history</Text>}
    >
      <Tabs 
        defaultActiveKey="1" 
        type="card"
        size="middle"
        tabBarStyle={{ marginBottom: 0 }}
      >
        <TabPane 
          tab={
            <span>
              <DollarOutlined style={{ marginRight: 8 }} />
              Margin Payments
            </span>
          }
          key="1"
        >
          <Table
            dataSource={marginPayment}
            columns={paymentColumns}
            rowKey="id"
            pagination={false}
            bordered={false}
            size="middle"
            style={{ marginTop: 16 }}
            locale={{
              emptyText: (
                <Text type="secondary" style={{ padding: '24px 0' }}>
                  No margin payments recorded
                </Text>
              )
            }}
          />
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <ContainerOutlined style={{ marginRight: 8 }} />
              Goods Shipment
            </span>
          }
          key="2"
        >
          <Table
            dataSource={goodsShipment}
            columns={shipmentColumns}
            rowKey="id"
            pagination={false}
            bordered={false}
            size="middle"
            style={{ marginTop: 16 }}
            locale={{
              emptyText: (
                <Text type="secondary" style={{ padding: '24px 0' }}>
                  No shipment records available
                </Text>
              )
            }}
          />
        </TabPane>
        
        {/* Additional tabs can be added here */}
        {/* <TabPane tab="LC Issuance" key="3">...</TabPane> */}
      </Tabs>
    </Card>
  );
};

export default LCStepTabs;