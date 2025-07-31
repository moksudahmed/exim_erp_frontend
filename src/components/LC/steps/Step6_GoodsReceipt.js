import React from 'react';
import { Card, Form, Input, DatePicker, Button, Space, Select, message } from 'antd';
import dayjs from 'dayjs';
import { addGoodsReceipt } from '../../../api/lc';

const { Option } = Select;

const Step6_GoodsReceipt = ({ data, onNext, onPrev, warehouses, token }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        lc_id: data.id,
        receipt_date: values.receipt_date.format('YYYY-MM-DD'),
        warehouse_id: values.warehouse_id,
        receiver_name: values.receiver_name,
        remarks: values.remarks || '',
      };

      await addGoodsReceipt(payload, token);
      message.success('L/C Goods Receipt submitted successfully!');
      onNext({ goods_receipt: payload }); // Update parent state
    } catch (error) {
      message.error('Please complete all required fields before submitting.');
    }
  };

  return (
    <Card title="Step 6: Goods Receipt">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          receipt_date: data.goods_receipt?.receipt_date
            ? dayjs(data.goods_receipt.receipt_date)
            : null,
          warehouse_id: data.goods_receipt?.warehouse_id || undefined,
          receiver_name: data.goods_receipt?.receiver_name || '',
          remarks: data.goods_receipt?.remarks || '',
        }}
      >
        <Form.Item
          name="receipt_date"
          label="Receipt Date"
          rules={[{ required: true, message: 'Please select receipt date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="warehouse_id"
          label="Warehouse"
          rules={[{ required: true, message: 'Please select a warehouse' }]}
        >
          <Select placeholder="Select Warehouse" allowClear>
            {warehouses?.map((wh) => (
              <Option key={wh.id} value={wh.id}>
                {wh.warehouse_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="receiver_name"
          label="Receiver Name"
          rules={[{ required: true, message: 'Please enter receiver name' }]}
        >
          <Input placeholder="Enter receiver name" />
        </Form.Item>

        <Form.Item name="remarks" label="Remarks">
          <Input.TextArea placeholder="Optional remarks" rows={3} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button onClick={onPrev}>Previous</Button>
            <Button type="primary" onClick={handleSubmit}>
              Submit & Next
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Step6_GoodsReceipt;
