import React from 'react';
import { Table } from 'antd';

const AccountsPayableList = ({ accountsPayable }) => {
  const columns = [
    { title: 'Order ID', dataIndex: 'purchaseOrderId', key: 'purchaseOrderId' },
    { title: 'Vendor', dataIndex: 'vendorName', key: 'vendorName' },
    { title: 'Amount Due', dataIndex: 'amountDue', key: 'amountDue' },
    { title: 'Amount Paid', dataIndex: 'amountPaid', key: 'amountPaid' },
    { title: 'Outstanding Balance', dataIndex: 'balance', key: 'balance' },
  ];

  return <Table dataSource={accountsPayable} columns={columns} />;
};
