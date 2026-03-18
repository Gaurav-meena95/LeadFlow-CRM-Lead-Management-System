import React, { useEffect, useState } from 'react';
import { X, Calendar, RefreshCw } from 'lucide-react';
import api from '../services/api';
import VisitModal from './VisitModal';

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  visit_scheduled: 'bg-purple-100 text-purple-700',
  visit_done: 'bg-gray-100 text-gray-700',
  booked: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700'
};

const statuses = ['new', 'contacted', 'visit_scheduled', 'visit_done', 'booked', 'lost'];

export default function LeadDrawer({ lead, onClose, onUpdate }) {
  const [visits, setVisits] = useState([]);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [status, setStatus] = useState(lead.status);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/api/visits?leadId=${lead._id}`).then((r) => setVisits(r.data.visits));
  }, [lead._id]);

  const handleStatusChange = async (newStatus) => {
    setSaving(true);
    try {
      const res = await api.patch(`/api/leads/${lead._id}`, { status: newStatus });
      setStatus(newStatus);
      onUpdate(res.data.lead);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Lead Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <p className="text-xl font-bold text-slate-800">{lead.name}</p>
            <p className="text-slate-500 text-sm">{lead.phone}</p>
            <p className="text-slate-500 text-sm capitalize">Source: {lead.source}</p>
            {lead.property && <p className="text-slate-500 text-sm">Property: {lead.property}</p>}
            <p className="text-slate-500 text-sm">
              Agent: {lead.assignedAgent?.name || 'Unassigned'}
            </p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
              {status.replace('_', ' ')}
            </span>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <RefreshCw size={14} /> Change Status
            </p>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  disabled={saving}
                  onClick={() => handleStatusChange(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    status === s
                      ? statusColors[s] + ' border-transparent'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Calendar size={14} /> Visit History
            </p>
            {visits.length === 0 ? (
              <p className="text-slate-400 text-sm">No visits yet</p>
            ) : (
              <div className="space-y-2">
                {visits.map((v) => (
                  <div key={v._id} className="bg-slate-50 rounded-lg p-3 text-sm">
                    <p className="font-medium">{v.property}</p>
                    <p className="text-slate-500">{new Date(v.scheduledAt).toLocaleString()}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                      v.status === 'completed' ? 'bg-green-100 text-green-700' :
                      v.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>{v.status}</span>
                    {v.notes && <p className="text-slate-500 mt-1">{v.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-slate-200">
          <button
            onClick={() => setShowVisitModal(true)}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Calendar size={16} /> Schedule Visit
          </button>
        </div>
      </div>

      {showVisitModal && (
        <VisitModal
          lead={lead}
          onClose={() => setShowVisitModal(false)}
          onCreated={(v) => {
            setVisits((prev) => [v, ...prev]);
            setShowVisitModal(false);
          }}
        />
      )}
    </>
  );
}
