import React, { useState, useEffect, useRef } from 'react';
import { Card, DatePicker, Table, Button, Typography, Spin, Dropdown, Menu } from 'antd';
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined, FileTextOutlined } from '@ant-design/icons';
import './reports.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { getBalanceSheet } from '../../../api/reports';
import { formatCurrency } from '../../../utils/format';

const { Title, Text } = Typography;

const BalanceSheet = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [asOfDate, setAsOfDate] = useState(null);
  const reportRef = useRef(null);

  const fetchBalanceSheet = async () => {
    if (!asOfDate) return;
    
    try {
      setLoading(true);
      const response = await getBalanceSheet(token, asOfDate.format('YYYY-MM-DD'), 'BALANCE_SHEET');
      console.log(response);
      setReportData(response);
    } catch (error) {
      console.error('Error fetching balance sheet:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (asOfDate) {
      fetchBalanceSheet();
    }
  }, [asOfDate]);

  // Extract nested data for easier access
  const balanceData = reportData?.data || {};
  const { assets = [], liabilities = [], equity = [], totals = {} } = balanceData;
  const reportDate = balanceData.as_of_date ? moment(balanceData.as_of_date) : asOfDate;

  const assetColumns = [
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
      //render: formatCurrency,
      render: (value) => formatCurrency(Math.abs(value)),
      align: 'right'
    }
  ];

  const liabilityEquityColumns = [
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
      render: (value) => formatCurrency(Math.abs(value)),
      align: 'right'
    }
  ];

  // ===================== EXPORT HANDLERS =====================
  const exportToCSV = () => {
    if (!reportData || !balanceData) return;
    setExporting(true);
    
    try {
      const { assets, liabilities, equity, totals } = balanceData;
      const formattedDate = reportDate.format('MMMM D, YYYY');
      
      let csvContent = "Balance Sheet\n";
      csvContent += `As of ${formattedDate}\n\n`;
      
      // Assets section
      csvContent += "Assets\nAccount,Amount\n";
      assets.forEach(item => {
        csvContent += `"${item.account_code} - ${item.account_name}",${formatCurrency(item.balance, '$', false)}\n`;
      });
      csvContent += `Total Assets,${formatCurrency(totals.assets, '$', false)}\n\n`;
      
      // Liabilities section
      csvContent += "Liabilities\nAccount,Amount\n";
      liabilities.forEach(item => {
        csvContent += `"${item.account_code} - ${item.account_name}",${formatCurrency(Math.abs(item.balance), '$', false)}\n`;
      });
      csvContent += `Total Liabilities,${formatCurrency(Math.abs(totals.liabilities), '$', false)}\n\n`;
      
      // Equity section
      csvContent += "Equity\nAccount,Amount\n";
      equity.forEach(item => {
        csvContent += `"${item.account_code} - ${item.account_name}",${formatCurrency(Math.abs(item.balance), '$', false)}\n`;
      });
      csvContent += `Total Equity,${formatCurrency(Math.abs(totals.equity), '$', false)}\n\n`;
      
      // Totals
      csvContent += `Total Liabilities and Equity,${formatCurrency(Math.abs(totals.liabilities_equity), '$', false)}\n`;
      
      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `balance_sheet_${reportDate.format('YYYYMMDD')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportToExcel = () => {
    if (!reportData || !balanceData) return;
    setExporting(true);
    
    try {
      const { assets, liabilities, equity, totals } = balanceData;
      const formattedDate = reportDate.format('YYYYMMDD');
      const displayDate = reportDate.format('MMMM D, YYYY');
      
      const wb = XLSX.utils.book_new();
      
      // Assets sheet
      const assetsData = [
        ['Assets'],
        ['Account', 'Amount'],
        ...assets.map(item => [
          `${item.account_code} - ${item.account_name}`,
          item.balance
        ]),
        ['Total Assets', totals.assets]
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(assetsData), 'Assets');
      
      // Liabilities sheet
      const liabilitiesData = [
        ['Liabilities'],
        ['Account', 'Amount'],
        ...liabilities.map(item => [
          `${item.account_code} - ${item.account_name}`,
          Math.abs(item.balance)
        ]),
        ['Total Liabilities', Math.abs(totals.liabilities)]
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(liabilitiesData), 'Liabilities');
      
      // Equity sheet
      const equityData = [
        ['Equity'],
        ['Account', 'Amount'],
        ...equity.map(item => [
          `${item.account_code} - ${item.account_name}`,
          Math.abs(item.balance)
        ]),
        ['Total Equity', Math.abs(totals.equity)]
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(equityData), 'Equity');
      
      // Summary sheet
      const summaryData = [
        ['Balance Sheet Summary'],
        ['As of', displayDate],
        [],
        ['Section', 'Amount'],
        ['Total Assets', totals.assets],
        ['Total Liabilities', Math.abs(totals.liabilities)],
        ['Total Equity', Math.abs(totals.equity)],
        [],
        ['Total Liabilities and Equity', Math.abs(totals.liabilities_equity)]
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), 'Summary');
      
      XLSX.writeFile(wb, `balance_sheet_${formattedDate}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = () => {
    if (!reportData || !balanceData) return;
    setExporting(true);
    
    try {
      const { assets, liabilities, equity, totals } = balanceData;
      const formattedDate = reportDate.format('MMMM D, YYYY');
      
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      
      // Header
      doc.setFontSize(16);
      doc.text('Balance Sheet', 105, 15, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`As of ${formattedDate}`, 105, 22, { align: 'center' });
      
      // Assets table
      doc.setFontSize(14);
      doc.text('Assets', 15, 30);
      const assetsTableData = assets.map(item => [
        `${item.account_code} - ${item.account_name}`,
        formatCurrency(item.balance, '$', false)
      ]);
      assetsTableData.push(['Total Assets', formatCurrency(totals.assets, '$', false)]);
      
      doc.autoTable({
        startY: 35,
        head: [['Account', 'Amount']],
        body: assetsTableData,
        theme: 'grid',
        headStyles: { fillColor: [241, 241, 241] },
        columnStyles: { 1: { halign: 'right' } }
      });
      
      // Liabilities table
      const liabilitiesY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text('Liabilities', 15, liabilitiesY);
      const liabilitiesTableData = liabilities.map(item => [
        `${item.account_code} - ${item.account_name}`,
        formatCurrency(Math.abs(item.balance), '$', false)
      ]);
      liabilitiesTableData.push(['Total Liabilities', formatCurrency(Math.abs(totals.liabilities), '$', false)]);
      
      doc.autoTable({
        startY: liabilitiesY + 5,
        head: [['Account', 'Amount']],
        body: liabilitiesTableData,
        theme: 'grid',
        headStyles: { fillColor: [241, 241, 241] },
        columnStyles: { 1: { halign: 'right' } }
      });
      
      // Equity table
      const equityY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text('Equity', 15, equityY);
      const equityTableData = equity.map(item => [
        `${item.account_code} - ${item.account_name}`,
        formatCurrency(Math.abs(item.balance), '$', false)
      ]);
      equityTableData.push(['Total Equity', formatCurrency(Math.abs(totals.equity), '$', false)]);
      
      doc.autoTable({
        startY: equityY + 5,
        head: [['Account', 'Amount']],
        body: equityTableData,
        theme: 'grid',
        headStyles: { fillColor: [241, 241, 241] },
        columnStyles: { 1: { halign: 'right' } }
      });
      
      // Totals section
      const totalsY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text('Totals', 15, totalsY);
      
      doc.autoTable({
        startY: totalsY + 5,
        body: [
          ['Total Assets', formatCurrency(totals.assets, '$', false)],
          ['Total Liabilities', formatCurrency(Math.abs(totals.liabilities), '$', false)],
          ['Total Equity', formatCurrency(Math.abs(totals.equity), '$', false)],
          ['Total Liabilities and Equity', formatCurrency(Math.abs(totals.liabilities_equity), '$', false)]
        ],
        theme: 'grid',
        styles: { fontStyle: 'bold' },
        columnStyles: { 1: { halign: 'right' } }
      });
      
      doc.save(`balance_sheet_${reportDate.format('YYYYMMDD')}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleExport = (type) => {
    switch (type) {
      case 'csv': exportToCSV(); break;
      case 'excel': exportToExcel(); break;
      case 'pdf': exportToPDF(); break;
      default: console.warn('Unknown export type:', type);
    }
  };

  const exportMenu = (
    <Menu onClick={({ key }) => handleExport(key)}>
      <Menu.Item key="csv" icon={<FileTextOutlined />}>Export as CSV</Menu.Item>
      <Menu.Item key="excel" icon={<FileExcelOutlined />}>Export as Excel</Menu.Item>
      <Menu.Item key="pdf" icon={<FilePdfOutlined />}>Export as PDF</Menu.Item>
    </Menu>
  );

  return (
    <div className="report-container">
      <Card
        title={
          <div className="report-header">
            <Title level={4}>Balance Sheet</Title>
            <div className="report-controls">
              <DatePicker
                picker="date"
                format="YYYY-MM-DD"
                onChange={setAsOfDate}
                placeholder="Select date"
                style={{ width: 200, marginRight: 16 }}
              />
              <Dropdown 
                overlay={exportMenu} 
                trigger={['click']}
                disabled={!reportData || exporting}
              >
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />}
                  loading={exporting}
                >
                  Export
                </Button>
              </Dropdown>
            </div>
          </div>
        }
      >
        <Spin spinning={loading || exporting}>
          {reportData && balanceData && (
            <div className="balance-sheet" ref={reportRef}>
              <div className="report-title">
                <Title level={3}>Balance Sheet</Title>
                <Text strong>As of {reportDate.format('MMMM D, YYYY')}</Text>
              </div>

              {/* Assets Section */}
              <div className="balance-sheet-section">
                <Title level={4}>Assets</Title>
                <Table
                  columns={assetColumns}
                  dataSource={assets}
                  pagination={false}
                  size="middle"
                  rowKey="account_id"
                  summary={() => (
                    <Table.Summary.Row>
                      <Table.Summary.Cell>
                        <Text strong>Total Assets</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text strong>{formatCurrency(totals.assets)}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                />
              </div>

              {/* Liabilities Section */}
              <div className="balance-sheet-section">
                <Title level={4}>Liabilities</Title>
                <Table
                  columns={liabilityEquityColumns}
                  dataSource={liabilities}
                  pagination={false}
                  size="middle"
                  rowKey="account_id"
                  summary={() => (
                    <Table.Summary.Row>
                      <Table.Summary.Cell>
                        <Text strong>Total Liabilities</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text strong>{formatCurrency(Math.abs(totals.liabilities))}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                />
              </div>

              {/* Equity Section */}
              <div className="balance-sheet-section">
                <Title level={4}>Equity</Title>
                <Table
                  columns={liabilityEquityColumns}
                  dataSource={equity}
                  pagination={false}
                  size="middle"
                  rowKey="account_id"
                  summary={() => (
                    <Table.Summary.Row>
                      <Table.Summary.Cell>
                        <Text strong>Total Equity</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text strong>{formatCurrency(Math.abs(totals.equity))}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                />
              </div>

              {/* Grand Total */}
              <div className="balance-sheet-totals">
                <Text strong>
                  Total Liabilities and Equity: {formatCurrency(Math.abs(totals.liabilities_equity))}
                </Text>
              </div>
            </div>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default BalanceSheet;