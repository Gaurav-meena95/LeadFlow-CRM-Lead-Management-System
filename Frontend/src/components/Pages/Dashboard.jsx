import {
  Users,
  UserPlus,
  Calendar,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { StatCard } from "../ui/cards/StatCard";

const pipelineData = [
  { name: "New", count: 45 },
  { name: "Contacted", count: 32 },
  { name: "Visit Scheduled", count: 28 },
  { name: "Visit Completed", count: 18 },
  { name: "Negotiation", count: 12 },
  { name: "Booked", count: 8 },
];

const recentLeads = [
  { id: 1, name: "Rahul Sharma", phone: "+91 9876543210", source: "Website", status: "New", time: "2 hours ago" },
  { id: 2, name: "Priya Singh", phone: "+91 9876543211", source: "Referral", status: "Contacted", time: "4 hours ago" },
  { id: 3, name: "Amit Kumar", phone: "+91 9876543212", source: "Facebook", status: "Visit Scheduled", time: "5 hours ago" },
  { id: 4, name: "Neha Gupta", phone: "+91 9876543213", source: "Walk-in", status: "Booked", time: "1 day ago" },
];

const recentActivities = [
  { id: 1, text: "Rahul Sharma was assigned to Agent Maya.", time: "1 hour ago" },
  { id: 2, text: "Visit scheduled for Priya Singh at Skyline PG.", time: "3 hours ago" },
  { id: 3, text: "Amit Kumar status changed to Contacted.", time: "4 hours ago" },
  { id: 4, text: "Payment received from Neha Gupta for booking.", time: "1 day ago" },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your leads today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors">
            Download Report
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Leads"
          value="248"
          trend="12%"
          isPositive={true}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="New Leads"
          value="45"
          trend="5%"
          isPositive={true}
          icon={UserPlus}
          color="blue"
        />
        <StatCard
          title="Visit Scheduled"
          value="28"
          trend="2%"
          isPositive={true}
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Bookings"
          value="14"
          trend="8%"
          isPositive={true}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Lost Leads"
          value="32"
          trend="4%"
          isPositive={false}
          icon={XCircle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Pipeline Distribution</h2>
            <div className="flex items-center text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 mr-1" /> Last 30 days
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#4F46E5" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activities</h2>
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4 relative">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 z-10"></div>
                {activity.id !== recentActivities.length && (
                  <div className="absolute top-4 left-1 w-px h-full bg-gray-200 -ml-px"></div>
                )}
                <div>
                  <p className="text-sm text-gray-800">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors">
            View All Activities
          </button>
        </div>
      </div>

      {/* Recent Leads Table (Simplified for Dashboard) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Recent Leads</h2>
          <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
              <tr>
                <th className="px-6 py-3 border-b border-gray-200">Name</th>
                <th className="px-6 py-3 border-b border-gray-200">Phone</th>
                <th className="px-6 py-3 border-b border-gray-200">Source</th>
                <th className="px-6 py-3 border-b border-gray-200">Status</th>
                <th className="px-6 py-3 border-b border-gray-200">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{lead.name}</td>
                  <td className="px-6 py-4">{lead.phone}</td>
                  <td className="px-6 py-4">{lead.source}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                      lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' :
                      lead.status === 'Visit Scheduled' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{lead.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
