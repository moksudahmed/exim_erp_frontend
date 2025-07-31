import React, { useEffect, useState } from 'react';
import { Input, message } from 'antd';
import LCCardOverview from './LCCardOverview';
import LifecycleProgress from './LifecycleProgress';
import LCStepTabs from './LCStepTabs';
import LCFormWizard from './steps/LCFormWizard';
import { fetchGoodsShipment, fetchMarginPayment } from '../../api/lc';
import { fetchWarehouses } from '../../api/business';

const STATUS_STAGE_MAP = {
  OPEN: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REALIZED: 'Issued',
  CLOSED: 'Closed',
};

const LetterOfCreditPage = ({ data = [], suppliers, banks, token }) => {
  const [lcId, setLcId] = useState('');
  const [lcData, setLcData] = useState(null);
  const [marginPayment, setMarginPayment] = useState([]);
  const [goodsShipment, setGoodsShipment] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [currentStage, setCurrentStage] = useState('Draft');
  const [showNewForm, setShowNewForm] = useState(false);

  const loadLCRelatedData = async (lc) => {
    try {
      if (lc) {
        const [margin, goods, warehouse] = await Promise.all([
          fetchMarginPayment(lc.id, token),
          fetchGoodsShipment(lc.id, token),
          fetchWarehouses(token),
        ]);
        setMarginPayment(margin);
        setGoodsShipment(goods);
        setWarehouses(warehouse);
      }
    } catch (err) {
      console.error('Error loading related LC data:', err);
    }
  };

  const determineStage = (lc) => {
    if (lc.status === 'OPEN') {
      if (lc.amount && lc.applicant && lc.beneficiary && lc.issue_date) {
        return 'Submitted';
      } else {
        return 'Draft';
      }
    }
    return STATUS_STAGE_MAP[lc.status] || 'Draft';
  };

  const handleSearch = () => {
    if (!lcId.trim()) {
      message.warning('Please enter a valid L/C ID');
      return;
    }

    const found = data.find(
      item => item.lc_number?.toString() === lcId.trim() //&& item.status === 'OPEN'
    );

    if (found) {
      setLcData(found);
      setCurrentStage(determineStage(found));
      loadLCRelatedData(found);
      setShowNewForm(false);
    } else {
      setLcData(null);
      setMarginPayment([]);
      setGoodsShipment([]);
      setWarehouses([]);
      message.info('No pending L/C found with that ID.');
    }
  };

  const handleStartNew = () => {
    setShowNewForm(true);
    setLcData(null);
    setLcId('');
  };

  return (
    <div className="lc-page-container" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2>Letter of Credit (L/C) Management</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            placeholder="Enter LC ID"
            value={lcId}
            onChange={(e) => setLcId(e.target.value)}
            style={{ width: 200, marginRight: 10 }}
          />
          <button style={buttonStyle} onClick={handleSearch}>🔍 Search Pending LC</button>
          <button style={{ ...buttonStyle, marginLeft: 10 }} onClick={handleStartNew}>➕ New L/C Application</button>
        </div>
      </div>

      {showNewForm ? (
        <LCFormWizard
          banks={banks}
          token={token}
          lcData={{}} // Empty for new L/C
          currentStage={'DRAFT'}
          marginPayment={[]}
          warehouses={warehouses}
        />
      ) : lcData ? (
        <>
          <LCCardOverview lcData={lcData} />
          {/* <LifecycleProgress currentStage={currentStage} /> */}
          <LCFormWizard
            banks={banks}
            token={token}
            lcData={lcData}
            currentStage={currentStage.toUpperCase()}
            marginPayment={marginPayment}
            warehouses={warehouses}
          />
          <LCStepTabs lcData={lcData} marginPayment={marginPayment} goodsShipment={goodsShipment} />
        </>
      ) : (
        <div style={{ paddingTop: 20 }}>No pending L/C selected or found.</div>
      )}
    </div>
  );
};

const buttonStyle = {
  backgroundColor: '#1890ff',
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default LetterOfCreditPage;
