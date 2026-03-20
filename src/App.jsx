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
  PlusCircle,
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  X,
  Save,
  Check,
  ShieldAlert,
  Calendar,
  Database,
  Trash2,
  Edit3
} from 'lucide-react';

const App = () => {
  // --- 狀態管理 ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 步驟管理

  // --- 表單資料庫 (維護用) ---
  const [forms, setForms] = useState([
    { id: 'HR-01', category: '人事類', name: '特別休假申請單', desc: '年度休假申請', status: '啟用' },
    { id: 'HR-02', category: '人事類', name: '加班申請單', desc: '加班紀錄與補休', status: '啟用' },
    { id: 'FIN-01', category: '財務類', name: '專案採購簽呈', desc: '重大採購核銷', status: '啟用' },
    { id: 'ADM-01', category: '行政類', name: '辦公設備領用單', desc: '設備領用與歸還', status: '啟用' },
  ]);

  const [formData, setFormData] = useState({
    template: '',
    subject: '',
    priority: '普通件',
    deadline: '',
    security: '普通'
  });

  // --- 模擬統計數據 ---
  const STATS = [
    { label: '待辦公文', value: 12, color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
    { label: '處理中', value: 5, color: 'text-green-600', bg: 'bg-green-50', icon: FileText },
    { label: '表單庫數量', value: forms.length, color: 'text-amber-600', bg: 'bg-amber-50', icon: Database },
    { label: '本月已結案', value: 48, color: 'text-gray-600', bg: 'bg-gray-100', icon: CheckCircle2 },
  ];

  const toggleModal = () => {
    if (!isModalOpen) setCurrentStep(1); // 開啟時回到步驟一
    setIsModalOpen(!isModalOpen);
  };

  // --- 內容渲染邏輯 ---
  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {STATS.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                        <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                        <Icon size={24} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-64 flex items-center justify-center text-gray-400">
                目前尚無最新公文數據
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-lg mb-4">快速發起</h3>
                <div className="space-y-3">
                  {forms.slice(0, 4).map((f) => (
                    <button 
                      key={f.id} 
                      onClick={toggleModal}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
                    >
                      <span className="text-sm font-medium">{f.name}</span>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'database':
        return (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">公文表單資料庫維護</h3>
              <button className="flex items-center gap-2 bg-[#1677FF] text-white px-4 py-2 rounded-lg text-sm font-bold">
                <Plus size={16} /> 新增表單範本
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs text-gray-500 font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">代碼</th>
                  <th className="px-6 py-4">範本名稱</th>
                  <th className="px-6 py-4">類別</th>
                  <th className="px-6 py-4">狀態</th>
                  <th className="px-6 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {forms.map(form => (
                  <tr key={form.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-400">{form.id}</td>
                    <td className="px-6 py-4 font-bold">{form.name}</td>
                    <td className="px-6 py-4">{form.category}</td>
                    <td className="px-6 py-4 text-green-600 font-medium">{form.status}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600"><Edit3 size={16} /></button>
                      <button className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
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
          <span className="font-bold text-xl tracking-tight">先啟資訊</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'dashboard', label: '控制台首頁', icon: LayoutDashboard },
            { id: 'database', label: '表單庫維護', icon: Database },
            { id: 'inbox', label: '收件匣', icon: Bell },
            { id: 'analytics', label: '效能分析', icon: BarChart3 },
            { id: 'settings', label: '系統設定', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                  activeTab === item.id ? 'bg-blue-50 text-[#1677FF]' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* 觸發按鈕：發起新公文 */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={toggleModal}
            className="w-full flex items-center justify-center gap-2 bg-[#1677FF] hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-all shadow-sm active:scale-95"
          >
            <PlusCircle size={18} />
            <span>發起新公文</span>
          </button>
        </div>
      </aside>

      {/* 主要內容區 Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="搜尋公旨、文號或發文人..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-bold">資深設計師</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">IT Department</p>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-white shadow-sm overflow-hidden ring-1 ring-gray-100">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {renderMainContent()}
        </div>

        {/* --- 整合後的彈出視窗 (Modal Overlay) --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col w-[1000px] border border-slate-200">
              
              {/* Header: 1000 * 80 */}
              <div className="h-[80px] w-full border-b border-slate-100 flex items-center justify-between px-8 bg-white">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-blue-50 text-[#1677FF] rounded flex items-center justify-center">
                      <PlusCircle size={24} />
                   </div>
                   <span className="text-xl font-bold text-slate-800 tracking-tight">發起新公文</span>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1.5 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-md font-medium transition-colors border border-transparent hover:border-slate-200">
                    <Save size={18} /> 儲存
                  </button>
                  <div className="w-px h-6 bg-slate-200 mx-1"></div>
                  <button 
                    disabled={currentStep === 1}
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-medium transition-colors border border-transparent ${currentStep === 1 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-50 hover:border-slate-200'}`}
                  >
                    <ChevronLeft size={18} /> 上一步
                  </button>
                  <button 
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md font-medium transition-colors border border-slate-200"
                  >
                    下一步 <ChevronRight size={18} />
                  </button>
                  <button 
                    onClick={toggleModal}
                    className="flex items-center gap-1.5 px-6 py-2 bg-[#1677FF] hover:bg-blue-700 text-white rounded-md font-medium transition-all shadow-md active:scale-95"
                  >
                    <Check size={18} /> 完成
                  </button>
                  <button onClick={toggleModal} className="ml-4 text-slate-400 hover:text-red-500 transition-colors p-1">
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Content: 1000 * 550 */}
              <div className="h-[550px] w-full overflow-y-auto p-12 bg-white relative">
                
                {/* 步驟流程指示器 (Step Indicator) */}
                <div className="absolute top-8 right-12 flex items-center gap-2">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === step ? 'bg-[#1677FF] text-white shadow-lg ring-4 ring-blue-100' : currentStep > step ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {currentStep > step ? <CheckCircle2 size={16} /> : step}
                      </div>
                      {step < 3 && <div className={`w-10 h-0.5 mx-1 ${currentStep > step ? 'bg-green-500' : 'bg-gray-100'}`}></div>}
                    </div>
                  ))}
                </div>

                <div className="mb-10 border-l-4 border-[#1677FF] pl-5">
                  <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">步驟 {currentStep}：簽呈基本資料填寫</h2>
                  <p className="text-slate-500 mt-2 flex items-center gap-2">
                    <AlertCircle size={16} className="text-blue-400" />
                    請填寫下列表格，即可完成公文預審
                  </p>
                </div>

                <div className="space-y-8 max-w-4xl">
                  {/* 下拉選單 - 連動資料庫 */}
                  <div className="grid grid-cols-12 gap-6 items-center">
                    <label className="col-span-3 text-right font-bold text-slate-700">請選擇表單範本</label>
                    <div className="col-span-9">
                      <select 
                        value={formData.template}
                        onChange={(e) => setFormData({...formData, template: e.target.value})}
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-[#1677FF] outline-none transition-all"
                      >
                        <option value="">-- 請選擇表單範本 (來自資料庫) --</option>
                        {forms.map(f => (
                          <option key={f.id} value={f.id}>{f.category} - {f.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 簽呈主旨 */}
                  <div className="grid grid-cols-12 gap-6 items-start">
                    <label className="col-span-3 text-right font-bold text-slate-700 mt-3">簽呈主旨</label>
                    <div className="col-span-9">
                      <textarea 
                        rows="2"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        placeholder="請輸入明確的主旨內容..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-[#1677FF] outline-none transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>

                  {/* 速別與期限 */}
                  <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-6 grid grid-cols-12 gap-4 items-center">
                      <label className="col-span-5 text-right font-bold text-slate-700">處理速別</label>
                      <div className="col-span-7 flex p-1 bg-slate-100 rounded-lg">
                        {['普通件', '速件', '最速件'].map((p) => (
                          <button 
                            key={p}
                            onClick={() => setFormData({...formData, priority: p})}
                            className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${
                              formData.priority === p 
                                ? 'bg-white text-[#1677FF] shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-6 grid grid-cols-12 gap-4 items-center">
                      <label className="col-span-4 text-right font-bold text-slate-700">簽核期限</label>
                      <div className="col-span-8 relative">
                        <input 
                          type="date"
                          value={formData.deadline}
                          onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                          className="w-full h-11 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                        />
                        <Calendar size={18} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* 機密等級 */}
                  <div className="grid grid-cols-12 gap-6 items-center">
                    <label className="col-span-3 text-right font-bold text-slate-700">機密等級</label>
                    <div className="col-span-9 flex flex-wrap gap-2">
                      {['普通', '密', '機密', '極機密', '絕對機密'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setFormData({...formData, security: s})}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all font-bold text-sm ${
                            formData.security === s 
                              ? 'bg-amber-50 border-amber-500 text-amber-700' 
                              : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <ShieldAlert size={14} className={formData.security === s ? 'text-amber-600' : 'text-slate-300'} />
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 頁尾提示 */}
                  <div className="mt-12 p-5 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-3">
                    <div className="h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="text-sm text-blue-800 leading-relaxed">
                      <strong>系統檢核：</strong> 目前為步驟 {currentStep}。請確保填寫正確，系統將根據您選擇的「表單範本」在後續步驟自動套用對應的簽核路徑與權限控管。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;