import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Table, Button, Typography, Spin, Select } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import api from '../../../services/api';
// Correct:

import './reports.css';
import { formatCurrency } from '../../../utils/format';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const GeneralLedger = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.accountsAPI.getAccounts();
        setAccounts(response);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    
    fetchAccounts();
  }, []);

  const fetchGeneralLedger = async () => {
    if (!selectedAccount || dateRange.length !== 2) return;
    
    try {
      setLoading(true);
      const response = await api.journalAPI.getGeneralLedger(
        selectedAccount,
        {
          start_date: dateRange[0].format('YYYY-MM-DD'),
          end_date: dateRange[1].format('YYYY-MM-DD')
        }
      );
      setData(response.entries);
    } catch (error) {
      console.error('Error fetching general ledger:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAccount && dateRange.length === 2) {
      fetchGeneralLedger();
    }
  }, [selectedAccount, dateRange]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'entry_date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Journal Entry',
      dataIndex: 'journal_entry_id',
      key: 'journal_entry'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      render: (value) => value > 0 ? formatCurrency(value) : '-',
      align: 'right'
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      render: (value) => value > 0 ? formatCurrency(value) : '-',
      align: 'right'
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: formatCurrency,
      align: 'right'
    }
  ];

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting general ledger...');
  };

  return (
    <div className="report-container">
      <Card
        title={
          <div className="report-header">
            <Title level={4}>General Ledger</Title>
            <div className="report-controls">
              <Select
                placeholder="Select Account"
                style={{ width: 300, marginRight: 16 }}
                onChange={setSelectedAccount}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {accounts.map(account => (
                  <Option key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </Option>
                ))}
              </Select>
              <RangePicker
                onChange={setDateRange}
                style={{ width: 300, marginRight: 16 }}
              />
              <Button 
                type="primary" 
                icon={<DownloadOutlined />}
                onClick={handleExport}
                disabled={!data.length}
              >
                Export
              </Button>
            </div>
          </div>
        }
      >
        <Spin spinning={loading}>
          {selectedAccount && data.length > 0 && (
            <div className="general-ledger">
              <div className="report-title">
                <Title level={3}>General Ledger</Title>
                <Text strong>
                  Account: {accounts.find(a => a.id === selectedAccount)?.name}
                </Text>
                <br />
                <Text>
                  Period: {dateRange[0].format('MMMM D, YYYY')} to {dateRange[1].format('MMMM D, YYYY')}
                </Text>
              </div>

              <div className="ledger-summary">
                <Text strong>
                  Beginning Balance: {formatCurrency(data[0].balance - data[0].debit + data[0].credit)}
                </Text>
                <br />
                <Text strong>
                  Ending Balance: {formatCurrency(data[data.length - 1].balance)}
                </Text>
              </div>

              <Table
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: 20 }}
                size="middle"
                rowKey="id"
              />
            </div>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default GeneralLedger;