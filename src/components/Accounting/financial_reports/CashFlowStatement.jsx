import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Table, Button, Typography, Spin, Tabs } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import api from '../../../services/api';
// Correct:

import './reports.css';
import { formatCurrency } from '../../../utils/format';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const CashFlowStatement = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [activeTab, setActiveTab] = useState('operating');

  const fetchCashFlow = async () => {
    if (dateRange.length !== 2) return;
    
    try {
      setLoading(true);
      const response = await api.reportsAPI.getCashFlowStatement(
        dateRange[0].format('YYYY-MM-DD'),
        dateRange[1].format('YYYY-MM-DD')
      );
      setData(response);
    } catch (error) {
      console.error('Error fetching cash flow statement:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange.length === 2) {
      fetchCashFlow();
    }
  }, [dateRange]);

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (value) => formatCurrency(value),
      align: 'right'
    }
  ];

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting cash flow statement...');
  };

  return (
    <div className="report-container">
      <Card
        title={
          <div className="report-header">
            <Title level={4}>Cash Flow Statement</Title>
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
            <div className="cash-flow-statement">
              <div className="report-title">
                <Title level={3}>Cash Flow Statement</Title>
                <Text strong>
                  For the period {dateRange[0].format('MMMM D, YYYY')} to {dateRange[1].format('MMMM D, YYYY')}
                </Text>
              </div>

              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="Operating Activities" key="operating">
                  <Table
                    columns={columns}
                    dataSource={data.operating_activities}
                    pagination={false}
                    size="middle"
                    summary={() => (
                      <Table.Summary.Row>
                        <Table.Summary.Cell>
                          <Text strong>Net Cash from Operating Activities</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <Text strong>
                            {formatCurrency(data.net_cash_operating)}
                          </Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    )}
                  />
                </TabPane>

                <TabPane tab="Investing Activities" key="investing">
                  <Table
                    columns={columns}
                    dataSource={data.investing_activities}
                    pagination={false}
                    size="middle"
                    summary={() => (
                      <Table.Summary.Row>
                        <Table.Summary.Cell>
                          <Text strong>Net Cash from Investing Activities</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <Text strong>
                            {formatCurrency(data.net_cash_investing)}
                          </Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    )}
                  />
                </TabPane>

                <TabPane tab="Financing Activities" key="financing">
                  <Table
                    columns={columns}
                    dataSource={data.financing_activities}
                    pagination={false}
                    size="middle"
                    summary={() => (
                      <Table.Summary.Row>
                        <Table.Summary.Cell>
                          <Text strong>Net Cash from Financing Activities</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <Text strong>
                            {formatCurrency(data.net_cash_financing)}
                          </Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    )}
                  />
                </TabPane>
              </Tabs>

              <div className="cash-flow-summary">
                <Table
                  showHeader={false}
                  pagination={false}
                  dataSource={[
                    {
                      key: 'net_increase',
                      label: 'Net Increase in Cash',
                      value: data.net_increase_cash
                    },
                    {
                      key: 'beginning_cash',
                      label: 'Cash at Beginning of Period',
                      value: data.cash_beginning
                    },
                    {
                      key: 'ending_cash',
                      label: 'Cash at End of Period',
                      value: data.cash_ending
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
                      render: (value) => <Text strong>{formatCurrency(value)}</Text>
                    }
                  ]}
                />
              </div>
            </div>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default CashFlowStatement;