import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  InputNumber,
  Typography,
  Row,
  Col,
  Statistic,
  Divider,
  Tag,
  message,
  Modal,
  Form,
  Select,
  Alert
} from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  StockOutlined,
  WarningOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const StockManagement = ({ products, onUpdateStock, onDeductDamaged, onAddInventory }) => {
  const [stockLevels, setStockLevels] = useState(
    products.reduce((acc, product) => {
      acc[product.id] = { add: 0, damage: 0, notes: '' };
      return acc;
    }, {})
  );
  const [selectedAction, setSelectedAction] = useState('add');
  const [bulkValue, setBulkValue] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form] = Form.useForm();

  const handleStockChange = (value, productId, type) => {
    setStockLevels((prevLevels) => ({
      ...prevLevels,
      [productId]: {
        ...prevLevels[productId],
        [type]: value
      }
    }));
  };

  const handleBulkAction = () => {
    if (bulkValue <= 0) {
      message.warning('Please enter a value greater than 0');
      return;
    }

    const updatedLevels = { ...stockLevels };
    Object.keys(updatedLevels).forEach(productId => {
      updatedLevels[productId][selectedAction] = bulkValue;
    });

    setStockLevels(updatedLevels);
    message.success(`Bulk ${selectedAction === 'add' ? 'addition' : 'deduction'} applied`);
  };

  const handleUpdateStock = () => {
    let hasChanges = false;
    
    Object.keys(stockLevels).forEach((productId) => {
      const stockToAdd = stockLevels[productId].add;
      const damagedStock = stockLevels[productId].damage;
      
      if (stockToAdd > 0) {
        onAddInventory(productId, stockToAdd);
        hasChanges = true;
      }
      if (damagedStock > 0) {
        onDeductDamaged(productId, damagedStock);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      message.success('Stock updated successfully');
      // Reset form
      setStockLevels(
        products.reduce((acc, product) => {
          acc[product.id] = { add: 0, damage: 0, notes: '' };
          return acc;
        }, {})
      );
    } else {
      message.info('No changes to update');
    }
  };

  const handleQuickAction = (product, action, value) => {
    setSelectedProduct(product);
    setSelectedAction(action);
    form.setFieldsValue({ value });
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      handleStockChange(values.value, selectedProduct.id, selectedAction);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { status: 'error', text: 'Out of Stock' };
    if (stock < 10) return { status: 'warning', text: 'Low Stock' };
    return { status: 'success', text: 'In Stock' };
  };

  // Calculate statistics
  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, product) => sum + (product.stock * product.price_per_unit), 0);
  const lowStockItems = products.filter(product => product.stock < 10).length;
  const outOfStockItems = products.filter(product => product.stock === 0).length;

  const columns = [
    {
      title: 'Product',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary">ID: {record.id}</Text>
        </div>
      ),
    },
    {
      title: 'Current Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock, record) => {
        const status = getStockStatus(stock);
        return (
          <Space direction="vertical" size="small">
            <Tag color={status.status} style={{ margin: 0 }}>
              {stock} units
            </Tag>
            <Text type="secondary">{status.text}</Text>
          </Space>
        );
      },
    },
    {
      title: 'Stock to Add',
      key: 'add',
      render: (_, record) => (
        <InputNumber
          min={0}
          value={stockLevels[record.id]?.add || 0}
          onChange={(value) => handleStockChange(value, record.id, 'add')}
          style={{ width: '100%' }}
          placeholder="Units to add"
        />
      ),
    },
    {
      title: 'Damaged Stock',
      key: 'damage',
      render: (_, record) => (
        <InputNumber
          min={0}
          max={record.stock}
          value={stockLevels[record.id]?.damage || 0}
          onChange={(value) => handleStockChange(value, record.id, 'damage')}
          style={{ width: '100%' }}
          placeholder="Units to deduct"
        />
      ),
    },
    {
      title: 'Projected Stock',
      key: 'projected',
      render: (_, record) => {
        const current = record.stock;
        const toAdd = stockLevels[record.id]?.add || 0;
        const toDeduct = stockLevels[record.id]?.damage || 0;
        const projected = current + toAdd - toDeduct;
        const status = getStockStatus(projected);
        
        return (
          <Space direction="vertical" size="small">
            <Text strong>{projected} units</Text>
            <Tag color={status.status} style={{ margin: 0 }}>
              {status.text}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: 'Quick Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<PlusOutlined />}
            onClick={() => handleQuickAction(record, 'add', 10)}
          >
            Add 10
          </Button>
          <Button 
            size="small" 
            icon={<MinusOutlined />}
            onClick={() => handleQuickAction(record, 'damage', 5)}
          >
            Deduct 5
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2}>
            <StockOutlined /> Stock Management
          </Title>
          <Text type="secondary">
            Manage inventory levels, add new stock, and record damaged items
          </Text>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Products"
              value={totalProducts}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Stock Value"
              value={totalStockValue}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Low/Out of Stock"
              value={lowStockItems + outOfStockItems}
              valueStyle={{ color: (lowStockItems + outOfStockItems) > 0 ? '#f5222d' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bulk Actions Card */}
      <Card 
        title="Bulk Actions" 
        style={{ marginBottom: 24, borderRadius: 8 }}
        extra={<SyncOutlined />}
      >
        <Row gutter={16} align="middle">
          <Col xs={24} sm={8}>
            <Select
              value={selectedAction}
              onChange={setSelectedAction}
              style={{ width: '100%' }}
            >
              <Option value="add">Add Stock</Option>
              <Option value="damage">Deduct Damaged</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <InputNumber
              min={0}
              value={bulkValue}
              onChange={setBulkValue}
              placeholder="Enter value"
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Button 
              type="primary" 
              onClick={handleBulkAction}
              style={{ width: '100%' }}
            >
              Apply to All Products
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Alerts for stock issues */}
      {outOfStockItems > 0 && (
        <Alert
          message={`${outOfStockItems} product(s) are out of stock`}
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: 16 }}
        />
      )}
      {lowStockItems > 0 && (
        <Alert
          message={`${lowStockItems} product(s) have low stock`}
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Products Table */}
      <Card
        title="Inventory Management"
        style={{ borderRadius: 8 }}
        extra={
          <Button 
            type="primary" 
            icon={<SyncOutlined />} 
            onClick={handleUpdateStock}
          >
            Update All Stock
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} products`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Quick Action Modal */}
      <Modal
        title={`${selectedAction === 'add' ? 'Add' : 'Deduct'} Stock - ${selectedProduct?.title}`}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Apply"
        cancelText="Cancel"
      >
        <Divider />
        <Form
          form={form}
          layout="vertical"
          name="stockActionForm"
        >
          <Form.Item
            name="value"
            label={selectedAction === 'add' ? 'Units to Add' : 'Units to Deduct'}
            rules={[{ required: true, message: 'Please enter a value' }]}
          >
            <InputNumber
              min={0}
              max={selectedAction === 'damage' ? selectedProduct?.stock : undefined}
              style={{ width: '100%' }}
            />
          </Form.Item>
          {selectedAction === 'damage' && (
            <Alert
              message={`Note: You cannot deduct more than the current stock (${selectedProduct?.stock} units)`}
              type="info"
              showIcon
            />
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default StockManagement;