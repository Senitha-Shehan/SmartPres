import React, { useState } from 'react';

const BankTransactionCRUD = () => {
  // Sample initial data
  const initialTransactions = [
    { id: 1, name: 'John Doe', date: '2023-05-15', amount: 150.00, status: 'Pending' },
    { id: 2, name: 'Jane Smith', date: '2023-05-16', amount: 225.50, status: 'Received' },
    { id: 3, name: 'Robert Johnson', date: '2023-05-17', amount: 89.99, status: 'Not Received' },
    { id: 4, name: 'Emily Davis', date: '2023-05-18', amount: 350.00, status: 'Pending' },
  ];

  const [transactions, setTransactions] = useState(initialTransactions);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: '',
    status: 'Pending'
  });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing transaction
      setTransactions(transactions.map(t => 
        t.id === editingId ? { ...formData, id: editingId } : t
      ));
      setEditingId(null);
    } else {
      // Add new transaction
      const newTransaction = {
        ...formData,
        id: Math.max(...transactions.map(t => t.id), 0) + 1
      };
      setTransactions([...transactions, newTransaction]);
    }
    
    setFormData({ name: '', amount: '', date: '', status: 'Pending' });
  };

  const handleEdit = (transaction) => {
    setFormData({
      name: transaction.name,
      amount: transaction.amount,
      date: transaction.date,
      status: transaction.status
    });
    setEditingId(transaction.id);
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, status: newStatus } : t
    ));
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Bank Transactions</h2>
      
      {/* Form Section */}
      <div style={{
        marginBottom: '40px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9'
      }}>
        <h3 style={{ marginBottom: '20px' }}>
          {editingId ? 'Edit Transaction' : 'Add New Transaction'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value="Pending">Pending</option>
                <option value="Received">Received</option>
                <option value="Not Received">Not Received</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {editingId ? 'Update Transaction' : 'Add Transaction'}
          </button>
          
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setFormData({ name: '', amount: '', date: '', status: 'Pending' });
                setEditingId(null);
              }}
              style={{
                marginTop: '20px',
                marginLeft: '10px',
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
      
      {/* Table Section */}
      <div style={{
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#4CAF50', color: 'white' }}>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Amount</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px 15px' }}>{transaction.id}</td>
                <td style={{ padding: '12px 15px' }}>{transaction.name}</td>
                <td style={{ padding: '12px 15px' }}>{transaction.date}</td>
                <td style={{ padding: '12px 15px' }}>${transaction.amount.toFixed(2)}</td>
                <td style={{ padding: '12px 15px' }}>
                  <select
                    value={transaction.status}
                    onChange={(e) => handleStatusChange(transaction.id, e.target.value)}
                    style={{
                      padding: '5px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      backgroundColor: 
                        transaction.status === 'Received' ? '#dff0d8' :
                        transaction.status === 'Not Received' ? '#f2dede' : '#fcf8e3'
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Received">Received</option>
                    <option value="Not Received">Not Received</option>
                  </select>
                </td>
                <td style={{ padding: '12px 15px' }}>
                  <button
                    onClick={() => handleEdit(transaction)}
                    style={{
                      padding: '5px 10px',
                      marginRight: '5px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankTransactionCRUD;