import React, { useState, useRef, useEffect } from 'react';
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
  X,
  Save, 
  Check, 
  Calendar,
  Database,
  Trash2,
  Edit3,
  Type,
  Paperclip,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  GripVertical,
  MousePointer2,
  ListOrdered,
  Settings2,
  Eye,
  Box
} from 'lucide-react';

// --- 全域設計規範 (Design Tokens) ---
const mingLiUStyle = { fontFamily: '"PMingLiU", "新細明體", serif' };

const App = () => {
  // --- 狀態管理 ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // --- No-Code 渲染引擎核心狀態 (Schema) ---
  const [myFormSchema, setMyFormSchema] = useState({
    title: "差勤加班智慧表單",
    fields: [
      { 
        id: "category", 
        label: "選擇類別", 
        type: "select", 
        options: ["行政類", "銷售類", "差勤類", "系統類"], 
        width: "w-full" 
      },
      { 
        id: "leave_type", 
        label: "假單類別", 
        type: "select", 
        options: ["特休", "事假", "病假", "喪假", "加班"], 
        dependsOn: "category", 
        showIf: "差勤類", 
        width: "w-full" 
      },
      { 
        id: "ot_type", 
        label: "加班類型", 
        type: "select", 
        options: ["事前", "事後"], 
        dependsOn: "leave_type", 
        showIf: "加班", 
        width: "w-full" 
      },
      { 
        id: "ot_reason", 
        label: "加班事由", 
        type: "text", 
        dependsOn: "ot_type", 
        showIf: ["事前", "事後"], // 只要選了類型就開啟
        width: "w-full" 
      },
      { 
        id: "submit_btn", 
        label: "提交表單", 
        type: "button", 
        width: "w-full" 
      }
    ]
  });

  // 表單輸入值追蹤
  const [formValues, setFormValues] = useState({});
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  // --- 模擬統計數據 ---
  const STATS = [
    { label: '待辦公文', value: 12, color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
    { label: '處理中', value: 5, color: 'text-green-600', bg: 'bg-green-50', icon: FileText },
    { label: '表單庫數量', value: 4, color: 'text-amber-600', bg: 'bg-amber-50', icon: Database },
    { label: '本月已結案', value: 48, color: 'text-gray-600', bg: 'bg-gray-100', icon: CheckCircle2 },
  ];

  // --- 核心組件：智慧渲染引擎 ---
  const SmartFormEngine = ({ schema }) => {
    const handleInputChange = (id, value) => {
      setFormValues(prev => {
        const newState = { ...prev, [id]: value };
        // 簡單的邏輯優化：如果父項改變，清除所有子項的值
        return newState;
      });
    };

    return (
      <div className="space-y-6">
        <div className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm font-serif">
          <h3 className="text-xl font-bold mb-8 text-center tracking-widest text-slate-800">** {schema.title.split('').join(' ')} **</h3>
          
          <div className="space-y-6">
            {schema.fields.map(field => {
              // 實作階層連動邏輯
              if (field.dependsOn) {
                const parentValue = formValues[field.dependsOn];
                const showConditions = Array.isArray(field.showIf) ? field.showIf : [field.showIf];
                if (!showConditions.includes(parentValue)) return null;
              }

              return (
                <div key={field.id} className={`${field.width} animate-in fade-in slide-in-from-top-2 duration-300`}>
                  {field.type !== "button" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 bg-[#1677FF] rounded-full"></div>
                      <label className="text-sm font-bold text-slate-700 underline decoration-slate-200 underline-offset-4">{field.label}：</label>
                    </div>
                  )}

                  {field.type === "select" && (
                    <select 
                      style={mingLiUStyle}
                      value={formValues[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full border border-slate-400 p-2 rounded text-sm outline-none focus:border-blue-500 bg-white shadow-sm"
                    >
                      <option value="">-- 請選擇 --</option>
                      {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  )}

                  {(field.type === "text" || field.type === "number") && (
                    <input 
                      type={field.type}
                      style={mingLiUStyle}
                      placeholder={`請輸入${field.label}`}
                      value={formValues[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full border border-slate-400 p-2 rounded text-sm outline-none focus:border-blue-500 shadow-sm"
                    />
                  )}

                  {field.type === "button" && (
                    <button 
                      className="w-full mt-4 bg-[#1677FF] text-white py-3 rounded-xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Send size={18} /> {field.label}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* 企業風格備註區 */}
          <div className="mt-10 border-t border-dashed border-slate-200 pt-6 leading-relaxed text-red-600" style={mingLiUStyle}>
            <div className="font-bold mb-2 text-[14px]">智慧表單備註 ：</div>
            <div className="space-y-1.5 text-[13px]">
              <div className="flex gap-1" style={{ paddingLeft: '2em' }}><span className="font-bold">A.</span><span>此表單採用四層連動架構：類別 {'->'} 假單 {'->'} 類型 {'->'} 事由。</span></div>
              <div className="flex gap-1" style={{ paddingLeft: '2em' }}><span className="font-bold">B.</span><span>「加班」項目須明確區分事前申請或事後補辦。</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const toggleModal = () => {
    if (!isModalOpen) setCurrentStep(1);
    setIsModalOpen(!isModalOpen);
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {STATS.map((stat, idx) => {
                const IconComp = stat.icon;
                return (
                  <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <div><p className="text-sm text-gray-400 mb-1 font-bold">{stat.label}</p><h3 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h3></div>
                      <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}><IconComp size={24} /></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'inbox':
        return (
          <div className="h-full flex gap-8 animate-in fade-in duration-500">
            {/* 左側：階層邏輯視圖 */}
            <div className="w-1/3 flex flex-col gap-6">
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-6 text-[#1677FF]">
                  <Box className="w-6 h-6" />
                  <span className="font-black text-xl">智慧引擎邏輯配置</span>
                </div>
                
                <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
                  {myFormSchema.fields.map((field) => (
                    <div 
                      key={field.id}
                      onClick={() => setSelectedFieldId(field.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col group ${selectedFieldId === field.id ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 hover:border-blue-200 bg-white'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-slate-700">{field.label}</p>
                        <span className="text-[9px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-400 uppercase">{field.type}</span>
                      </div>
                      {field.dependsOn && (
                        <div className="flex items-center gap-1 text-[10px] text-[#1677FF] font-bold">
                          <ArrowRight size={10} />
                          連動自: {field.dependsOn} (值為 {Array.isArray(field.showIf) ? field.showIf.join('/') : field.showIf})
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右側：渲染引擎即時輸出 */}
            <div className="flex-1 bg-[#F8FAFC] rounded-[3rem] border border-gray-200 p-12 overflow-y-auto shadow-inner relative">
              <div className="absolute top-8 left-12 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#1677FF]"><Eye size={20} /></div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg">智慧引擎輸出預覽</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Multi-Level Logic Render</p>
                </div>
              </div>
              
              <div className="mt-16">
                <SmartFormEngine schema={myFormSchema} />
              </div>

              <div className="mt-8 flex justify-center">
                <div className="px-6 py-2 bg-white border shadow-sm rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                  請測試連動：差勤類 {'->'} 加班 {'->'} 事前/事後
                </div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#F0F2F5] text-[#262626] font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-[2px_0_12px_rgba(0,0,0,0.02)] z-20">
        <div className="p-8 flex items-center gap-3"><div className="w-10 h-10 bg-[#1677FF] rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100"><FileText className="text-white w-6 h-6" /></div><span className="font-black text-2xl tracking-tighter text-slate-800 italic">先啟資訊</span></div>
        <nav className="flex-1 px-4 space-y-1 mt-6">
          {[
            { id: 'dashboard', label: '首頁', icon: LayoutDashboard },
            { id: 'database', label: '表單庫維護', icon: Database },
            { id: 'inbox', label: '智慧建單', icon: MousePointer2 },
            { id: 'analytics', label: '效能分析', icon: BarChart3 },
            { id: 'settings', label: '系統設定', icon: Settings },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all font-black text-sm ${activeTab === item.id ? 'bg-blue-50 text-[#1677FF] shadow-sm shadow-blue-50' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'}`}><div className="flex items-center gap-3"><item.icon size={20} /><span>{item.label}</span></div></button>
          ))}
        </nav>
        <div className="p-6 border-t border-gray-50"><button onClick={toggleModal} className="w-full flex items-center justify-center gap-2 bg-[#1677FF] hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-2xl shadow-blue-200 active:scale-95"><PlusCircle size={20} /><span>發起新公文</span></button></div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 shadow-sm z-10">
          <div className="relative w-[450px] group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1677FF] transition-colors" size={20} /><input type="text" placeholder="搜尋簽呈主旨..." className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs focus:bg-white focus:border-blue-300 outline-none transition-all font-bold shadow-inner" /></div>
          <div className="flex items-center gap-6"><div className="p-3 text-slate-400 hover:bg-slate-100 rounded-full cursor-pointer relative"><Bell size={22} /><span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span></div><div className="flex items-center gap-4 pl-6 border-l border-gray-100"><div className="text-right"><p className="text-xs font-black text-slate-800">資深設計師</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">IT Management Dept.</p></div><div className="w-12 h-12 bg-blue-50 rounded-2xl border-2 border-white shadow-lg overflow-hidden ring-1 ring-slate-100 transform hover:scale-105 transition-transform cursor-pointer"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" /></div></div></div>
        </header>
        <div className="flex-1 overflow-y-auto p-12 bg-[#F8FAFC]">{renderMainContent()}</div>
      </main>
    </div>
  );
};

export default App;