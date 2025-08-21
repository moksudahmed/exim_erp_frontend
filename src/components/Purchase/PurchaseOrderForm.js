import React, { useEffect, useState, useCallback } from 'react';
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
  Popconfirm,
  Space,
  Input,
  Radio,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
  SendOutlined,
  UserAddOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import SupplierEntryModal from './SupplierEntryModal';
import './styles/PurchaseOrderForm.css';
import * as clientAPI from '../../api/client';

const { Option } = Select;
const { Title, Text } = Typography;

const PurchaseOrderForm = ({ supplierList, products, onSubmit, branches, token }) => {
  const [form] = Form.useForm();
  const [vendor, setVendor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [productId, setProductId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [subcategory, setSubcategory] = useState('');
  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [measurementType, setMeasurementType] = useState('scale');
  const [measurementValue, setMeasurementValue] = useState(0);
  const [dimensions, setDimensions] = useState({
    length: 0,
    width: 0,
    height: 0
  });
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const loadSuppliers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await clientAPI.fetchClientsByType('SUPPLIER', token);
      const data = Array.isArray(response) ? response : [];
      setSuppliers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      message.error('Failed to load suppliers.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  // Update unit price when product is selected
  useEffect(() => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setUnitPrice(product.price_per_unit);
      }
    }
  }, [productId, products]);

  const calculateTapeMeasurement = (l, w, h) => {
    return parseFloat(((l * w * h) / 35).toFixed(3));
  };

  const handleDimensionChange = (name, value) => {
    const newDimensions = {
      ...dimensions,
      [name]: parseFloat(value) || 0
    };
    setDimensions(newDimensions);
    
    if (measurementType === 'tape') {
      const calculated = calculateTapeMeasurement(
        newDimensions.length,
        newDimensions.width,
        newDimensions.height
      );
      setMeasurementValue(calculated);
    }
  };

  const handleMeasurementTypeChange = (e) => {
    const type = e.target.value;
    setMeasurementType(type);
    
    if (type === 'scale') {
      setMeasurementValue(0);
    } else if (type === 'tape') {
      const calculated = calculateTapeMeasurement(
        dimensions.length,
        dimensions.width,
        dimensions.height
      );
      setMeasurementValue(calculated);
    }
  };

  const handleMeasurementValueChange = (value) => {
    setMeasurementValue(value);
  };

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
      cost_per_unit: unitPrice,
      unit: product.unit || 'pcs',
      measurement_type: measurementType,
      measurement_value: measurementValue,
      quality: subcategory,
      ...(measurementType === 'tape' && { dimensions })
    };
    
    setItems([...items, newItem]);
    setProductId(null);
    setQuantity(1);
    setUnitPrice(0);
    setSubcategory('');
    setMeasurementType('scale');
    setMeasurementValue(0);
    setDimensions({ length: 0, width: 0, height: 0 });
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
      branch_id: selectedBranch,
      measurement: measurementType,
      measurement_value: measurementValue
    };

    const payment = {
      business_id: 1,
      amount: 0,
      payment_method: paymentMethod,
      reference_number: '',
      notes: ''
    };

    const payload = {
      order_data: orderPayload,
      payment: payment
    };

    try {
      setIsSubmitting(true);
      await onSubmit(payload);
      message.success('Purchase order submitted successfully!');
      setItems([]);
      setVendor(null);
      setPaymentMethod('credit');
      setSelectedBranch(null);
      form.resetFields();
    } catch (error) {
      console.error('Submission Error:', error);
      message.error(error.response?.data?.message || 'Failed to submit purchase order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'PRODUCT',
      dataIndex: 'product_name',
      key: 'product_name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'QUALITY',
      dataIndex: 'quality',
      key: 'quality',
      align: 'center',
      render: (quality) => <Tag color="green">{quality}</Tag>
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
      title: 'MEASUREMENT',
      key: 'measurement',
      align: 'center',
      render: (_, record) => (
        <div>
          <Tag color="purple">{record.measurement_type.toUpperCase()}</Tag>
          <div>
            {record.measurement_type === 'tape' ? (
              <>
                <Text type="secondary">L: {record.dimensions.length}ft × W: {record.dimensions.width}ft × H: {record.dimensions.height}ft</Text>
                <br />
                <Text strong>= {record.measurement_value} tons</Text>
              </>
            ) : (
              <Text strong>{record.measurement_value} tons</Text>
            )}
          </div>
        </div>
      )
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
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.product_id)}
          style={{ color: '#ff4d4f' }}
        />
      ),
    },
  ];

  return (
    <div className="purchase-order-container">
      <Card 
        bordered={false} 
        className="order-header-card" 
        bodyStyle={{ padding: '20px 24px' }}
        headStyle={{ borderBottom: 0 }}
      >
        <Row align="middle" gutter={16}>
          <Col flex="none">
            <div className="order-icon">
              <ShoppingCartOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            </div>
          </Col>
          <Col flex="auto">
            <Title level={4} className="order-title" style={{ marginBottom: 0 }}>Create Purchase Order</Title>
            <Text type="secondary">Add products and select supplier to create new purchase order</Text>
          </Col>
          <Col flex="none">
            <Statistic
              title="Total Amount"
              value={totalAmount}
              precision={2}
              valueStyle={{
                color: totalAmount > 0 ? '#1890ff' : '#ccc',
                fontSize: 24,
                fontWeight: 500
              }}
              prefix="৳"
              suffix="BDT"
            />
          </Col>
        </Row>
      </Card>

      <Card 
        className="form-card" 
        style={{ marginTop: 16, borderRadius: 8 }}
        bodyStyle={{ padding: 24 }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong>Select Supplier</Text>}
                required
                tooltip="Choose a supplier from your client list"
              >
                <Select
                  size="large"
                  value={vendor}
                  onChange={setVendor}
                  style={{ width: '100%' }}
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
                  {suppliers.map((client) => (
                    <Option key={client.client_id} value={client.client_id}>
                      {client.account_holder}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item label={<Text strong>Payment Method</Text>}>
                <Select
                  size="large"
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                  style={{ width: '100%' }}
                >
                  <Option value="credit">Credit</Option>
                  <Option value="cash">Cash</Option>
                  <Option value="bank_transfer">Bank Transfer</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                label={<Text strong>Branch</Text>}
                rules={[{ required: true, message: 'Please select a branch' }]}
              >
                <Select 
                  placeholder="Select Branch" 
                  size="large"
                  showSearch
                  optionFilterProp="children"
                  allowClear
                  value={selectedBranch}
                  onChange={setSelectedBranch}
                  style={{ width: '100%' }}
                >
                  {branches.map(branch => (
                    <Option key={branch.id} value={branch.id}>
                      {branch.branchname}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" plain>
            <Text type="secondary" strong>Order Items</Text>
          </Divider>

          <Row gutter={16} align="bottom">
            {/* Product Selection */}
            <Col xs={24} md={6} lg={5}>
              <Form.Item label={<Text strong>Product</Text>}>
                <Select
                  size="large"
                  placeholder="Select product"
                  value={productId}
                  onChange={setProductId}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  style={{ width: '100%' }}
                >
                  {filteredProducts.map((product) => (
                    <Option key={product.id} value={product.id}>
                      {product.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Quality Selection */}
            <Col xs={12} md={6} lg={3}>
              <Form.Item label={<Text strong>Quality</Text>}>
                <Select 
                  placeholder="Select quality"                
                  size="large"                
                  value={subcategory}
                  onChange={setSubcategory}
                  style={{ width: '100%' }}
                >
                  <Option value="SUPER">SUPER</Option>
                  <Option value="MEDIUM">MEDIUM</Option>
                  <Option value="MIXTURE">MIXTURE</Option>                  
                </Select>                
              </Form.Item>
            </Col>

            {/* Quantity Input */}
            <Col xs={12} md={6} lg={3}>
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

            {/* Measurement Selection */}
            <Col xs={24} md={12} lg={5}>
              <Form.Item label={
                <span>
                  <Text strong>Measurement</Text>
                  <Tooltip title="Select measurement type and enter values">
                    <InfoCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                  </Tooltip>
                </span>
              }>
                <div style={{ marginBottom: 8 }}>
                  <Radio.Group
                    value={measurementType}
                    onChange={handleMeasurementTypeChange}
                    style={{ width: '100%' }}
                  >
                    <Radio.Button value="scale">Scale</Radio.Button>
                    <Radio.Button value="tape">Tape</Radio.Button>
                  </Radio.Group>
                </div>

                {measurementType === 'tape' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    <InputNumber
                      placeholder="L (ft)"
                      min={0}
                      step={0.01}
                      value={dimensions.length}
                      onChange={(value) => handleDimensionChange('length', value)}
                      style={{ width: '100%' }}
                    />
                    <InputNumber
                      placeholder="W (ft)"
                      min={0}
                      step={0.01}
                      value={dimensions.width}
                      onChange={(value) => handleDimensionChange('width', value)}
                      style={{ width: '100%' }}
                    />
                    <InputNumber
                      placeholder="H (ft)"
                      min={0}
                      step={0.01}
                      value={dimensions.height}
                      onChange={(value) => handleDimensionChange('height', value)}
                      style={{ width: '100%' }}
                    />
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                      <Text strong>Calculated: {measurementValue} tons</Text>
                    </div>
                  </div>
                ) : (
                  <InputNumber
                    placeholder="Tons"
                    min={0}
                    step={0.01}
                    value={measurementValue}
                    onChange={handleMeasurementValueChange}
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>

            {/* Unit Price Input */}
            <Col xs={12} md={6} lg={4}>            
              <Form.Item label={<Text strong>Unit Price (৳)</Text>}>
                <InputNumber
                  placeholder="Price"
                  min={0}
                  step={0.01}
                  value={unitPrice}
                  onChange={setUnitPrice}
                  style={{ width: '100%' }}
                  formatter={value => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/৳\s?|(,*)/g, '')}
                />     
              </Form.Item>
            </Col>

            {/* Add Item Button */}
            <Col xs={24} md={6} lg={4}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={handleAddItem}
                disabled={!productId || quantity < 1 || measurementValue <= 0}
                block
                style={{ marginTop: 29 }}
              >
                Add Item
              </Button>
            </Col>
          </Row>

          {items.length > 0 && (
            <div className="order-items-section" style={{ marginTop: 24 }}>
              <Table
                dataSource={items}
                columns={columns}
                rowKey="product_id"
                pagination={false}
                size="middle"
                bordered
                scroll={{ x: true }}
                className="order-items-table"
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={6} align="right">
                        <Text strong>Total Amount:</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right">
                        <Text strong>৳{totalAmount.toLocaleString('en-BD')}</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} />
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </div>
          )}

          <div className="order-actions" style={{ marginTop: 24, textAlign: 'right' }}>
            <Popconfirm
              title="Confirm Purchase Order Submission"
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
                style={{ minWidth: 200 }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Order'}
              </Button>
            </Popconfirm>
          </div>
        </Form>
      </Card>

      <SupplierEntryModal
        visible={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
        onSuccess={(newSupplier) => {
          message.success('New supplier added successfully!');
          setShowSupplierModal(false);
          setVendor(newSupplier.client_id);
          loadSuppliers();
        }}
        token={token}
      />
    </div>
  );
};

export default PurchaseOrderForm;