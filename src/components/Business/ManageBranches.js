import React, { useState } from 'react';
import './ManageBranches.css';
import { addBranche } from '../../api/business';

const ManageBranches = ({ branches, token }) => {
  const [newBranch, setNewBranch] = useState({
    branchname: '',
    branchaddress: '',
    city: '',
    contactno: '',
    business_id: 1,
    employee_id:1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBranch((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();
    if (
      newBranch.branchname.trim() &&
      newBranch.branchaddress.trim() &&
      newBranch.city.trim() &&
      newBranch.contactno.trim()
    ) {
     // onAddBranch(newBranch);
      await addBranche(newBranch, token);
      setNewBranch({ branchname: '', branchaddress: '', city: '', contactno: '' });
    } else {
      alert('Please fill out all fields');
    }
  };

  if (!Array.isArray(branches)) {
    return <div>Error: Branch data is not an array.</div>;
  }

  return (
    <div>
      <h2>Branches</h2>

      <form onSubmit={handleAddBranch} style={{ marginBottom: '20px' }}>
        <h3>Add New Branch</h3>
        <div>
          <label>Branch Name:</label>
          <input
            type="text"
            name="branchname"
            value={newBranch.branchname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="branchaddress"
            value={newBranch.branchaddress}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={newBranch.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contact No:</label>
          <input
            type="text"
            name="contactno"
            value={newBranch.contactno}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Branch</button>
      </form>

      <table className="log-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>Contact No</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((b) => (
            <tr key={b.id}>
              <td>{b.branchname}</td>
              <td>{b.branchaddress}</td>
              <td>{b.city}</td>
              <td>{b.contactno}</td>
              <td>
                {/* Optional: Add Edit/Delete buttons */}
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBranches;
