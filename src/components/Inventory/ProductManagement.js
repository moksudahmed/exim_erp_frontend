import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Typography,
  Row,
  Col,
  Statistic,
  Divider,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;

const ProductManagement = ({ products, onAddProduct, onEditProduct, onDeleteProduct }) => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // Filter products based on search text
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calculate statistics
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);
  const outOfStockCount = products.filter(product => (product.stock || 0) <= 0).length;

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalVisible(true);
    form.setFieldsValue(product);
  };

  const handleDeleteProduct = (productId) => {
    onDeleteProduct(productId);
    message.success('Product deleted successfully');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingProduct) {
        onEditProduct({ ...editingProduct, ...values });
        message.success('Product updated successfully');
      } else {
        onAddProduct(values);
        message.success('Product added successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          {record.description && (
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {record.description}
              </Text>
            </div>
          )}
        </div>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color="blue" style={{ margin: 0 }}>
          {category || 'Uncategorized'}
        </Tag>
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'price_per_unit',
      key: 'price_per_unit',
      render: (price) => (
        <Text strong>${parseFloat(price).toFixed(2)}</Text>
      ),
      align: 'right',
      sorter: (a, b) => a.price_per_unit - b.price_per_unit,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => {
        let status = 'success';
        if (stock < 10) status = 'warning';
        if (stock === 0) status = 'error';
        
        return (
          <Tag color={status}>
            {stock || 0} in stock
          </Tag>
        );
      },
      align: 'center',
      sorter: (a, b) => (a.stock || 0) - (b.stock || 0),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const stock = record.stock || 0;
        if (stock > 10) return <Tag color="green">In Stock</Tag>;
        if (stock > 0) return <Tag color="orange">Low Stock</Tag>;
        return <Tag color="red">Out of Stock</Tag>;
      },
      align: 'center',
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit product">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditProduct(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Tooltip title="Delete product">
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2} style={{ margin: 0 }}>
            <ShoppingOutlined /> Product Management
          </Title>
          <Paragraph type="secondary">
            Manage your product inventory, add new products, and update existing products
          </Paragraph>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Products"
              value={totalProducts}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Stock"
              value={totalStock}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Out of Stock"
              value={outOfStockCount}
              valueStyle={{ color: outOfStockCount > 0 ? '#f5222d' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Action Bar */}
      <Card 
        style={{ marginBottom: 16, borderRadius: 8 }}
        bodyStyle={{ padding: '16px' }}
      >
        <Row gutter={16} align="middle">
          <Col xs={24} md={12}>
            <Search
              placeholder="Search products..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={handleAddProduct}
            >
              Add New Product
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Products Table */}
      <Card
        title={`Products (${filteredProducts.length})`}
        style={{ borderRadius: 8 }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} products`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText={editingProduct ? 'Update' : 'Add'}
      >
        <Divider />
        <Form
          form={form}
          layout="vertical"
          name="productForm"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="title"
                label="Product Name"
                rules={[{ required: true, message: 'Please enter product name' }]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="category"
                label="Category"
              >
                <Select placeholder="Select category">
                  <Option value="electronics">Electronics</Option>
                  <Option value="clothing">Clothing</Option>
                  <Option value="food">Food</Option>
                  <Option value="books">Books</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={3} placeholder="Enter product description" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="price_per_unit"
                label="Price"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="stock"
                label="Stock Quantity"
                rules={[{ required: true, message: 'Please enter stock quantity' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;