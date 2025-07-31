import React, { useState } from 'react';
import { Layout, Menu, Card, Table, Button, Form, Input, Select, DatePicker, Tag, Space } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  DollarOutlined,
  TransactionOutlined,
  FileTextOutlined,
  BranchesOutlined
} from '@ant-design/icons';
import ManageBranches from '../components/Business/ManageBranches';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const BusinessDashboard = ({branches, token}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState('businesses');
 
  // Sample data from your backend models
  const [businesses, setBusinesses] = useState([
    { id: 1, name: 'Acme Corp', tax_id: '123-45-6789', status: 'active' }
  ]);
  
  const [members, setMembers] = useState([
    { user_id: 1, business_id: 1, role: 'owner', user: { username: 'admin' } }
  ]);

  const columns = {
    businesses: [
      { title: 'ID', dataIndex: 'id' },
      { title: 'Name', dataIndex: 'name' },
      { title: 'Tax ID', dataIndex: 'tax_id' },
      { title: 'Status', dataIndex: 'status', render: status => (
        <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
      )},
      { title: 'Actions', render: (_, record) => (
        <Space>
          <Button>Edit</Button>
          <Button danger>Delete</Button>
        </Space>
      )}
    ],
    members: [
      { title: 'User', dataIndex: ['user', 'username'] },
      { title: 'Role', dataIndex: 'role' },
      { title: 'Joined', dataIndex: 'joined_at' },
      { title: 'Actions', render: () => (
        <Space>
          <Button>Edit Role</Button>
          <Button danger>Remove</Button>
        </Space>
      )}
    ],
    /*branches: [
      { title: 'Branch Name', dataIndex: 'branchname' },
      { title: 'Address', dataIndex: 'branchaddress' },
      { title: 'Contact', dataIndex: 'contactno' },
      { title: 'Actions', render: () => (
        <Space>
          <Button>Edit</Button>
          <Button danger>Delete</Button>
        </Space>
      )}
    ]*/
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo">BizERP</div>
        <Menu theme="dark" selectedKeys={[currentTab]} mode="inline">
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item 
            key="businesses" 
            icon={<ShopOutlined />}
            onClick={() => setCurrentTab('businesses')}
          >
            Businesses
          </Menu.Item>
          <Menu.Item 
            key="branches" 
            icon={<BranchesOutlined />}
            onClick={() => setCurrentTab('branches')}
          >
            Branches
          </Menu.Item>
          <Menu.Item 
            key="members" 
            icon={<UserOutlined />}
            onClick={() => setCurrentTab('members')}
          >
            Team Members
          </Menu.Item>
          <Menu.Item key="financial" icon={<DollarOutlined />}>
            Financial
          </Menu.Item>
          <Menu.Item key="transactions" icon={<TransactionOutlined />}>
            Transactions
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Header className="site-layout-header">
          <h2>
            {currentTab === 'businesses' ? 'Business Management' : 
             currentTab === 'members' ? 'Team Members' : 
             currentTab === 'branches' ? 'Branch Management' : 
             currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
          </h2>
        </Header>

        <Content style={{ margin: '24px 16px' }}>
          {currentTab === 'businesses' && (
            <>
              <Card title="Register New Business" style={{ marginBottom: 24 }}>
                <Form layout="vertical">
                  <Form.Item label="Business Name" name="name" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Tax ID" name="tax_id">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Address" name="address">
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary">Create Business</Button>
                  </Form.Item>
                </Form>
              </Card>

              <Card title="Your Businesses">
                <Table 
                  columns={columns.businesses} 
                  dataSource={businesses} 
                  rowKey="id"
                />
              </Card>
            </>
          )}

          {currentTab === 'members' && (
            <>
              <Card title="Add Team Member" style={{ marginBottom: 24 }}>
                <Form layout="vertical">
                  <Form.Item label="Business" name="business_id" rules={[{ required: true }]}>
                    <Select>
                      {businesses.map(b => (
                        <Option key={b.id} value={b.id}>{b.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="User Email" name="email" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Role" name="role" rules={[{ required: true }]}>
                    <Select>
                      <Option value="owner">Owner</Option>
                      <Option value="admin">Admin</Option>
                      <Option value="staff">Staff</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary">Add Member</Button>
                  </Form.Item>
                </Form>
              </Card>
                    
              <Card title="Team Members">
                <Table 
                  columns={columns.members} 
                  dataSource={members}
                  rowKey="user_id"
                />
              </Card>
            </>
          )}

          {currentTab === 'branches' && (
            <ManageBranches branches={branches} token={token}/>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default BusinessDashboard;