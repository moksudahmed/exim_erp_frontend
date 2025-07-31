import React, { useState } from 'react';
//import { Table, Button, Input, Select, message, DatePicker } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { fetchAccounts} from '../../api/account';
import './styles/JournalItemsForm.css';
import { saveJournalItems } from '../../api/journal_entries';
import { Table, Button, Input, Select, message, DatePicker } from 'antd';


const { Option } = Select;

const CreateLedgerWithEntryForm = ({ token, accounts }) => {
  const [journalItems, setJournalItems] = useState([]);
  const [transaction_date, setTransactionDate] = useState(new Date());
  const [refNo, setRefNo] = useState('');
  const [journal, setJournal] = useState('Miscellaneous Operations (KWD)');
  const [company, setCompany] = useState('General Demo');
  const [description, setDescription] = useState('');
  const [accountType, setAccountType] = useState('asset');


  const handleAddItem = (type) => {
    setJournalItems([
      ...journalItems,
      {
        account_id: '',
        narration: '',
        debitcredit: type,
        amount: 0,
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    setJournalItems(journalItems.filter((_, i) => i !== index));
  };

  const handleJournalItemChange = (index, field, value) => {
    const updatedItems = [...journalItems];
    updatedItems[index][field] = value;
    setJournalItems(updatedItems);
  };

  const calculateTotal = (type) =>
    journalItems.reduce((total, item) => total + (item.debitcredit === type ? parseFloat(item.amount) || 0 : 0), 0);

  const handleSubmit = async () => {
    const payload = {
      ref_no: refNo,
      account_type: accountType,
      journal,
      company,
      description,
      transaction_date: transaction_date,
      user_id: 1,
      journal_items: journalItems,
    };
    try {
      console.log(payload);
      await saveJournalItems(token, payload);
      message.success('Journal entry saved successfully');
      resetForm();
    } catch (error) {
      message.error('Failed to save journal items');
    }
  };

  const resetForm = () => {
    setJournalItems([]);
    setTransactionDate(new Date());
    setRefNo('');
  };
  const columns = [
    {
      title: 'Account',
      dataIndex: 'account_id',
      key: 'account_id',
      render: (value, record, index) => (
        <Select
          style={{ width: '100%' }}
          value={value}
          onChange={(val) => handleJournalItemChange(index, 'account_id', val)}
          placeholder="Select Account"
          dropdownMatchSelectWidth={false}
          showSearch
          optionFilterProp="children"
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
      title: 'Narration',
      dataIndex: 'narration',
      key: 'narration',
      render: (value, record, index) => (
        <Input
          value={value}
          onChange={(e) => handleJournalItemChange(index, 'narration', e.target.value)}
          placeholder="Enter narration"
        />
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (value, record, index) => (
        <Input
          type="number"
          min={0}
          value={value}
          onChange={(e) => handleJournalItemChange(index, 'amount', e.target.value)}
          placeholder="0.00"
        />
      ),
    },
    {
      title: 'Type',
      dataIndex: 'debitcredit',
      key: 'debitcredit',
      render: (value) => <strong>{value}</strong>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record, index) => (
        <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleRemoveItem(index)} />
      ),
    },
  ];
  const columns2 = [
    {
      title: 'Account',
      dataIndex: 'account',
      key: 'account',
      render: (_, record, index) => (
        <Select
          value={record.account_id}
          onChange={(value) => handleJournalItemChange(index, 'account_id', value)}
          placeholder="Select Account"
        >
          {accounts.map((account) => (
            <Option key={account.account_id} value={account.account_id}>
              {account.account_name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Narration',
      dataIndex: 'narration',
      key: 'narration',
      render: (_, record, index) => (
        <Input
          value={record.narration}
          onChange={(e) => handleJournalItemChange(index, 'narration', e.target.value)}
        />
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (_, record, index) => (
        <Input
          value={record.amount}
          type="number"
          min={0}
          onChange={(e) => handleJournalItemChange(index, 'amount', e.target.value)}
        />
      ),
    },
    {
      title: '',
      key: 'action',
      render: (_, record, index) => (
        <Button onClick={() => handleRemoveItem(index)} icon={<DeleteOutlined />} danger />
      ),
    },
  ];


  const totalDebit = calculateTotal('DEBIT');
  const totalCredit = calculateTotal('CREDIT');
  const balance = totalDebit - totalCredit;

  return (
    <div className="journal-entry-form">
      <div className="header-actions">
        <Button type="primary" onClick={handleSubmit}>Post Entry</Button>
        <Button type="default" onClick={resetForm}>Duplicate</Button>
      </div>

      <div className="journal-info">
        <div>
          <label>Date</label>
          <input type="date" value={transaction_date} onChange={(e) => setTransactionDate(e.target.value)} />          
        </div>
        <div>
          <label>Reference</label>
          <Input placeholder="RCPT#2367" value={refNo} onChange={(e) => setRefNo(e.target.value)} />
        </div>
        <div>
          <label>Journal</label>
          <Input placeholder="Miscellaneous Operations (KWD)" value={journal} onChange={(e) => setJournal(e.target.value)} />
        </div>
        <div>
          <label>Company</label>
          <Input placeholder="General Demo" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div>
          <label>Description</label>
          <Input placeholder=" " value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        
      </div>

      <h3>Journal Items</h3>
      <Table
        dataSource={journalItems}
        columns={columns}
        pagination={false}
        bordered
        rowKey={(record, index) => index}
      />
      <div className="add-item-buttons">
      <Button className="add-debit-button" type="link" onClick={() => handleAddItem('DEBIT')}>
        + Add Debit Item
      </Button>
      <Button className="add-credit-button" type="link" onClick={() => handleAddItem('CREDIT')}>
        + Add Credit Item
      </Button>
    </div>

      <div className="footer-summary">
        <p>Total Debit: <span>{totalDebit.toFixed(2)} Tk</span></p>
        <p>Total Credit: <span>{totalCredit.toFixed(2)} Tk</span></p>
        <p>Balance: <span>{balance.toFixed(2)} Tk</span></p>
      </div>

      <div className="footer-buttons">
        <Button type="primary" onClick={handleSubmit}>Save</Button>
        <Button type="danger" onClick={resetForm}>Discard</Button>
      </div>
    </div>
  );
};

export default CreateLedgerWithEntryForm;
