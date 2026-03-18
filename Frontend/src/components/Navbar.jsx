import React from 'react';
import { Bell, User } from 'lucide-react';

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
      <div />
      <div className="flex items-center gap-4">
        <button className="text-slate-500 hover:text-slate-700">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <User size={16} className="text-indigo-600" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-slate-800">{user?.name}</p>
            <p className="text-slate-500 capitalize text-xs">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
