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
  CheckCircle, 
  X,
  Save, 
  Check, 
  Calendar,
  Database, 
  Trash,
  Edit, 
  Type,
  Paperclip,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  GripVertical,
  MousePointer, 
  ListOrdered,
  Eye,
  Box,
  Sun,
  Moon,
  Printer,
  Home,
  FileCheck,
  UserCheck,
  Play,
  Sliders,
  ChevronDown,
  RotateCcw,
  Menu,
  ClipboardList,
  Activity,
  Layers, 
  Briefcase,
  Timer,
  UploadCloud,
  Inbox,
  FileX,
  FileSearch,
  Filter,
  MoreVertical,
  Info,
  DownloadCloud,
  FileSpreadsheet,
  FileDown,
  ArrowLeft,
  Users,
  UserPlus,
  Mail,
  Phone,
  Lock,
  WifiOff,
  LogIn,
  LogOut,
  User
} from 'lucide-react';

// --- 全域設計規範 (Design Tokens) ---
const mingLiUStyle = { fontFamily: '"PMingLiU", "新細明體", "MingLiU", serif' };

// 偵測是否為開發環境
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

/**
 * 【連線設定】
 */
const PROD_API_URL = "https://subdiapasonic-raylan-cheerless.ngrok-free.dev";
const API_URL_ROOT = isLocalhost ? `http://localhost:3001` : PROD_API_URL;

// 通用的 Fetch Headers 處理
const getRequestHeaders = (extraHeaders = {}) => ({
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true', 
  ...extraHeaders
});

