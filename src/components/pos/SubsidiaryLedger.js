import React, { useEffect, useState } from 'react';
import { Select, Table, Card, Typography, Spin, message } from 'antd';
import { fetchSubsidiaryAccounts } from '../../api/subsidiary_account';
import { fetchLedgerByAccountId } from '../../api/ledger'; // You need this API defined.

const { Option } = Select;
const { Title } = Typography;

const SubsidiaryLedger = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch accounts on mount
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const res = await fetchSubsidiaryAccounts();
        setAccounts(res);
      } catch (error) {
        message.error('Failed to load accounts.');
      }
    };
    loadAccounts();
  }, []);

  // Fetch ledger data when account is selected
  useEffect(() => {
    const loadLedger = async () => {
      if (!selectedAccountId) return;
      setLoading(true);
      try {
        const res = await fetchLedgerByAccountId(selectedAccountId); // Implement this API
        setLedgerData(res);
      } catch (error) {
        message.error('Failed to fetch ledger data.');
      } finally {
        setLoading(false);
      }
    };
    loadLedger();
  }, [selectedAccountId]);

  const columns = [
    { title: 'Transaction Date', dataIndex: 'transaction_date', key: 'transaction_date' },
    { title: 'Narration', dataIndex: 'narration', key: 'narration' },
    { title: 'Debit/Credit', dataIndex: 'debitcredit', key: 'debitcredit' },
    { title: 'Amount (৳)', dataIndex: 'amount', key: 'amount', render: (val) => parseFloat(val).toLocaleString() },
    { title: 'Company', dataIndex: 'company', key: 'company' },
    { title: 'Account Type', dataIndex: 'account_type', key: 'account_type' },
    { title: 'Client Type', dataIndex: 'client_type', key: 'client_type' }
  ];

  return (
    <Card>
      <Title level={4}>Subsidiary Account Ledger</Title>
      <Select
        showSearch
        placeholder="Select Subsidiary Account"
        style={{ width: 400, marginBottom: 20 }}
        onChange={setSelectedAccountId}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {accounts.map((acc) => (
          <Option key={acc.subsidiary_account_id} value={acc.account_id}>
            {acc.account_name}
          </Option>
        ))}
      </Select>

      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={ledgerData}
          columns={columns}
          rowKey="journal_entry_id"
          bordered
        />
      )}
    </Card>
  );
};

export default SubsidiaryLedger;
