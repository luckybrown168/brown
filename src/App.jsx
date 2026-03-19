import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Send,
  BarChart3,
  Settings,
  Search,
  Bell,
  Plus,
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen bg-[#F0F2F5] text-[#262626] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1677FF] rounded-lg flex items-center justify-center">
            <FileText className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">DocFlow</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'inbox', label: 'Inbox', icon: Bell },
            { id: 'sent', label: 'Sent', icon: Send },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-[#1677FF]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center justify-center gap-2 bg-[#1677FF] hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-all shadow-sm">
            <Plus size={18} />
            <span>New Document</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search documents, people, or tags..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1677FF] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-bold">Alex Chen</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                  IT Department
                </p>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 border-2 border-white shadow-sm overflow-hidden">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="avatar"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
            <h2 className="text-xl font-bold text-gray-800">No data yet</h2>
            <p className="text-sm text-gray-500 mt-2">
              Create your first document to populate this dashboard.
            </p>
            <button className="mt-6 inline-flex items-center gap-2 bg-[#1677FF] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm">
              <Plus size={18} />
              <span>New Document</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
