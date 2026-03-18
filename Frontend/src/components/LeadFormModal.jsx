import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

export default function LeadFormModal({ onClose, onCreated }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [form, setForm] = useState({ name: '', phone: '', source: '', assignedAgent: '', property: '' });
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'manager') {
      api.get('/api/auth/users').then((res) => setAgents(res.data.users.filter((u) => u.role === 'agent')));
    }
  }, []);

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!/^\d{10}$/.test(form.phone)) return 'Phone must be exactly 10 digits';
    if (!form.source) return 'Source is required';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    try {
      const payload = { name: form.name, phone: form.phone, source: form.source };
      if (form.assignedAgent) payload.assignedAgent = form.assignedAgent;
      if (form.property) payload.property = form.property;
      const res = await api.post('/api/leads', payload);
      onCreated(res.data.lead);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold">Add Lead</h2>
          <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Customer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="10-digit phone"
              maxLength={10}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
            >
              <option value="">Select source</option>
              <option value="website">Website</option>
              <option value="facebook">Facebook</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="referral">Referral</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Property (optional)</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.property}
              onChange={(e) => setForm({ ...form, property: e.target.value })}
              placeholder="Property name"
            />
          </div>
          {(user?.role === 'admin' || user?.role === 'manager') && agents.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assign Agent</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.assignedAgent}
                onChange={(e) => setForm({ ...form, assignedAgent: e.target.value })}
              >
                <option value="">Auto assign</option>
                {agents.map((a) => (
                  <option key={a._id} value={a._id}>{a.name}</option>
                ))}
              </select>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Lead'}
          </button>
        </form>
      </div>
    </div>
  );
}
