import React, { useState, useEffect } from 'react';
import { Button, Select, Input, DatePicker, InputNumber, Table } from 'antd';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import './styles/JournalEntryForm.css';
import { fetchAccounts } from '../../api/account';

const { Option } = Select;

const JournalEntryForm = ({ token }) => {
  const [accounts, setAccounts] = useState([]);
  const [journalItems, setJournalItems] = useState([
    { account_id: '', partner: '', narration: '', analytic_account: '', debit: '', credit: '' },
  ]);
  const [journalInfo, setJournalInfo] = useState({
    date: null,
    reference: '',
    journal: '',
    company: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (token) {
          const fetchedAccounts = await fetchAccounts(token);
          setAccounts(fetchedAccounts);
        }
      } catch (error) {
        console.error('Failed to load accounts:', error.message);
      }
    };
    loadData();
  }, [token]);

  const handleJournalInfoChange = (e) => {
    setJournalInfo({ ...journalInfo, [e.target.name]: e.target.value });
  };

  const handleJournalItemChange = (index, field, value) => {
    const updatedItems = [...journalItems];
    updatedItems[index][field] = value;
    setJournalItems(updatedItems);
  };

  const addItem = () => {
    setJournalItems([...journalItems, { account_id: '', partner: '', narration: '', analytic_account: '', debit: '', credit: '' }]);
  };

  const removeItem = (index) => {
    setJournalItems(journalItems.filter((_, i) => i !== index));
  };

  const calculateTotal = (type) => {
    return journalItems.reduce((total, item) => total + (parseFloat(item[type]) || 0), 0);
  };

  const handleSubmit = async () => {
    try {
      // Add logic to submit the form
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const columns = [
    {
      title: 'Account',
      dataIndex: 'account_id',
      key: 'account_id',
      render: (text, record, index) => (
        <Select
          placeholder="Select account"
          value={text}
          onChange={(value) => handleJournalItemChange(index, 'account_id', value)}
          required
        >
          {accounts.map((acc) => (
            <Option key={acc.account_id} value={acc.account_id}>
              {acc.account_name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Partner',
      dataIndex: 'partner',
      key: 'partner',
      render: (text, record, index) => (
        <Input
          placeholder="Partner"
          value={text}
          onChange={(e) => handleJournalItemChange(index, 'partner', e.target.value)}
        />
      ),
    },
    {
      title: 'Narration',
      dataIndex: 'narration',
      key: 'narration',
      render: (text, record, index) => (
        <Input
          placeholder="Narration"
          value={text}
          onChange={(e) => handleJournalItemChange(index, 'narration', e.target.value)}
        />
      ),
    },
    {
      title: 'Analytic Account',
      dataIndex: 'analytic_account',
      key: 'analytic_account',
      render: (text, record, index) => (
        <Input
          placeholder="Analytic Account"
          value={text}
          onChange={(e) => handleJournalItemChange(index, 'analytic_account', e.target.value)}
        />
      ),
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      render: (text, record, index) => (
        <InputNumber
          placeholder="Debit"
          value={text}
          onChange={(value) => handleJournalItemChange(index, 'debit', value)}
          min={0}
        />
      ),
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      render: (text, record, index) => (
        <InputNumber
          placeholder="Credit"
          value={text}
          onChange={(value) => handleJournalItemChange(index, 'credit', value)}
          min={0}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record, index) => (
        <Button icon={<DeleteOutlined />} danger onClick={() => removeItem(index)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div className="journal-entry-form">
      <h2>Journal Entry</h2>

      {/* Journal Info Section */}
      <div className="journal-info">
        <label>Date:</label>
        <DatePicker
          value={journalInfo.date}
          onChange={(date) => setJournalInfo({ ...journalInfo, date })}
          required
        />
        <label>Reference:</label>
        <Input
          name="reference"
          value={journalInfo.reference}
          onChange={handleJournalInfoChange}
        />
        <label>Journal:</label>
        <Input
          name="journal"
          value={journalInfo.journal}
          onChange={handleJournalInfoChange}
        />
        <label>Company:</label>
        <Input
          name="company"
          value={journalInfo.company}
          onChange={handleJournalInfoChange}
        />
      </div>

      {/* Journal Items Table */}
      <h3>Journal Items</h3>
      <Table
        columns={columns}
        dataSource={journalItems}
        pagination={false}
        rowKey={(record, index) => index}
      />

      {/* Add Item Button */}
      <Button icon={<PlusCircleOutlined />} onClick={addItem}>
        Add Item
      </Button>

      {/* Total Debit/Credit */}
      <div className="total-section">
        <p>Total Debit: {calculateTotal('debit').toFixed(2)}</p>
        <p>Total Credit: {calculateTotal('credit').toFixed(2)}</p>
        <p>Balance: {(calculateTotal('debit') - calculateTotal('credit')).toFixed(2)}</p>
      </div>

      {/* Save and Discard Buttons */}
      <Button type="primary" onClick={handleSubmit}>
        Save
      </Button>
      <Button danger onClick={() => setJournalItems([])}>
        Discard
      </Button>
    </div>
  );
};

export default JournalEntryForm;
