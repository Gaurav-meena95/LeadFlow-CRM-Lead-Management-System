import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, GitBranch, Calendar,
  UserCog, Settings, LogOut, Menu, X, Building2
} from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/pipeline', label: 'Pipeline', icon: GitBranch },
  { to: '/visits', label: 'Visits', icon: Calendar },
  { to: '/agents', label: 'Agents', icon: UserCog, roles: ['admin'] },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className={`${collapsed ? 'w-16' : 'w-60'} bg-slate-900 text-white flex flex-col transition-all duration-200 shrink-0`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Building2 size={20} className="text-indigo-400" />
            <span className="font-bold text-lg">LeadFlow</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-slate-400 hover:text-white">
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {links.map(({ to, label, icon: Icon, roles }) => {
          if (roles && !roles.includes(user?.role)) return null;
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-slate-400 hover:text-red-400 text-sm w-full px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
