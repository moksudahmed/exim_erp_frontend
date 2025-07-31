import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Table, Button, Typography, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import api from '../../../services/api';
// Correct:

import './reports.css';
import { formatCurrency } from '../../../utils/format';

const { Title, Text } = Typography;

const TrialBalance = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [asOfDate, setAsOfDate] = useState(null);

  const fetchTrialBalance = async () => {
    if (!asOfDate) return;
    
    try {
      setLoading(true);
      const response = await api.reportsAPI.getTrialBalance(asOfDate.format('YYYY-MM-DD'));
      setData(response);
    } catch (error) {
      console.error('Error fetching trial balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (asOfDate) {
      fetchTrialBalance();
    }
  }, [asOfDate]);

  const columns = [
    {
      title: 'Account',
      dataIndex: 'account_name',
      key: 'account_name',
      render: (text, record) => `${record.account_code} - ${text}`
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      render: formatCurrency,
      align: 'right'
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      render: formatCurrency,
      align: 'right'
    }
  ];

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting trial balance...');
  };

  return (
    <div className="report-container">
      <Card
        title={
          <div className="report-header">
            <Title level={4}>Trial Balance</Title>
            <div className="report-controls">
              <DatePicker
                picker="date"
                format="YYYY-MM-DD"
                onChange={setAsOfDate}
                placeholder="Select date"
                style={{ width: 200, marginRight: 16 }}
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
          {data.length > 0 && (
            <div className="trial-balance">
              <div className="report-title">
                <Title level={3}>Trial Balance</Title>
                <Text strong>As of {asOfDate.format('MMMM D, YYYY')}</Text>
              </div>

              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                size="middle"
                summary={() => {
                  const totalDebit = data.reduce((sum, item) => sum + item.debit, 0);
                  const totalCredit = data.reduce((sum, item) => sum + item.credit, 0);

                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell>
                        <Text strong>Total</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text strong>{formatCurrency(totalDebit)}</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text strong>{formatCurrency(totalCredit)}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  );
                }}
              />
            </div>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default TrialBalance;