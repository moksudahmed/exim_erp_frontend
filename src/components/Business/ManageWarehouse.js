import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  message,
  Row,
  Col,
  Space,
  Table,
  Tag,
  Modal,
  Divider,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  ApartmentOutlined,
  ShopOutlined
} from '@ant-design/icons';
import { addWarehouse } from '../../api/business';

const { Title, Text } = Typography;
const { Option } = Select;

const ManageWarehouses = ({ warehouses = [], branches = [], token }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  console.log(warehouses);
  const handleAddWarehouse = async (values) => {
    setLoading(true);
    try {
      await addWarehouse(values, token);
      message.success('Warehouse added successfully!');
      form.resetFields();
      setIsModalVisible(false);
    } catch (err) {
      console.error(err);
      message.error('Failed to add warehouse');
    } finally {
      setLoading(false);
    }
  };

  const handleEditWarehouse = (warehouse) => {
    setEditingWarehouse(warehouse);
    setIsModalVisible(true);
    form.setFieldsValue({
      warehouse_name: warehouse.warehouse_name,
      location: warehouse.location,
      branch_id: warehouse.branch_id
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingWarehouse(null);
    form.resetFields();
  };

  const handleDeleteWarehouse = (warehouse) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: `Are you sure you want to delete "${warehouse.warehouse_name}"?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        message.success('Warehouse deleted successfully');
        // Add your delete API call here
      }
    });
  };

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.warehouse_name.toLowerCase().includes(searchText.toLowerCase()) ||
    warehouse.location.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'Warehouse Name',
      dataIndex: 'warehouse_name',
      key: 'warehouse_name',
      sorter: (a, b) => a.warehouse_name.localeCompare(b.warehouse_name),
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      sorter: (a, b) => a.location.localeCompare(b.location)
    },
    {
      title: 'Branch',
      dataIndex: 'branch_id',
      key: 'branch_id',
      render: (branchId) => {
        const branch = branches.find(b => b.id === branchId);
        return branch ? branch.branchname : 'Unknown Branch';
      }
    },
    {
      title: 'Status',
      key: 'status',
      render: () => <Tag color="green">Active</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditWarehouse(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDeleteWarehouse(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            <ShopOutlined /> Warehouse Management
          </Title>
          <Text type="secondary">Manage your warehouses and their details</Text>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={() => setIsModalVisible(true)}
          >
            Add Warehouse
          </Button>
        </Col>
      </Row>

      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search warehouses..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select placeholder="Filter by branch" style={{ width: '100%' }} allowClear>
              {branches.map(branch => (
                <Option key={branch.id} value={branch.id}>
                  {branch.branchname}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredWarehouses}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} warehouses`
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        title={
          <span>
            {editingWarehouse ? <EditOutlined /> : <PlusOutlined />}
            {editingWarehouse ? ' Edit Warehouse' : ' Add New Warehouse'}
          </span>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Divider />
        <Form
          form={form}
          layout="vertical"
          onFinish={editingWarehouse ? () => {} : handleAddWarehouse}
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Warehouse Name"
                name="warehouse_name"
                rules={[{ required: true, message: 'Please enter warehouse name' }]}
              >
                <Input 
                  prefix={<ShopOutlined />}
                  placeholder="Enter warehouse name" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Branch"
                name="branch_id"
                rules={[{ required: true, message: 'Please select a branch' }]}
              >
                <Select
                  placeholder="Select branch"
                  suffixIcon={<ApartmentOutlined />}
                  allowClear
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
          
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: 'Please enter location' }]}
          >
            <Input.TextArea 
              rows={3}
              prefix={<EnvironmentOutlined />} 
              placeholder="Enter full address" 
            />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
              >
                {editingWarehouse ? 'Update Warehouse' : 'Add Warehouse'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageWarehouses;