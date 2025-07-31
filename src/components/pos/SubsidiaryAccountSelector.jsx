import React, { useEffect, useState } from 'react';
import { Select, Spin, Typography } from 'antd';
import { fetchSubsidiaryAccounts } from '../../api/subsidiary_account';

const { Option } = Select;
const { Title, Text } = Typography;

const SubsidiaryAccountSelector = () => {
  const [subsidiaryAccounts, setSubsidiaryAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await fetchSubsidiaryAccounts(); // ensure this returns a list of accounts
        setSubsidiaryAccounts(data);
      } catch (error) {
        console.error("Failed to fetch subsidiary accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  const handleChange = (value) => {
    const account = subsidiaryAccounts.find(acc => acc.subsidiary_account_id === value);
    setSelectedAccount(account);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <Title level={4}>Select Subsidiary Account</Title>
      
      {loading ? (
        <Spin tip="Loading Accounts..." />
      ) : (
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Select an account"
          optionFilterProp="children"
          onChange={handleChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {subsidiaryAccounts.map((acc) => (
            <Option key={acc.subsidiary_account_id} value={acc.subsidiary_account_id}>
              {acc.account_name}
            </Option>
          ))}
        </Select>
      )}

      {selectedAccount && (
        <div style={{ marginTop: '24px' }}>
          <Title level={5}>Account Details</Title>
          <Text><strong>Account No:</strong> {selectedAccount.account_no}</Text><br />
          <Text><strong>Branch:</strong> {selectedAccount.branch}</Text><br />
          <Text><strong>Holder:</strong> {selectedAccount.account_holder}</Text><br />
          <Text><strong>Address:</strong> {selectedAccount.address}</Text><br />
          <Text><strong>Type:</strong> {selectedAccount.type}</Text>
        </div>
      )}
    </div>
  );
};

export default SubsidiaryAccountSelector;
