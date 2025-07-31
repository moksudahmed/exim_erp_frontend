import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Table, Button, Typography, Spin, Row, Col } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import api from '../../../services/api';
// Correct:

import './reports.css';
import { formatCurrency } from '../../../utils/format';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const IncomeStatement = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [dateRange, setDateRange] = useState([]);

  const fetchIncomeStatement = async () => {
    if (dateRange.length !== 2) return;
    
    try {
      setLoading(true);
      const response = await api.reportsAPI.getIncomeStatement(
        dateRange[0].format('YYYY-MM-DD'),
        dateRange[1].format('YYYY-MM-DD')
      );
      setData(response);
    } catch (error) {
      console.error('Error fetching income statement:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange.length === 2) {
      fetchIncomeStatement();
    }
  }, [dateRange]);

  const columns = [
    {
      title: 'Account',
      dataIndex: 'account_name',
      key: 'account_name',
      render: (text, record) => `${record.account_code} - ${text}`
    },
    {
      title: 'Amount',
      dataIndex: 'balance',
      key: 'balance',
      render: (value, record) => (
        <Text type={record.account_type === 'REVENUE' ? 'success' : 'danger'}>
          {formatCurrency(Math.abs(value))}
        </Text>
      ),
      align: 'right'
    }
  ];

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting income statement...');
  };

  return (
    <div className="report-container">
      <Card
        title={
          <div className="report-header">
            <Title level={4}>Income Statement</Title>
            <div className="report-controls">
              <RangePicker
                onChange={setDateRange}
                style={{ width: 300, marginRight: 16 }}
              />
              <Button 
                type="primary" 
                icon={<DownloadOutlined />}
                onClick={handleExport}
                disabled={!data}
              >
                Export
              </Button>
            </div>
          </div>
        }
      >
        <Spin spinning={loading}>
          {data && (
            <div className="income-statement">
              <div className="report-title">
                <Title level={3}>Income Statement</Title>
                <Text strong>
                  For the period {dateRange[0].format('MMMM D, YYYY')} to {dateRange[1].format('MMMM D, YYYY')}
                </Text>
              </div>

              <div className="income-section">
                <Title level={4}>Revenue</Title>
                <Table
                  columns={columns}
                  dataSource={data.revenues}
                  pagination={false}
                  size="middle"
                  summary={() => (
                    <Table.Summary.Row>
                      <Table.Summary.Cell>
                        <Text strong>Total Revenue</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text strong type="success">
                          {formatCurrency(data.total_revenue)}
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                />
              </div>

              <div className="income-section">
                <Title level={4}>Expenses</Title>
                <Table
                  columns={columns}
                  dataSource={data.expenses}
                  pagination={false}
                  size="middle"
                  summary={() => (
                    <Table.Summary.Row>
                      <Table.Summary.Cell>
                        <Text strong>Total Expenses</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text strong type="danger">
                          {formatCurrency(data.total_expenses)}
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                />
              </div>

              <Row justify="end" className="net-income-row">
                <Col span={8}>
                  <Table
                    showHeader={false}
                    pagination={false}
                    dataSource={[
                      {
                        key: 'net_income',
                        label: 'Net Income',
                        value: data.net_income,
                        type: data.net_income >= 0 ? 'success' : 'danger'
                      }
                    ]}
                    columns={[
                      {
                        dataIndex: 'label',
                        key: 'label',
                        render: (text) => <Text strong>{text}</Text>
                      },
                      {
                        dataIndex: 'value',
                        key: 'value',
                        align: 'right',
                        render: (value, record) => (
                          <Text strong type={record.type}>
                            {formatCurrency(value)}
                          </Text>
                        )
                      }
                    ]}
                  />
                </Col>
              </Row>
            </div>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default IncomeStatement;