import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Card,
  Typography,
  Tag,
  Space,
  Input,
  Button,
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
  BankOutlined,
  HomeOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import './styles/SupplierList.css';

const { Title, Text } = Typography;

const SupplierList = ({ suppliers = [] }) => {
  const [searchText, setSearchText] = useState('');

  const filteredSuppliers = useMemo(() => {
    if (!searchText) return suppliers;
    const lowerText = searchText.toLowerCase();
    return suppliers.filter((supplier) =>
      `${supplier.first_name} ${supplier.last_name}`.toLowerCase().includes(lowerText) ||
      (supplier.account_name?.toLowerCase() || '').includes(lowerText) ||
      (supplier.contact_no || '').includes(lowerText) ||
      (supplier.account_no || '').includes(lowerText)
    );
  }, [searchText, suppliers]);

  const columns = [
    {
      title: (
        <Space>
          <UserOutlined />
          <span>Supplier</span>
        </Space>
      ),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div>
          <Text strong>{`${record.title || ''} ${record.first_name} ${record.last_name}`}</Text>
          <br />
          <Text type="secondary">{record.account_name || '—'}</Text>
        </div>
      ),
      sorter: (a, b) =>
        `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`),
    },
    {
      title: (
        <Space>
          <PhoneOutlined />
          <span>Contact</span>
        </Space>
      ),
      dataIndex: 'contact_no',
      key: 'contact',
      render: (text) => text || '—',
    },
    {
      title: (
        <Space>
          <BankOutlined />
          <span>Bank Details</span>
        </Space>
      ),
      key: 'bank',
      render: (_, record) => (
        <div>
          <Text>Account: {record.account_no || '—'}</Text>
          <br />
          <Text type="secondary">Branch: {record.branch || '—'}</Text>
        </div>
      ),
    },
    {
      title: (
        <Space>
          <HomeOutlined />
          <span>Address</span>
        </Space>
      ),
      dataIndex: 'address',
      key: 'address',
      render: (text) => text || '—',
    },
    {
      title: (
        <Space>
          <CalendarOutlined />
          <span>Registered</span>
        </Space>
      ),
      dataIndex: 'registration_date',
      key: 'registered',
      render: (date) => (
        <Tag color="blue">
          {date ? new Date(date).toLocaleDateString() : '—'}
        </Tag>
      ),
      sorter: (a, b) =>
        new Date(a.registration_date || 0) - new Date(b.registration_date || 0),
    },
  ];

  return (
    <div className="supplier-management-container">
      <Card
        bordered={false}
        className="supplier-header-card"
        bodyStyle={{ paddingBottom: 0 }}
      >
        <div className="supplier-header">
          <div>
            <Title level={4} className="supplier-title">Supplier Directory</Title>
            <Text type="secondary">
              {filteredSuppliers.length} {filteredSuppliers.length === 1 ? 'supplier' : 'suppliers'} registered
            </Text>
          </div>
          <div className="supplier-actions">
            <Input
              placeholder="Search suppliers..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <Button type="primary" style={{ marginLeft: 8 }}>
              Add New Supplier
            </Button>
          </div>
        </div>
      </Card>

      <Card className="supplier-table-card">
        {filteredSuppliers.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredSuppliers}
            rowKey="client_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} suppliers`,
            }}
            scroll={{ x: true }}
            className="supplier-data-table"
          />
        ) : (
          <div className="no-suppliers">
            <img
              src="/empty-state.svg"
              alt="No suppliers found"
              style={{ width: 200, opacity: 0.6 }}
            />
            <Title level={4} style={{ marginTop: 16 }}>
              {searchText ? 'No matching suppliers found' : 'No suppliers registered yet'}
            </Title>
            <Text type="secondary">
              {searchText
                ? 'Try adjusting your search query'
                : 'Add your first supplier to get started'}
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SupplierList;
