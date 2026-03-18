import React, { useEffect, useState } from 'react';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import DataTable from '../components/DataTable';

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVisits = () => {
    setLoading(true);
    api.get('/api/visits').then((r) => setVisits(r.data.visits)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchVisits(); }, []);

  const handleUpdate = async (id, status, leadOutcome) => {
    const res = await api.patch(`/api/visits/${id}`, { status, leadOutcome });
    setVisits((prev) => prev.map((v) => v._id === id ? res.data.visit : v));
  };

  const columns = [
    { key: 'lead', label: 'Lead', render: (r) => r.leadId?.name || '-' },
    { key: 'phone', label: 'Phone', render: (r) => r.leadId?.phone || '-' },
    { key: 'property', label: 'Property' },
    { key: 'agent', label: 'Agent', render: (r) => r.agent?.name || '-' },
    {
      key: 'scheduledAt', label: 'Scheduled At',
      render: (r) => new Date(r.scheduledAt).toLocaleString()
    },
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
            className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800"
          >
            <CheckCircle size={14} /> Complete
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleUpdate(r._id, 'completed', 'booked'); }}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
          >
            Booked
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleUpdate(r._id, 'cancelled'); }}
            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800"
          >
            <XCircle size={14} /> Cancel
          </button>
        </div>
      ) : null
    }
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Visits</h1>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable columns={columns} data={visits} />
      )}
    </div>
  );
}
