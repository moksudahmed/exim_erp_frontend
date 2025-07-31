import React, { useEffect, useState } from 'react';
import { fetchClients as fetchClientsAPI, deleteClient } from '../../api/client';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  const getClients = async () => {
    try {
      const response = await fetchClientsAPI();
      setClients(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
      setMessage({ text: 'Failed to load clients.', type: 'error' });
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  const handleDelete = async (clientId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this client?');
    if (!confirmDelete) return;

    try {
      await deleteClient(clientId);
      setMessage({ text: 'Client deleted successfully!', type: 'success' });
      getClients();
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ text: 'Failed to delete client.', type: 'error' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Client List</h2>

      {message.text && (
        <div
          className={`mb-4 px-4 py-3 rounded text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200 rounded-md">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="py-3 px-4 border">#</th>
              <th className="py-3 px-4 border">Type</th>
              <th className="py-3 px-4 border">Name</th>
              <th className="py-3 px-4 border">Gender</th>
              <th className="py-3 px-4 border">Reg. Date</th>
              <th className="py-3 px-4 border">Account Name</th>
              <th className="py-3 px-4 border">Account No</th>
              <th className="py-3 px-4 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((client, index) => (
                <tr
                  key={client.client_id}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{client.client_type || '-'}</td>
                  <td className="py-2 px-4 border">{`${client.first_name} ${client.last_name}`}</td>
                  <td className="py-2 px-4 border">{client.gender || '-'}</td>
                  <td className="py-2 px-4 border">{client.registration_date || '-'}</td>
                  <td className="py-2 px-4 border">{client.account_name || '-'}</td>
                  <td className="py-2 px-4 border">{client.account_no || '-'}</td>
                  <td className="py-2 px-4 border text-center">
                    <div className="flex justify-center space-x-3 text-lg">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        aria-label="View client"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="text-yellow-500 hover:text-yellow-700"
                        aria-label="Edit client"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(client.client_id)}
                        className="text-red-600 hover:text-red-800"
                        aria-label="Delete client"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="py-6 px-4 text-center text-gray-500 italic"
                >
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientList;
