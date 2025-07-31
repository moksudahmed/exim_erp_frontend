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

const TaxReports = () => {
  const [loading, setLoading] = useState(false);
  const [taxLiability, setTaxLiability] = useState([]);
  const [taxRates, setTaxRates] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [activeTab, setActiveTab] = useState('liability');

  useEffect(() => {
    const fetchTaxRates = async () => {
      try {
        const response = await api.taxAPI.getTaxRates();
        setTaxRates(response);
      } catch (error) {
        console.error('Error fetching tax rates:', error);
      }
    };
    
    fetchTaxRates();
  }, []);

  const fetchTaxLiability = async () => {
    if (dateRange.length !== 2) return;
    
    try {
      setLoading(true);
      const response = await api.taxAPI.getTaxLiability(
        dateRange[0].format('YYYY-MM-DD'),
        dateRange[1].format('YYYY-MM-DD')
      );
      setTaxLiability(response);
    } catch (error) {
      console.error('Error fetching tax liability:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange.length === 2 && activeTab === 'liability') {
      fetchTaxLiability();
    }
  }, [dateRange, activeTab]);

  const liabilityColumns = [
    {
      title: 'Tax Rate',
      dataIndex: 'tax_rate_name',
      key: 'tax_rate'
    },
    {
      title: 'Taxable Amount',
      dataIndex: 'taxable_amount',
      key: 'taxable_amount',
      render: formatCurrency,
      align: 'right'
    },
    {
      title: 'Tax Amount',
      dataIndex: 'tax_amount',
      key: 'tax_amount',
      render: formatCurrency,
      align: 'right'
    }
  ];

  const taxRateColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate) => `${rate}%`,
      align: 'right'
    },
    {
      title: 'Applies To',
      dataIndex: 'applies_to',
      key: 'applies_to',
      render: (types) => types.join(', ')
    }
  ];

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting tax report...');
  };

  return (
    <div className="report-container">
      <Card
        title={
          <div className="report-header">
            <Title level={4}>Tax Reports</Title>
            <div className="report-controls">
              {activeTab === 'liability' && (
                <RangePicker
                  onChange={setDateRange}
                  style={{ width: 300, marginRight: 16 }}
                />
              )}
              <Button 
                type="primary" 
                icon={<DownloadOutlined />}
                onClick={handleExport}
                disabled={activeTab === 'liability' && !taxLiability.length}
              >
                Export
              </Button>
            </div>
          </div>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Tax Liability" key="liability">
            <Spin spinning={loading}>
              {dateRange.length === 2 && taxLiability.length > 0 && (
                <div className="tax-report">
                  <div className="report-title">
                    <Title level={3}>Tax Liability Report</Title>
                    <Text strong>
                      For the period {dateRange[0].format('MMMM D, YYYY')} to {dateRange[1].format('MMMM D, YYYY')}
                    </Text>
                  </div>

                  <Table
                    columns={liabilityColumns}
                    dataSource={taxLiability}
                    pagination={false}
                    size="middle"
                    summary={() => {
                      const totalTaxable = taxLiability.reduce((sum, item) => sum + item.taxable_amount, 0);
                      const totalTax = taxLiability.reduce((sum, item) => sum + item.tax_amount, 0);

                      return (
                        <Table.Summary.Row>
                          <Table.Summary.Cell>
                            <Text strong>Total</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell>
                            <Text strong>{formatCurrency(totalTaxable)}</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell>
                            <Text strong>{formatCurrency(totalTax)}</Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      );
                    }}
                  />
                </div>
              )}
            </Spin>
          </TabPane>

          <TabPane tab="Tax Rates" key="rates">
            <div className="tax-rates">
              <Title level={3}>Tax Rates</Title>
              
              <Table
                columns={taxRateColumns}
                dataSource={taxRates}
                rowKey="id"
                pagination={false}
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default TaxReports;