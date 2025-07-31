import React, { useEffect, useState } from 'react';
import VendorForm from './VendorForm';

const VendorList = ({ vendors, onEdit, onDelete, onAdd }) => {
  const [selectedVendor, setSelectedVendor] = useState(null);

  const handleAddVendor = () => setSelectedVendor({});
  const handleEditVendor = (vendor) => setSelectedVendor(vendor);
  const handleCancel = () => setSelectedVendor(null);

  return (
    <div className="vendor-list">
      <header>
        <h2>Vendors</h2>
        <button onClick={handleAddVendor}>Add Vendor</button>
      </header>

      {selectedVendor && (
        <VendorForm
          initialData={selectedVendor}
          onSave={(data) => {
            if (selectedVendor.id) onEdit(selectedVendor.id, data);
            else onAdd(data);
            setSelectedVendor(null);
          }}
          onCancel={handleCancel}
        />
      )}

      <ul>
        {vendors.map((vendor) => (
          <li key={vendor.id}>
            <div className="vendor-details">
              <h3>{vendor.name}</h3>
              <p>{vendor.contact_info}</p>
            </div>
            <button onClick={() => handleEditVendor(vendor)}>Edit</button>
            <button onClick={() => onDelete(vendor.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VendorList;
