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
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MoreVertical,
  ChevronRight,
  Filter
} from 'lucide-react';

// --- 模擬數據 ---
const MOCK_DOCS = [
  { id: 'DOC-2024-001', title: '2024 年度 Q3 採購預算申請單', status: '核決中', priority: '最速件', type: '採購單', creator: '張小明', date: '2024-03-20', progress: 75 },
  { id: 'DOC-2024-002', title: '技術研發部人員增補申請', status: '待辦', priority: '速件', type: '人事單', creator: '李曉華', date: '2024-03-19', progress: 30 },
  { id: 'DOC-2024-003', title: '關於「AI 智能助手」開發計畫草案', status: '處理中', priority: '普通', type: '簽呈', creator: '王大同', date: '2024-03-18', progress: 50 },
  { id: 'DOC-2024-004', title: '雲端伺服器年度維護合約', status: '逾期', priority: '最速件', type: '合約', creator: '陳美玲', date: '2024-03-15', progress: 90 },
  { id: 'DOC-2024-005', title: '清明連假排班異動通知', status: '已結案', priority: '普通', type: '公告', creator: '行政部', date: '2024-03-10', progress: 100 },
];

const STATS = [
  { label: '待辦公文', value: 12, color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
  { label: '處理中', value: 5, color: 'text-green-600', bg: 'bg-green-50', icon: FileText },
  { label: '逾期預警', value: 2, color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle },
  { label: '本月已結案', value: 128, color: 'text-gray-600', bg: 'bg-gray-100', icon: CheckCircle2 },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // 顏色映射
  const getPriorityColor = (p) => {
    switch (p) {
      case '最速件': return 'bg-red-100 text-red-700 border-red-200';
      case '速件': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusColor = (s) => {
    switch (s) {
      case '逾期': return 'text-red-600';
      case '已結案': return 'text-green-600';
      case '待辦': return 'text-blue-600 font-bold';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex h-screen bg-[#F0F2F5] text-[#262626] font-sans">
      {/* 側邊導航欄 Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1677FF] rounded-lg flex items-center justify-center">
            <FileText className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">DocFlow</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'dashboard', label: '控制台', icon: LayoutDashboard },
            { id: 'inbox', label: '收件匣', icon: Bell, count: 12 },
            { id: 'sent', label: '已發送', icon: Send },
            { id: 'analytics', label: '效能分析', icon: BarChart3 },
            { id: 'settings', label: '系統設定', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                activeTab === item.id ? 'bg-blue-50 text-[#1677FF]' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.count && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center justify-center gap-2 bg-[#1677FF] hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-all shadow-sm">
            <Plus size={18} />
            <span>發起新公文</span>
          </button>
        </div>
      </aside>

      {/* 主要內容區 Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 頂部全域搜索 Header */}
        <header className="h-16 bg-white border-bottom border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="搜尋公文主旨、文號或發文人..."
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
                <p className="text-sm font-bold">資深設計師</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">IT Department</p>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 border-2 border-white shadow-sm overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* 捲動區域 Dashboard Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* 戰情指標 Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-gray-400 font-medium">
                  <span className="text-green-500 mr-1">↑ 12%</span>
                  <span>較上周增加</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 效能趨勢圖 (SVG 模擬) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">處理效能趨勢</h3>
                <select className="text-xs bg-gray-50 border-none rounded-md px-2 py-1 outline-none">
                  <option>最近 7 天</option>
                  <option>最近 30 天</option>
                </select>
              </div>
              <div className="relative h-48 w-full flex items-end justify-between gap-2 px-2">
                {/* 簡單的長條模擬圖表 */}
                {[45, 60, 40, 70, 85, 50, 90].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div 
                      className="w-full bg-blue-100 group-hover:bg-[#1677FF] rounded-t-sm transition-all duration-500 relative"
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {h} 件
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">03/{15+i}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 快速捷徑 Quick Actions */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-lg mb-4">快速範本</h3>
              <div className="space-y-3">
                {['一般請假單', '加班申請單', '資訊設備採購', '專案立項簽呈'].map((tpl, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-medium">{tpl}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 公文列表 List Section */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="font-bold text-lg">我的待辦事項</h3>
                <div className="flex bg-gray-100 p-1 rounded-lg text-xs">
                  <button className="px-3 py-1 bg-white shadow-sm rounded-md font-bold">進行中</button>
                  <button className="px-3 py-1 text-gray-500">已追蹤</button>
                  <button className="px-3 py-1 text-gray-500">草稿</button>
                </div>
              </div>
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1677FF]">
                <Filter size={16} />
                <span>篩選條件</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">文號 / 主旨</th>
                    <th className="px-6 py-4">類型</th>
                    <th className="px-6 py-4">緊急程度</th>
                    <th className="px-6 py-4">處理進度</th>
                    <th className="px-6 py-4">狀態</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_DOCS.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-mono mb-1">{doc.id}</span>
                          <span className="font-bold text-sm group-hover:text-[#1677FF] transition-colors">{doc.title}</span>
                          <span className="text-xs text-gray-500 mt-1">發起人：{doc.creator} • {doc.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{doc.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getPriorityColor(doc.priority)} font-bold`}>
                          {doc.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 w-48">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-700 ${doc.status === '逾期' ? 'bg-red-500' : 'bg-[#1677FF]'}`}
                              style={{ width: `${doc.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] text-gray-400 w-8">{doc.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium flex items-center gap-1.5 ${getStatusColor(doc.status)}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${doc.status === '逾期' ? 'bg-red-500 animate-pulse' : (doc.status === '已結案' ? 'bg-green-500' : 'bg-blue-500')}`}></div>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1 hover:bg-gray-200 rounded text-gray-400">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-center">
              <button className="text-sm font-medium text-[#1677FF] hover:underline">查看全部公文記錄</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;