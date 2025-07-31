// src/components/InvoiceGenerator.tsx
import React, { useState } from 'react';
import { Button, message, Modal } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';


const InvoiceGenerator = ({businessId,saleId}) => {
   const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState('');

  const handleGenerateInvoice = async (preview = false) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/businesses/${businessId}/sales/${saleId}/invoice`,
        { include_tax: true },
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      if (preview) {
        setInvoiceUrl(url);
        setPreviewVisible(true);
      } else {
        const filename = `invoice_${saleId}.pdf`;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }

      message.success('Invoice generated successfully');
    } catch (error) {
      message.error('Failed to generate invoice');
      console.error('Invoice generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={() => handleGenerateInvoice(false)}
        loading={loading}
      >
        Download
      </Button>

      <Button
        icon={<EyeOutlined />}
        onClick={() => handleGenerateInvoice(true)}
        loading={loading}
      >
        Preview
      </Button>

      <Modal
        title="Invoice Preview"
        open={previewVisible}
        width="80%"
        footer={null}
        onCancel={() => {
          setPreviewVisible(false);
          window.URL.revokeObjectURL(invoiceUrl);
        }}
        destroyOnClose
      >
        {invoiceUrl && (
          <iframe
            src={invoiceUrl}
            style={{ width: '100%', height: '80vh', border: 'none' }}
            title="Invoice Preview"
          />
        )}
      </Modal>
    </div>
  );
};

export default InvoiceGenerator;

