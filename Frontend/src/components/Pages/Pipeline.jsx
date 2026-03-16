import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Phone, User, Tag } from "lucide-react";











const COLUMNS = ["New", "Contacted", "Visit Scheduled", "Visit Completed", "Booked", "Lost"];

const initialLeads = [
{ id: "1", name: "Rajesh Kumar", phone: "+91 98765 43210", agent: "Vikram Singh", source: "Website", budget: "10-15k", status: "New" },
{ id: "2", name: "Priya Sharma", phone: "+91 98765 43211", agent: "Priya Mehta", source: "Instagram", budget: "12-18k", status: "New" },
{ id: "3", name: "Amit Patel", phone: "+91 98765 43212", agent: "Vikram Singh", source: "Referral", budget: "8-12k", status: "Contacted" },
{ id: "4", name: "Sneha Reddy", phone: "+91 98765 43213", agent: "Rahul Kapoor", source: "Facebook", budget: "15-20k", status: "Visit Scheduled" },
{ id: "5", name: "Karthik Raj", phone: "+91 98765 43214", agent: "Priya Mehta", source: "Google", budget: "6-10k", status: "Visit Completed" },
{ id: "6", name: "Anita Desai", phone: "+91 98765 43215", agent: "Vikram Singh", source: "Website", budget: "10-15k", status: "Booked" },
{ id: "7", name: "Rahul Verma", phone: "+91 98765 43216", agent: "Rahul Kapoor", source: "Referral", budget: "12-16k", status: "New" },
{ id: "8", name: "Meera Nair", phone: "+91 98765 43217", agent: "Priya Mehta", source: "Instagram", budget: "8-12k", status: "Contacted" }];






function DraggableCard({ lead }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "LEAD",
    item: lead,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  return (
    <div
      ref={drag}
      className={`bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-move ${
      isDragging ? "opacity-50" : ""}`
      }>
      
      <h3 className="font-medium text-gray-900 mb-2">{lead.name}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-3.5 h-3.5" />
          <span>{lead.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-3.5 h-3.5" />
          <span>{lead.agent}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Tag className="w-3.5 h-3.5" />
            <span>{lead.source}</span>
          </div>
          <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
            {lead.budget}
          </span>
        </div>
      </div>
    </div>);

}







function Column({ title, leads, onDrop }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "LEAD",
    drop: (item) => onDrop(item, title),
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  const columnColors = {
    New: "bg-blue-50 border-blue-200",
    Contacted: "bg-yellow-50 border-yellow-200",
    "Visit Scheduled": "bg-purple-50 border-purple-200",
    "Visit Completed": "bg-indigo-50 border-indigo-200",
    Booked: "bg-green-50 border-green-200",
    Lost: "bg-red-50 border-red-200"
  };

  return (
    <div
      ref={drop}
      className={`flex-shrink-0 w-80 bg-gray-50 rounded-xl p-4 ${isOver ? "ring-2 ring-blue-500" : ""}`}>
      
      <div className={`flex items-center justify-between mb-4 p-3 rounded-lg border ${columnColors[title]}`}>
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700">
          {leads.length}
        </span>
      </div>
      <div className="space-y-3 min-h-[200px]">
        {leads.map((lead) =>
        <DraggableCard key={lead.id} lead={lead} />
        )}
      </div>
    </div>);

}

export function Pipeline() {
  const [leads, setLeads] = useState(initialLeads);

  const handleDrop = (lead, newStatus) => {
    setLeads((prevLeads) =>
    prevLeads.map((l) => l.id === lead.id ? { ...l, status: newStatus } : l)
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
          <p className="text-gray-600 mt-1">Drag and drop leads to update their status</p>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {COLUMNS.map((column) =>
            <Column
              key={column}
              title={column}
              leads={leads.filter((lead) => lead.status === column)}
              onDrop={handleDrop} />

            )}
          </div>
        </div>
      </div>
    </DndProvider>);

}
