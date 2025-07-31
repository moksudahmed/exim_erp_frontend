import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions, Spin } from 'antd';
import InvoiceGenerator from '../components/pos/InvoiceGenerator';
//import { fetchSales } from '../api/salesApi'; // ✅ renamed (no "use" prefix)

const SaleDetailsPage = ({ saleData }) => {  

  if (!saleData) return <div>No sale data found.</div>;

  return (
    <div>
      <Card title="Sale Details">
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Customer">{saleData.customerName}</Descriptions.Item>
          <Descriptions.Item label="Date">{saleData.date}</Descriptions.Item>
          <Descriptions.Item label="Total Amount">
            ${saleData.totalAmount?.toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label="Status">{saleData.status}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default SaleDetailsPage;
