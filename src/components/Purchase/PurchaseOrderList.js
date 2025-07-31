import { Table, Button, Modal, message } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';

const PurchaseOrderList = ({ purchaseOrders, onReceive, onView, onCancel, selectedOrder, onComplete }) => {

  const handleOnView = async (orderId) => {
    try {    
      onView(orderId)  
      Modal.info({
        title: 'Order Details',
        content: (
          <div>
            <p>Order ID: {selectedOrder.id}</p>
            <p>Vendor ID: {selectedOrder.client_id}</p>
            <p>Date: {selectedOrder.date}</p>
            <p>Total Amount: {selectedOrder.total_amount}</p>
            <p>Status: {selectedOrder.status}</p>
            <p>Items:</p>
            <ul>
              {selectedOrder.items.map(item => (
                <li key={item.product_id}>
                  Product ID: {item.product_id}, Quantity: {item.quantity}, Cost per Unit: {item.cost_per_unit}
                </li>
              ))}
            </ul>
          </div>
        ),
      });
    } catch (error) {
      message.error('Failed to load order details');
    }
  };


  const columns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Vendor', dataIndex: 'client_id', key: 'client_id' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Total', dataIndex: 'total_amount', key: 'total_amount' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      render: (text, record) => (
        <>
          <Button onClick={() => handleOnView(record.id)}>View</Button>
          <Button onClick={() => onReceive(record.id)} disabled={record.status !== 'PENDING'}>
            Receive
          </Button>
          <Button onClick={() => onCancel(record.id)} disabled={record.status === 'COMPLETED'}>
            Cancel
          </Button>
          <Button onClick={() => onComplete(record.id)} disabled={record.status === 'CANCEL'}>
            Complete
          </Button>          
        </>
      ),
    },
  ];

  return <Table dataSource={purchaseOrders} columns={columns} rowKey="id" />;
};

export default PurchaseOrderList;
