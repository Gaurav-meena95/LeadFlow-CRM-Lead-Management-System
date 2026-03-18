import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import api from '../services/api';
import DataTable from '../components/DataTable';

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'agent', shopName: 'LeadFlow' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAgents = () => {
    api.get('/api/leads').then((r) => {
      const map = {};
      r.data.leads.forEach((l) => {
        if (l.assignedAgent) map[l.assignedAgent._id] = l.assignedAgent;
      });
      setAgents(Object.values(map));
    });
  };

  useEffect(() => { fetchAgents(); }, []);

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email';
    if (!/^\d{10}$/.test(form.phone)) return 'Phone must be 10 digits';
    if (!/(?=.*[!@#$%^&*])(?=.{8,})/.test(form.password)) return 'Password must be 8+ chars with a special character';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    try {
      await api.post('/api/auth/signup', form);
      setShowModal(false);
      setForm({ name: '', email: '', phone: '', password: '', role: 'agent', shopName: 'LeadFlow' });
      fetchAgents();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role', render: (r) => <span className="capitalize">{r.role}</span> }
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Agents</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      <DataTable columns={columns} data={agents} />

      {showModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold">Add User</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
              {['name', 'email', 'phone', 'password'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">{field}</label>
                  <input
                    type={field === 'password' ? 'password' : 'text'}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    placeholder={field}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="agent">Agent</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
