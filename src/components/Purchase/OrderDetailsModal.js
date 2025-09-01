import React from 'react';
import { Modal, Card, Descriptions, Tag, Table, Typography, Divider, Button, Space, Badge } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  DollarOutlined, 
  ShoppingOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const OrderDetailsModal = ({ selectedOrder, modalVisible, handleModalClose, suppliers, formatCurrency }) => {
  // Status configuration
  const statusConfig = {
    'COMPLETED': { color: 'green', icon: <CheckCircleOutlined />, text: 'Completed' },
    'CANCEL': { color: 'red', icon: <CloseCircleOutlined />, text: 'Cancelled' },
    'PENDING': { color: 'blue', icon: <SyncOutlined spin />, text: 'Pending' },
    'PROCESSING': { color: 'orange', icon: <SyncOutlined spin />, text: 'Processing' }
  };

  const status = selectedOrder?.status || 'PENDING';
  const statusInfo = statusConfig[status] || statusConfig['PENDING'];

  return (
    <Modal
      title={
        <Space>
          <FileTextOutlined />
          <span>Order Details - #{selectedOrder?.id || 'N/A'}</span>
          <Badge 
            status={statusInfo.color} 
            text={statusInfo.text} 
          />
        </Space>
      }
      open={modalVisible}
      onCancel={handleModalClose}
      footer={[
        <Button key="close" type="primary" onClick={handleModalClose}>
          Close
        </Button>
      ]}
      width={800}
      bodyStyle={{ padding: '16px 0' }}
    >
      {selectedOrder && (
        <div style={{ padding: '0 8px' }}>
          {/* Order Summary Card */}
          <Card 
            size="small" 
            style={{ marginBottom: 20, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
            bodyStyle={{ padding: '16px' }}
          >
            <Descriptions 
              bordered 
              size="small" 
              column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
              labelStyle={{ 
                fontWeight: 600, 
                background: '#fafafa',
                width: '30%'
              }}
            >
              <Descriptions.Item 
                label={
                  <Space>
                    <UserOutlined />
                    <span>Supplier</span>
                  </Space>
                }
              >
                {suppliers.find(s => s.client_id === selectedOrder.client_id)?.account_name || '—'}
              </Descriptions.Item>
              
              <Descriptions.Item 
                label={
                  <Space>
                    <CalendarOutlined />
                    <span>Order Date</span>
                  </Space>
                }
              >
                {new Date(selectedOrder.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Descriptions.Item>
              
              <Descriptions.Item 
                label={
                  <Space>
                    <DollarOutlined />
                    <span>Total Amount</span>
                  </Space>
                }
              >
                <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                  {formatCurrency(selectedOrder.total_amount)}
                </Text>
              </Descriptions.Item>
              
              <Descriptions.Item 
                label={
                  <Space>
                    <ShoppingOutlined />
                    <span>Status</span>
                  </Space>
                }
              >
                <Tag 
                  color={statusInfo.color}
                  icon={statusInfo.icon}
                  style={{ 
                    padding: '4px 8px', 
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    width: 'fit-content'
                  }}
                >
                  {statusInfo.text}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Divider orientation="left">
            <Space>
              <ShoppingOutlined />
              <span>Order Items</span>
            </Space>
          </Divider>

          {/* Items Table */}
          <Table
            size="middle"
            dataSource={selectedOrder.items || []}
            pagination={false}
            rowKey="product_id"
            scroll={{ x: 600 }}
            style={{ borderRadius: 8, overflow: 'hidden' }}
            columns={[
              {
                title: 'Product',
                dataIndex: 'product_name',
                key: 'product_name',
                render: (text, record) => (
                  <div>
                    <div style={{ fontWeight: 500 }}>{text}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      ID: {record.product_id}
                    </Text>
                  </div>
                )
              },
              {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
                align: 'right',
                render: (value) => (
                  <Tag color="blue" style={{ minWidth: 60, textAlign: 'center' }}>
                    {value}
                  </Tag>
                )
              },
              {
                title: 'Unit Cost',
                dataIndex: 'cost_per_unit',
                key: 'cost_per_unit',
                align: 'right',
                render: (cost) => (
                  <Text strong>{formatCurrency(cost)}</Text>
                )
              },
              {
                title: 'Total',
                key: 'total',
                align: 'right',
                render: (_, record) => {
                  const quantity = record.quantity || 0;
                  const cost = record.cost_per_unit || 0;
                  return (
                    <Text strong style={{ color: '#52c41a' }}>
                      {formatCurrency(quantity * cost)}
                    </Text>
                  );
                }
              }
            ]}
            summary={() => (
              <Table.Summary.Row style={{ background: '#fafafa' }}>
                <Table.Summary.Cell index={0} colSpan={2} align="right">
                  <Text strong>Grand Total:</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right" colSpan={2}>
                  <Text strong type="success" style={{ fontSize: '16px' }}>
                    {formatCurrency(selectedOrder.total_amount)}
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </div>
      )}
    </Modal>
  );
};

export default OrderDetailsModal;