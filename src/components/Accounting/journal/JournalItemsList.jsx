import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/JournalItemsList.css";
import { FaTrash, FaEdit, FaSpinner } from "react-icons/fa";

const JournalItemsList = ({ token }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const apiUrl = process.env.REACT_APP_API_URL;
  const API_URL = `${apiUrl}api/v1/general-ledger`;

  useEffect(() => {
    const fetchJournalEntries = async () => {
      try {
        const response = await axios.get(`${API_URL}journal-entries/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEntries(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
        setLoading(false);
      }
    };
    fetchJournalEntries();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      try {
        await axios.delete(`${API_URL}journal-entries/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntries(entries.filter((entry) => entry.id !== id));
      } catch (error) {
        console.error("Error deleting journal entry:", error);
      }
    }
  };

  return (
    <div className="journal-list-container">
      <h2 className="title">📜 Journal Entries Overview</h2>
      {loading ? (
        <div className="loading-container">
          <FaSpinner className="spinner" /> Loading journal entries...
        </div>
      ) : entries.length === 0 ? (
        <p className="no-entries">No journal entries available.</p>
      ) : (
        <table className="journal-table">
          <thead>
            <tr>
              <th>Narration</th>
              <th>Debit/Credit</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.narration}</td>
                <td className={`debitcredit ${entry.debitcredit.toLowerCase()}`}>
                  {entry.debitcredit}
                </td>
                <td className="amount">💰 {entry.amount.toLocaleString()}</td>
                <td>{new Date(entry.created_at).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <button className="edit-btn">
                    <FaEdit /> Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(entry.id)}>
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default JournalItemsList;
