import React, { useEffect, useState } from 'react';
import api from '../services/api';
import LeadDrawer from '../components/LeadDrawer';
import { STATUSES, COL_STYLE, STATUS_COLORS } from '../lib/constants';

export default function Pipeline() {
  const [leads, setLeads] = useState([]);
  const [selected, setSelected] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    api.get('/api/leads').then((r) => setLeads(r.data.leads));
  }, []);

  const handleStatusChange = async (lead, newStatus) => {
    const res = await api.patch(`/api/leads/${lead._id}`, { status: newStatus });
    setLeads((prev) => prev.map((l) => l._id === lead._id ? res.data.lead : l));
  };

  const grouped = STATUSES.reduce((acc, s) => {
    acc[s] = leads.filter((l) => l.status === s);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Pipeline</h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((status) => (
          <div key={status} className="min-w-52 shrink-0">
            <div className={`${COL_STYLE[status].header} text-white text-xs font-semibold px-3 py-2 rounded-t-lg flex items-center justify-between`}>
              <span>{status.replace(/_/g, ' ').toUpperCase()}</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded-full">{grouped[status].length}</span>
            </div>
            <div className={`${COL_STYLE[status].bg} rounded-b-lg p-2 space-y-2 min-h-48`}>
              {grouped[status].length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">Empty</p>
              )}
              {grouped[status].map((lead) => (
                <div
                  key={lead._id}
                  className="bg-white rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelected(lead)}
                >
                  <p className="text-sm font-medium text-slate-800">{lead.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{lead.phone}</p>
                  <p className="text-xs text-slate-400 mt-1">{lead.assignedAgent?.name || 'Unassigned'}</p>
                  {lead.followUpRequired && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-xs bg-red-100 text-red-600">Follow-up</span>
                  )}
                  <div className="mt-2">
                    <select
                      className="text-xs border border-slate-200 rounded px-1.5 py-1 w-full focus:outline-none bg-white"
                      value={lead.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(lead, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
}
