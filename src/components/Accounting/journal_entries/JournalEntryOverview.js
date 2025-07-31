import React, { useEffect, useState } from "react";
import axios from "axios";
//import "../styles/JournalEntryOverview.css";

const JournalEntryOverview = ({ token, setSelectedLedgerID }) => {
  const [ledgers, setLedgers] = useState([]);
  const [expandedLedger, setExpandedLedger] = useState(null);
  const [ledgerDetails, setLedgerDetails] = useState({});
  const apiUrl = process.env.REACT_APP_API_URL;
  const API_URL = `${apiUrl}api/v1/general-ledger`;

  useEffect(() => {
    const fetchLedgers = async () => {
      try {
        const response = await axios.get(`${API_URL}/general-ledger/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLedgers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching ledgers:", error);
      }
    };
    fetchLedgers();
  }, [token]);

  const handleLedgerSelect = (id) => {
    alert(id);
    if (window.confirm("Are you sure you want to add this journal entry?")) {
      setSelectedLedgerID(id);
    }
  };

  const toggleLedgerDetails = async (id) => {
    if (expandedLedger === id) {
      setExpandedLedger(null);
      return;
    }    
    
    setExpandedLedger(id);
  };

  return (
    <div className="ledger-container">
      <h2 className="ledger-title">📊 General Ledger Overview</h2>

      {ledgers.length > 0 ? (
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Ref No.</th>
              <th>Type</th>
              <th>Company</th>
              <th>Transaction Date</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ledgers.map((ledger) => (
              <React.Fragment key={ledger.id}>
                <tr className="ledger-row">
                  <td>{ledger.ref_no}</td>
                  <td>{ledger.account_type}</td>
                  <td>{ledger.company}</td>
                  <td>{new Date(ledger.transaction_date).toLocaleDateString()}</td>
                  <td>{new Date(ledger.created_at).toLocaleDateString()}</td>
                  <td className="action-buttons">
                    <button className="btn add-btn" onClick={() => handleLedgerSelect(ledger.id)}>
                      ➕ Add
                    </button>
                    <button className="btn open-btn" onClick={() => toggleLedgerDetails(ledger.id)}>
                      {expandedLedger === ledger.id ? "🔽 Close" : "🔼 Open"}
                    </button>
                  </td>
                </tr>

                {expandedLedger === ledger.id && (
                  <tr className="ledger-details-row">
                    <td colSpan="6">
                      <div className="ledger-details">
                        <h3>📋 Ledger Details</h3>
                        <p><strong>Description:</strong> {ledger.ref_no}</p>
                        <p><strong>Entries:</strong></p>
                        <ul className="ledger-entries">
                          {ledger.journal_items.map((entry, index) => (
                            <li key={index}>
                              <span className="entry-narration">{entry.narration}</span>
                              <span className="entry-debitcredit">{entry.debitcredit}</span>
                              <span className="entry-amount">💰 {entry.amount}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-entries-message">No ledger entries available.</p>
      )}
    </div>
  );
};

export default JournalEntryOverview;
