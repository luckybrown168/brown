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
  Box,
  Sun,
  Moon,
  Printer,
  Home,
  FileCheck2,
  UserCheck,
  Play
} from 'lucide-react';

// --- 全域設計規範 (Design Tokens) ---
const mingLiUStyle = { fontFamily: '"PMingLiU", "新細明體", serif' };

// --- 核心組件：優化後的時間選擇器 ---
const DateTimePicker = ({ id, label, value, onChange }) => {
  const [tempDate, setTempDate] = useState('');
  const [tempHour, setTempHour] = useState('09');
  const [tempMin, setTempMin] = useState('00');
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (value && !isConfirmed) {
      const parts = value.split(' ');
      if (parts.length >= 3) {
        setTempDate(parts[0]);
        setIsConfirmed(true);
      }
    }
  }, [value, isConfirmed]);

  const handleConfirm = (period) => {
    if (!tempDate) return;
    const formattedValue = `${tempDate} ${period} ${tempHour}:${tempMin}`;
    onChange(id, formattedValue);
    setIsConfirmed(true);
  };

  return (
    <div className={`p-4 border rounded-xl transition-all ${isConfirmed ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-slate-400 uppercase">1. 預選日期</span>
          <input 
            type="date" 
            style={mingLiUStyle}
            value={tempDate}
            onChange={(e) => { setTempDate(e.target.value); setIsConfirmed(false); }}
            className="border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-slate-400 uppercase">2. 預選時間</span>
          <div className="flex items-center gap-1">
            <select 
              style={mingLiUStyle}
              value={tempHour}
              onChange={(e) => { setTempHour(e.target.value); setIsConfirmed(false); }}
              className="border border-slate-300 rounded px-1 py-1 text-sm outline-none bg-white"
            >
              {Array.from({length: 12}, (_, i) => String(i+1).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <span className="text-slate-400">:</span>
            <select 
              style={mingLiUStyle}
              value={tempMin}
              onChange={(e) => { setTempMin(e.target.value); setIsConfirmed(false); }}
              className="border border-slate-300 rounded px-1 py-1 text-sm outline-none bg-white"
            >
              <option value="00">00</option>
              <option value="30">30</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-slate-400 uppercase">3. 點擊確認</span>
          <div className="flex items-center gap-1">
            <button 
              type="button"
              onClick={() => handleConfirm('上午')}
              className={`px-3 py-1 text-xs font-bold rounded border transition-all flex items-center gap-1 ${value?.includes('上午') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
            >
              <Sun size={12} /> 上午
            </button>
            <button 
              type="button"
              onClick={() => handleConfirm('下午')}
              className={`px-3 py-1 text-xs font-bold rounded border transition-all flex items-center gap-1 ${value?.includes('下午') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
            >
              <Moon size={12} /> 下午
            </button>
          </div>
        </div>

        {isConfirmed && (
          <div className="ml-auto flex items-center gap-1 text-green-600 font-bold text-xs animate-in zoom-in-50">
            <CheckCircle2 size={16} /> 已確認
          </div>
        )}
      </div>
    </div>
  );
};

// --- 核心組件：智慧渲染引擎 ---
const SmartFormEngine = ({ schema, formValues, onInputChange, onSubmit }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm font-serif relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] opacity-[0.03] rotate-12 pointer-events-none">
          <FileText size={200} />
        </div>

        <h3 className="text-xl font-bold mb-8 text-center tracking-widest text-slate-800 relative z-10">
          ** {schema.title.split('').join(' ')} **
        </h3>
        
        <div className="space-y-6 relative z-10">
          {schema.fields.map(field => {
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
                    onChange={(e) => onInputChange(field.id, e.target.value)}
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
                    onChange={(e) => onInputChange(field.id, e.target.value)}
                    className="w-full border border-slate-400 p-2 rounded text-sm outline-none focus:border-blue-500 shadow-sm"
                  />
                )}

                {field.type === "datetime" && (
                  <DateTimePicker 
                    id={field.id}
                    label={field.label}
                    value={formValues[field.id]}
                    onChange={onInputChange}
                  />
                )}

                {field.type === "button" && (
                  <button 
                    type="button"
                    onClick={onSubmit}
                    className="w-full mt-4 bg-[#1677FF] text-white py-4 rounded-xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
                  >
                    <Send size={20} /> {field.label}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 border-t border-dashed border-slate-200 pt-6 leading-relaxed text-red-600" style={mingLiUStyle}>
          <div className="font-bold mb-2 text-[14px]">智慧表單備註 ：</div>
          <div className="space-y-1.5 text-[13px]">
            <div className="flex gap-1" style={{ paddingLeft: '2em' }}><span className="font-bold">A.</span><span>時間欄位：選擇日期與小時/分鐘為預選，必須點擊「上午/下午」按鈕方完成確認。</span></div>
            <div className="flex gap-1" style={{ paddingLeft: '2em' }}><span className="font-bold">B.</span><span>此流程設計旨在降低誤觸風險並強化公文簽核之嚴謹性。</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 組件：提交成功後的公文總結頁面 ---
const SubmissionSummary = ({ schema, values, onReset }) => {
  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-10 shadow-2xl relative font-serif overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 border-4 border-red-500 rounded-full flex flex-col items-center justify-center rotate-12 opacity-80 pointer-events-none">
          <span className="text-red-500 font-black text-xs">先啟資訊簽核件</span>
          <span className="text-red-500 font-black text-lg border-y-2 border-red-500 my-1">已 收 訖</span>
          <span className="text-red-500 font-black text-[10px]">{new Date().toLocaleDateString()}</span>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-slate-800 tracking-[0.4em] underline decoration-4 underline-offset-8">電子簽核公文存根</h2>
        </div>

        <div className="grid grid-cols-2 gap-y-6 border-l-4 border-blue-500 pl-6 mb-10">
          {schema.fields.filter(f => f.type !== 'button').map(field => {
             if (field.dependsOn) {
               const parentValue = values[field.dependsOn];
               const showConditions = Array.isArray(field.showIf) ? field.showIf : [field.showIf];
               if (!showConditions.includes(parentValue)) return null;
             }
             return (
               <div key={field.id} className={field.width === 'w-full' ? 'col-span-2' : 'col-span-1'}>
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{field.label}</p>
                 <p className="text-sm font-bold text-slate-700">{values[field.id] || '( 未填寫 )'}</p>
               </div>
             );
          })}
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 mb-4 flex items-center gap-2">
            <UserCheck size={14} /> 簽核流向 (預計路徑)
          </p>
          <div className="flex items-center gap-4">
            {[
              { role: '申請人', name: '資深設計師 Felix' },
              { role: '部門主管', name: '張部長' },
              { role: '行政部', name: '會簽單位' }
            ].map((step, i, arr) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-green-500 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>
                    {i === 0 ? <Check size={14}/> : i + 1}
                  </div>
                  <p className="text-[10px] font-bold text-slate-600">{step.role}</p>
                </div>
                {i < arr.length - 1 && <ArrowRight size={14} className="text-slate-200 mb-4" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center">
           <p className="text-xs text-slate-400 italic">系統序號: EB-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
           <div className="flex gap-3">
              <button type="button" className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">
                <Printer size={14} /> 列印此單
              </button>
              <button 
                type="button"
                onClick={onReset}
                className="flex items-center gap-2 px-6 py-2 bg-[#1677FF] text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all"
              >
                <Plus size={14} /> 發起下一筆
              </button>
           </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-100 p-6 rounded-3xl flex items-center gap-4">
         <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
           <FileCheck2 size={24} />
         </div>
         <div>
           <h4 className="font-black text-green-800 text-lg">公文提交成功！</h4>
           <p className="text-green-600 text-xs font-bold">已正式將此件送往部門主管進行核閱，您可在「首頁」追蹤進度。</p>
         </div>
      </div>
    </div>
  );
};

const App = () => {
  // --- 狀態管理 ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- No-Code 渲染引擎核心狀態 ---
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
        id: "ot_start_time", 
        label: "加班開始日期時間", 
        type: "datetime", 
        dependsOn: "ot_type", 
        showIf: ["事前", "事後"], 
        width: "w-full" 
      },
      { 
        id: "ot_end_time", 
        label: "加班結束日期時間", 
        type: "datetime", 
        dependsOn: "ot_type", 
        showIf: ["事前", "事後"], 
        width: "w-full" 
      },
      { 
        id: "ot_reason", 
        label: "加班事由", 
        type: "text", 
        dependsOn: "ot_type", 
        showIf: ["事前", "事後"], 
        width: "w-full" 
      },
      { 
        id: "submit_btn", 
        label: "提交簽核表單", 
        type: "button", 
        width: "w-full" 
      }
    ]
  });

  const [formValues, setFormValues] = useState({});
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  const handleInputChange = (id, value) => {
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = () => {
    if (!formValues.category) return;
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setFormValues({});
    setIsSubmitted(false);
  };

  // --- 模擬統計數據 ---
  const STATS = [
    { label: '待辦公文', value: 12, color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
    { label: '處理中', value: 5, color: 'text-green-600', bg: 'bg-green-50', icon: FileText },
    { label: '表單庫數量', value: 4, color: 'text-amber-600', bg: 'bg-amber-50', icon: Database },
    { label: '本月已結案', value: 48, color: 'text-gray-600', bg: 'bg-gray-100', icon: CheckCircle2 },
  ];

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
            <div className="grid grid-cols-3 gap-6">
               <div className="col-span-2 bg-white rounded-3xl border border-gray-100 p-8 h-80 flex flex-col items-center justify-center text-slate-300 italic border-dashed border-4">
                  <Play size={48} className="opacity-10 mb-4" />
                  動態公文流量監視中
               </div>
               <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-xl mb-2">先啟資訊系統公告</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">2026 年度智慧建單引擎已全面上線，支援多級連動與電子存根功能。</p>
                  </div>
                  <button type="button" className="bg-[#1677FF] py-3 rounded-xl font-bold text-sm">查看詳情</button>
               </div>
            </div>
          </div>
        );
      case 'inbox':
        return (
          <div className="h-full flex gap-8 animate-in fade-in duration-500">
            <div className={`w-1/3 flex flex-col gap-6 transition-opacity duration-500 ${isSubmitted ? 'opacity-30 pointer-events-none' : ''}`}>
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
                          連動自: {field.dependsOn}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-[#F8FAFC] rounded-[3rem] border border-gray-200 p-12 overflow-y-auto shadow-inner relative">
              {!isSubmitted ? (
                <>
                  <div className="absolute top-8 left-12 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#1677FF]"><Eye size={20} /></div>
                    <div>
                      <h3 className="font-black text-slate-800 text-lg">智慧引擎輸出預覽</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Real-time Form Building</p>
                    </div>
                  </div>
                  <div className="mt-16">
                    <SmartFormEngine 
                      schema={myFormSchema} 
                      formValues={formValues} 
                      onInputChange={handleInputChange} 
                      onSubmit={handleFormSubmit}
                    />
                  </div>
                </>
              ) : (
                <SubmissionSummary 
                  schema={myFormSchema} 
                  values={formValues} 
                  onReset={resetForm} 
                />
              )}
            </div>
          </div>
        );
      case 'database':
        return (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-700">公文表單類型庫</h3>
              <button type="button" className="flex items-center gap-2 bg-[#1677FF] text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg"><Plus size={18} /> 新增表單</button>
            </div>
            <div className="p-10 text-center text-slate-300 italic">資料庫內容載入中...</div>
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