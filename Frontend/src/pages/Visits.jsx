import React, { useEffect, useState } from 'react';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import DataTable from '../components/DataTable';

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const fetchVisits = () => {
    setLoading(true);
    api.get('/api/visits').then((r) => setVisits(r.data.visits)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVisits();
    api.get('/api/leads').then((r) => setLeads(r.data.leads));
  }, []);

  const handleUpdate = async (id, status, leadOutcome) => {
    const res = await api.patch(`/api/visits/${id}`, { status, leadOutcome });
    setVisits((prev) => prev.map((v) => v._id === id ? res.data.visit : v));
  };

  const columns = [
    { key: 'lead', label: 'Lead', render: (r) => r.leadId?.name || '-' },
    { key: 'phone', label: 'Phone', render: (r) => r.leadId?.phone || '-' },
    { key: 'property', label: 'Property' },
    { key: 'agent', label: 'Agent', render: (r) => r.agent?.name || '-' },
    { key: 'scheduledAt', label: 'Scheduled At', render: (r) => new Date(r.scheduledAt).toLocaleString() },
    {
      key: 'status', label: 'Status',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          r.status === 'completed' ? 'bg-green-100 text-green-700' :
          r.status === 'cancelled' ? 'bg-red-100 text-red-700' :
          'bg-purple-100 text-purple-700'
        }`}>{r.status}</span>
      )
    },
    {
      key: 'actions', label: 'Actions',
      render: (r) => r.status === 'scheduled' ? (
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleUpdate(r._id, 'completed', 'visit_done'); }}
            className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium"
          >
            <CheckCircle size={13} /> Complete
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleUpdate(r._id, 'completed', 'booked'); }}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Booked
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleUpdate(r._id, 'cancelled'); }}
            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium"
          >
            <XCircle size={13} /> Cancel
          </button>
        </div>
      ) : null
    }
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Visits</h1>
        <button
          onClick={() => { setSelectedLead(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
        >
          <Plus size={16} /> Schedule Visit
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable columns={columns} data={visits} />
      )}

      {showModal && (
        <VisitScheduleModal
          leads={leads}
          initialLead={selectedLead}
          onClose={() => { setShowModal(false); setSelectedLead(null); }}
          onCreated={(v) => {
            setVisits((prev) => [v, ...prev]);
            setShowModal(false);
            setSelectedLead(null);
          }}
        />
      )}
    </div>
  );
}

function VisitScheduleModal({ leads, initialLead, onClose, onCreated }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [leadId, setLeadId] = useState(initialLead?._id || '');
  const [form, setForm] = useState({ property: initialLead?.property || '', scheduledAt: '', notes: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedLead = leads.find((l) => l._id === leadId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leadId) return setError('Please select a lead');
    if (!form.property.trim()) return setError('Property is required');
    if (!form.scheduledAt) return setError('Date and time is required');
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/visits', {
        leadId,
        property: form.property,
        scheduledAt: form.scheduledAt,
        agent: selectedLead?.assignedAgent?._id || user._id,
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
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold">Schedule Visit</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XCircle size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Lead</label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={leadId}
              onChange={(e) => {
                setLeadId(e.target.value);
                const l = leads.find((x) => x._id === e.target.value);
                if (l?.property) setForm((f) => ({ ...f, property: l.property }));
              }}
            >
              <option value="">Select lead</option>
              {leads.map((l) => (
                <option key={l._id} value={l._id}>{l.name} — {l.phone}</option>
              ))}
            </select>
          </div>
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
