import { useState } from "react";
import { Plus, Calendar, Clock, MapPin, User, X } from "lucide-react";












const mockVisits = [
{
  id: "1",
  lead: "Rajesh Kumar",
  property: "PG Elite - Koramangala",
  agent: "Vikram Singh",
  date: "2026-03-17",
  time: "10:00 AM",
  status: "Scheduled",
  notes: "Interested in single occupancy room"
},
{
  id: "2",
  lead: "Priya Sharma",
  property: "Girls PG - Indiranagar",
  agent: "Priya Mehta",
  date: "2026-03-17",
  time: "2:30 PM",
  status: "Scheduled"
},
{
  id: "3",
  lead: "Amit Patel",
  property: "Boys Hostel - HSR Layout",
  agent: "Vikram Singh",
  date: "2026-03-16",
  time: "11:00 AM",
  status: "Completed"
},
{
  id: "4",
  lead: "Sneha Reddy",
  property: "Premium PG - Whitefield",
  agent: "Rahul Kapoor",
  date: "2026-03-18",
  time: "4:00 PM",
  status: "Scheduled"
},
{
  id: "5",
  lead: "Karthik Raj",
  property: "Shared PG - Marathahalli",
  agent: "Priya Mehta",
  date: "2026-03-15",
  time: "3:00 PM",
  status: "Cancelled"
}];


const statusColors = {
  Scheduled: "bg-purple-100 text-purple-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700"
};

export function Visits() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    lead: "",
    property: "",
    agent: "",
    date: "",
    time: "",
    notes: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
    setFormData({
      lead: "",
      property: "",
      agent: "",
      date: "",
      time: "",
      notes: ""
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visits</h1>
          <p className="text-gray-600 mt-1">Schedule and manage property visits</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
          
          <Plus className="w-4 h-4" />
          Schedule Visit
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockVisits.map((visit) =>
              <tr key={visit.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{visit.lead}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{visit.property}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{visit.agent}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(visit.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{visit.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[visit.status]}`}>
                      {visit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{visit.notes || "-"}</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Visit Modal */}
      {showModal &&
      <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowModal(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Schedule Visit</h2>
              <button
              onClick={() => setShowModal(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors">
              
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label htmlFor="lead" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Lead
                </label>
                <select
                id="lead"
                value={formData.lead}
                onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required>
                
                  <option value="">Choose a lead...</option>
                  <option value="Rajesh Kumar">Rajesh Kumar</option>
                  <option value="Priya Sharma">Priya Sharma</option>
                  <option value="Amit Patel">Amit Patel</option>
                </select>
              </div>

              <div>
                <label htmlFor="property" className="block text-sm font-medium text-gray-700 mb-2">
                  Property
                </label>
                <select
                id="property"
                value={formData.property}
                onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required>
                
                  <option value="">Choose a property...</option>
                  <option value="PG Elite - Koramangala">PG Elite - Koramangala</option>
                  <option value="Girls PG - Indiranagar">Girls PG - Indiranagar</option>
                  <option value="Boys Hostel - HSR Layout">Boys Hostel - HSR Layout</option>
                  <option value="Premium PG - Whitefield">Premium PG - Whitefield</option>
                </select>
              </div>

              <div>
                <label htmlFor="agent" className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Agent
                </label>
                <select
                id="agent"
                value={formData.agent}
                onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required>
                
                  <option value="">Choose an agent...</option>
                  <option value="Vikram Singh">Vikram Singh</option>
                  <option value="Priya Mehta">Priya Mehta</option>
                  <option value="Rahul Kapoor">Rahul Kapoor</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
                
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
                
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any special requirements or notes..." />
              
              </div>

              <div className="flex gap-3 pt-4">
                <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
                
                  Schedule Visit
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