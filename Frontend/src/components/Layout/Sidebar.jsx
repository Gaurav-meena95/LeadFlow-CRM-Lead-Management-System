import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Columns3,
    Calendar,
    UserSquare2,
    Settings,
    LogOut,
    X
} from
    "lucide-react";






const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/leads", label: "Leads", icon: Users },
    { path: "/pipeline", label: "Pipeline", icon: Columns3 },
    { path: "/visits", label: "Visits", icon: Calendar },
    { path: "/agents", label: "Agents", icon: UserSquare2 },
    { path: "/settings", label: "Settings", icon: Settings }];


export function Sidebar({ isOpen, onClose }) {
    return (
        <>
            {/* Mobile overlay */}
            {isOpen &&
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose} />

            }

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64`
                }>

                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg" />
                            <span className="font-semibold text-gray-900">LeadFlow CRM</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden p-1 hover:bg-gray-100 rounded-md">

                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) =>
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/"}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ?
                                        "bg-blue-50 text-blue-700" :
                                        "text-gray-700 hover:bg-gray-50"}`

                                }>

                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        )}
                    </nav>

                    {/* Logout */}
                    <div className="p-3 border-t border-gray-200">
                        <NavLink
                            to="/login"
                            className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">

                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </NavLink>
                    </div>
                </div>
            </aside>
        </>);

}