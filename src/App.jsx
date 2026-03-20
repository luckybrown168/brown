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
  Edit3,
  Bold,
  Italic,
  Underline,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Paperclip,
  Users,
  ArrowRight
} from 'lucide-react';

const App = () => {
  // --- 狀態管理 ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 步驟管理 (1, 2, 3)
  const [otType, setOtType] = useState('事前'); // 加班類別：事前/事後

  // --- 表單資料庫 (維護用) ---
  const [forms] = useState([
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
    if (!isModalOpen) setCurrentStep(1);
    setIsModalOpen(!isModalOpen);
  };

  // --- 步驟二：加班申請單模板組件 ---
  const OvertimeFormTemplate = () => (
    <div className="border border-slate-300 rounded shadow-sm bg-white overflow-hidden animate-in fade-in duration-500">
      {/* 模擬編輯器工具列 */}
      <div className="bg-slate-100 border-b border-slate-300 p-2 flex items-center gap-2 flex-wrap">
        <select className="text-xs border border-slate-300 rounded px-1 h-6 outline-none bg-white"><option>字型</option></select>
        <select className="text-xs border border-slate-300 rounded px-1 h-6 outline-none bg-white"><option>大小</option></select>
        <div className="w-px h-4 bg-slate-300 mx-1"></div>
        <button className="p-1 hover:bg-slate-200 rounded text-slate-600"><Bold size={14} /></button>
        <button className="p-1 hover:bg-slate-200 rounded text-slate-600"><Italic size={14} /></button>
        <button className="p-1 hover:bg-slate-200 rounded text-slate-600"><Underline size={14} /></button>
        <div className="w-px h-4 bg-slate-300 mx-1"></div>
        <button className="p-1 hover:bg-slate-200 rounded text-slate-600"><AlignLeft size={14} /></button>
        <button className="p-1 hover:bg-slate-200 rounded text-slate-600"><AlignCenter size={14} /></button>
        <button className="p-1 hover:bg-slate-200 rounded text-slate-600"><AlignRight size={14} /></button>
        <div className="w-px h-4 bg-slate-300 mx-1"></div>
        <button className="p-1 hover:bg-slate-200 rounded text-slate-600"><List size={14} /></button>
      </div>

      {/* 表格內容區 */}
      <div className="p-8 font-serif">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold tracking-[0.2em]">** 加 班 工 時 申 請 單 - {otType === '事前' ? '事 前 申 請' : '事 後 申 請'} **</h3>
        </div>

        <table className="w-full border-collapse border border-slate-400 text-sm">
          <tbody>
            <tr className="bg-slate-50">
              <td className="border border-slate-400 p-3 text-center font-bold w-1/6 leading-relaxed">員 工<br/>編 號</td>
              <td className="border border-slate-400 p-3 text-center font-bold w-1/4 leading-relaxed">姓 名</td>
              <td className="border border-slate-400 p-3 text-center font-bold w-1/3 leading-relaxed">事 由</td>
              <td className="border border-slate-400 p-3 text-center font-bold w-1/6 leading-relaxed">加班<br/>類別</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-3"><input type="text" className="w-full border border-slate-300 p-1 rounded text-center outline-none focus:border-blue-500 transition-colors" placeholder="輸入編號"/></td>
              <td className="border border-slate-400 p-3"><input type="text" className="w-full border border-slate-300 p-1 rounded text-center outline-none focus:border-blue-500 transition-colors" placeholder="輸入姓名"/></td>
              <td className="border border-slate-400 p-3"><textarea className="w-full border border-slate-300 p-1 rounded h-16 resize-none outline-none focus:border-blue-500 transition-colors" placeholder="請輸入加班原因..."></textarea></td>
              <td className="border border-slate-400 p-3 text-center align-middle">
                {/* 加班類別選擇 BAR */}
                <div className="inline-flex bg-slate-100 p-1 rounded-md border border-slate-200 shadow-inner">
                  <button 
                    onClick={() => setOtType('事前')}
                    className={`px-3 py-1.5 text-xs font-bold rounded transition-all duration-200 ${otType === '事前' ? 'bg-[#1677FF] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    事前
                  </button>
                  <button 
                    onClick={() => setOtType('事後')}
                    className={`px-3 py-1.5 text-xs font-bold rounded transition-all duration-200 ${otType === '事後' ? 'bg-[#1677FF] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    事後
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-3 bg-slate-50 text-center font-bold">實際加班<br/>起訖時間</td>
              <td colSpan="3" className="border border-slate-400 p-3">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span>自</span>
                  <select className="border border-slate-300 rounded px-1 outline-none"><option>2024</option></select>年
                  <select className="border border-slate-300 rounded px-1 outline-none"><option>1</option></select>月
                  <select className="border border-slate-300 rounded px-1 outline-none"><option>1</option></select>日
                  <select className="border border-slate-300 rounded px-1 outline-none"><option>1</option></select>時
                  <select className="border border-slate-300 rounded px-1 outline-none"><option>0</option></select>分起
                </div>
                <div className="flex items-center gap-2 flex-wrap text-xs mt-3">
                  <span>至</span>
                  <select className="border border-slate-300 rounded px-1 outline-none"><option>2024</option></select>年
                  <select className="border border-slate-300 rounded px-1 outline-none"><option>1</option></select>月
                  <select className="border border-slate-300 rounded px-1 outline-none"><option>1</option></select>日
                  <select className="border border-slate-300 rounded px-1 outline-none"><option>1</option></select>時
                  <select className="border border-slate-300 rounded px-1 outline-none"><option>0</option></select>分止
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-3 bg-slate-50 text-center font-bold">工時數</td>
              <td colSpan="3" className="border border-slate-400 p-3 text-xs">
                共計 <select className="border border-slate-300 rounded px-1 mx-1 outline-none"><option>0</option></select> 日 
                <select className="border border-slate-300 rounded px-1 mx-1 outline-none"><option>0</option></select> 時
                <select className="border border-slate-300 rounded px-1 mx-1 outline-none"><option>0</option></select> 分
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-3 bg-slate-50 text-center font-bold text-red-600 whitespace-nowrap">選項 *</td>
              <td colSpan="3" className="border border-slate-400 p-3 text-xs">
                <label className="inline-flex items-center gap-2 mr-6 cursor-pointer hover:text-blue-600 group">
                  <input type="radio" name="ot_option" className="form-radio text-[#1677FF] focus:ring-[#1677FF]" /> 
                  <span className="group-hover:font-bold transition-all underline decoration-dotted underline-offset-4">換補休</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer hover:text-blue-600 group">
                  <input type="radio" name="ot_option" className="form-radio text-[#1677FF] focus:ring-[#1677FF]" /> 
                  <span className="group-hover:font-bold transition-all underline decoration-dotted underline-offset-4">計薪</span>
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 max-w-4xl animate-in fade-in duration-300">
            <div className="grid grid-cols-12 gap-6 items-center">
              <label className="col-span-3 text-right font-bold text-slate-700">請選擇表單範本</label>
              <div className="col-span-9">
                <select 
                  value={formData.template}
                  onChange={(e) => setFormData({...formData, template: e.target.value})}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer font-bold text-slate-600"
                >
                  <option value="">-- 請選擇表單範本 (來自資料庫) --</option>
                  {forms.map(f => (
                    <option key={f.id} value={f.id}>{f.category} - {f.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-6 items-start">
              <label className="col-span-3 text-right font-bold text-slate-700 mt-3">簽呈主旨</label>
              <div className="col-span-9">
                <textarea 
                  rows="2"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="請輸入明確的主旨內容..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none font-bold text-slate-700"
                ></textarea>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-6 grid grid-cols-12 gap-4 items-center">
                <label className="col-span-5 text-right font-bold text-slate-700">處理速別</label>
                <div className="col-span-7 flex p-1 bg-slate-100 rounded-lg">
                  {['普通件', '速件', '最速件'].map((p) => (
                    <button 
                      key={p}
                      onClick={() => setFormData({...formData, priority: p})}
                      className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${
                        formData.priority === p ? 'bg-white text-[#1677FF] shadow-sm' : 'text-slate-500 hover:text-slate-700'
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
                    className="w-full h-11 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-700"
                  />
                  <Calendar size={18} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-10">
            {/* 第二步的主旨編輯區 */}
            <div className="flex items-center gap-2 mb-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100 shadow-inner group transition-all hover:bg-blue-50">
               <span className="font-bold text-slate-700 whitespace-nowrap">簽呈主旨：</span>
               <input 
                 type="text"
                 value={formData.subject}
                 onChange={(e) => setFormData({...formData, subject: e.target.value})}
                 placeholder="（請輸入主旨）"
                 className="flex-1 bg-transparent text-[#1677FF] font-black text-lg underline decoration-2 underline-offset-4 outline-none border-none focus:ring-0 placeholder:text-blue-200"
               />
               <Edit3 size={16} className="text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                <Type size={16} className="text-slate-400" /> 請填寫下列表格內容：
              </p>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 text-[#1677FF] text-xs font-bold hover:underline bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                  <Paperclip size={14} /> 上傳附件
                </button>
              </div>
            </div>

            {/* 根據選擇的範本決定載入的表格內容 */}
            {formData.template === 'HR-02' ? (
              <OvertimeFormTemplate />
            ) : (
               <div className="h-64 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl italic text-sm gap-3">
                 <Database size={40} className="opacity-20" />
                 請回上一步選擇「人事類 - 加班申請單」以加載對應表格
               </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-200 pb-4">
                <CheckCircle2 className="text-green-500" size={24} /> 最終發布確認
              </h3>
              
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">公文主旨</p>
                    <p className="text-lg font-bold text-[#1677FF]">{formData.subject}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">對應範本</p>
                    <p className="text-sm font-bold text-slate-700">{forms.find(f => f.id === formData.template)?.name || '未選取'}</p>
                  </div>
                  <div className="flex gap-10">
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">速別</p>
                      <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">{formData.priority}</span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">機密等級</p>
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold border border-amber-100">{formData.security}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">預計簽核路徑</p>
                  <div className="space-y-4">
                    {[
                      { role: '申請人', name: '資深設計師 Felix', status: '當前' },
                      { role: '部門主管', name: '張部長', status: '待處理' },
                      { role: '人事單位', name: '李組長', status: '待處理' },
                      { role: '決策層', name: '王總經理', status: '最終核定' }
                    ].map((step, i, arr) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400'}`}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-700 leading-none mb-1">{step.role}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{step.name}</p>
                        </div>
                        {i < arr.length - 1 && <ArrowRight size={14} className="text-slate-200" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                 <AlertCircle className="text-amber-500 mt-0.5" size={18} />
                 <p className="text-xs text-amber-700 leading-relaxed font-bold">
                   請注意：一旦送出簽核，公文內容將被鎖定為唯讀狀態。若需修改內容，請在點擊下方「送出簽核」按鈕前，使用「上一步」功能返回編輯。
                 </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {STATS.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-400 mb-1 font-bold">{stat.label}</p>
                        <h3 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h3>
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
              <div className="col-span-2 bg-white p-8 rounded-xl border border-gray-100 shadow-sm h-72 flex items-center justify-center text-gray-300 font-medium italic border-dashed border-2">
                [ 系統動態加載中，暫無即時訊息 ]
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                  <PlusCircle size={20} className="text-[#1677FF]" /> 快速發起範本
                </h3>
                <div className="space-y-3">
                  {forms.slice(0, 4).map((f) => (
                    <button 
                      key={f.id} 
                      onClick={() => {
                        setFormData({...formData, template: f.id, subject: `【發起】${f.name}`});
                        toggleModal();
                      }}
                      className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all group"
                    >
                      <span className="text-sm font-bold text-slate-600 group-hover:text-[#1677FF]">{f.name}</span>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-[#1677FF] transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'database':
        return (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-700">公文表單資料庫維護中心</h3>
              <button className="flex items-center gap-2 bg-[#1677FF] text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-blue-100 active:scale-95 transition-all">
                <Plus size={18} /> 新增表單範本
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-white text-[10px] text-gray-400 font-black uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5">代碼</th>
                  <th className="px-6 py-5">範本名稱</th>
                  <th className="px-6 py-5">類別</th>
                  <th className="px-6 py-5">狀態</th>
                  <th className="px-8 py-5 text-right">管理操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-medium text-slate-600">
                {forms.map(form => (
                  <tr key={form.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                    <td className="px-8 py-5 font-mono text-gray-400 text-xs">{form.id}</td>
                    <td className="px-6 py-5 font-bold text-slate-800">{form.name}</td>
                    <td className="px-6 py-5">{form.category}</td>
                    <td className="px-6 py-5">
                      <span className="text-green-600 font-black text-[10px] bg-green-50 px-2 py-1 rounded-full border border-green-100">
                        {form.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                      <button className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit3 size={18} /></button>
                      <button className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
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
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-[2px_0_12px_rgba(0,0,0,0.02)] z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1677FF] rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100">
            <FileText className="text-white w-6 h-6" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-slate-800 italic">先啟資訊</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-6">
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
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all font-black text-sm ${
                  activeTab === item.id ? 'bg-blue-50 text-[#1677FF] shadow-sm shadow-blue-50' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <button 
            onClick={toggleModal}
            className="w-full flex items-center justify-center gap-2 bg-[#1677FF] hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-2xl shadow-blue-200 active:scale-95"
          >
            <PlusCircle size={20} />
            <span>發起新公文</span>
          </button>
        </div>
      </aside>

      {/* 主要內容區 Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 shadow-sm z-10">
          <div className="relative w-[450px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1677FF] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="搜尋簽呈主旨、文號或發文人員..."
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs focus:bg-white focus:border-blue-300 outline-none transition-all font-bold shadow-inner"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="p-3 text-slate-400 hover:bg-slate-100 rounded-full cursor-pointer transition-colors relative">
               <Bell size={22} />
               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
            </div>
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
              <div className="text-right">
                <p className="text-xs font-black text-slate-800">資深設計師</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">IT Management Dept.</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl border-2 border-white shadow-lg overflow-hidden ring-1 ring-slate-100 transform hover:scale-105 transition-transform cursor-pointer">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 bg-[#F8FAFC]">
          {renderMainContent()}
        </div>

        {/* --- 整合後的彈出視窗 (Modal Overlay) --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-[0_32px_128px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col w-[1000px] border border-white/20 transform animate-in zoom-in-95 duration-200">
              
              {/* Header: 1000 * 80 */}
              <div className="h-[90px] w-full border-b border-slate-100 flex items-center justify-between px-12 bg-white/50">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 bg-blue-50 text-[#1677FF] rounded-2xl flex items-center justify-center shadow-inner">
                      <PlusCircle size={28} />
                   </div>
                   <div>
                     <span className="text-2xl font-black text-slate-800 tracking-tighter block leading-none">發起新公文</span>
                     <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-2 inline-block bg-blue-50 px-2 py-0.5 rounded">Process Step: {currentStep}</span>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-5 py-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl font-bold transition-all">
                    <Save size={18} /> 暫存
                  </button>
                  <div className="w-px h-8 bg-slate-100 mx-2"></div>
                  <button 
                    disabled={currentStep === 1}
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border-2 ${currentStep === 1 ? 'border-transparent text-slate-300 cursor-not-allowed' : 'border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200'}`}
                  >
                    <ChevronLeft size={18} /> 上一步
                  </button>
                  {currentStep < 3 ? (
                    <button 
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="flex items-center gap-2 px-8 py-2.5 bg-blue-50 text-[#1677FF] hover:bg-blue-100 rounded-xl font-black transition-all border-2 border-blue-200 shadow-lg shadow-blue-50"
                    >
                      下一步 <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button 
                      onClick={toggleModal}
                      className="flex items-center gap-2 px-10 py-2.5 bg-[#1677FF] hover:bg-blue-700 text-white rounded-xl font-black transition-all shadow-2xl shadow-blue-200 active:scale-95"
                    >
                      <Check size={20} /> 送出簽核
                    </button>
                  )}
                  <button onClick={toggleModal} className="ml-6 text-slate-300 hover:text-red-500 transition-all p-2 hover:bg-red-50 rounded-full">
                    <X size={32} />
                  </button>
                </div>
              </div>

              {/* Content: 1000 * 550 */}
              <div className="h-[580px] w-full overflow-y-auto p-12 bg-white relative scrollbar-hide">
                
                {/* 步驟流程指示器 */}
                <div className="absolute top-12 right-16 flex items-center gap-3 bg-slate-50/50 p-2 rounded-full border border-slate-100">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all ${currentStep === step ? 'bg-[#1677FF] text-white shadow-xl ring-4 ring-blue-50 scale-110' : currentStep > step ? 'bg-green-500 text-white shadow-md' : 'bg-white text-slate-300'}`}>
                        {currentStep > step ? <CheckCircle2 size={20} /> : step}
                      </div>
                      {step < 3 && <div className={`w-14 h-1 mx-2 rounded-full ${currentStep > step ? 'bg-green-500' : 'bg-slate-200'}`}></div>}
                    </div>
                  ))}
                </div>

                <div className="mb-12 border-l-[8px] border-[#1677FF] pl-8 py-2">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">
                    {currentStep === 1 ? '簽呈基礎參數設定' : currentStep === 2 ? '簽呈詳細內容核校' : '最終發布確認'}
                  </h2>
                  <p className="text-slate-400 mt-2 flex items-center gap-2 font-bold text-lg">
                    <AlertCircle size={20} className="text-[#1677FF]" />
                    {currentStep === 1 ? '請指定公文範本與簽核權限屬性' : currentStep === 2 ? '請編輯下方動態加載的表單內容' : '請確認所有資訊無誤後送出簽核'}
                  </p>
                </div>

                {renderStepContent()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;