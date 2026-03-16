import { useState } from "react";
import { Plus, Mail, Phone, TrendingUp, MoreVertical, X } from "lucide-react";











const mockAgents = [
{
  id: "1",
  name: "Vikram Singh",
  email: "vikram.singh@leadflow.com",
  phone: "+91 98765 12345",
  assignedLeads: 45,
  conversions: 12,
  status: "Active"
},
{
  id: "2",
  name: "Priya Mehta",
  email: "priya.mehta@leadflow.com",
  phone: "+91 98765 12346",
  assignedLeads: 38,
  conversions: 15,
  status: "Active"
},
{
  id: "3",
  name: "Rahul Kapoor",
  email: "rahul.kapoor@leadflow.com",
  phone: "+91 98765 12347",
  assignedLeads: 32,
  conversions: 9,
  status: "Active"
},
{
  id: "4",
  name: "Anjali Rao",
  email: "anjali.rao@leadflow.com",
  phone: "+91 98765 12348",
  assignedLeads: 28,
  conversions: 11,
  status: "Active"
},
{
  id: "5",
  name: "Karan Joshi",
  email: "karan.joshi@leadflow.com",
  phone: "+91 98765 12349",
  assignedLeads: 0,
  conversions: 0,
  status: "Inactive"
}];


export function Agents() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
    setFormData({ name: "", email: "", phone: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
          <p className="text-gray-600 mt-1">Manage your sales team and track performance</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
          
          <Plus className="w-4 h-4" />
          Add Agent
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Agents</p>
          <p className="text-3xl font-bold text-gray-900">5</p>
          <p className="text-sm text-green-600 mt-2">4 Active</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Leads</p>
          <p className="text-3xl font-bold text-gray-900">143</p>
          <p className="text-sm text-gray-500 mt-2">Assigned</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Conversions</p>
          <p className="text-3xl font-bold text-gray-900">47</p>
          <p className="text-sm text-green-600 mt-2">+15% this month</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Avg Conversion Rate</p>
          <p className="text-3xl font-bold text-gray-900">32.9%</p>
          <p className="text-sm text-gray-500 mt-2">Performance</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Leads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockAgents.map((agent) => {
                const conversionRate = agent.assignedLeads > 0 ?
                (agent.conversions / agent.assignedLeads * 100).toFixed(1) :
                "0.0";

                return (
                  <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {agent.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <div className="font-medium text-gray-900">{agent.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{agent.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{agent.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{agent.assignedLeads}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{agent.conversions}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-900">{conversionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                        agent.status === "Active" ?
                        "bg-green-100 text-green-700" :
                        "bg-gray-100 text-gray-700"}`
                        }>
                        
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Agent Modal */}
      {showModal &&
      <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowModal(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl z-50">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Add New Agent</h2>
              <button
              onClick={() => setShowModal(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors">
              
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter agent name"
                required />
              
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="agent@leadflow.com"
                required />
              
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+91 98765 43210"
                required />
              
              </div>

              <div className="flex gap-3 pt-4">
                <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
                
                  Add Agent
                </button>
                <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      }
    </div>);

}