// --- 登入頁面組件 ---
const LoginView = ({ onLoginSuccess, isMockMode }) => {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isMockMode) {
        if (staffId === 'admin' && password === '123456') {
          onLoginSuccess({ 
            name: '系統管理員', 
            pos: 'Administrator', 
            dept: '總經理室', 
            staffId: 'ADMIN-01',
            annualLeave: 56.0,
            compLeave: 12.5
          });
        } else {
          setError('連線中斷或測試模式請輸入 admin / 123456');
        }
      } else {
        const response = await fetch(`${API_URL_ROOT}/api/login`, {
          method: 'POST',
          headers: getRequestHeaders(),
          body: JSON.stringify({ staffId, password })
        });
        
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error("伺服器回應異常，請確認後端 Node.js 是否運作");
        }

        const data = await response.json();
        if (data.success) {
          onLoginSuccess(data.user);
        } else {
          setError(data.message || '員編或密碼不正確');
        }
      }
    } catch (err) {
      setError(`登入失敗：${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6" style={mingLiUStyle}>
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="bg-indigo-600 p-12 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm shadow-xl">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter" style={mingLiUStyle}>先啟智慧表單系統</h1>
          <p className="text-indigo-100 text-[10px] font-bold mt-2 uppercase tracking-widest opacity-80" style={mingLiUStyle}>Smart Approval Workflow</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-10 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2" style={mingLiUStyle}>
              <AlertCircle size={16} /> {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1" style={mingLiUStyle}>員工編號 Staff ID</label>
            <div className="relative">
              <UserCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type="text" required value={staffId} onChange={(e) => setStaffId(e.target.value)} style={mingLiUStyle}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-sm" placeholder="請輸入員編" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1" style={mingLiUStyle}>登入密碼 Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={mingLiUStyle}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-sm" placeholder="請輸入密碼" />
            </div>
          </div>

          <button type="submit" disabled={loading} style={mingLiUStyle} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4">
            {loading ? <RotateCcw className="animate-spin" size={20} /> : <LogIn size={20} />} 進入系統
          </button>
          
          <p className="text-center text-[10px] text-slate-300 font-bold uppercase pt-4 tracking-tighter" style={mingLiUStyle}>
            {!isLocalhost && !isMockMode ? "🌐 正透過公網安全隧道連線" : isMockMode ? "⚠️ 模擬模式已啟動" : "✅ 本機開發模式"}
          </p>
        </form>
      </div>
    </div>
  );
};

// --- 輔助組件：列表視圖 ---
const ListView = ({ title, icon: Icon, color, data, onItemClick }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500" style={mingLiUStyle}>
      <div className="flex items-center gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-lg text-white`}>
          <Icon size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800" style={mingLiUStyle}>{title}</h2>
          <p className="text-xs text-slate-400 font-bold" style={mingLiUStyle}>管理與追蹤您的單據申請</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/30">
            <tr>
              <th className="px-8 py-4 font-black text-slate-400 uppercase tracking-widest text-[12px]" style={mingLiUStyle}>單號</th>
              <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[12px]" style={mingLiUStyle}>主旨</th>
              <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[12px]" style={mingLiUStyle}>提交日期</th>
              <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[12px]" style={mingLiUStyle}>狀態</th>
              <th className="px-8 py-4 text-right" style={mingLiUStyle}>操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length > 0 ? data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-5 text-sm font-bold text-blue-600" style={mingLiUStyle}>{item.id}</td>
                <td className="px-6 py-5 text-sm font-bold text-slate-700" style={mingLiUStyle}>
                  {item.form_subject || item.values?.form_subject || '無主旨'}
                </td>
                <td className="px-6 py-5 text-xs font-bold text-slate-500" style={mingLiUStyle}>
                  {item.submitDate ? new Date(item.submitDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    item.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 
                    item.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`} style={mingLiUStyle}>
                    {item.status === 'Pending' ? '待簽核' : item.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => onItemClick(item)} className="p-2 text-slate-300 hover:text-blue-600 transition-all">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center text-slate-300 italic text-sm" style={mingLiUStyle}>
                  目前尚無相關單據資料。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 核心組件：人員編輯/新增彈出視窗 ---
const PersonnelFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    staffId: '', name: '', dept: '', team: '', pos: '', hireDate: '', email: '', password: '', annualLeave: '0', compLeave: '0'
  });

  useEffect(() => {
    if (initialData) { 
      const formattedDate = initialData.hireDate ? initialData.hireDate.split('T')[0] : '';
      setFormData({ ...initialData, hireDate: formattedDate }); 
    } 
    else { 
      setFormData({ staffId: '', name: '', dept: '', team: '', pos: '', hireDate: '', email: '', password: '', annualLeave: '0', compLeave: '0' }); 
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const labelClass = "text-[12px] font-black text-slate-500 mb-1.5 block";
  const inputClass = "w-full border border-slate-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 transition-all bg-white shadow-sm";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={mingLiUStyle}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden" style={mingLiUStyle}>
        <div className="bg-indigo-600 px-8 py-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">{initialData ? <Edit size={20} /> : <UserPlus size={20} />}</div>
            <div>
              <h3 className="text-lg font-black tracking-tight" style={mingLiUStyle}>{initialData ? '修改人員資料' : '新增人員資料'}</h3>
              <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest" style={mingLiUStyle}>{initialData ? 'Update Profile' : 'Create New Profile'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
        </div>
        <div className="p-8 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass} style={mingLiUStyle}>員編</label><input name="staffId" value={formData.staffId} onChange={handleChange} className={inputClass} disabled={!!initialData} style={mingLiUStyle} /></div>
            <div><label className={labelClass} style={mingLiUStyle}>姓名</label><input name="name" value={formData.name} onChange={handleChange} className={inputClass} style={mingLiUStyle} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass} style={mingLiUStyle}>部門</label>
              <select name="dept" value={formData.dept} onChange={handleChange} className={inputClass} style={mingLiUStyle}>
                <option value="">請選擇部門</option>
                <option value="總經理">總經理</option><option value="財務行政部">財務行政部</option>
                <option value="業務部">業務部</option><option value="系統暨工程部">系統暨工程部</option>
              </select>
            </div>
            <div><label className={labelClass} style={mingLiUStyle}>組別</label>
              <select name="team" value={formData.team} onChange={handleChange} className={inputClass} style={mingLiUStyle}>
                <option value="">請選擇組別</option>
                <option value="總經理室">總經理室</option><option value="北區營業組">北區營業組</option><option value="中區營業組">中區營業組</option><option value="南區營業組">南區營業組</option><option value="客服組">客服組</option><option value="產品組">產品組</option><option value="工程組">工程組</option><option value="系統組">系統組</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass} style={mingLiUStyle}>職稱</label><input name="pos" value={formData.pos} onChange={handleChange} className={inputClass} style={mingLiUStyle} /></div>
            <div><label className={labelClass} style={mingLiUStyle}>到職日</label><input type="date" name="hireDate" value={formData.hireDate} onChange={handleChange} className={inputClass} style={mingLiUStyle} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass} style={mingLiUStyle}>電子郵件</label><input name="email" value={formData.email} onChange={handleChange} className={inputClass} style={mingLiUStyle} /></div>
            <div><label className={labelClass} style={mingLiUStyle}>登入密碼</label><input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass} style={mingLiUStyle} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100"><label className={`${labelClass} text-blue-600`} style={mingLiUStyle}>剩餘特休 (hr)</label><input type="number" name="annualLeave" value={formData.annualLeave} onChange={handleChange} className={inputClass} style={mingLiUStyle} /></div>
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100"><label className={`${labelClass} text-emerald-600`} style={mingLiUStyle}>剩餘補休 (hr)</label><input type="number" name="compLeave" value={formData.compLeave} onChange={handleChange} className={inputClass} style={mingLiUStyle} /></div>
          </div>
        </div>
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border rounded-xl text-sm font-bold text-slate-500 hover:bg-white transition-all" style={mingLiUStyle}>取消返回</button>
          <button onClick={() => onSave(formData)} className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-sm font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all" style={mingLiUStyle}><Save size={18} /> 儲存資料</button>
        </div>
      </div>
    </div>
  );
};

// --- 時間/工時選擇器組件 ---
const DateTimePicker = ({ id, label, value, onChange }) => {
  const [tempDate, setTempDate] = useState('');
  const [tempHour, setTempHour] = useState('09');
  const [tempMin, setTempMin] = useState('00');
  const [isConfirmed, setIsConfirmed] = useState(false);
  useEffect(() => { if (value && !isConfirmed) { const parts = value.split(' '); if (parts.length >= 3) { setTempDate(parts[0]); setIsConfirmed(true); } } }, [value, isConfirmed]);
  const handleConfirm = (period) => { if (!tempDate) return; onChange(id, `${tempDate} ${period} ${tempHour}:${tempMin}`); setIsConfirmed(true); };
  return (
    <div className={`p-4 border rounded-xl transition-all ${isConfirmed ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50 border-slate-200'}`} style={mingLiUStyle}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1"><span className="text-[10px] font-black text-slate-400 uppercase" style={mingLiUStyle}>1. 日期</span><input type="date" value={tempDate} onChange={(e) => { setTempDate(e.target.value); setIsConfirmed(false); }} className="border rounded px-2 py-1 text-sm outline-none" style={mingLiUStyle} /></div>
        <div className="flex flex-col gap-1"><span className="text-[10px] font-black text-slate-400 uppercase" style={mingLiUStyle}>2. 時間</span><div className="flex items-center gap-1"><select value={tempHour} onChange={(e) => { setTempHour(e.target.value); setIsConfirmed(false); }} className="border rounded px-1 py-1 text-sm" style={mingLiUStyle}>{Array.from({length: 12}, (_, i) => String(i+1).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}</select><span>:</span><select value={tempMin} onChange={(e) => { setTempMin(e.target.value); setIsConfirmed(false); }} className="border rounded px-1 py-1 text-sm" style={mingLiUStyle}><option value="00">00</option><option value="30">30</option></select></div></div>
        <div className="flex flex-col gap-1"><span className="text-[10px] font-black text-slate-400 uppercase" style={mingLiUStyle}>3. 確認</span><div className="flex items-center gap-1">
          <button type="button" onClick={() => handleConfirm('上午')} className={`px-3 py-1 text-xs font-bold rounded border ${value?.includes('上午') ? 'bg-blue-600 text-white' : 'bg-white'}`} style={mingLiUStyle}><Sun size={12} /> 上午</button>
          <button type="button" onClick={() => handleConfirm('下午')} className={`px-3 py-1 text-xs font-bold rounded border ${value?.includes('下午') ? 'bg-blue-600 text-white' : 'bg-white'}`} style={mingLiUStyle}><Moon size={12} /> 下午</button>
        </div></div>
        {isConfirmed && <div className="ml-auto flex items-center gap-1 text-green-600 font-bold text-xs animate-bounce" style={mingLiUStyle}><CheckCircle size={16} /> 已確認</div>}
      </div>
    </div>
  );
};

const DurationPicker = ({ id, value, onChange }) => {
  const [d, setD] = useState('0'); const [h, setH] = useState('0'); const [m, setM] = useState('00');
  useEffect(() => { if (value) { const match = value.match(/(\d+)\s*日\s*(\d+)\s*時\s*(\d+)\s*分/); if (match) { setD(match[1]); setH(match[2]); setM(match[3]); } } }, [value]);
  const updateDuration = (newD, newH, newM) => onChange(id, `${newD} 日 ${newH} 時 ${newM} 分`);
  return (
    <div className="flex items-center gap-4 bg-slate-50 p-4 border border-slate-200 rounded-xl" style={mingLiUStyle}>
      <div className="flex items-center gap-2"><select style={mingLiUStyle} value={d} onChange={(e) => { setD(e.target.value); updateDuration(e.target.value, h, m); }} className="border rounded px-2 py-1 text-sm">{Array.from({length: 32}, (_, i) => i).map(num => <option key={num} value={num}>{num}</option>)}</select><span className="text-sm font-bold text-slate-600" style={mingLiUStyle}>日</span></div>
      <div className="flex items-center gap-2"><select style={mingLiUStyle} value={h} onChange={(e) => { setH(e.target.value); updateDuration(d, e.target.value, m); }} className="border rounded px-2 py-1 text-sm">{Array.from({length: 24}, (_, i) => i).map(num => <option key={num} value={num}>{num}</option>)}</select><span className="text-sm font-bold text-slate-600" style={mingLiUStyle}>時</span></div>
      <div className="flex items-center gap-2"><select style={mingLiUStyle} value={m} onChange={(e) => { setM(e.target.value); updateDuration(d, h, e.target.value); }} className="border rounded px-2 py-1 text-sm"><option value="00">00</option><option value="30">30</option></select><span className="text-sm font-bold text-slate-600" style={mingLiUStyle}>分</span></div>
      <div className="ml-auto text-[#1677FF] opacity-30"><Timer size={20} /></div>
    </div>
  );
};

const LeaveDurationPicker = ({ id, value, onChange }) => {
  const [d, setD] = useState('0'); const [h, setH] = useState('0');
  useEffect(() => { if (value) { const match = value.match(/(\d+)\s*日\s*(\d+)\s*時/); if (match) { setD(match[1]); setH(match[2]); } } }, [value]);
  const updateDuration = (newD, newH) => onChange(id, `${newD} 日 ${newH} 時`);
  return (
    <div className="flex items-center gap-4 bg-blue-50/30 p-4 border border-blue-100 rounded-xl" style={mingLiUStyle}>
      <div className="flex items-center gap-2"><select style={mingLiUStyle} value={d} onChange={(e) => { setD(e.target.value); updateDuration(e.target.value, h); }} className="border rounded px-2 py-1 text-sm">{Array.from({length: 32}, (_, i) => i).map(num => <option key={num} value={num}>{num}</option>)}</select><span className="text-sm font-bold text-slate-600" style={mingLiUStyle}>日</span></div>
      <div className="flex items-center gap-2"><select style={mingLiUStyle} value={h} onChange={(e) => { setH(e.target.value); updateDuration(d, e.target.value); }} className="border rounded px-2 py-1 text-sm">{Array.from({length: 24}, (_, i) => i).map(num => <option key={num} value={num}>{num}</option>)}</select><span className="text-sm font-bold text-slate-600" style={mingLiUStyle}>時</span></div>
      <div className="ml-auto text-blue-600 opacity-30"><ClipboardList size={20} /></div>
    </div>
  );
};

// --- 規章備註區塊 ---
const LeaveNoticeBlock = () => (
  <div className="bg-amber-50/40 border border-amber-200 rounded-2xl p-6 mt-4 shadow-inner" style={mingLiUStyle}>
    <div className="flex items-center gap-2 mb-4 text-amber-800 border-b border-amber-200 pb-2"><Info size={18} /><span className="font-black text-base" style={mingLiUStyle}>請假規章與簽核流程說明</span></div>
    <div className="space-y-4 text-[13px] text-slate-700 leading-relaxed">
      <div>
        <div className="font-black text-amber-900 mb-1 flex items-center gap-1.5" style={mingLiUStyle}>
          <div className="w-1 h-3 bg-amber-500 rounded-full"></div> 簽核流程：
        </div>
        <div className="pl-3 border-l-2 border-amber-100 ml-0.5" style={mingLiUStyle}>
          申請人 → 經副理(請假天數3日(含)以下) → 協理(請假天數5日(含)以下) → 總經理(請假天數5日以上) → 交辦(財務行政部)。<br />
          <span className="text-red-600 font-bold underline">單位主管一天(含)以上由總經理核定。</span>
        </div>
      </div>
      <div>
        <div className="font-black text-amber-900 mb-1 flex items-center gap-1.5 text-red-600" style={mingLiUStyle}>
          <div className="w-1 h-3 bg-red-500 rounded-full"></div> 一般規範：
        </div>
        <div className="pl-3 text-slate-600 font-bold" style={mingLiUStyle}>連續日期之請假單不可分開簽核，並均須檢附相關證明文件或說明事項：</div>
      </div>
      <div className="grid grid-cols-1 gap-2.5 pl-3">
        {[
          { title: "一. 婚假", content: "以日為單位，可分次或連續實施，於結婚之日前10日起三個月內休完。檢附結婚證明。" },
          { title: "二. 喪假", content: "以日為單位，可分次或連續實施。檢附訃文。" },
          { title: "三. 普通傷病假", content: "以日或時為單位，請假日數超過一日以上，檢附健保醫院或公立醫院 or 公司特約醫院診斷證明(附醫囑建議休息天數)。" },
          { title: "四. 事假", content: "以日或時為單位。" },
          { title: "五. 分娩假", content: "以日為單位。檢附診斷證明或出生證明。" },
          { title: "六. 陪產假", content: "以日為單位，於配偶分娩之當日及其前後合計十五日期間內，擇其中之五日請假。檢附診斷證明或出生證明。" },
          { title: "七. 產檢假", content: "以半日或小時為單位，一經選定不得更改。檢附診斷證明或媽媽手冊。" }
        ].map((item, idx) => (
          <div key={idx} className="flex gap-2" style={mingLiUStyle}>
            <span className="font-black text-slate-800 shrink-0">{item.title}：</span>
            <span>{item.content}</span>
          </div>
        ))}
      </div>
      <div className="pt-2 border-t border-amber-100 font-black text-slate-900" style={mingLiUStyle}>八. 給假天數均依勞基法辦理。</div>
    </div>
  </div>
);

const OvertimeNoticeBlock = () => (
  <div className="bg-blue-50/40 border border-blue-200 rounded-2xl p-6 mt-4 shadow-inner" style={mingLiUStyle}>
    <div className="flex items-center gap-2 mb-4 text-blue-800 border-b border-blue-200 pb-2"><Info size={18} /><span className="font-black text-base" style={mingLiUStyle}>加班申請規則與備註</span></div>
    <div className="space-y-4 text-[13px] text-slate-700 leading-relaxed">
      <div className="flex gap-3"><span className="font-black text-blue-600 shrink-0" style={mingLiUStyle}>A.</span><div style={mingLiUStyle}>加班申請須事前由直屬主管核准，始得進行加班，並於事後呈主管審核確認。</div></div>
      <div className="flex gap-3"><span className="font-black text-blue-600 shrink-0" style={mingLiUStyle}>B.</span><div style={mingLiUStyle}>此單由各部門編序號並於加班後七個工作日內交至財務行政部辦理，逾期不受理。</div></div>
      <div className="flex gap-3">
        <span className="font-black text-blue-600 shrink-0" style={mingLiUStyle}>C.</span>
        <div style={mingLiUStyle}>
          <span className="font-black">加班類別：</span>
          <span className="inline-flex flex-wrap gap-2 ml-1">
            <span className="px-2 py-0.5 bg-white border border-blue-100 rounded text-blue-700" style={mingLiUStyle}>1. 一般上班日</span>
            <span className="px-2 py-0.5 bg-white border border-blue-100 rounded text-blue-700" style={mingLiUStyle}>2. 國定假日</span>
            <span className="px-2 py-0.5 bg-white border border-blue-100 rounded text-blue-700" style={mingLiUStyle}>3. 休息日</span>
            <span className="px-2 py-0.5 bg-white border border-blue-100 rounded text-blue-700" style={mingLiUStyle}>4. 出差加班</span>
          </span>
        </div>
      </div>
      <div className="flex gap-3"><span className="font-black text-blue-600 shrink-0" style={mingLiUStyle}>D.</span><div style={mingLiUStyle}>此加班工時將依比率換算為補休時數或薪資。</div></div>
      <div className="flex gap-3"><span className="font-black text-blue-600 shrink-0" style={mingLiUStyle}>E.</span><div className="text-red-600 font-bold underline" style={mingLiUStyle}>每月加班時數上限不得超過46小時。</div></div>
    </div>
  </div>
);

// --- 核心組件：人員管理視圖 ---
const PersonnelManagementView = ({ isMockMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = `${API_URL_ROOT}/api/personnel`; 

  const fetchStaffFromDB = async () => {
    try {
      if (isMockMode) return;
      setIsLoading(true);
      const response = await fetch(API_BASE_URL, {
        headers: getRequestHeaders()
      });
      
      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType || !contentType.includes("application/json")) {
        throw new Error(`伺服器回應錯誤 (${response.status})，請確認後端 Node.js 已啟動。`);
      }

      const data = await response.json();
      setStaffList(data);
    } catch (err) { 
      console.error("無法載入人員資料:", err.message); 
    } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchStaffFromDB(); }, [isMockMode]);

  const handleSaveStaff = async (staffData) => {
    try {
      setIsLoading(true);
      if (!isMockMode) {
        const url = editingStaff ? `${API_BASE_URL}/${staffData.staffId}` : API_BASE_URL;
        const method = editingStaff ? 'PUT' : 'POST';
        
        const response = await fetch(url, { 
          method, 
          headers: getRequestHeaders(), 
          body: JSON.stringify(staffData) 
        });
        
        if (!response.ok) throw new Error("儲存失敗");
        await fetchStaffFromDB();
      } else {
        if (editingStaff) { setStaffList(prev => prev.map(item => item.staffId === staffData.staffId ? staffData : item)); } 
        else { setStaffList(prev => [...prev, staffData]); }
      }
    } catch (err) { console.error("操作失敗", err); } 
    finally { setIsLoading(false); setIsModalOpen(false); setEditingStaff(null); }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm(`確定要刪除成員 [${staffId}] 嗎？`)) return;
    try {
      if (!isMockMode) { 
        const response = await fetch(`${API_BASE_URL}/${staffId}`, { 
          method: 'DELETE',
          headers: getRequestHeaders()
        }); 
        if (!response.ok) throw new Error("刪除失敗");
        await fetchStaffFromDB(); 
      } 
      else { setStaffList(prev => prev.filter(item => item.staffId !== staffId)); }
    } catch (err) { console.error("刪除失敗", err); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500" style={mingLiUStyle}>
      {isMockMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex items-start gap-4 shadow-sm animate-in slide-in-from-top-4">
          <div className="bg-amber-500 p-2.5 rounded-2xl text-white"><WifiOff size={20} /></div>
          <div className="flex-1">
            <h4 className="text-amber-800 font-black text-sm" style={mingLiUStyle}>離線測試模式</h4>
            <p className="text-amber-600 text-xs mt-1 leading-relaxed" style={mingLiUStyle}>此裝置無法連通伺服器。如果是 Vercel 環境，請確認後端已開啟 Ngrok 穿透且路由已設定。</p>
          </div>
          <button onClick={fetchStaffFromDB} className="px-4 py-2 bg-white border border-amber-200 rounded-xl text-xs font-bold text-amber-600 hover:bg-amber-100 transition-colors" style={mingLiUStyle}>嘗試重連</button>
        </div>
      )}
      <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg text-white"><Users size={28} /></div>
          <div><h2 className="text-2xl font-black text-slate-800" style={mingLiUStyle}>人員資料管理</h2><p className="text-xs text-slate-400 font-bold" style={mingLiUStyle}>檢視及維護公司成員的基本資訊</p></div>
        </div>
        <div className="flex gap-3">
          <div className={`px-4 py-3 rounded-2xl border flex items-center gap-2 transition-colors ${isMockMode ? 'bg-slate-100 border-slate-200' : 'bg-emerald-50 border-emerald-100'}`}>
              <div className={`w-2 h-2 rounded-full ${isMockMode ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'}`}></div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isMockMode ? 'text-slate-500' : 'text-emerald-600'}`} style={mingLiUStyle}>{isMockMode ? 'Mock Mode' : 'Tunnel Active'}</span>
          </div>
          <button onClick={() => { setEditingStaff(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg active:scale-95" style={mingLiUStyle}><UserPlus size={18} /> 新增人員</button>
        </div>
      </div>
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/30"><tr className="text-[12px] font-black text-slate-400 uppercase tracking-widest" style={mingLiUStyle}><th className="px-8 py-4">員編 / 姓名</th><th className="px-6 py-4">部門組別</th><th className="px-6 py-4">職稱</th><th className="px-6 py-4">電子郵件</th><th className="px-8 py-4 text-right"></th></tr></thead>
          <tbody className="divide-y divide-slate-50">
            {staffList.length > 0 ? staffList.map((person, idx) => (
              <tr key={person.staffId || idx} className="hover:bg-indigo-50/20 transition-colors group">
                <td className="px-8 py-5"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-100 rounded-full border border-white shadow-sm overflow-hidden"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`} alt="avatar" /></div><div><p className="text-[10px] font-bold text-indigo-600 mb-0.5" style={mingLiUStyle}>{person.staffId}</p><p className="text-sm font-bold text-slate-700" style={mingLiUStyle}>{person.name}</p></div></div></td>
                <td className="px-6 py-5 text-xs font-bold text-slate-600" style={mingLiUStyle}>{person.dept} {person.team ? `/ ${person.team}` : ''}</td>
                <td className="px-6 py-5 text-xs font-bold text-slate-600" style={mingLiUStyle}>{person.pos}</td>
                <td className="px-6 py-5 flex items-center gap-1.5 text-slate-500" style={mingLiUStyle}><Mail size={12} className="text-slate-300" /><span className="text-[11px] font-bold">{person.email}</span></td>
                <td className="px-8 py-5 text-right"><div className="flex justify-end gap-2"><button onClick={() => { setEditingStaff(person); setIsModalOpen(true); }} className="p-2 text-slate-300 hover:text-indigo-600 transition-all"><Edit size={18} /></button><button onClick={() => handleDeleteStaff(person.staffId)} className="p-2 text-slate-300 hover:text-red-500 transition-all"><Trash size={18} /></button></div></td>
              </tr>
            )) : <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-300 italic text-sm" style={mingLiUStyle}>{isLoading ? "正在讀取資料..." : "目前資料庫尚無資料。"}</td></tr>}
          </tbody>
        </table>
      </div>
      <PersonnelFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveStaff} initialData={editingStaff} />
    </div>
  );
};

