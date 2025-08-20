import React, { useState, useMemo } from 'react';
import { Table, Button, Modal, message, Tag, Space, Typography } from 'antd';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, CheckSquareOutlined } from '@ant-design/icons';

const { Text } = Typography;

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0.00';
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `$${numericAmount.toFixed(2)}`;
};

const PurchaseOrderList = ({ 
  purchaseOrders, 
  onReceive, 
  onView, 
  onCancel, 
  selectedOrder, 
  onComplete,
  branches
}) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleViewOrder = async (orderId) => {
    try {
      setLoading(true);
      await onView(orderId);
      setModalVisible(true);
    } catch (error) {
      message.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      PENDING: { color: 'blue', text: 'Pending' },
      COMPLETED: { color: 'green', text: 'Completed' },
      CANCEL: { color: 'red', text: 'Cancelled' },
    };
    
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = useMemo(() => [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Text strong>#{id}</Text>,
    },
    {
      title: 'Vendor ID',
      dataIndex: 'client_id',
      key: 'client_id',
    },
    {
      title: 'Branch',
      dataIndex: 'branch_id',
      key: 'branch_id',
      render: (branch_id) => {
        // Since your branches don't have branch_id, we'll use the index as ID
        // This assumes that branch_id in purchaseOrders corresponds to the index in branches array
        const branch = branches[branch_id];
        return <Text strong>{branch ? branch.branchname : 'N/A'}</Text>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount) => <Text strong>{formatCurrency(amount)}</Text>,
      align: 'right',
    },
    {
      title: 'Measurement',
      dataIndex: 'measurement',
      key: 'measurement',
      render: (measurement) => <Text strong>{measurement || 'N/A'}</Text>,
      align: 'right',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewOrder(record.id)}
            size="small"
            loading={loading && selectedOrder?.id === record.id}
          >
            View
          </Button>
          <Button
            icon={<CheckCircleOutlined />}
            onClick={() => onReceive(record.id)}
            disabled={record.status !== 'PENDING'}
            size="small"
            type="primary"
            ghost
          >
            Receive
          </Button>
          <Button
            icon={<CloseCircleOutlined />}
            onClick={() => onCancel(record.id)}
            disabled={record.status === 'COMPLETED'}
            size="small"
            danger
            ghost
          >
            Cancel
          </Button>
          <Button
            icon={<CheckSquareOutlined />}
            onClick={() => onComplete(record.id)}
            disabled={record.status === 'CANCEL'}
            size="small"
            type="primary"
          >
            Complete
          </Button>
        </Space>
      ),
    },
  ], [loading, selectedOrder, branches]);

  return (
    <>
      <Table
        dataSource={purchaseOrders}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1000 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} orders`,
        }}
      />
      
      <Modal
        title={`Order Details - #${selectedOrder?.id || ''}`}
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedOrder && (
          <div style={{ padding: '16px 0' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong>Vendor ID:</Text> {selectedOrder.client_id}
              </div>
              <div>
                <Text strong>Order Date:</Text> {new Date(selectedOrder.date).toLocaleDateString()}
              </div>
              <div>
                <Text strong>Total Amount:</Text> {formatCurrency(selectedOrder.total_amount)}
              </div>
              <div>
                <Text strong>Status:</Text> 
                <Tag 
                  color={
                    selectedOrder.status === 'COMPLETED' ? 'green' : 
                    selectedOrder.status === 'CANCEL' ? 'red' : 
                    'blue'
                  }
                  style={{ marginLeft: 8 }}
                >
                  {selectedOrder.status}
                </Tag>
              </div>
              <div>
                <Text strong>Items:</Text>
                <Table
                  size="small"
                  dataSource={selectedOrder.items || []}
                  pagination={false}
                  columns={[
                    {
                      title: 'Product ID',
                      dataIndex: 'product_id',
                      key: 'product_id',
                    },
                    {
                      title: 'Quantity',
                      dataIndex: 'quantity',
                      key: 'quantity',
                      align: 'right',
                    },
                    {
                      title: 'Unit Cost',
                      dataIndex: 'cost_per_unit',
                      key: 'cost_per_unit',
                      render: (cost) => formatCurrency(cost),
                      align: 'right',
                    },
                    {
                      title: 'Total',
                      key: 'total',
                      render: (_, record) => {
                        const quantity = record.quantity || 0;
                        const cost = record.cost_per_unit || 0;
                        return formatCurrency(quantity * cost);
                      },
                      align: 'right',
                    }
                  ]}
                  rowKey="product_id"
                />
              </div>
            </Space>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PurchaseOrderList;