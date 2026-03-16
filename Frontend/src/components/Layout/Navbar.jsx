import { Search, Bell, Menu, ChevronDown } from "lucide-react";
import { useState } from "react";





export function Navbar({ onMenuClick }) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 lg:left-64 z-30">
            <div className="h-full px-4 lg:px-6 flex items-center justify-between">
                {/* Left section */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">

                        <Menu className="w-5 h-5 text-gray-700" />
                    </button>

                    {/* Search */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search leads, contacts..."
                            className="w-80 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell className="w-5 h-5 text-gray-700" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                    {/* User Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">

                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">JD</span>
                            </div>
                            <div className="hidden md:block text-left">
                                <div className="text-sm font-medium text-gray-900">John Doe</div>
                                <div className="text-xs text-gray-500">Admin</div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
                        </button>

                        {/* Dropdown */}
                        {showProfileMenu &&
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowProfileMenu(false)} />

                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="font-medium text-gray-900">John Doe</div>
                                        <div className="text-sm text-gray-500">john.doe@example.com</div>
                                    </div>
                                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                        Profile Settings
                                    </button>
                                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                        Help & Support
                                    </button>
                                    <div className="border-t border-gray-100 mt-1 pt-1">
                                        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </header>);

}