import React, { useState } from 'react';
import {
  Button,
  Select,
  Form,
  InputNumber,
  Table,
  Row,
  Col,
  Card,
  Typography,
  Divider,
  message,
  Statistic,
  Tag,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
  SendOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import SupplierEntryModal from './SupplierEntryModal'; // Adjust path as needed
import './styles/PurchaseOrderForm.css';

const { Option } = Select;
const { Title, Text } = Typography;

const PurchaseOrderForm = ({ clients, products, onSubmit, token }) => {
  const [vendor, setVendor] = useState(null);
  const [productId, setProductId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [supplierList, setSupplierList] = useState(clients); // Local copy to update after modal submit

  const handleAddItem = () => {
    const product = products.find((p) => p.id === productId);
    if (!product) return message.error('Please select a valid product.');
    if (items.some((item) => item.product_id === productId)) {
      return message.warning('This product is already added.');
    }
    const newItem = {
      product_id: productId,
      product_name: product.title,
      quantity,
      cost_per_unit: product.price_per_unit,
      unit: product.unit || 'pcs'
    };
    setItems([...items, newItem]);
    setProductId(null);
    setQuantity(1);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.product_id !== id));
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.cost_per_unit,
    0
  );

  const handleSubmit = async () => {
    if (!vendor || items.length === 0) {
      message.error('Please select a supplier and add at least one product.');
      return;
    }

    const orderPayload = {
      client_id: vendor,
      date: new Date().toISOString().split('T')[0],
      total_amount: totalAmount,
      status: 'PENDING',
      user_id: 1,
      items,
    };

    const payment = {
      business_id: 1,
      amount: 0,
      payment_method: paymentMethod,
      reference_number: '',
      notes: ''
    };

    const playload = {
      order_data: orderPayload,
      payment: payment
    };

    try {
      setIsSubmitting(true);
      await onSubmit(playload);
      message.success('Purchase order submitted successfully!');
      setItems([]);
      setVendor(null);
      setPaymentMethod('credit');
    } catch (error) {
      console.error('Submission Error:', error);
      message.error('Failed to submit purchase order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshSuppliers = async () => {
    // If you want to fetch latest suppliers from API after creating one, you can add that here.
    // For now we mimic by adding a success callback in modal to update local list.
  };

  const columns = [
    {
      title: 'PRODUCT',
      dataIndex: 'product_name',
      key: 'product_name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'UNIT',
      dataIndex: 'unit',
      key: 'unit',
      align: 'center',
      render: (unit) => <Tag color="blue">{unit}</Tag>
    },
    {
      title: 'QUANTITY',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (value) => <Text type="secondary">{value}</Text>
    },
    {
      title: 'UNIT PRICE (৳)',
      dataIndex: 'cost_per_unit',
      key: 'cost_per_unit',
      align: 'right',
      render: (value) => value.toLocaleString('en-BD')
    },
    {
      title: 'SUBTOTAL (৳)',
      key: 'subtotal',
      align: 'right',
      render: (_, record) => (
        <Text strong>{(record.quantity * record.cost_per_unit).toLocaleString('en-BD')}</Text>
      )
    },
    {
      title: 'ACTION',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.product_id)}
        />
      ),
    },
  ];

  return (
    <div className="purchase-order-container">
      <Card bordered={false} className="order-header-card" bodyStyle={{ paddingBottom: 0 }}>
        <Row align="middle" gutter={16}>
          <Col flex="none">
            <div className="order-icon">
              <ShoppingCartOutlined />
            </div>
          </Col>
          <Col flex="auto">
            <Title level={4} className="order-title">Create Purchase Order</Title>
            <Text type="secondary">Add products and select supplier to create new purchase order</Text>
          </Col>
          <Col flex="none">
            <Statistic
              title="Total Amount"
              value={totalAmount}
              precision={2}
              valueStyle={{
                color: totalAmount > 0 ? '#1890ff' : '#ccc',
                fontSize: 24
              }}
              prefix="৳"
              suffix="BDT"
            />
          </Col>
        </Row>
      </Card>

      <Card className="form-card">
        <Form layout="vertical">
          <Row gutter={24} align="bottom">
            <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong>Select Supplier</Text>}
                required
                tooltip="Choose a vendor from your client list"
              >
                <Select
                  size="large"
                  placeholder="Search or select supplier"
                  value={vendor}
                  onChange={setVendor}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <div style={{ padding: '8px', textAlign: 'center' }}>
                        <Button
                          type="link"
                          icon={<UserAddOutlined />}
                          onClick={() => setShowSupplierModal(true)}
                        >
                          Add New Supplier
                        </Button>
                      </div>
                    </>
                  )}
                >
                  {supplierList.map((client) => (
                    <Option key={client.client_id} value={client.client_id}>
                      {client.account_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<Text strong>Payment Method</Text>}>
                <Select
                  size="large"
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                >
                  <Option value="credit">Credit</Option>
                  <Option value="cash">Cash</Option>
                  <Option value="bank_transfer">Bank</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" plain>
            <Text type="secondary">Add Products</Text>
          </Divider>

          <Row gutter={16} align="bottom">
            <Col xs={24} md={12} lg={10}>
              <Form.Item label={<Text strong>Product</Text>}>
                <Select
                  size="large"
                  placeholder="Search products..."
                  value={productId}
                  onChange={setProductId}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {products.map((product) => (
                    <Option key={product.id} value={product.id}>
                      {product.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Form.Item label={<Text strong>Quantity</Text>}>
                <InputNumber
                  size="large"
                  min={1}
                  value={quantity}
                  onChange={setQuantity}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col xs={12} md={6} lg={4} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={handleAddItem}
                disabled={!productId || quantity < 1}
                block
              >
                Add Item
              </Button>
            </Col>
          </Row>

          {items.length > 0 && (
            <div className="order-items-section">
              <Table
                dataSource={items}
                columns={columns}
                rowKey="product_id"
                pagination={false}
                size="middle"
                bordered
                scroll={{ x: true }}
                className="order-items-table"
              />
            </div>
          )}

          <div className="order-actions">
            <Popconfirm
              title="Confirm submission"
              description="Are you sure you want to submit this purchase order?"
              onConfirm={handleSubmit}
              okText="Submit"
              cancelText="Cancel"
              disabled={!vendor || items.length === 0}
            >
              <Button
                type="primary"
                size="large"
                icon={<SendOutlined />}
                loading={isSubmitting}
                disabled={!vendor || items.length === 0}
              >
                Submit Purchase Order
              </Button>
            </Popconfirm>
          </div>
        </Form>
      </Card>

      {/* SUPPLIER MODAL */}
      <SupplierEntryModal
        visible={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        onSuccess={() => {
          message.success('New supplier added!');
          setShowSupplierModal(false);
          // Reload supplier list from backend if needed
          // For now, just refetch or refresh manually if needed
        }}
      />
    </div>
  );
};

export default PurchaseOrderForm;
