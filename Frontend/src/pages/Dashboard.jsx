import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Calendar, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import StatCard from '../components/StatCard';

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  visit_scheduled: 'bg-purple-100 text-purple-700',
  visit_done: 'bg-gray-100 text-gray-700',
  booked: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700'
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/dashboard'),
      api.get('/api/leads')
    ]).then(([dashRes, leadsRes]) => {
      setStats(dashRes.data);
      setRecentLeads(leadsRes.data.leads.slice(0, 10));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Leads" value={stats?.totalLeads || 0} icon={Users} color="bg-indigo-500" />
        <StatCard title="New Leads" value={stats?.new || 0} icon={UserPlus} color="bg-blue-500" />
        <StatCard title="Visits Scheduled" value={stats?.visit_scheduled || 0} icon={Calendar} color="bg-purple-500" />
        <StatCard title="Booked" value={stats?.booked || 0} icon={CheckCircle} color="bg-green-500" />
        <StatCard title="Lost" value={stats?.lost || 0} icon={XCircle} color="bg-red-500" />
      </div>

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
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                    {lead.status.replace(/_/g, ' ')}
                  </span>
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
                    <p className="text-xs text-slate-500">{v.property} · {new Date(v.scheduledAt).toLocaleTimeString()}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    v.status === 'completed' ? 'bg-green-100 text-green-700' :
                    v.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>{v.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
