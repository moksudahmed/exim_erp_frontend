import React, { useState, useMemo } from 'react';
import {
  Table,
  Card,
  Input,
  Select,
  Tag,
  Typography,
  Space,
  Button,
  DatePicker,
  Row,
  Col,
  Statistic,
  Progress
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  StockOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const InventoryLogs = ({ products, inventoryLogs, warehouses = [], isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [dateRange, setDateRange] = useState([]);

  // Create product map
  const productMap = useMemo(() => {
    const map = {};
    if (Array.isArray(products)) {
      products.forEach(product => {
        map[product.id] = product;
      });
    }
    return map;
  }, [products]);

  // Create warehouse map
  const warehouseMap = useMemo(() => {
    const map = {};
    if (Array.isArray(warehouses)) {
      warehouses.forEach(warehouse => {
        map[warehouse.id] = warehouse;
      });
    }
    return map;
  }, [warehouses]);

  // Action types for filter
  const actionTypes = useMemo(() => {
    if (!Array.isArray(inventoryLogs)) return ['all'];
    const types = new Set(inventoryLogs.map(log => log.action_type));
    return ['all', ...Array.from(types)];
  }, [inventoryLogs]);

  // Filter + sort logs
  const filteredAndSortedLogs = useMemo(() => {
    if (!Array.isArray(inventoryLogs)) return [];

    let filteredLogs = inventoryLogs.filter(log => {
      const product = productMap[log.product_id];
      const matchesSearch = product && product.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction = selectedAction === 'all' || log.action_type === selectedAction;
      const matchesWarehouse = selectedWarehouse === 'all' || log.warehouse_id == selectedWarehouse;
      
      // Date range filter
      let matchesDate = true;
      if (dateRange.length === 2) {
        const logDate = new Date(log.created_at);
        const startDate = new Date(dateRange[0]);
        const endDate = new Date(dateRange[1]);
        endDate.setHours(23, 59, 59, 999); // End of the day
        matchesDate = logDate >= startDate && logDate <= endDate;
      }
      
      return matchesSearch && matchesAction && matchesWarehouse && matchesDate;
    });

    if (sortConfig.key) {
      filteredLogs.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'product_id') {
          aValue = productMap[a.product_id]?.title || '';
          bValue = productMap[b.product_id]?.title || '';
        } else if (sortConfig.key === 'warehouse_id') {
          aValue = warehouseMap[a.warehouse_id]?.warehouse_name || '';
          bValue = warehouseMap[b.warehouse_id]?.warehouse_name || '';
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredLogs;
  }, [inventoryLogs, productMap, warehouseMap, searchTerm, selectedAction, selectedWarehouse, dateRange, sortConfig]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalAdditions = filteredAndSortedLogs
      .filter(log => log.action_type === 'add')
      .reduce((sum, log) => sum + log.quantity, 0);
      
    const totalRemovals = filteredAndSortedLogs
      .filter(log => log.action_type === 'remove')
      .reduce((sum, log) => sum + log.quantity, 0);
      
    return {
      totalEntries: filteredAndSortedLogs.length,
      totalAdditions,
      totalRemovals,
      netChange: totalAdditions - totalRemovals
    };
  }, [filteredAndSortedLogs]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  };

  const getActionTag = (action) => {
    let color = 'default';
    let icon = null;
    
    switch(action) {
      case 'add':
        color = 'green';
        icon = <ArrowUpOutlined />;
        break;
      case 'remove':
        color = 'red';
        icon = <ArrowDownOutlined />;
        break;
      case 'adjust':
        color = 'blue';
        break;
      default:
        color = 'default';
    }
    
    return (
      <Tag color={color} icon={icon}>
        {action.toUpperCase()}
      </Tag>
    );
  };

  const columns = [
    {
      title: (
        <span onClick={() => requestSort('product_id')}>
          Product {getSortIcon('product_id')}
        </span>
      ),
      dataIndex: 'product_id',
      key: 'product',
      render: (productId) => {
        const product = productMap[productId];
        return product ? product.title : 'Unknown Product';
      }
    },
    {
      title: (
        <span onClick={() => requestSort('action_type')}>
          Action {getSortIcon('action_type')}
        </span>
      ),
      dataIndex: 'action_type',
      key: 'action',
      render: (action) => getActionTag(action)
    },
    {
      title: (
        <span onClick={() => requestSort('quantity')}>
          Quantity {getSortIcon('quantity')}
        </span>
      ),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <Text strong={record.action_type === 'add'} type={record.action_type === 'remove' ? 'danger' : 'success'}>
          {record.action_type === 'add' ? '+' : '-'}{quantity}
        </Text>
      )
    },
    {
      title: (
        <span onClick={() => requestSort('created_at')}>
          Date {getSortIcon('created_at')}
        </span>
      ),
      dataIndex: 'created_at',
      key: 'date',
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: (
        <span onClick={() => requestSort('warehouse_id')}>
          Warehouse {getSortIcon('warehouse_id')}
        </span>
      ),
      dataIndex: 'warehouse_id',
      key: 'warehouse',
      render: (warehouseId) => {
        const warehouse = warehouseMap[warehouseId];
        return warehouse ? warehouse.warehouse_name : 'N/A';
      }
    }
  ];

  if (isLoading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Progress type="circle" percent={30} />
          <Title level={4} style={{ marginTop: 16 }}>Loading Inventory Data</Title>
          <Text type="secondary">Please wait while we fetch the latest logs...</Text>
        </div>
      </Card>
    );
  }

  if (!Array.isArray(inventoryLogs)) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Title level={4} type="danger">Data Format Issue</Title>
          <Text type="secondary">Inventory logs data is not in the expected format.</Text>
        </div>
      </Card>
    );
  }

  if (inventoryLogs.length === 0) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <StockOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} />
          <Title level={4}>No Inventory Logs Found</Title>
          <Text type="secondary">There are no inventory logs to display at this time.</Text>
        </div>
      </Card>
    );
  }

  return (
    <div className="inventory-logs">
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Title level={2} style={{ margin: 0 }}>
              <StockOutlined /> Inventory Logs
            </Title>
            <Text type="secondary">Track all inventory movements and adjustments</Text>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Space>
              <Button icon={<DownloadOutlined />}>Export</Button>
              <Button icon={<ReloadOutlined />}>Refresh</Button>
            </Space>
          </Col>
        </Row>

        {/* Stats Overview */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="Total Entries"
                value={stats.totalEntries}
                prefix={<StockOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="Items Added"
                value={stats.totalAdditions}
                valueStyle={{ color: '#3f8600' }}
                prefix={<ArrowUpOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="Items Removed"
                value={stats.totalRemovals}
                valueStyle={{ color: '#cf1322' }}
                prefix={<ArrowDownOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small">
              <Statistic
                title="Net Change"
                value={stats.netChange}
                valueStyle={{ color: stats.netChange >= 0 ? '#3f8600' : '#cf1322' }}
                prefix={stats.netChange >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8} md={6}>
              <Input
                placeholder="Search products..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={8} md={4}>
              <Select
                value={selectedAction}
                onChange={setSelectedAction}
                style={{ width: '100%' }}
                suffixIcon={<FilterOutlined />}
              >
                {actionTypes.map(action => (
                  <Option key={action} value={action}>
                    {action === 'all' ? 'All Actions' : action}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={8} md={4}>
              <Select
                value={selectedWarehouse}
                onChange={setSelectedWarehouse}
                style={{ width: '100%' }}
                placeholder="All Warehouses"
                allowClear
              >
                <Option value="all">All Warehouses</Option>
                {warehouses.map(warehouse => (
                  <Option key={warehouse.id} value={warehouse.id}>
                    {warehouse.warehouse_name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <RangePicker
                style={{ width: '100%' }}
                value={dateRange}
                onChange={setDateRange}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={2}>
              <Button 
                type="default" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedAction('all');
                  setSelectedWarehouse('all');
                  setDateRange([]);
                }}
                style={{ width: '100%' }}
              >
                Clear
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Results count */}
        <div style={{ marginBottom: 16 }}>
          <Text strong>
            Showing {filteredAndSortedLogs.length} of {inventoryLogs.length} entries
          </Text>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredAndSortedLogs}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} items`
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default InventoryLogs;