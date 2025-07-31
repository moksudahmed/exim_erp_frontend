import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Layout,
  Menu,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { fetchAccountTypes } from '../../api/enum_types';
import { fetchAccounts, addAccount } from '../../api/account';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { Option } = Select;

const AccountManagement = ({ token, accounts, accountTypes, setAccounts, setAccountTypes, accountNatureType }) => {  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null); 
  const [form] = Form.useForm();


  const handleAddEditAccount = () => {
    form.resetFields();
    if (currentAccount) form.setFieldsValue(currentAccount);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentAccount(null);
  };

  const handleSave = async (values) => {
    try {
      await addAccount(values, token);
      const updatedAccounts = await fetchAccounts(token);
      setAccounts(updatedAccounts);
      message.success('Account saved successfully');
      setIsModalVisible(false);
      setCurrentAccount(null);
    } catch (error) {
      if (error.message.includes('already exists')) {
        form.setFields([
          {
            name: 'account_name',
            errors: ['Account name already exists. Please use a different name.'],
          },
        ]);
      } else {
        message.error('Failed to save account: ' + error.message);
      }
    }
  };

  return (
    <Layout>
      <Header style={{ background: '#fff', padding: 0 }}>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['accounts']}>
          <Menu.Item key="dashboard">Dashboard</Menu.Item>
          <Menu.Item key="accounts">Accounts</Menu.Item>
          <Menu.Item key="transactions">Transactions</Menu.Item>
          <Menu.Item key="reports">Reports</Menu.Item>
        </Menu>
      </Header>

      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%' }}>
            <Menu.Item key="1">Add Account</Menu.Item>
            <Menu.Item key="2">View Transactions</Menu.Item>
          </Menu>
        </Sider>

        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Title level={2}>Account Management</Title>

            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEditAccount}>
              Add Account
            </Button>

            <Table
              style={{ marginTop: 20 }}
              dataSource={accounts}
              rowKey="account_id"
              columns={[
                { title: 'Account Name', dataIndex: 'account_name', key: 'account_name' },
                { title: 'Account Type', dataIndex: 'account_type', key: 'account_type' },
                { title: 'Account Nature', dataIndex: 'nature_type', key: 'nature_type' },
                { title: 'Balance', dataIndex: 'balance', key: 'balance' },
                { title: 'Created At', dataIndex: 'created_at', key: 'created_at' },
                {
                  title: 'Actions',
                  render: (_, record) => (
                    <Button
                      type="link"
                      onClick={() => {
                        setCurrentAccount(record);
                        handleAddEditAccount();
                      }}
                    >
                      Edit
                    </Button>
                  ),
                },
              ]}
            />

            <Modal
              title={currentAccount ? 'Edit Account' : 'Add Account'}
              visible={isModalVisible}
              onCancel={handleCancel}
              footer={null}
            >
              <Form
                form={form}
                layout="vertical"
                initialValues={currentAccount}
                onFinish={handleSave}
              >
                <Form.Item
                  name="account_name"
                  label="Account Name"
                  rules={[{ required: true, message: 'Please enter account name' }]}
                >
                  <Input placeholder="Enter account name" />
                </Form.Item>

                <Form.Item
                  name="account_type"
                  label="Account Type"
                  rules={[{ required: true, message: 'Please select account type' }]}
                >
                  <Select placeholder="Select account type">
                    {accountTypes.map((item, index) => (
                      <Option key={index} value={item}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="nature_type"
                  label="Nature Type"
                  rules={[{ required: true, message: 'Please select nature type' }]}
                >
                  <Select placeholder="Select nature type">
                    {accountNatureType.map((item, index) => (
                      <Option key={index} value={item}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="balance"
                  label="Balance"
                  rules={[{ required: true, message: 'Please enter balance' }]}
                >
                  <Input type="number" placeholder="Enter balance" />
                </Form.Item>
                <Form.Item
                  name="business_id"
                  label="Business"
                  rules={[{ required: true, message: 'Please enter business id' }]}
                >
                  <Input type="number" placeholder="Enter balance" value={1}/>
                </Form.Item>

                  <Form.Item
                  name="code"
                  label="Code"
                  rules={[{ required: true, message: 'Please enter code' }]}
                >
                  <Input placeholder="Enter code" value={1}/>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AccountManagement;
