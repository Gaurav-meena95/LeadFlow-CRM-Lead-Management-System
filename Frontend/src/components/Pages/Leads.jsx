import { useState } from "react";
import { Plus, Search, Filter, MoreVertical, Phone, Mail, MapPin, Calendar, User, X } from "lucide-react";














const mockLeads = [
{
  id: "1",
  name: "Rajesh Kumar",
  phone: "+91 98765 43210",
  email: "rajesh.k@email.com",
  source: "Website",
  assignedAgent: "Vikram Singh",
  status: "New",
  createdDate: "2026-03-16",
  location: "Koramangala, Bangalore",
  budget: "10,000 - 15,000/month"
},
{
  id: "2",
  name: "Priya Sharma",
  phone: "+91 98765 43211",
  email: "priya.sharma@email.com",
  source: "Instagram",
  assignedAgent: "Priya Mehta",
  status: "Contacted",
  createdDate: "2026-03-15",
  location: "Indiranagar, Bangalore",
  budget: "12,000 - 18,000/month"
},
{
  id: "3",
  name: "Amit Patel",
  phone: "+91 98765 43212",
  email: "amit.patel@email.com",
  source: "Referral",
  assignedAgent: "Vikram Singh",
  status: "Visit Scheduled",
  createdDate: "2026-03-14",
  location: "HSR Layout, Bangalore",
  budget: "8,000 - 12,000/month"
},
{
  id: "4",
  name: "Sneha Reddy",
  phone: "+91 98765 43213",
  email: "sneha.r@email.com",
  source: "Facebook",
  assignedAgent: "Rahul Kapoor",
  status: "Booked",
  createdDate: "2026-03-13",
  location: "Whitefield, Bangalore",
  budget: "15,000 - 20,000/month"
},
{
  id: "5",
  name: "Karthik Raj",
  phone: "+91 98765 43214",
  email: "karthik.raj@email.com",
  source: "Google Ads",
  assignedAgent: "Priya Mehta",
  status: "Lost",
  createdDate: "2026-03-12",
  location: "Marathahalli, Bangalore",
  budget: "6,000 - 10,000/month"
}];


const statusColors = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  "Visit Scheduled": "bg-purple-100 text-purple-700",
  Booked: "bg-green-100 text-green-700",
  Lost: "bg-red-100 text-red-700"
};

export function Leads() {
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const activities = [
  { type: "status_change", description: "Status changed to Visit Scheduled", time: "2 hours ago" },
  { type: "call", description: "Called by Vikram Singh", time: "1 day ago" },
  { type: "note", description: "Interested in girls PG near metro", time: "1 day ago" },
  { type: "created", description: "Lead created from website form", time: "2 days ago" }];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-1">Manage and track all your property leads</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockLeads.map((lead) =>
              <tr
                key={lead.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedLead(lead)}>
                
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{lead.name}</div>
                    <div className="text-sm text-gray-500">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {lead.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {lead.assignedAgent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(lead.createdDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Panel */}
      {selectedLead &&
      <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedLead(null)} />
          <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Lead Details</h2>
              <button
              onClick={() => setSelectedLead(null)}
              className="p-1 hover:bg-gray-100 rounded transition-colors">
              
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{selectedLead.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{selectedLead.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{selectedLead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Preferred Location</p>
                      <p className="font-medium text-gray-900">{selectedLead.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Budget</p>
                      <p className="font-medium text-gray-900">{selectedLead.budget}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Agent */}
              <div className="flex gap-4">
                <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedLead.status]}`}>
                    {selectedLead.status}
                  </span>
                </div>
                <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Assigned Agent</p>
                  <p className="font-medium text-gray-900">{selectedLead.assignedAgent}</p>
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Activity Timeline</h3>
                <div className="space-y-4">
                  {activities.map((activity, index) =>
                <div key={index} className="flex gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
                  Schedule Visit
                </button>
                <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Change Status
                </button>
                <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </>
      }
    </div>);

}