// --- 組件：智慧渲染引擎 ---
const SmartFormEngine = ({ schema, formValues, onInputChange, onPreview }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (fieldId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 檔案大小限制 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("檔案太大，請上傳小於 5MB 的檔案");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      // 正式化：將檔案轉為 Base64 物件儲存
      onInputChange(fieldId, {
        name: file.name,
        type: file.type,
        base64: reader.result 
      });
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert("檔案讀取失敗");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6" style={mingLiUStyle}>
      <div className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm font-serif relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] opacity-[0.03] rotate-12 pointer-events-none"><FileText size={200} /></div>
        <h3 className="text-xl font-bold mb-8 text-center tracking-widest text-slate-800 relative z-10" style={mingLiUStyle}>** {schema.title.split('').join(' ')} **</h3>
        <div className="flex flex-wrap gap-y-6 -mx-2 relative z-10">
          {schema.fields.map(field => {
            if (field.dependsOn) {
              const parentValue = formValues[field.dependsOn];
              const showConditions = Array.isArray(field.showIf) ? field.showIf : [field.showIf];
              if (!showConditions.includes(parentValue)) return null;
            }
            return (
              <div key={field.id} className={`${field.width} px-2 animate-in fade-in slide-in-from-top-2 duration-300`}>
                {field.type !== "button" && field.type !== "notice" && field.type !== "ot_notice" && (
                  <div className="flex items-center gap-2 mb-2"><div className="w-1.5 h-1.5 bg-[#1677FF] rounded-full"></div><label className="text-sm font-bold text-slate-700 underline decoration-slate-200 underline-offset-4" style={mingLiUStyle}>{field.label}：</label></div>
                )}
                {field.type === "select" && <select style={mingLiUStyle} value={formValues[field.id] || ""} onChange={(e) => onInputChange(field.id, e.target.value)} className="w-full border border-slate-400 p-2 rounded text-sm outline-none focus:border-blue-500 bg-white shadow-sm"><option value="">-- 請選擇 --</option>{field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>}
                {(field.type === "text" || field.type === "number") && <input type={field.type} style={mingLiUStyle} placeholder={`請輸入${field.label}`} value={formValues[field.id] || ""} onChange={(e) => onInputChange(field.id, e.target.value)} className="w-full border border-slate-400 p-2 rounded text-sm outline-none focus:border-blue-500 shadow-sm" />}
                {field.type === "datetime" && <DateTimePicker id={field.id} label={field.label} value={formValues[field.id]} onChange={onInputChange} />}
                {field.type === "duration" && <DurationPicker id={field.id} value={formValues[field.id]} onChange={onInputChange} />}
                {field.type === "leave_duration" && <LeaveDurationPicker id={field.id} value={formValues[field.id]} onChange={onInputChange} />}
                
                {field.type === "file" && (
                  <div className="relative group">
                    <input type="file" className="hidden" id={`file-${field.id}`} onChange={(e) => handleFileChange(field.id, e)} />
                    <label htmlFor={`file-${field.id}`} className={`flex items-center gap-3 w-full border-2 border-dashed ${formValues[field.id] ? 'border-green-400 bg-green-50/30' : 'border-slate-300 bg-transparent'} p-4 rounded-xl cursor-pointer hover:border-blue-400 transition-all group`}>
                      <div className={`w-10 h-10 ${formValues[field.id] ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'} rounded-lg flex items-center justify-center transition-colors`}>
                        {isUploading ? <RotateCcw size={20} className="animate-spin" /> : <Paperclip size={20} />}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-600 truncate" style={mingLiUStyle}>
                          {isUploading ? "正在處理檔案..." : (formValues[field.id]?.name || "點擊或拖曳檔案至此處上傳")}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight" style={mingLiUStyle}>支援 PDF, JPG, PNG (最大 5MB)</p>
                      </div>
                      {formValues[field.id] && !isUploading && <CheckCircle className="text-green-500" size={24} />}
                    </label>
                  </div>
                )}

                {field.type === "notice" && <LeaveNoticeBlock />}
                {field.type === "ot_notice" && <OvertimeNoticeBlock />}
                {field.type === "button" && <div className="w-full mt-4"><button type="button" onClick={onPreview} className="w-full bg-[#1677FF] text-white py-4 rounded-xl font-black shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-lg" style={mingLiUStyle}><Eye size={20} /> 預覽填寫內容</button></div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- 組件：預覽校對畫面 ---
const SubmissionPreview = ({ schema, values, onEdit, onSubmit, staffList }) => {
  const [selectedApprover, setSelectedApprover] = useState("");
  const [selectedCountersigners, setSelectedCountersigners] = useState([]);

  const toggleCountersigner = (id) => {
    setSelectedCountersigners(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleFinalSubmit = () => {
    if (!selectedApprover) {
      alert("請選擇主簽核人");
      return;
    }
    onSubmit({
      approverId: selectedApprover,
      countersignIds: selectedCountersigners
    });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500" style={mingLiUStyle}>
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-10 shadow-xl relative font-serif">
          <div className="flex items-center gap-3 mb-8 border-b pb-4 border-blue-50">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><FileText size={24} /></div>
            <div><h2 className="text-xl font-black text-slate-800" style={mingLiUStyle}>簽核表單預覽校對</h2><p className="text-xs text-slate-400 font-bold" style={mingLiUStyle}>請確認下方資訊無誤後點擊送出</p></div>
          </div>
          <div className="flex flex-wrap -mx-2 gap-y-6">
             {schema.fields.filter(f => f.type !== 'button' && f.type !== 'notice' && f.type !== 'ot_notice').map(field => {
                if (field.dependsOn && !values[field.dependsOn]) return null;
                const val = values[field.id];
                const displayVal = field.type === 'file' ? (val?.name ? `📎 ${val.name}` : '(未上傳)') : (val || '(未填寫)');
                return (
                  <div key={field.id} className={`${field.width} px-2`}><div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 h-full flex flex-col justify-center"><p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest" style={mingLiUStyle}>{field.label}</p><p className="text-base font-bold text-slate-700" style={mingLiUStyle}>{displayVal}</p></div></div>
                );
             })}
          </div>

          {/* --- 新增：簽核流程選取介面 --- */}
          <div className="mt-10 p-8 bg-indigo-50/30 rounded-[2.5rem] border border-indigo-100 border-dashed">
            <div className="flex items-center gap-2 mb-6 text-indigo-800">
              <Send size={20} />
              <h3 className="font-black text-lg" style={mingLiUStyle}>設定簽核路徑</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 主簽核人 */}
              <div>
                <label className="text-xs font-black text-slate-500 uppercase mb-3 block" style={mingLiUStyle}>1. 選擇主簽核人 (單選)</label>
                <select 
                  className="w-full p-3 bg-white border border-indigo-200 rounded-xl outline-none focus:border-indigo-500 shadow-sm text-sm font-bold"
                  value={selectedApprover}
                  onChange={(e) => setSelectedApprover(e.target.value)}
                  style={mingLiUStyle}
                >
                  <option value="">-- 請選擇簽核對象 --</option>
                  {staffList.map(s => (
                    <option key={s.staffId} value={s.staffId}>{s.name} ({s.pos})</option>
                  ))}
                </select>
              </div>

              {/* 會簽人員 */}
              <div>
                <label className="text-xs font-black text-slate-500 uppercase mb-3 block" style={mingLiUStyle}>2. 選擇會簽人員 (複選)</label>
                <div className="bg-white border border-indigo-200 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2 shadow-sm custom-scrollbar">
                  {staffList.map(s => (
                    <div 
                      key={s.staffId} 
                      onClick={() => toggleCountersigner(s.staffId)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedCountersigners.includes(s.staffId) ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                      <span className="text-xs font-bold" style={mingLiUStyle}>{s.name} <small className="opacity-70">{s.dept}</small></span>
                      {selectedCountersigners.includes(s.staffId) && <Check size={14} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4">
             <button onClick={onEdit} className="flex-1 py-4 border-2 border-slate-200 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2" style={mingLiUStyle}><ChevronLeft size={20} /> 資訊有誤，回填單頁面</button>
             <button onClick={handleFinalSubmit} className="flex-[2] py-4 bg-[#1677FF] text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-lg active:scale-95" style={mingLiUStyle}><Check size={24} /> 確認無誤，發送申請</button>
          </div>
        </div>
    </div>
  );
};

// --- 組件：提交後的存根 ---
const SubmissionSummary = ({ schema, values, onReset, currentDocId, isViewOnly, onBack, currentUser }) => {
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `申請存根_${currentDocId}`;
    window.print();
    document.title = originalTitle;
  };

  const handleViewFile = (fileObj) => {
    if (!fileObj || !fileObj.base64) return;
    const link = document.createElement('a');
    link.href = fileObj.base64;
    link.download = fileObj.name || "attachment";
    if (fileObj.type?.match(/image|pdf/i)) {
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(`<iframe src="${fileObj.base64}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        return;
      }
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const safeValues = values || {};

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500" style={mingLiUStyle}>
      <div id="printable-stub" className="bg-white border-2 border-slate-200 rounded-3xl p-10 shadow-2xl relative font-serif print:shadow-none print:border-slate-400">
        <div className="absolute top-10 right-10 w-32 h-32 border-4 border-red-500 rounded-full flex flex-col items-center justify-center rotate-12 opacity-80 pointer-events-none text-red-500 font-black">
          <span className="text-xs" style={mingLiUStyle}>先啟智慧表單件</span><span className="text-lg border-y-2 border-red-500 my-1" style={mingLiUStyle}>已 收 訖</span><span className="text-[10px]" style={mingLiUStyle}>{new Date().toLocaleDateString()}</span>
        </div>
        <div className="text-center mb-10"><h2 className="text-2xl font-black text-slate-800 underline decoration-4 underline-offset-8" style={mingLiUStyle}>電子表單申請存根</h2></div>
        <div className="mb-6 flex justify-between items-end border-b pb-4">
            <div><p className="text-[10px] font-black text-slate-400 uppercase" style={mingLiUStyle}>文件單號 Document ID</p><p className="text-xl font-black text-blue-600" style={mingLiUStyle}>{currentDocId}</p></div>
            <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase" style={mingLiUStyle}>申請人 Applicant</p><p className="text-sm font-bold text-slate-700" style={mingLiUStyle}>{currentUser?.name || '測試人員'}</p></div>
        </div>
        <div className="flex flex-wrap -mx-2 gap-y-6 border-l-4 border-blue-500 pl-4 mb-10">
          {schema.fields.filter(f => f.type !== 'button' && f.type !== 'notice' && f.type !== 'ot_notice').map(field => {
             const val = safeValues[field.id];
             if (field.dependsOn && !safeValues[field.dependsOn]) return null;
             
             return (
              <div key={field.id} className={`${field.width} px-2`} style={mingLiUStyle}>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1" style={mingLiUStyle}>{field.label}</p>
                <div className="flex items-center gap-2">
                  {field.type === 'file' ? (
                    val?.base64 ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-bold text-slate-700">📎 {val.name}</p>
                        <button 
                          type="button" 
                          onClick={() => handleViewFile(val)}
                          className="print:hidden flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black hover:bg-blue-100 transition-colors"
                        >
                          <DownloadCloud size={14} /> 點擊下載/檢視附件
                        </button>
                      </div>
                    ) : <p className="text-sm font-bold text-slate-400 italic">(無附件)</p>
                  ) : (
                    <p className="text-sm font-bold text-slate-700">{val || '(未填寫)'}</p>
                  )}
                </div>
              </div>
             );
          })}
        </div>
        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end gap-3 print:hidden">
          <button type="button" onClick={handlePrint} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all flex items-center gap-2" style={mingLiUStyle}>
            <Printer size={14} /> 列印存根
          </button>
          <button type="button" onClick={onBack || onReset} className="px-8 py-2 bg-[#1677FF] text-white rounded-xl text-xs font-black shadow-md hover:bg-blue-700 transition-all flex items-center gap-2" style={mingLiUStyle}>
            {isViewOnly ? <ArrowLeft size={14} /> : null} {isViewOnly ? "返回列表" : "完成返回"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 主應用程式組件 ---
const App = () => {
  const [currentUser, setCurrentUser] = useState(null); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMockMode, setIsMockMode] = useState(true); 

  const [submittedForms, setSubmittedForms] = useState([]);
  const [currentDocId, setCurrentDocId] = useState('');
  const [viewingForm, setViewingForm] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [staffList, setStaffList] = useState([]);

  // 從資料庫讀取人員列表 (供簽核選取使用)
  const fetchPersonnel = async () => {
    if (isMockMode) return;
    try {
      const res = await fetch(`${API_URL_ROOT}/api/personnel`, { headers: getRequestHeaders() });
      const data = await res.json();
      setStaffList(data);
    } catch (err) { console.error("人員列表讀取失敗"); }
  };

  // 從資料庫讀取該使用者的表單資料
  const fetchMyForms = async (userId) => {
    if (isMockMode || !userId) return;
    try {
      const res = await fetch(`${API_URL_ROOT}/api/forms/${userId}`, {
        headers: getRequestHeaders()
      });
      
      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType || !contentType.includes("application/json")) {
        console.warn("無法取得表單 JSON: 後端路由 /api/forms/:staffId 可能尚未建立");
        return;
      }

      const data = await res.json();
      const formattedData = data.map(item => ({
        ...item,
        values: typeof item.form_values === 'string' ? JSON.parse(item.form_values) : item.form_values
      }));
      setSubmittedForms(formattedData);
    } catch (err) {
      console.error("無法載入表單資料:", err.message);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch(`${API_URL_ROOT}/api/personnel`, {
          headers: getRequestHeaders()
        });
        if (res.ok) {
          setIsMockMode(false);
        }
      } catch (err) { 
        setIsMockMode(true); 
      }
    };
    checkConnection();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchMyForms(currentUser.staffId);
      fetchPersonnel();
    }
  }, [currentUser, activeTab]);

  const handleLogout = () => { setCurrentUser(null); setActiveTab('dashboard'); setFormValues({}); };

  const LEAVE_TYPES = ["特休", "事假", "病假", "喪假", "補休", "婚假", "公假", "產假", "家庭照顧假"];
  const TEAM_OPTIONS = ["總經理室", "北區營業組", "中區營業組", "南區營業組", "客服組", "產品組", "工程組", "系統組"];

  const myFormSchema = {
    title: "電子智慧表單",
    fields: [
      { id: "form_subject", label: "單據主旨", type: "text", width: "w-full" },
      { id: "employee_id", label: "員工編號", type: "text", width: "w-1/2" },
      { id: "department", label: "組別", type: "select", options: TEAM_OPTIONS, width: "w-1/2" },
      { id: "category", label: "選擇類別", type: "select", options: ["行政類", "銷售類", "差勤類", "系統類"], width: "w-full" },
      { id: "leave_type", label: "假單類別", type: "select", options: [...LEAVE_TYPES, "加班"], dependsOn: "category", showIf: "差勤類", width: "w-full" },
      { id: "agent", label: "代理人", type: "text", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "leave_start_time", label: "請假開始日期時間", type: "datetime", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "leave_end_time", label: "請假結束日期時間", type: "datetime", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "leave_total", label: "共計", type: "leave_duration", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "leave_reason", label: "請假事由", type: "text", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "leave_comment", label: "意見", type: "text", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "leave_attachment", label: "附加檔案", type: "file", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "leave_rules_notice", type: "notice", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "ot_type", label: "加班類型", type: "select", options: ["事前", "事後"], dependsOn: "leave_type", showIf: "加班", width: "w-full" },
      { id: "ot_start_time", label: "加班開始日期時間", type: "datetime", dependsOn: "ot_type", showIf: ["事前", "事後"], width: "w-full" },
      { id: "ot_end_time", label: "加班結束日期時間", type: "datetime", dependsOn: "ot_type", showIf: ["事前", "事後"], width: "w-full" },
      { id: "ot_duration", label: "工時數", type: "duration", dependsOn: "ot_type", showIf: ["事前", "事後"], width: "w-full" },
      { id: "ot_compensation", label: "補償方式", type: "select", options: ["換補休", "計薪"], dependsOn: "ot_type", showIf: ["事前", "事後"], width: "w-full" },
      { id: "ot_reason", label: "加班事由", type: "text", dependsOn: "ot_type", showIf: ["事前", "事後"], width: "w-full" },
      { id: "ot_rules_notice", type: "ot_notice", dependsOn: "leave_type", showIf: "加班", width: "w-full" },
      { id: "submit_btn", label: "預覽填寫內容", type: "button", width: "w-full" }
    ]
  };

  const handleInputChange = (id, value) => {
    setFormValues(prev => {
      const nextValues = { ...prev, [id]: value };
      const cleanupChildren = (parentId) => {
        myFormSchema.fields.forEach(field => {
          if (field.dependsOn === parentId) {
            const showConditions = Array.isArray(field.showIf) ? field.showIf : [field.showIf];
            if (!showConditions.includes(nextValues[parentId])) {
              delete nextValues[field.id];
              cleanupChildren(field.id);
            }
          }
        });
      };
      cleanupChildren(id);
      return nextValues;
    });
  };

  const generateNewDocId = () => {
    const now = new Date();
    const dateStr = now.getFullYear().toString() + 
                    (now.getMonth() + 1).toString().padStart(2, '0') + 
                    now.getDate().toString().padStart(2, '0');
    
    const todayPrefix = dateStr + "_";
    const todayForms = submittedForms.filter(f => f.id && f.id.startsWith(todayPrefix));
    
    let nextNum = 1;
    if (todayForms.length > 0) {
      const nums = todayForms.map(f => parseInt(f.id.split('_')[1]) || 0);
      nextNum = Math.max(...nums) + 1;
    }
    
    return `${todayPrefix}${nextNum.toString().padStart(3, '0')}`;
  };

  const handleFinalSubmit = async (approvalFlow) => {
    const newDocId = generateNewDocId();
    
    // 組合表單數據，加入簽核人與會簽資訊
    const submissionData = {
      id: newDocId,
      staffId: currentUser.staffId,
      form_subject: formValues.form_subject || '未命名表單',
      values: {
        ...formValues,
        ...approvalFlow // 包含 approverId 與 countersignIds
      }
    };

    if (isMockMode) {
      setSubmittedForms([...submittedForms, { 
        ...submissionData,
        submitDate: new Date().toISOString(), 
        status: 'Pending' 
      }]);
      setCurrentDocId(newDocId); setIsPreviewing(false); setIsSubmitted(true);
    } else {
      try {
        const response = await fetch(`${API_URL_ROOT}/api/forms`, {
          method: 'POST',
          headers: getRequestHeaders(),
          body: JSON.stringify(submissionData)
        });
        
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error("提交失敗，請確認後端 API 設定");
        }
        
        await fetchMyForms(currentUser.staffId);
        setCurrentDocId(newDocId);
        setIsPreviewing(false);
        setIsSubmitted(true);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const resetForm = () => { setFormValues({}); setIsSubmitted(false); setIsPreviewing(false); setActiveTab('dashboard'); };

  if (!currentUser) { return <LoginView onLoginSuccess={setCurrentUser} isMockMode={isMockMode} />; }

  const renderMainContent = () => {
    if (viewingForm) { 
      return (
        <SubmissionSummary 
          schema={myFormSchema} 
          values={viewingForm.values} 
          currentDocId={viewingForm.id} 
          isViewOnly={true} 
          onBack={() => setViewingForm(null)} 
          onReset={() => setViewingForm(null)}
          currentUser={currentUser} 
        />
      ); 
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500" style={mingLiUStyle}>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-2/3 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute right-[-30px] top-[-30px] opacity-10 rotate-12"><Layers size={240} /></div>
                  <div className="relative z-10">
                    <h2 className="text-3xl font-black mb-3" style={mingLiUStyle}>早安，{currentUser.name} {currentUser.pos}</h2>
                    <p className="text-blue-100 text-sm max-w-md leading-relaxed" style={mingLiUStyle}>您的員編為 {currentUser.staffId}，隸屬 {currentUser.dept}。目前系統運作正常，您可以點擊下方按鈕開始建單。</p>
                    <button onClick={() => setActiveTab('inbox')} className="bg-white text-blue-700 px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg mt-8" style={mingLiUStyle}><Plus size={18} /> 開始建立表單</button>
                  </div>
                </div>
                <div className="lg:w-1/3 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-6"><h4 className="text-lg font-black text-slate-700 flex items-center gap-2" style={mingLiUStyle}><Clock size={20} className="text-blue-600" /> 休假剩餘時數</h4><span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase" style={mingLiUStyle}>Balance</span></div>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-slate-600" style={mingLiUStyle}>特休 (Annual)</span>
                        <span className="text-xl font-black text-blue-600" style={mingLiUStyle}>{currentUser?.annualLeave || 0} <small className="text-[10px] text-slate-400" style={mingLiUStyle}>hr</small></span>
                      </div>
                      <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(((currentUser?.annualLeave || 0) / 720) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-slate-600" style={mingLiUStyle}>補休 (Comp.)</span>
                        <span className="text-xl font-black text-emerald-600" style={mingLiUStyle}>{currentUser?.compLeave || 0} <small className="text-[10px] text-slate-400" style={mingLiUStyle}>hr</small></span>
                      </div>
                      <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min((currentUser?.compLeave || 0) * 2, 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'inbox_stat', label: '收件匣', value: 0, color: 'text-blue-600', bg: 'bg-blue-600', icon: Inbox, targetTab: 'inbox_list' },
                { id: 'pending_stat', label: '流程中案件', value: submittedForms.filter(f => f.status === 'Pending').length, color: 'text-amber-600', bg: 'bg-amber-600', icon: Activity, targetTab: 'pending_list' },
                { id: 'completed_stat', label: '已結案', value: submittedForms.filter(f => f.status === 'Completed').length, color: 'text-green-600', bg: 'bg-green-600', icon: FileCheck, targetTab: 'completed_list' },
                { id: 'draft_stat', label: '草稿匣', value: 0, color: 'text-indigo-600', bg: 'bg-indigo-600', icon: FileSearch, targetTab: 'draft_list' },
                { id: 'rejected_stat', label: '退件/抽單', value: 0, color: 'text-red-600', bg: 'bg-red-600', icon: FileX, targetTab: 'rejected' },
                { id: 'trash_stat', label: '垃圾桶', value: 0, color: 'text-slate-600', bg: 'bg-slate-600', icon: Trash, targetTab: 'trash' },
              ].map((stat, idx) => (
                <div key={idx} onClick={() => setActiveTab(stat.targetTab)} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1.5 cursor-pointer group active:scale-95">
                  <div className="flex justify-between items-start"><div><p className="text-[10px] text-slate-400 mb-1 font-bold" style={mingLiUStyle}>{stat.label}</p><h3 className="text-2xl font-black" style={{ ...mingLiUStyle, color: 'inherit' }}>{stat.value}</h3></div><div className={`p-2.5 rounded-xl ${stat.bg} text-white shadow-lg`}><stat.icon size={18} /></div></div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'personnel_management': return <PersonnelManagementView isMockMode={isMockMode} />;
      case 'inbox':
        return (
          <div className="h-full flex justify-center animate-in fade-in duration-500">
            <div className="w-full max-w-4xl bg-[#F8FAFC] rounded-[3rem] border border-gray-200 p-12 overflow-y-auto shadow-inner relative">
              {isSubmitted ? <SubmissionSummary schema={myFormSchema} values={formValues} onReset={resetForm} currentDocId={currentDocId} currentUser={currentUser} /> : 
                isPreviewing ? <SubmissionPreview schema={myFormSchema} values={formValues} onEdit={() => setIsPreviewing(false)} onSubmit={handleFinalSubmit} staffList={staffList} /> : 
                <SmartFormEngine schema={myFormSchema} formValues={formValues} onInputChange={handleInputChange} onPreview={() => setIsPreviewing(true)} />}
            </div>
          </div>
        );
      case 'pending_list': return <ListView title="流程中案件" icon={Activity} color="bg-amber-600" data={submittedForms.filter(f => f.status === 'Pending')} onItemClick={setViewingForm} />;
      case 'completed_list': return <ListView title="已結案案件" icon={FileCheck} color="bg-green-600" data={submittedForms.filter(f => f.status === 'Completed')} onItemClick={setViewingForm} />;
      case 'inbox_list': case 'draft_list': case 'rejected': case 'trash':
        return <ListView title="清單管理" icon={ClipboardList} color="bg-slate-600" data={[]} onItemClick={setViewingForm} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#F0F2F5] text-[#262626]" style={mingLiUStyle}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-stub, #printable-stub * { visibility: visible; }
          #printable-stub {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 0;
            box-shadow: none;
          }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
      <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'} print:hidden`} style={mingLiUStyle}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-[#1677FF] rounded-2xl flex items-center justify-center shadow-xl text-white shrink-0"><Layers size={24} /></div>
            {!isSidebarCollapsed && (<span className="font-black text-lg tracking-tighter text-slate-800 italic animate-in slide-in-from-left-2" style={mingLiUStyle}>先啟智慧表單</span>)}
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-6">
          {[
            { id: 'dashboard', label: '首頁', icon: LayoutDashboard }, 
            { id: 'personnel_management', label: '人員管理', icon: Users }
          ].map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setViewingForm(null); }} className={`w-full flex items-center px-5 py-3.5 rounded-2xl transition-all font-black text-sm ${activeTab === item.id || activeTab.includes('_list') ? 'bg-blue-50 text-[#1677FF]' : 'text-slate-400 hover:bg-slate-50'} ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-start gap-3'}`} style={mingLiUStyle}>
              <item.icon size={20} />
              {!isSidebarCollapsed && <span style={item.id === 'personnel_management' ? mingLiUStyle : {}}>{item.label}</span>}
            </button>
          ))}
          <div className="pt-8 mt-8 border-t border-slate-100">
            <button onClick={handleLogout} className={`w-full flex items-center px-5 py-3.5 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all font-black text-sm ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`} style={mingLiUStyle}>
              <LogOut size={20} />
              {!isSidebarCollapsed && <span style={mingLiUStyle}>登出系統</span>}
            </button>
          </div>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden relative" style={mingLiUStyle}>
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 z-10 print:hidden" style={mingLiUStyle}>
          <div className="text-slate-800 font-black text-lg" style={mingLiUStyle}>{activeTab === 'dashboard' ? '數位儀表板' : activeTab === 'inbox' ? '建立智慧表單' : '人員管理'}</div>
          <div className="flex items-center gap-4 border-l border-gray-100 pl-6">
            <div className="text-right"><p className="text-xs font-black text-slate-800" style={mingLiUStyle}>{currentUser.name}</p><p className="text-[10px] text-slate-400 font-black uppercase" style={mingLiUStyle}>{currentUser.pos}</p></div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl border-2 border-white shadow-lg overflow-hidden"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`} alt="avatar" /></div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-12 bg-[#F8FAFC] print:p-0 print:bg-white" style={mingLiUStyle}>{renderMainContent()}</div>
      </main>
    </div>
  );
};

export default App;