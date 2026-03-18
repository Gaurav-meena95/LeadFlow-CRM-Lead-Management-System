import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import LeadDrawer from '../components/LeadDrawer';
import LeadFormModal from '../components/LeadFormModal';
import { STATUS_COLORS } from '../lib/constants';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const canCreate = user?.role === 'admin' || user?.role === 'manager';

  const fetchLeads = () => {
    setLoading(true);
    api.get('/api/leads').then((r) => setLeads(r.data.leads)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchLeads(); }, []);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'source', label: 'Source', render: (r) => <span className="capitalize">{r.source}</span> },
    { key: 'assignedAgent', label: 'Agent', render: (r) => r.assignedAgent?.name || 'Unassigned' },
    {
      key: 'status', label: 'Status',
      render: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[r.status]}`}>
          {r.status.replace(/_/g, ' ')}
        </span>
      )
    },
    {
      key: 'followUp', label: '',
      render: (r) => r.followUpRequired
        ? <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-600">Follow-up</span>
        : null
    },
    { key: 'createdAt', label: 'Created', render: (r) => new Date(r.createdAt).toLocaleDateString() }
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Leads</h1>
        {canCreate && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
          >
            <Plus size={16} /> Add Lead
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable columns={columns} data={leads} onRowClick={setSelected} />
      )}

      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onUpdate={(updated) => {
            setLeads((prev) => prev.map((l) => l._id === updated._id ? updated : l));
            setSelected(updated);
          }}
        />
      )}

      {showModal && (
        <LeadFormModal
          onClose={() => setShowModal(false)}
          onCreated={(lead) => {
            setLeads((prev) => [lead, ...prev]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
