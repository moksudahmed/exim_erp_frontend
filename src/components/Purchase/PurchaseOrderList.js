import React, { useState, useMemo } from 'react';
import { Table, Button, message, Tag, Space, Typography } from 'antd';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import OrderDetailsModal from './OrderDetailsModal';

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
  branches,
  suppliers
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
      title: 'Supplier',
      dataIndex: 'client_id',
      key: 'client_id',
      render: (client_id) => {
        const supplier = suppliers.find(s => s.client_id === client_id);
        return (
          <div>
            <Text strong>{`${supplier?.title || ''} ${supplier?.first_name || ''} ${supplier?.last_name || ''}`.trim()}</Text>
            <br />
            <Text type="secondary">{supplier?.account_name || '—'}</Text>
          </div>
        );
      },
    },
    {
      title: 'Branch',
      dataIndex: 'branch_id',
      key: 'branch_id',
      render: (branch_id) => {
        const branch = branches.find(b => b.id === branch_id);
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
        </Space>
      ),
    },
  ], [loading, selectedOrder, branches, suppliers, onReceive, onCancel]);

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
      
      <OrderDetailsModal
        selectedOrder={selectedOrder}
        modalVisible={modalVisible}
        handleModalClose={handleModalClose}
        suppliers={suppliers}
        formatCurrency={formatCurrency}
      />
    </>
  );
};

export default PurchaseOrderList;