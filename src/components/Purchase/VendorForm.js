import React, { useState, useEffect } from 'react';

const VendorForm = ({ initialData = {}, onSave, onCancel }) => {
  const [name, setName] = useState(initialData.name || '');
  const [contactInfo, setContactInfo] = useState(initialData.contactInfo || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return alert("Vendor name is required");

    const vendorData = {
      name,
      contact_info: contactInfo,
      user_id:1
     
    };
    onSave(vendorData);
  };

  return (
    <form className="vendor-form" onSubmit={handleSubmit}>
      <h2>{initialData.id ? "Edit Vendor" : "Add Vendor"}</h2>
      
      <label>
        Vendor Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label>
        Contact Info:
        <input
          type="text"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
        />
      </label>

      <div className="vendor-form-actions">
        <button type="submit">{initialData.id ? "Update" : "Save"}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default VendorForm;
