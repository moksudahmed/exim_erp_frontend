import React, { useState } from 'react';
import {
  Table,
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Input,
  Avatar,
} from 'antd';
import {
  EditOutlined,
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  HomeOutlined,
  NumberOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ManageCustomers = ({ customers = [] }) => {
  const [searchText, setSearchText] = useState('');

  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer?.first_name || ''} ${customer?.last_name || ''}`.toLowerCase();
    return (
      fullName.includes(searchText.toLowerCase()) ||
      (customer?.account_name || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (customer?.contact_no || '').includes(searchText)
    );
  });

  const handleEditClick = (customer) => {
    console.log('Editing customer:', customer);
    // Implement edit logic
  };

  const columns = [
    {
      title: <Text strong>ID</Text>,
      dataIndex: 'client_id',
      key: 'client_id',
      width: 80,
      render: (id) => <Tag color="blue">#{id}</Tag>,
      sorter: (a, b) => a.client_id - b.client_id,
    },
    {
      title: <Text strong>Customer</Text>,
      key: 'full_name',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>
              {record?.title ? `${record.title} ` : ''}
              {record?.first_name} {record?.last_name}
            </Text>
            <br />
            <Text type="secondary">{record?.client_type}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: <Text strong>Account</Text>,
      key: 'account',
      render: (_, record) => (
        <div>
          <Text>
            <NumberOutlined /> {record?.account_no || '-'}
          </Text>
          <br />
          <Text strong>{record?.account_name || '-'}</Text>
        </div>
      ),
    },
    {
      title: <Text strong>Contact</Text>,
      dataIndex: 'contact_no',
      key: 'contact',
      render: (contact) => (
        <Space>
          <PhoneOutlined style={{ color: '#1890ff' }} />
          <Text>{contact || '-'}</Text>
        </Space>
      ),
    },
    {
      title: <Text strong>Address</Text>,
      dataIndex: 'address',
      key: 'address',
      render: (address) => (
        <Space>
          <HomeOutlined style={{ color: '#fa8c16' }} />
          <Text>{address || '-'}</Text>
        </Space>
      ),
    },
    {
      title: <Text strong>Type</Text>,
      dataIndex: 'client_type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'CUSTOMER' ? 'green' : 'volcano'}>
          {type || 'OTHER'}
        </Tag>
      ),
      filters: [
        { text: 'Customer', value: 'CUSTOMER' },
        { text: 'Other', value: 'OTHER' },
      ],
      onFilter: (value, record) => record?.client_type === value,
    },
    {
      title: <Text strong>Registered</Text>,
      dataIndex: 'registration_date',
      key: 'registration_date',
      render: (date) =>
        date ? dayjs(date).format('DD MMM YYYY') : <Text type="secondary">N/A</Text>,
      sorter: (a, b) =>
        new Date(a.registration_date) - new Date(b.registration_date),
    },
    {
      title: <Text strong>Actions</Text>,
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEditClick(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      }}
      title={
        <Space size="large">
          <Title level={5} style={{ margin: 0 }}>
            <IdcardOutlined style={{ marginRight: 8 }} />
            Customer Management
          </Title>
          <Input
            placeholder="Search by name, account, or contact"
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </Space>
      }
      extra={<Button type="primary">+ Add New Customer</Button>}
    >
      <Table
        columns={columns}
        dataSource={filteredCustomers}
        rowKey="client_id"
        size="middle"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} customers`,
        }}
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: <Text type="secondary">No customer records found</Text>,
        }}
      />
    </Card>
  );
};

export default ManageCustomers;
