import React, { useEffect, useRef, useState } from 'react';
import { X, Calendar, RefreshCw, UserCheck, MessageSquare, Activity } from 'lucide-react';
import api from '../services/api';
import VisitModal from './VisitModal';
import { STATUSES, STATUS_COLORS } from '../lib/constants';

const TABS = ['details', 'chat', 'timeline'];

export default function LeadDrawer({ lead, onClose, onUpdate }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const canAssign = user?.role === 'admin' || user?.role === 'manager';

  const [tab, setTab] = useState('details');
  const [visits, setVisits] = useState([]);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [status, setStatus] = useState(lead.status);
  const [saving, setSaving] = useState(false);
  const [agents, setAgents] = useState([]);
  const [assignedAgent, setAssignedAgent] = useState(lead.assignedAgent?._id || '');
  const [assigning, setAssigning] = useState(false);
  const [messages, setMessages] = useState(lead.messages || []);
  const [msgText, setMsgText] = useState('');
  const [sending, setSending] = useState(false);
  const [activity, setActivity] = useState(lead.activity || []);
  const chatEndRef = useRef(null);

  useEffect(() => {
    api.get(`/api/visits?leadId=${lead._id}`).then((r) => setVisits(r.data.visits));
    if (canAssign) {
      api.get('/api/auth/users').then((r) => setAgents(r.data.users.filter((u) => u.role === 'agent')));
    }
  }, [lead._id, canAssign]);

  useEffect(() => {
    if (tab === 'chat') chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, tab]);

  const handleStatusChange = async (newStatus) => {
    setSaving(true);
    try {
      const res = await api.patch(`/api/leads/${lead._id}`, { status: newStatus });
      setStatus(newStatus);
      setActivity(res.data.lead.activity || []);
      onUpdate(res.data.lead);
    } finally {
      setSaving(false);
    }
  };

  const handleAssign = async () => {
    if (!assignedAgent) return;
    setAssigning(true);
    try {
      const res = await api.patch(`/api/leads/${lead._id}`, { assignedAgent });
      onUpdate(res.data.lead);
    } finally {
      setAssigning(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    setSending(true);
    try {
      const res = await api.post(`/api/leads/${lead._id}/message`, { text: msgText.trim() });
      setMessages(res.data.messages);
      setMsgText('');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{lead.name}</h2>
            <p className="text-xs text-slate-500">{lead.phone} · {lead.source}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        <div className="flex border-b border-slate-200">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors ${
                tab === t ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t === 'chat' ? 'Conversation' : t === 'timeline' ? 'Activity' : 'Details'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === 'details' && (
            <div className="p-5 space-y-5">
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
                  {status.replace(/_/g, ' ')}
                </span>
                {lead.property && <p className="text-slate-500 text-sm">Property: {lead.property}</p>}
                <p className="text-slate-500 text-sm">Agent: {lead.assignedAgent?.name || 'Unassigned'}</p>
                {lead.followUpRequired && (
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Follow-up required</span>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><RefreshCw size={14} /> Change Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      disabled={saving}
                      onClick={() => handleStatusChange(s)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        status === s ? STATUS_COLORS[s] + ' border-transparent' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {s.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {canAssign && agents.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><UserCheck size={14} /> Assign Agent</p>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={assignedAgent}
                      onChange={(e) => setAssignedAgent(e.target.value)}
                    >
                      <option value="">Select agent</option>
                      {agents.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
                    </select>
                    <button
                      onClick={handleAssign}
                      disabled={assigning || !assignedAgent}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {assigning ? 'Saving...' : 'Assign'}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><Calendar size={14} /> Visit History</p>
                {visits.length === 0 ? (
                  <p className="text-slate-400 text-sm">No visits yet</p>
                ) : (
                  <div className="space-y-2">
                    {visits.map((v) => (
                      <div key={v._id} className="bg-slate-50 rounded-lg p-3 text-sm">
                        <p className="font-medium">{v.propertyName}</p>
                        {v.propertyLocation && <p className="text-slate-400 text-xs">{v.propertyLocation}</p>}
                        <p className="text-slate-500">{new Date(v.scheduledAt).toLocaleString()}</p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                          v.status === 'completed' ? 'bg-green-100 text-green-700' :
                          v.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                        }`}>{v.status}</span>
                        {v.notes && <p className="text-slate-500 mt-1">{v.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center mt-8">No messages yet</p>
                ) : (
                  messages.map((m, i) => (
                    <div key={i} className={`flex ${m.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
                        m.sender === 'agent' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <p>{m.text}</p>
                        <p className={`text-xs mt-1 ${m.sender === 'agent' ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex gap-2">
                <input
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Type a message..."
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={sending || !msgText.trim()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          )}

          {tab === 'timeline' && (
            <div className="p-5">
              {activity.length === 0 ? (
                <p className="text-slate-400 text-sm">No activity yet</p>
              ) : (
                <div className="relative space-y-4">
                  {[...activity].reverse().map((a, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1 shrink-0" />
                        {i < activity.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm text-slate-700">
                          {a.type === 'status_change' && (
                            a.metadata?.from
                              ? `Status changed from "${a.metadata.from.replace(/_/g, ' ')}" to "${a.metadata.to.replace(/_/g, ' ')}"`
                              : `Lead created with status "${a.metadata?.to?.replace(/_/g, ' ')}"`
                          )}
                          {a.type === 'visit_scheduled' && `Visit scheduled for ${a.metadata?.propertyName || 'property'}`}
                          {a.type === 'message_sent' && `Message sent: "${a.metadata?.preview}"`}
                          {a.type === 'assigned' && `Agent assigned`}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{new Date(a.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
