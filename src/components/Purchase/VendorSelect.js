import React from 'react';
import { Select } from 'antd';

const VendorSelect = ({ vendors, onChange }) => (
  <Select placeholder="Select Vendor" onChange={onChange}>
    {vendors.map((vendor) => (
      <Select.Option key={vendor.id} value={vendor.id}>
        {vendor.name}
      </Select.Option>
    ))}
  </Select>
);
