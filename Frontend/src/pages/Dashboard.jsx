import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Calendar, CheckCircle, XCircle, AlertCircle, TrendingUp, UserCheck } from 'lucide-react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import { STATUS_COLORS } from '../lib/constants';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [agentStats, setAgentStats] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/dashboard'),
      api.get('/api/leads')
    ]).then(([dashRes, leadsRes]) => {
      setStats(dashRes.data);
      setAgentStats(dashRes.data.agentStats || []);
      setRecentLeads(leadsRes.data.leads.slice(0, 8));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sm = stats?.statusMap || {};

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Leads" value={stats?.totalLeads || 0} icon={Users} color="bg-indigo-500" />
        <StatCard title="New Leads" value={sm['new_lead'] || 0} icon={UserPlus} color="bg-blue-500" />
        <StatCard title="Visits Scheduled" value={sm['visit_scheduled'] || 0} icon={Calendar} color="bg-purple-500" />
        <StatCard title="Booked" value={sm['booked'] || 0} icon={CheckCircle} color="bg-green-500" />
        <StatCard title="Lost" value={sm['lost'] || 0} icon={XCircle} color="bg-red-500" />
        <StatCard title="Conversion Rate" value={`${stats?.conversionRate || 0}%`} icon={TrendingUp} color="bg-emerald-500" />
        <StatCard title="Follow-ups Pending" value={stats?.followUpsPending || 0} icon={AlertCircle} color="bg-orange-500" />
        <StatCard title="Today's Visits" value={stats?.todayVisits?.length || 0} icon={Calendar} color="bg-cyan-500" />
      </div>

      {stats?.followUpsPending > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle size={18} className="text-orange-500 shrink-0" />
          <p className="text-sm text-orange-700">
            <span className="font-semibold">{stats.followUpsPending} leads</span> have had no activity in over 24 hours and require follow-up.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Recent Leads</h2>
          {recentLeads.length === 0 ? (
            <p className="text-slate-400 text-sm">No leads yet</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div key={lead._id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.phone} · {lead.source}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {lead.followUpRequired && (
                      <span className="px-1.5 py-0.5 rounded text-xs bg-red-100 text-red-600">Follow-up</span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status]}`}>
                      {lead.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Today's Visits</h2>
          {!stats?.todayVisits?.length ? (
            <p className="text-slate-400 text-sm">No visits scheduled today</p>
          ) : (
            <div className="space-y-3">
              {stats.todayVisits.map((v) => (
                <div key={v._id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{v.leadId?.name}</p>
                    <p className="text-xs text-slate-500">{v.propertyName} · {new Date(v.scheduledAt).toLocaleTimeString()}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    v.status === 'completed' ? 'bg-green-100 text-green-700' :
                    v.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                  }`}>{v.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {agentStats.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <UserCheck size={16} /> Agent Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 px-3 text-slate-500 font-medium">Agent</th>
                  <th className="text-left py-2 px-3 text-slate-500 font-medium">Leads</th>
                  <th className="text-left py-2 px-3 text-slate-500 font-medium">Booked</th>
                  <th className="text-left py-2 px-3 text-slate-500 font-medium">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {agentStats.map((a) => (
                  <tr key={a._id} className="border-b border-slate-50 last:border-0">
                    <td className="py-2 px-3 text-slate-700">{a.name || 'Unknown'}</td>
                    <td className="py-2 px-3 text-slate-700">{a.total}</td>
                    <td className="py-2 px-3 text-slate-700">{a.booked}</td>
                    <td className="py-2 px-3 text-slate-700">
                      {a.total > 0 ? ((a.booked / a.total) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
