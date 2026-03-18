import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

export default function VisitModal({ lead, onClose, onCreated }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [form, setForm] = useState({ property: lead?.property || '', scheduledAt: '', notes: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.property.trim()) return setError('Property is required');
    if (!form.scheduledAt) return setError('Date and time is required');
    setLoading(true);
    try {
      const res = await api.post('/api/visits', {
        leadId: lead._id,
        property: form.property,
        scheduledAt: form.scheduledAt,
        agent: lead.assignedAgent?._id || user._id,
        notes: form.notes
      });
      onCreated(res.data.visit);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to schedule visit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold">Schedule Visit</h2>
          <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Property</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.property}
              onChange={(e) => setForm({ ...form, property: e.target.value })}
              placeholder="Property name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
            <input
              type="datetime-local"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.scheduledAt}
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label>
            <textarea
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any notes..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Scheduling...' : 'Schedule Visit'}
          </button>
        </form>
      </div>
    </div>
  );
}
