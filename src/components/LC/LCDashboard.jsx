// /src/modules/lc/LCDashboard.jsx
import React, { useEffect, useState } from 'react';
import { fetchLcSummary } from './lcAPI';

const LCDashboard = () => {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    fetchLcSummary().then(setSummary);
  }, []);

  return (
    <div>
      <h3>L/C Summary Dashboard</h3>
      {/* render chart or table */}
    </div>
  );
};
