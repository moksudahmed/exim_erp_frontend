import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import '../styles/journalItemsOverview.css';

const JournalItemsOverview = ({ token }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchJournalEntries = async () => {
      try {
        const response = await axios.get('/api/v1/journal-entries', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      }
    };
    fetchJournalEntries();
  }, [token]);

  return (
    <div className="journal_overview_container">
      <h2 className="journal_overview_title">Journal Entry Overview</h2>
      {entries.length > 0 ? (
        <table className="journal_table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.description}</td>
                <td>{entry.debit}</td>
                <td>{entry.credit}</td>
                <td>{new Date(entry.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no_journal_message">No journal entries available.</p>
      )}
    </div>
  );
};

export default JournalItemsOverview;
