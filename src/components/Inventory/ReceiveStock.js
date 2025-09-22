import React, { useState } from 'react';
import axios from "axios";
import {
  Card,
  Table,
  Button,
  Select,
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  Divider,
  Alert,
  message,
  Space
} from 'antd';
import {
  CheckCircleOutlined,
  ShopOutlined,
  InboxOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/inventory/`;

const ReceiveStock = ({ products, setProducts, receiveItems, warehouse, isAuthenticated, token }) => {
  const [rowState, setRowState] = useState(() => {
    const initial = {};
    receiveItems.forEach(batch => {
      batch.items.forEach(item => {
        initial[item.product_id] = {
          checked: true,
          warehouse_id: undefined,
        };
      });
    });
    return initial;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckboxChange = (productId) => {
    setRowState(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        checked: !prev[productId].checked,
      }
    }));
  };

  const handleWarehouseChange = (productId, warehouseId) => {    
    setRowState(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        warehouse_id: warehouseId,
      }
    }));
  };

  const handleBulkUpdate = async () => {
    setIsSubmitting(true);
    
    const updates = receiveItems.flatMap(batch =>
      batch.items
        .filter(item => rowState[item.product_id]?.checked)
        .map(item => {
          const product = products.find(p => p.id === item.product_id);
          const whId = rowState[item.product_id]?.warehouse_id;

          if (!product || !whId) return null;

          return {
            product_id: product.id,
            action_type: "ADD",
            quantity: item.quantity,
            warehouse_id: whId,
            user_id: 1,
            id: batch.id,
          };
        })
        .filter(Boolean)
    );

    if (updates.length === 0) {
      message.warning("No items selected or warehouses missing.");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(`${API_URL}bulk-update`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(prevProducts =>
        prevProducts.map(product => {
          const updatedItem = updates.find(u => u.product_id === product.id);
          return updatedItem
            ? { ...product, stock: product.stock + updatedItem.quantity }
            : product;
        })
      );

      message.success("Stock updated successfully!");
    } catch (error) {
      console.error("Error updating stock:", error);
      message.error("Failed to update stock. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = receiveItems.some(batch =>
    batch.items.some(item => {
      const state = rowState[item.product_id];
      return state?.checked && state?.warehouse_id === undefined;
    })
  );

  // Calculate totals for summary
  const selectedItemsCount = receiveItems.reduce((total, batch) => {
    return total + batch.items.filter(item => rowState[item.product_id]?.checked).length;
  }, 0);

  const totalQuantity = receiveItems.reduce((total, batch) => {
    return total + batch.items
      .filter(item => rowState[item.product_id]?.checked)
      .reduce((sum, item) => sum + item.quantity, 0);
  }, 0);

  const totalValue = receiveItems.reduce((total, batch) => {
    return total + batch.items
      .filter(item => rowState[item.product_id]?.checked)
      .reduce((sum, item) => sum + (item.quantity * item.cost_per_unit), 0);
  }, 0);

  // Prepare data for the table
  const tableData = receiveItems.flatMap(batch =>
    batch.items.map(item => {
      const product = products.find(p => p.id === item.product_id);
      const state = rowState[item.product_id] || { checked: false, warehouse_id: undefined };
      
      return {
        key: `${batch.id}-${item.product_id}`,
        product_id: item.product_id,
        product_name: product ? product.title : "Unknown Product",
        quantity: item.quantity,
        cost_per_unit: item.cost_per_unit,
        total_value: item.quantity * item.cost_per_unit,
        checked: state.checked,
        warehouse_id: state.warehouse_id,
        batch_id: batch.id
      };
    })
  );

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      key: 'product_name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <Text type="secondary">ID: {record.product_id}</Text>
        </div>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => (
        <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
          {quantity} units
        </Tag>
      ),
    },
    {
      title: 'Cost Per Unit',
      dataIndex: 'cost_per_unit',
      key: 'cost_per_unit',
      render: (cost) => `$${cost}`
    },
    {
      title: 'Total Value',
      dataIndex: 'total_value',
      key: 'total_value',
      render: (value) => (
        <Text strong>${value}</Text>
      )
    },
    {
      title: 'Select',
      dataIndex: 'checked',
      key: 'checked',
      render: (checked, record) => (
        <Button
          shape="circle"
          icon={checked ? <CheckOutlined /> : <CloseOutlined />}
          type={checked ? "primary" : "default"}
          onClick={() => handleCheckboxChange(record.product_id)}
          style={{ 
            backgroundColor: checked ? '#52c41a' : '#f5f5f5',
            borderColor: checked ? '#52c41a' : '#d9d9d9'
          }}
        />
      ),
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse_id',
      key: 'warehouse',
      render: (warehouseId, record) => (
        <Select
          placeholder="Select Warehouse"
          size="middle"
          allowClear
          value={warehouseId}
          onChange={value => handleWarehouseChange(record.product_id, value)}
          style={{ width: "100%", minWidth: '180px' }}
          status={record.checked && !warehouseId ? 'error' : ''}
        >
          {warehouse.map(wh => (
            <Option key={wh.id} value={wh.id}>
              <Space>
                <ShopOutlined />
                {wh.warehouse_name}
              </Space>
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>
            <InboxOutlined /> Receive Stock
          </Title>
          <Text type="secondary">
            Review and confirm incoming inventory items
          </Text>
        </div>

        <Alert
          message="Instructions"
          description="Select items to receive and assign them to warehouses. Items without a selected warehouse cannot be processed."
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        {/* Summary Statistics */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={8}>
            <Card size="small">
              <Statistic
                title="Selected Items"
                value={selectedItemsCount}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small">
              <Statistic
                title="Total Quantity"
                value={totalQuantity}
                suffix="units"
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small">
              <Statistic
                title="Total Value"
                value={totalValue}
                precision={2}
                prefix="$"
              />
            </Card>
          </Col>
        </Row>

        <Divider />

        <div>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            scroll={{ x: 800 }}
            style={{ marginBottom: '24px' }}
          />
          
          <div style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              size="large"
              onClick={handleBulkUpdate}
              disabled={isSubmitDisabled || isSubmitting}
              loading={isSubmitting}
              icon={<CheckCircleOutlined />}
              style={{ minWidth: '250px' }}
            >
              {isSubmitting ? 'Processing...' : 'Update Stock for Selected Items'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReceiveStock;