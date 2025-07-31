import React, { useState } from 'react';
import { Modal, Button, Table, InputNumber } from 'antd';

const InventoryUpdate = ({ orderItems, onReceive, visible, onClose }) => {
  const [updatedItems, setUpdatedItems] = useState(orderItems);

  const handleQuantityChange = (index, quantity) => {
    const items = [...updatedItems];
    items[index].quantityReceived = quantity;
    setUpdatedItems(items);
  };

  const handleConfirm = () => {
    onReceive(updatedItems);
    onClose();
  };

  return (
    <Modal visible={visible} onCancel={onClose} onOk={handleConfirm} title="Receive Inventory">
      <Table
        dataSource={updatedItems}
        columns={[
          { title: 'Product', dataIndex: 'productName', key: 'productName' },
          { title: 'Ordered Quantity', dataIndex: 'quantity', key: 'quantity' },
          {
            title: 'Received Quantity',
            render: (_, record, index) => (
              <InputNumber
                min={0}
                max={record.quantity}
                value={record.quantityReceived}
                onChange={(value) => handleQuantityChange(index, value)}
              />
            ),
          },
        ]}
      />
    </Modal>
  );
};
