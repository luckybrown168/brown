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
  User,
  MoreHorizontal,
  ChevronUp,
  UserCog,
  MessageSquare,
  Undo2,
  UserPlus2,
  ShieldCheck,
  ListChecks,
  GitBranch,
  History,
  ShieldAlert
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

// --- 單一登入限制：全域 Token 管理 ---
let globalTokenData = null;
const setGlobalToken = (staffId, token) => { globalTokenData = { staffId, token }; };
const clearGlobalToken = () => { globalTokenData = null; };

// 通用的 Fetch Headers 處理，自動帶入 Session Token
const getRequestHeaders = (extraHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', 
    ...extraHeaders
  };
  if (globalTokenData) {
    headers['x-staff-id'] = globalTokenData.staffId;
    headers['x-session-token'] = globalTokenData.token;
  }
  return headers;
};

// 全域 API 請求封裝，自動攔截 401 無效的 Token
const apiFetch = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (res.status === 401) {
    // 觸發自訂的全域登出事件
    window.dispatchEvent(new CustomEvent('session-expired'));
    throw new Error("Session Invalid");
  }
  return res;
};

// --- 效期計算輔助函數 ---
const getExpirationStatus = (submitDateStr) => {
  if (!submitDateStr) return null;
  const submitDate = new Date(submitDateStr);
  const expireDate = new Date(submitDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7天效期
  const now = new Date();
  const diffMs = expireDate - now;

  if (diffMs <= 0) {
    return { isExpired: true, text: '已逾期', color: 'bg-red-50 text-red-600 border-red-200' };
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (diffDays > 3) {
    return { isExpired: false, text: `剩餘 ${diffDays} 天`, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
  } else if (diffDays > 0) {
    return { isExpired: false, text: `剩餘 ${diffDays}天 ${diffHours}時`, color: 'bg-amber-50 text-amber-600 border-amber-200' };
  } else {
    return { isExpired: false, text: `剩餘 ${diffHours} 小時`, color: 'bg-orange-50 text-orange-600 border-orange-300 animate-pulse' };
  }
};

// --- 職務代理人解析輔助函數 ---
const resolveDelegate = (targetStaffId, currentStaffList, visited = new Set()) => {
  if (visited.has(targetStaffId)) return targetStaffId; // 防止循環代理
  visited.add(targetStaffId);

  const staff = currentStaffList.find(s => s.staffId === targetStaffId);
  if (!staff || !staff.oooActive || !staff.oooDelegateId) return targetStaffId;

  const now = new Date();
  if (staff.oooStartDate && staff.oooEndDate) {
    const start = new Date(staff.oooStartDate);
    const end = new Date(staff.oooEndDate);
    end.setHours(23, 59, 59, 999);
    if (now < start || now > end) return targetStaffId;
  }
  
  return resolveDelegate(staff.oooDelegateId, currentStaffList, visited);
};

// --- 職級與自動上呈解析輔助函數 ---
const getPositionRank = (pos) => {
  if (!pos) return 0;
  const p = pos.toLowerCase();
  if (p.includes('執行長') || p.includes('ceo')) return 110;
  if (p.includes('總經理') && !p.includes('副總經理')) return 100;
  if (p.includes('副總') || p.includes('總監')) return 90;
  if (p.includes('處長') || p.includes('協理')) return 80;
  if (p.includes('經理') && !p.includes('副理') && !p.includes('總經理')) return 70;
  if (p.includes('副理')) return 60;
  if (p.includes('組長') || p.includes('課長') || p.includes('主任')) return 50;
  if (p.includes('資深') || p.includes('高級')) return 30;
  return 10; // 一般員工/專員
};

const findSupervisor = (staffId, staffList) => {
  const staff = staffList.find(s => s.staffId === staffId);
  if (!staff) return null;

  const staffRank = getPositionRank(staff.pos);

  // 1. 同部門且職級較高的人 (尋找最接近的直屬主管)
  const deptSupervisors = staffList.filter(s => s.dept === staff.dept && getPositionRank(s.pos) > staffRank);
  if (deptSupervisors.length > 0) {
    deptSupervisors.sort((a, b) => getPositionRank(a.pos) - getPositionRank(b.pos));
    return deptSupervisors[0].staffId;
  }

  // 2. 若部門內沒有更高級別，則全公司尋找職級較高的人 (例如找全公司最高級別的總經理)
  const companyExecutives = staffList.filter(s => s.staffId !== staffId && getPositionRank(s.pos) > staffRank);
  if (companyExecutives.length > 0) {
    // 找全公司分數最高的人
    companyExecutives.sort((a, b) => getPositionRank(b.pos) - getPositionRank(a.pos));
    return companyExecutives[0].staffId;
  }

  // 3. 容錯機制：如果資料庫的職稱都沒有設定符合的關鍵字，至少往上抓全公司職級相對最高的主管
  const allOthers = staffList.filter(s => s.staffId !== staffId);
  if (allOthers.length > 0) {
    allOthers.sort((a, b) => getPositionRank(b.pos) - getPositionRank(a.pos));
    // 只要最高分的人有 50 分(含)以上的主管級，就可以當作最終呈報對象
    if (getPositionRank(allOthers[0].pos) >= 50) {
      return allOthers[0].staffId;
    }
  }

  return null; // 真的沒有任何人可以呈報了
};

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
        if ((staffId === 'admin' || staffId === '0338') && password === '123456') {
          onLoginSuccess({ 
            name: staffId === '0338' ? '預設管理員' : '系統管理員', 
            pos: 'Administrator', 
            dept: '總經理室', 
            staffId: staffId === '0338' ? '0338' : 'ADMIN-01',
            annualLeave: 56.0,
            compLeave: 12.5,
            isAdmin: true,
            sessionToken: 'mock-admin-token'
          });
        } else if (staffId === 'user' && password === '123456') {
          onLoginSuccess({ 
            name: '一般測試員', pos: '專員', dept: '業務部', staffId: 'USER-01', annualLeave: 10, compLeave: 5, isAdmin: false,
            sessionToken: 'mock-user-token'
          });
        } else {
          setError('連線中斷或測試模式請輸入 admin(或0338) / 123456');
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
          <p className="text-indigo-100 text-xs font-bold mt-2 uppercase tracking-widest opacity-80" style={mingLiUStyle}>Smart Approval Workflow</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-10 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2" style={mingLiUStyle}>
              <AlertCircle size={16} /> {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase ml-1" style={mingLiUStyle}>員工編號 Staff ID</label>
            <div className="relative">
              <UserCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type="text" required value={staffId} onChange={(e) => setStaffId(e.target.value)} style={mingLiUStyle}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-sm" placeholder="請輸入員編" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase ml-1" style={mingLiUStyle}>登入密碼 Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={mingLiUStyle}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-sm" placeholder="請輸入密碼" />
            </div>
          </div>

          <button type="submit" disabled={loading} style={mingLiUStyle} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4">
            {loading ? <RotateCcw className="animate-spin" size={20} /> : <LogIn size={20} />} 進入系統
          </button>
          
          <p className="text-center text-xs text-slate-300 font-bold uppercase pt-4 tracking-tighter" style={mingLiUStyle}>
            {!isLocalhost && !isMockMode ? "🌐 正透過公網安全隧道連線" : isMockMode ? "⚠️ 模擬模式已啟動" : "✅ 本機開發模式"}
          </p>
        </form>
      </div>
    </div>
  );
};

// --- 輔助組件：列表視圖 ---
const ListView = ({ title, icon: Icon, color, data, onItemClick, onDelete }) => {
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
              <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[12px]" style={mingLiUStyle}>簽核時效</th>
              <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[12px]" style={mingLiUStyle}>狀態</th>
              <th className="px-8 py-4 text-right font-black text-slate-400 uppercase tracking-widest text-[12px]" style={mingLiUStyle}>檢視</th>
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
                  {item.status === 'Pending' && item.submitDate ? (() => {
                    const exp = getExpirationStatus(item.submitDate);
                    if(!exp) return null;
                    return (
                      <span className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-black ${exp.color} whitespace-nowrap flex items-center gap-1 w-fit shadow-sm`} style={mingLiUStyle}>
                        <Timer size={12} />
                        {exp.text}
                      </span>
                    );
                  })() : (
                    <span className="text-slate-300 text-xs font-bold" style={mingLiUStyle}>-</span>
                  )}
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    item.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 
                    item.status === 'Completed' ? 'bg-green-50 text-green-600' : 
                    item.status === 'Deleted' ? 'bg-slate-100 text-slate-500' : 
                    item.status === 'Draft' ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-600'
                  }`} style={mingLiUStyle}>
                    {item.status === 'Pending' ? '待簽核' : 
                     item.status === 'Deleted' ? '已刪除' : 
                     item.status === 'Draft' ? '草稿' : item.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end items-center gap-2">
                    {onDelete && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(item); }} 
                        className="p-2 text-slate-300 hover:text-red-500 transition-all active:scale-90"
                        title="刪除單據"
                      >
                        <Trash size={18} />
                      </button>
                    )}
                    <button onClick={() => onItemClick(item)} className="p-2 text-slate-300 hover:text-blue-600 transition-all active:scale-90">
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="px-8 py-20 text-center text-slate-300 italic text-sm" style={mingLiUStyle}>
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
    staffId: '', name: '', dept: '', team: '', pos: '', hireDate: '', email: '', password: '', annualLeave: '0', compLeave: '0', isAdmin: false
  });

  useEffect(() => {
    if (initialData) { 
      const formattedDate = initialData.hireDate ? initialData.hireDate.split('T')[0] : '';
      setFormData({ ...initialData, hireDate: formattedDate, isAdmin: !!initialData.isAdmin }); 
    } 
    else { 
      setFormData({ staffId: '', name: '', dept: '', team: '', pos: '', hireDate: '', email: '', password: '', annualLeave: '0', compLeave: '0', isAdmin: false }); 
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
              <p className="text-xs opacity-70 font-bold uppercase tracking-widest" style={mingLiUStyle}>{initialData ? 'Update Profile' : 'Create New Profile'}</p>
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
                <option value="總經理室">總經理室</option><option value="財務行政部">財務行政部</option>
                <option value="業務部">業務部</option><option value="系統暨工程部">系統暨工程部</option>
              </select>
            </div>
            <div><label className={labelClass} style={mingLiUStyle}>組別</label>
              <select name="team" value={formData.team} onChange={handleChange} className={inputClass} style={mingLiUStyle}>
                <option value="">請選擇組別</option>
                <option value="總經理室">總經理室</option>
                <option value="財務行政部">財務行政部</option>
                <option value="北區營業組">北區營業組</option><option value="中區營業組">中區營業組</option><option value="南區營業組">南區營業組</option><option value="客服組">客服組</option><option value="產品組">產品組</option><option value="工程組">工程組</option><option value="系統組">系統組</option>
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
          
          {/* 系統管理員設定區塊 */}
          <div className="col-span-2 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                name="isAdmin" 
                checked={formData.isAdmin} 
                onChange={handleChange} 
                className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer" 
              />
              <div className="flex flex-col">
                <span className="text-sm font-black text-indigo-800 flex items-center gap-1.5" style={mingLiUStyle}>
                  <ShieldCheck size={16} /> 設為系統管理員
                </span>
                <span className="text-[11px] text-indigo-500 font-bold mt-0.5" style={mingLiUStyle}>開啟後，該人員可於左側選單進入「人員管理」與「流程設定」介面。</span>
              </div>
            </label>
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

// --- 職務代理設定彈出視窗 ---
const DelegateSettingsModal = ({ isOpen, onClose, onSave, currentUser, staffList }) => {
  const [formData, setFormData] = useState({
    oooActive: false,
    oooDelegateId: '',
    oooStartDate: '',
    oooEndDate: ''
  });

  useEffect(() => {
    if (currentUser && isOpen) {
      setFormData({
        oooActive: !!currentUser.oooActive,
        oooDelegateId: currentUser.oooDelegateId || '',
        oooStartDate: currentUser.oooStartDate || '',
        oooEndDate: currentUser.oooEndDate || ''
      });
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const labelClass = "text-[12px] font-black text-slate-500 mb-1.5 block";
  const inputClass = "w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 transition-all bg-slate-50 shadow-sm";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={mingLiUStyle}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300" style={mingLiUStyle}>
        <div className="bg-purple-600 px-8 py-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Briefcase size={20} /></div>
            <div>
              <h3 className="text-lg font-black tracking-tight" style={mingLiUStyle}>職務代理設定</h3>
              <p className="text-xs opacity-70 font-bold uppercase tracking-widest" style={mingLiUStyle}>Out-of-Office Delegation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100 flex items-center justify-between">
            <div>
              <p className="font-black text-purple-800 text-sm mb-1" style={mingLiUStyle}>啟用職務代理</p>
              <p className="text-xs text-purple-600/70 font-bold" style={mingLiUStyle}>開啟後，指派給您的表單將自動轉派</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="oooActive" checked={formData.oooActive} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className={`space-y-5 transition-opacity duration-300 ${!formData.oooActive ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div>
              <label className={labelClass} style={mingLiUStyle}>指定代理人 (僅限同部門)</label>
              <select name="oooDelegateId" value={formData.oooDelegateId} onChange={handleChange} className={inputClass} style={mingLiUStyle}>
                <option value="">-- 請選擇同部門代理人 --</option>
                {/* 修改：過濾條件增加 s.dept === currentUser?.dept */}
                {staffList
                  .filter(s => s.staffId !== currentUser?.staffId && s.dept === currentUser?.dept)
                  .map(s => (
                    <option key={s.staffId} value={s.staffId}>{s.name} ({s.pos}) - {s.dept}</option>
                  ))
                }
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={mingLiUStyle}>開始日期 (選填)</label>
                <input type="date" name="oooStartDate" value={formData.oooStartDate} onChange={handleChange} className={inputClass} style={mingLiUStyle} />
              </div>
              <div>
                <label className={labelClass} style={mingLiUStyle}>結束日期 (選填)</label>
                <input type="date" name="oooEndDate" value={formData.oooEndDate} onChange={handleChange} className={inputClass} style={mingLiUStyle} />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-bold leading-relaxed" style={mingLiUStyle}>
              * 若未設定日期，則只要「啟用」即刻生效。<br/>
              * 若設定日期區間，系統將以您設定的起訖日自動判斷是否轉派。
            </p>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border rounded-xl text-sm font-bold text-slate-500 hover:bg-white transition-all" style={mingLiUStyle}>取消</button>
          <button onClick={() => {
            if (formData.oooActive && !formData.oooDelegateId) {
              return alert("啟用代理時，請務必選擇一位代理人！");
            }
            onSave(formData);
          }} className="flex-[2] py-3 bg-purple-600 text-white rounded-xl text-sm font-black flex items-center justify-center gap-2 hover:bg-purple-700 transition-all shadow-md active:scale-95" style={mingLiUStyle}>
            <Save size={18} /> 儲存設定
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 組件：流程設定視圖 (自動化規則設定) ---
const WorkflowSettingsView = ({ staffList, rules, onSaveRule, onDeleteRule, teamOptions }) => {
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({ category: '差勤類', formKind: '所有單據', department: '所有組別', steps: [] });
  const [tempStaffId, setTempStaffId] = useState('');
  const [tempRole, setTempRole] = useState('簽核');

  const categories = ["行政類", "銷售類", "差勤類", "系統類"];
  const formKinds = {
    "差勤類": ["所有單據", "出勤異常單", "銷假單", "加班單", "請假單"],
    "行政類": ["所有單據"], "銷售類": ["所有單據"], "系統類": ["所有單據"]
  };

  const handleEdit = (rule) => {
    setEditingRule(rule.id);
    setFormData({ ...rule });
  };

  const handleAddStep = () => {
    if (!tempStaffId) return;
    const staff = staffList.find(s => s.staffId === tempStaffId);
    if (!staff) return;
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { staffId: staff.staffId, role: tempRole }]
    }));
    setTempStaffId('');
  };

  const handleRemoveStep = (index) => {
    const newSteps = [...formData.steps];
    newSteps.splice(index, 1);
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const handleSave = () => {
    if (formData.steps.length === 0) return alert('請至少加入一位簽核人員');
    onSaveRule({
      id: editingRule || `rule-${Date.now()}`,
      ...formData
    });
    setEditingRule(null);
    setFormData({ category: '差勤類', formKind: '所有單據', department: '所有組別', steps: [] });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500" style={mingLiUStyle}>
      <div className="flex items-center gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg text-white">
          <GitBranch size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800" style={mingLiUStyle}>簽核流程配置與自動化</h2>
          <p className="text-xs text-slate-400 font-bold" style={mingLiUStyle}>設定各類單據與組別的預設送單路徑，員工送單時將自動套用</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2" style={mingLiUStyle}><ListOrdered size={18} className="text-indigo-600"/> 已設定的自動化規則</h3>
            <div className="space-y-3">
              {rules.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4" style={mingLiUStyle}>尚無任何規則，請於右側新增</p>
              ) : (
                rules.map(rule => (
                  <div key={rule.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:border-indigo-300 transition-colors group cursor-pointer" onClick={() => handleEdit(rule)}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded uppercase" style={mingLiUStyle}>{rule.category}</span>
                      <button onClick={(e) => { e.stopPropagation(); onDeleteRule(rule.id); }} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash size={14}/></button>
                    </div>
                    <p className="text-sm font-bold text-slate-700" style={mingLiUStyle}>
                      {rule.formKind === '所有單據' ? '套用該類別所有單據' : rule.formKind}
                      <span className="text-[11px] text-slate-400 ml-1.5 bg-slate-200 px-1.5 py-0.5 rounded">
                        {rule.department || '所有組別'}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 mt-2 font-bold" style={mingLiUStyle}>共 {rule.steps.length} 個預設簽核關卡</p>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => { setEditingRule(null); setFormData({ category: '差勤類', formKind: '所有單據', department: '所有組別', steps: [] }); }} className="w-full mt-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black text-xs hover:bg-indigo-100 transition-colors flex justify-center items-center gap-2" style={mingLiUStyle}>
              <Plus size={16}/> 建立新規則
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
          <h3 className="text-lg font-black text-slate-800 mb-6 border-b border-slate-100 pb-4" style={mingLiUStyle}>
            {editingRule ? '編輯自動化規則' : '新增自動化規則'}
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-black text-slate-500 mb-1.5 block" style={mingLiUStyle}>適用大類</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value, formKind: '所有單據'})} className="w-full p-3 border border-slate-300 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 bg-slate-50" style={mingLiUStyle}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 mb-1.5 block" style={mingLiUStyle}>適用單據種類</label>
                <select value={formData.formKind} onChange={e => setFormData({...formData, formKind: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 bg-slate-50" style={mingLiUStyle}>
                  {(formKinds[formData.category] || ["所有單據"]).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 mb-1.5 block" style={mingLiUStyle}>適用組別條件</label>
                <select value={formData.department || '所有組別'} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 bg-slate-50" style={mingLiUStyle}>
                  <option value="所有組別">所有組別 (無差別套用)</option>
                  {teamOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <label className="text-xs font-black text-indigo-600 mb-3 block" style={mingLiUStyle}>設定預設流程路徑</label>
              
              <div className="space-y-2 mb-6">
                {formData.steps.length === 0 ? (
                  <div className="py-8 border-2 border-dashed border-slate-300 rounded-xl text-center text-slate-400 text-sm font-bold" style={mingLiUStyle}>尚未設定人員，請從下方加入</div>
                ) : (
                  formData.steps.map((step, idx) => {
                    const staffInfo = staffList.find(s => s.staffId === step.staffId) || { name: '未知人員', pos: '' };
                    return (
                      <div key={idx} className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black shrink-0">{idx + 1}</div>
                        <div className="flex-1 flex justify-between items-center">
                          <div><span className="font-bold text-sm text-slate-700" style={mingLiUStyle}>{staffInfo.name}</span> <span className="text-xs text-slate-400">({staffInfo.pos})</span></div>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-black rounded uppercase" style={mingLiUStyle}>{step.role}</span>
                        </div>
                        <button onClick={() => handleRemoveStep(idx)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors rounded hover:bg-red-50"><X size={16}/></button>
                      </div>
                    )
                  })
                )}
              </div>

              <div className="flex gap-2 items-center">
                <select value={tempStaffId} onChange={e => setTempStaffId(e.target.value)} className="flex-1 p-2.5 border border-slate-300 rounded-xl text-sm font-bold outline-none focus:border-indigo-500" style={mingLiUStyle}>
                  <option value="">-- 選擇指定人員 --</option>
                  {staffList.map(s => <option key={s.staffId} value={s.staffId}>{s.name} - {s.dept}</option>)}
                </select>
                <select value={tempRole} onChange={e => setTempRole(e.target.value)} className="w-24 p-2.5 border border-slate-300 rounded-xl text-sm font-bold outline-none focus:border-indigo-500" style={mingLiUStyle}>
                  <option value="簽核">簽核</option><option value="會簽">會簽</option><option value="交辦">交辦</option>
                </select>
                <button onClick={handleAddStep} className="px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-black hover:bg-slate-700 transition-colors" style={mingLiUStyle}>加入</button>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button onClick={handleSave} className="px-8 py-3 bg-[#1677FF] text-white rounded-xl text-sm font-black flex items-center gap-2 hover:bg-blue-700 shadow-md active:scale-95 transition-all" style={mingLiUStyle}>
                <Save size={18}/> 儲存規則
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 組件：稽核日誌視圖 ---
const AuditLogView = ({ isMockMode }) => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      if (isMockMode) {
        // 模擬數據
        setLogs([
          { id: 'L001', user: 'ADMIN-01', name: '管理員', action: '系統登入', target: 'N/A', details: '成功從 192.168.1.5 登入', timestamp: new Date().toISOString() },
          { id: 'L002', user: '0338', name: '王管理', action: '人員變更', target: 'USER-01', details: '修改 剩餘特休 時數: 10 -> 12', timestamp: new Date(Date.now() - 3600000).toISOString() },
          { id: 'L003', user: 'USER-01', name: '一般測試員', action: '提交表單', target: 'F20240320-USER-01-001', details: '發起 [請假單] 申請', timestamp: new Date(Date.now() - 7200000).toISOString() },
          { id: 'L004', user: '0338', name: '王管理', action: '表單簽核', target: 'F20240320-USER-01-001', details: '執行決策: 同意', timestamp: new Date(Date.now() - 10800000).toISOString() },
        ]);
      } else {
        const response = await apiFetch(`${API_URL_ROOT}/api/audit_logs`, { headers: getRequestHeaders() });
        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        }
      }
    } catch (err) {
      console.error("無法載入日誌:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, [isMockMode]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500" style={mingLiUStyle}>
      <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg text-white">
            <History size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800" style={mingLiUStyle}>系統稽核日誌</h2>
            <p className="text-xs text-slate-400 font-bold" style={mingLiUStyle}>監控所有人員的操作行為與系統狀態變更記錄</p>
          </div>
        </div>
        <button onClick={fetchLogs} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
          <RotateCcw size={20} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/30">
            <tr className="text-[12px] font-black text-slate-400 uppercase tracking-widest" style={mingLiUStyle}>
              <th className="px-8 py-4">操作時間</th>
              <th className="px-6 py-4">執行人員</th>
              <th className="px-6 py-4">動作項目</th>
              <th className="px-6 py-4">操作對象</th>
              <th className="px-8 py-4">詳細說明</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.length > 0 ? logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5 text-xs font-bold text-slate-500" style={mingLiUStyle}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-700" style={mingLiUStyle}>{log.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{log.user}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black ${
                    log.action.includes('刪除') || log.action.includes('異常') ? 'bg-red-50 text-red-600 border border-red-100' :
                    log.action.includes('登入') ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    log.action.includes('變更') ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-slate-100 text-slate-600'
                  }`} style={mingLiUStyle}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-5 text-xs font-bold text-indigo-600" style={mingLiUStyle}>
                  {log.target}
                </td>
                <td className="px-8 py-5 text-sm text-slate-600 font-bold" style={mingLiUStyle}>
                  {log.details}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-300 italic text-sm">{isLoading ? "讀取中..." : "目前尚無日誌。"}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 時間/工時選擇器組件 ---
const TimePicker = ({ id, value, onChange, defaultTime = '09:00' }) => {
  const h = value ? value.split(':')[0] : defaultTime.split(':')[0];
  const m = value ? value.split(':')[1] : defaultTime.split(':')[1];
  
  useEffect(() => {
    if (!value) {
      onChange(id, defaultTime);
    }
  }, []);

  const updateTime = (newH, newM) => onChange(id, `${newH}:${newM}`);

  return (
    <div className="flex items-center gap-4 bg-slate-50 p-4 border border-slate-200 rounded-xl" style={mingLiUStyle}>
      <div className="flex items-center gap-2">
        <select style={mingLiUStyle} value={h} onChange={(e) => updateTime(e.target.value, m)} className="border rounded px-2 py-1 text-sm bg-white outline-none">
          {Array.from({length: 24}, (_, i) => String(i).padStart(2, '0')).map(num => <option key={num} value={num}>{num}</option>)}
        </select>
        <span className="text-sm font-bold text-slate-600" style={mingLiUStyle}>時</span>
      </div>
      <div className="flex items-center gap-2">
        <select style={mingLiUStyle} value={m} onChange={(e) => updateTime(h, e.target.value)} className="border rounded px-2 py-1 text-sm bg-white outline-none">
          {Array.from({length: 60}, (_, i) => String(i).padStart(2, '0')).map(num => <option key={num} value={num}>{num}</option>)}
        </select>
        <span className="text-sm font-bold text-slate-600" style={mingLiUStyle}>分</span>
      </div>
      <div className="ml-auto text-blue-600 opacity-30"><Clock size={20} /></div>
    </div>
  );
};

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
        <div className="flex flex-col gap-1"><span className="text-xs font-black text-slate-400 uppercase" style={mingLiUStyle}>1. 日期</span><input type="date" value={tempDate} onChange={(e) => { setTempDate(e.target.value); setIsConfirmed(false); }} className="border rounded px-2 py-1 text-sm outline-none" style={mingLiUStyle} /></div>
        <div className="flex flex-col gap-1"><span className="text-xs font-black text-slate-400 uppercase" style={mingLiUStyle}>2. 時間</span><div className="flex items-center gap-1"><select value={tempHour} onChange={(e) => { setTempHour(e.target.value); setIsConfirmed(false); }} className="border rounded px-1 py-1 text-sm" style={mingLiUStyle}>{Array.from({length: 12}, (_, i) => String(i+1).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}</select><span>:</span><select value={tempMin} onChange={(e) => { setTempMin(e.target.value); setIsConfirmed(false); }} className="border rounded px-1 py-1 text-sm" style={mingLiUStyle}><option value="00">00</option><option value="30">30</option></select></div></div>
        <div className="flex flex-col gap-1"><span className="text-xs font-black text-slate-400 uppercase" style={mingLiUStyle}>3. 確認</span><div className="flex items-center gap-1">
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
const AnomalyNoticeBlock = () => (
  <div className="bg-red-50/40 border border-red-200 rounded-2xl p-6 mt-4 shadow-inner" style={mingLiUStyle}>
    <div className="flex items-center gap-2 mb-4 text-red-800 border-b border-red-200 pb-2"><Info size={18} /><span className="font-black text-base" style={mingLiUStyle}>出勤異常單備註</span></div>
    <div className="space-y-3 text-[13px] text-slate-700 leading-relaxed">
      <div className="flex gap-3"><span className="font-black text-red-600 shrink-0" style={mingLiUStyle}>1.</span><div style={mingLiUStyle}>請盡量避免因電腦未登出或未關機而補單。</div></div>
      <div className="flex gap-3"><span className="font-black text-red-600 shrink-0" style={mingLiUStyle}>2.</span><div style={mingLiUStyle}>出勤異常確認單請於出勤日期隔日前交付財務行政部辦理。</div></div>
      <div className="flex gap-3"><span className="font-black text-red-600 shrink-0" style={mingLiUStyle}>3.</span><div style={mingLiUStyle}>加班事後申請請於加班後七個工作日內交至財務行政部辦理，逾期視同無加班事實。</div></div>
    </div>
  </div>
);

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
          { title: "三. 普通傷病假", content: "以日或時為單位，請假日數超過一日以上，檢附健保醫院 or 公立醫院 or 公司特約醫院診斷證明(附醫囑建議休息天數)。" },
          { title: "四. 事假", content: "以日或時為單位。" },
          { title: "五. 分娩假", content: "以日為單位。檢附診斷證明或出生證明。" },
          { title: "六. 陪產假", content: "以日為單位，於配偶分娩之當日及其前後合計十五日期間內，擇其中之五日請假。檢附診斷證明或毀生證明。" },
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
      <div className="flex gap-3"><span className="font-black text-blue-600 shrink-0" style={mingLiUStyle}>A.</span><div style={mingLiUStyle}>加班申請須事前由直屬主管核准，始得進行加班，並於事後呈現主管審核確認。</div></div>
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
      const response = await apiFetch(API_BASE_URL, {
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
    if (!editingStaff) {
      const isStaffIdExists = staffList.some(s => s.staffId === staffData.staffId);
      if (isStaffIdExists) {
        alert(`儲存失敗：員工編號 [${staffData.staffId}] 已存在於系統中，請使用其他編號。`);
        return; 
      }
    }

    try {
      setIsLoading(true);
      if (!isMockMode) {
        const url = editingStaff ? `${API_BASE_URL}/${staffData.staffId}` : API_BASE_URL;
        const method = editingStaff ? 'PUT' : 'POST';
        
        const response = await apiFetch(url, { 
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
      setIsModalOpen(false); 
      setEditingStaff(null);
    } catch (err) { 
      console.error("操作失敗", err); 
      alert("儲存人員資料時發生錯誤。");
    } 
    finally { setIsLoading(false); }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm(`確定要刪除成員 [${staffId}] 嗎？`)) return;
    try {
      if (!isMockMode) { 
        const response = await apiFetch(`${API_BASE_URL}/${staffId}`, { 
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
          <div><h2 className="text-2xl font-black text-slate-800" style={mingLiUStyle}>人員資料管理</h2><p className="text-xs text-slate-400 font-bold" style={mingLiUStyle}>檢視及維護公司成員的基本資訊與系統管理員權限</p></div>
        </div>
        <div className="flex gap-3">
          <div className={`px-4 py-3 rounded-2xl border flex items-center gap-2 transition-colors ${isMockMode ? 'bg-slate-100 border-slate-200' : 'bg-emerald-50 border-emerald-100'}`}>
              <div className={`w-2 h-2 rounded-full ${isMockMode ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'}`}></div>
              <span className={`text-xs font-black uppercase tracking-widest ${isMockMode ? 'text-slate-500' : 'text-emerald-600'}`} style={mingLiUStyle}>{isMockMode ? 'Mock Mode' : 'Tunnel Active'}</span>
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
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full border border-white shadow-sm overflow-hidden">
                      <img src={`https://robohash.org/${encodeURIComponent(person.name)}?set=set4`} alt="avatar" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-indigo-600 mb-0.5 flex items-center gap-1.5" style={mingLiUStyle}>
                        {person.staffId}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-[18px] font-bold text-slate-700 leading-tight" style={mingLiUStyle}>{person.name}</p>
                        {(person.isAdmin || person.staffId === '0338' || person.staffId === 'ADMIN-01') && (
                          <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[10px] font-black tracking-widest flex items-center gap-1" style={mingLiUStyle}>
                            <ShieldCheck size={10} /> 管理員
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-[18px] font-bold text-slate-600" style={mingLiUStyle}>{person.dept} {person.team ? `/ ${person.team}` : ''}</td>
                <td className="px-6 py-5 text-[18px] font-bold text-slate-600" style={mingLiUStyle}>{person.pos}</td>
                <td className="px-6 py-5 flex items-center gap-1.5 text-slate-500" style={mingLiUStyle}><Mail size={16} className="text-slate-300" /><span className="text-[18px] font-bold">{person.email}</span></td>
                <td className="px-8 py-5 text-right"><div className="flex justify-end gap-2"><button onClick={() => { setEditingStaff(person); setIsModalOpen(true); }} className="p-2 text-slate-300 hover:text-indigo-600 transition-all"><Edit size={22} /></button><button onClick={() => handleDeleteStaff(person.staffId)} className="p-2 text-slate-300 hover:text-red-500 transition-all"><Trash size={22} /></button></div></td>
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
const SmartFormEngine = ({ schema, formValues, onInputChange, onPreview, isProcessing, staffList }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (fieldId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("檔案太大，請上傳小於 5MB 的檔案");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
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

  const isRequiredMissing = !formValues.form_subject || !formValues.employee_id;

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
                {field.type !== "button" && field.type !== "notice" && field.type !== "ot_notice" && field.type !== "anomaly_notice" && field.type !== "switch" && field.type !== "multi_select_staff" && (
                  <div className="flex items-center gap-2 mb-2"><div className="w-1.5 h-1.5 bg-[#1677FF] rounded-full"></div><label className="text-sm font-bold text-slate-700 underline decoration-slate-200 underline-offset-4" style={mingLiUStyle}>{field.label}：</label></div>
                )}
                {field.type === "select" && <select style={mingLiUStyle} value={formValues[field.id] || ""} onChange={(e) => onInputChange(field.id, e.target.value)} className="w-full border border-slate-400 p-2 rounded text-sm outline-none focus:border-blue-500 bg-white shadow-sm"><option value="">-- 請選擇 --</option>{field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>}
                {(field.type === "text" || field.type === "number") && <input type={field.type} style={mingLiUStyle} placeholder={`請輸入${field.label}`} value={formValues[field.id] || ""} onChange={(e) => onInputChange(field.id, e.target.value)} className="w-full border border-slate-400 p-2 rounded text-sm outline-none focus:border-blue-500 shadow-sm" />}
                
                {field.type === "time_picker" && <TimePicker id={field.id} value={formValues[field.id]} onChange={onInputChange} defaultTime={field.id === 'anomaly_clock_out' ? '18:00' : '09:00'} />}
                {field.type === "datetime" && <DateTimePicker id={field.id} label={field.label} value={formValues[field.id]} onChange={onInputChange} />}
                {field.type === "duration" && <DurationPicker id={field.id} value={formValues[field.id]} onChange={onInputChange} />}
                {field.type === "leave_duration" && <LeaveDurationPicker id={field.id} value={formValues[field.id]} onChange={onInputChange} />}
                
                {field.type === "switch" && (
                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm mt-2">
                    <div>
                      <p className="text-sm font-bold text-slate-700" style={mingLiUStyle}>{field.label}</p>
                      {field.description && <p className="text-xs text-slate-400 mt-1" style={mingLiUStyle}>{field.description}</p>}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={!!formValues[field.id]} onChange={(e) => onInputChange(field.id, e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                )}

                {field.type === "multi_select_staff" && (
                  <div className="flex flex-col bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm mt-2">
                    <div>
                      <p className="text-sm font-bold text-slate-700" style={mingLiUStyle}>{field.label}</p>
                      {field.description && <p className="text-xs text-slate-400 mt-1" style={mingLiUStyle}>{field.description}</p>}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(formValues[field.id] || []).map(id => {
                        const s = staffList?.find(staff => staff.staffId === id);
                        return (
                          <span key={id} className="px-2.5 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-black rounded-lg flex items-center gap-1.5 shadow-sm" style={mingLiUStyle}>
                            <User size={12} />
                            {s?.name || id}
                            <button type="button" onClick={() => {
                              const newArr = (formValues[field.id] || []).filter(item => item !== id);
                              onInputChange(field.id, newArr);
                            }} className="hover:text-red-500 hover:bg-white rounded-full p-0.5 transition-colors"><X size={12}/></button>
                          </span>
                        )
                      })}
                    </div>
                    <select 
                      className="w-full mt-3 border border-slate-300 p-2.5 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 bg-white shadow-sm"
                      style={mingLiUStyle}
                      value=""
                      onChange={(e) => {
                        if (!e.target.value) return;
                        const currentArr = formValues[field.id] || [];
                        if (!currentArr.includes(e.target.value)) {
                          onInputChange(field.id, [...currentArr, e.target.value]);
                        }
                      }}
                    >
                      <option value="">-- 請選擇欲分享的同仁 --</option>
                      {staffList?.filter(s => s.staffId !== formValues.employee_id).map(s => (
                        <option key={s.staffId} value={s.staffId}>{s.name} ({s.pos}) - {s.dept}</option>
                      ))}
                    </select>
                  </div>
                )}

                {field.type === "file" && (
                  <div className="relative group">
                    <input type="file" className="hidden" id={`file-${field.id}`} onChange={(e) => handleFileChange(field.id, e)} />
                    <div className={`flex items-center gap-3 w-full border-2 border-dashed ${formValues[field.id] ? 'border-green-400 bg-green-50/30' : 'border-slate-300 bg-transparent'} p-4 rounded-xl transition-all group`}>
                      <label htmlFor={`file-${field.id}`} className="flex flex-1 items-center gap-3 cursor-pointer">
                        <div className={`w-10 h-10 ${formValues[field.id] ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'} rounded-lg flex items-center justify-center transition-colors`}>
                          {isUploading ? <RotateCcw size={20} className="animate-spin" /> : <Paperclip size={20} />}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-bold text-slate-600 truncate" style={mingLiUStyle}>
                            {isUploading ? "正在處理檔案..." : (formValues[field.id]?.name || "點擊或拖曳檔案至此處上傳")}
                          </p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-tight" style={mingLiUStyle}>支援 PDF, JPG, PNG (最大 5MB)</p>
                        </div>
                      </label>
                      {formValues[field.id] && !isUploading && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="text-green-500" size={24} />
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onInputChange(field.id, null); }} 
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
                            title="移除附件"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {field.type === "notice" && <LeaveNoticeBlock />}
                {field.type === "ot_notice" && <OvertimeNoticeBlock />}
                {field.type === "anomaly_notice" && <AnomalyNoticeBlock />}
                {field.type === "button" && (
                  <div className="w-full mt-4">
                    <button 
                      type="button" 
                      disabled={isProcessing || isRequiredMissing} 
                      onClick={onPreview} 
                      title={isRequiredMissing ? "請先填寫「單據主旨」與「員工編號」" : "點擊進入預覽與設定簽核"}
                      className={`w-full py-4 rounded-xl font-black shadow-lg transition-all flex items-center justify-center gap-2 text-lg ${isRequiredMissing ? 'bg-slate-300 text-slate-500 cursor-not-allowed grayscale' : 'bg-[#1677FF] text-white hover:bg-blue-700 active:scale-[0.99]'}`} 
                      style={mingLiUStyle}
                    >
                      <Eye size={20} /> 預覽填寫內容
                    </button>
                    {isRequiredMissing && (
                      <p className="text-center text-xs text-red-500 font-bold mt-2 animate-pulse" style={mingLiUStyle}>
                        * 請務必輸入單據主旨與員工編號方可進行下一步
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- 組件：預覽校對畫面 ---
const SubmissionPreview = ({ schema, values, onEdit, onSubmit, onSaveDraft, staffList, isProcessing, workflowRules, currentUser }) => {
  const [workflowSteps, setWorkflowSteps] = useState(values.workflowPath || []);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedRole, setSelectedRole] = useState("簽核");

  useEffect(() => {
    if (!values.workflowPath || values.workflowPath.length === 0) {
      const userDept = values.department || '';

      const matchedRule = 
        workflowRules?.find(r => r.category === values.category && r.formKind === values.form_kind && r.department === userDept) ||
        workflowRules?.find(r => r.category === values.category && r.formKind === values.form_kind && r.department === '所有組別') ||
        workflowRules?.find(r => r.category === values.category && r.formKind === '所有單據' && r.department === userDept) ||
        workflowRules?.find(r => r.category === values.category && r.formKind === '所有單據' && r.department === '所有組別');

      if (matchedRule) {
        const applicantId = String(values.employee_id || currentUser?.staffId || "").trim().toLowerCase();
        const applicantStaff = staffList.find(s => String(s.staffId).trim().toLowerCase() === applicantId);
        const applicantRank = applicantStaff ? getPositionRank(applicantStaff.pos) : 0;

        const mappedSteps = matchedRule.steps.map(step => {
          let targetStaffId = step.staffId;
          let escalationNote = '';

          const targetStaff = staffList.find(s => s.staffId === targetStaffId);
          const targetRank = targetStaff ? getPositionRank(targetStaff.pos) : 0;

          const isSelf = String(targetStaffId).trim().toLowerCase() === applicantId;
          // 只針對「簽核」角色做職級檢測，避免把「交辦」或「會簽」的行政人員也誤判升級給總經理
          const isLowerRankApprover = step.role === '簽核' && targetRank < applicantRank;

          // 【修正邏輯】精細化不同角色碰到自己時的處理方式
          if (step.role === '簽核' && (isSelf || isLowerRankApprover)) {
            // 如果是「簽核」碰到自己或較低職級者，尋找「申請人」的主管進行上呈
            const supervisorId = findSupervisor(applicantStaff?.staffId || targetStaffId, staffList);
            if (supervisorId) {
              targetStaffId = supervisorId;
              escalationNote = '(自動上呈)';
            } else {
              // 找不到主管則跳過此流程避免自己核准自己
              return null;
            }
          } else if (isSelf && step.role !== '交辦') {
            // 如果是「會簽」或「串會」碰到自己，直接跳過（不需自己會簽自己）
            return null;
          }
          // 若是「交辦」碰到自己，系統會直接略過上述判斷，將關卡完整保留給自己執行

          const actualStaffId = resolveDelegate(targetStaffId, staffList);
          const staff = staffList.find(s => s.staffId === actualStaffId);
          const originalStaff = staffList.find(s => s.staffId === step.staffId);

          if (!staff) return null;

          const isDelegated = actualStaffId !== targetStaffId;
          let delegateNote = isDelegated ? `(代理 ${staffList.find(s => s.staffId === targetStaffId)?.name})` : '';
          
          let finalNote = [];
          if (escalationNote) finalNote.push(escalationNote);
          if (delegateNote) finalNote.push(delegateNote);

          return { 
            staffId: staff.staffId, 
            name: staff.name, 
            pos: staff.pos, 
            dept: staff.dept, 
            role: step.role,
            isDelegated,
            originalStaffId: isDelegated ? targetStaffId : null,
            delegateNote: finalNote.join(' ')
          };
        }).filter(Boolean);
        
        // 過濾掉連續重複的簽核人（若多關卡都替換為同一個主管，將其合併）
        const uniqueSteps = mappedSteps.filter((step, index, self) => 
          index === 0 || step.staffId !== self[index - 1].staffId
        );
        
        setWorkflowSteps(uniqueSteps);
      }
    }
  }, []);

  const roles = [
    { label: "簽核", value: "簽核", color: "bg-indigo-600", icon: CheckCircle },
    { label: "會簽", value: "會簽", color: "bg-emerald-600", icon: Users },
    { label: "串會", value: "串會", color: "bg-amber-600", icon: ListOrdered },
    { label: "交辦", value: "交辦", color: "bg-blue-600", icon: Play }
  ];

  const addToWorkflow = () => {
    if (!selectedStaffId) { alert("請先選擇人員"); return; }
    
    const actualStaffId = resolveDelegate(selectedStaffId, staffList);
    const staff = staffList.find(s => s.staffId === actualStaffId);
    const originalStaff = staffList.find(s => s.staffId === selectedStaffId);

    if (!staff) return;
    if (workflowSteps.some(step => step.staffId === actualStaffId)) { alert("此人員(或其代理人)已在流程中"); return; }
    
    const isDelegated = actualStaffId !== selectedStaffId;
    const delegateNote = isDelegated ? `(代理 ${originalStaff?.name})` : '';

    setWorkflowSteps([...workflowSteps, { 
      staffId: staff.staffId, 
      name: staff.name, 
      pos: staff.pos, 
      dept: staff.dept, 
      role: selectedRole,
      isDelegated,
      originalStaffId: isDelegated ? selectedStaffId : null,
      delegateNote
    }]);
    setSelectedStaffId("");
  };

  const removeFromWorkflow = (staffId) => setWorkflowSteps(workflowSteps.filter(step => step.staffId !== staffId));

  const moveStep = (index, direction) => {
    const newSteps = [...workflowSteps];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setWorkflowSteps(newSteps);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500" style={mingLiUStyle}>
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-10 shadow-xl relative font-serif">
          <div className="flex items-center gap-3 mb-8 border-b pb-4 border-blue-50">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><FileText size={24} /></div>
            <div>
              <h2 className="text-xl font-black text-slate-800" style={mingLiUStyle}>簽核表單預覽校對</h2>
              <p className="text-xs text-slate-400 font-bold" style={mingLiUStyle}>請確認下方資訊無誤後設定簽核路徑</p>
            </div>
          </div>
          <div className="flex flex-wrap -mx-2 gap-y-4 mb-10">
              {schema.fields.filter(f => f.type !== 'button' && f.type !== 'notice' && f.type !== 'ot_notice' && f.type !== 'anomaly_notice').map(field => {
                if (field.dependsOn) {
                  const parentValue = values[field.dependsOn];
                  const showConditions = Array.isArray(field.showIf) ? field.showIf : [field.showIf];
                  if (!showConditions.includes(parentValue)) return null;
                }
                const val = values[field.id];
                
                let displayVal = val || '(未填寫)';
                if (field.type === 'file') {
                  displayVal = val?.name ? `📎 ${val.name}` : '(未上傳)';
                } else if (field.type === 'switch') {
                  displayVal = val ? '✅ 是 (公開)' : '❌ 否 (不公開)';
                } else if (field.type === 'multi_select_staff') {
                  displayVal = (Array.isArray(val) && val.length > 0) ? val.map(id => staffList.find(s => s.staffId === id)?.name || id).join('、') : '(未指定)';
                }

                return (
                  <div key={field.id} className={`${field.width} px-2`}>
                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col">
                      <p className="text-xs font-black text-slate-400 uppercase mb-0.5 tracking-widest" style={mingLiUStyle}>{field.label}</p>
                      <p className="text-sm font-bold text-slate-700" style={mingLiUStyle}>{displayVal}</p>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-200 p-8 shadow-inner">
            <div className="flex items-center gap-2 mb-6"><UserCog size={22} className="text-indigo-600" /><h3 className="font-black text-lg text-slate-800" style={mingLiUStyle}>自定義簽核流程路徑</h3></div>
            <div className="flex flex-col md:flex-row gap-3 mb-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm items-end">
              <div className="flex-1 space-y-1.5"><label className="text-xs font-black text-slate-400 uppercase ml-1" style={mingLiUStyle}>1. 選擇人員</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-sm" value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)} style={mingLiUStyle}>
                  <option value="">-- 搜尋/選取簽核人員 --</option>
                  {staffList.map(s => (<option key={s.staffId} value={s.staffId}>{s.name} ({s.pos}) - {s.dept}</option>))}
                </select>
              </div>
              <div className="flex-1 space-y-1.5"><label className="text-xs font-black text-slate-400 uppercase ml-1" style={mingLiUStyle}>2. 指派任務角色</label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map(r => (<button key={r.value} onClick={() => setSelectedRole(r.value)} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-black transition-all ${selectedRole === r.value ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'}`} style={mingLiUStyle}><r.icon size={14} /> {r.label}</button>))}
                </div>
              </div>
              <button onClick={addToWorkflow} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 shadow-lg active:scale-95 flex items-center gap-2 shrink-0 h-[46px]" style={mingLiUStyle}><Plus size={18} /> 加入流程</button>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase ml-1 block mb-2" style={mingLiUStyle}>3. 簽核順序與角色預覽</label>
              {workflowSteps.length > 0 ? (
                <div className="space-y-3">
                  {workflowSteps.map((step, index) => {
                    const roleInfo = roles.find(r => r.value === step.role);
                    return (
                      <div key={step.staffId} className="flex items-center gap-4 animate-in slide-in-from-left-4 duration-300">
                        <div className="flex flex-col items-center gap-1"><div className="w-8 h-8 bg-white border-2 border-indigo-100 rounded-full flex items-center justify-center text-xs font-black text-indigo-600 shadow-sm">{index + 1}</div>{index < workflowSteps.length - 1 && <div className="w-0.5 h-6 bg-indigo-100"></div>}</div>
                        <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm group hover:border-indigo-300 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 ${roleInfo.color} rounded-xl flex items-center justify-center text-white shadow-inner`}><roleInfo.icon size={20} /></div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-black text-slate-800" style={mingLiUStyle}>
                                    {step.name}
                                    {step.delegateNote && <span className="text-amber-600 ml-1.5 text-xs bg-amber-50 px-1.5 py-0.5 rounded">{step.delegateNote}</span>}
                                  </p>
                                  <span className={`px-2 py-0.5 rounded-md text-xs font-black text-white uppercase ${roleInfo.color}`} style={mingLiUStyle}>{step.role}</span>
                                </div>
                                <p className="text-xs text-slate-400 font-bold" style={mingLiUStyle}>{step.pos} · {step.dept}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => moveStep(index, -1)} disabled={index === 0} className="p-1.5 text-slate-400 hover:text-indigo-600 disabled:opacity-20"><ChevronUp size={16} /></button>
                              <button onClick={() => moveStep(index, 1)} disabled={index === workflowSteps.length - 1} className="p-1.5 text-slate-400 hover:text-indigo-600 disabled:opacity-20"><ChevronDown size={16} /></button>
                              <div className="w-px h-6 bg-slate-100 mx-1"></div>
                              <button onClick={() => removeFromWorkflow(step.staffId)} className="p-1.5 text-slate-400 hover:text-red-500"><X size={16} /></button>
                            </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (<div className="py-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-300 gap-2"><Activity size={32} className="opacity-30" /><p className="text-sm font-bold" style={mingLiUStyle}>尚未設定任何簽核步驟，請由上方選取人員加入。</p></div>)}
            </div>
          </div>
          <div className="mt-12 flex gap-4">
              <button onClick={onEdit} disabled={isProcessing} className="flex-1 py-4 border-2 border-slate-200 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50" style={mingLiUStyle}><ChevronLeft size={20} /> 資訊有誤，回填單頁面</button>
              <button onClick={() => onSaveDraft({ workflowPath: workflowSteps })} disabled={isProcessing} className="flex-1 py-4 bg-indigo-50 text-indigo-600 border-2 border-indigo-100 rounded-2xl font-black hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 text-lg active:scale-95 disabled:opacity-50" style={mingLiUStyle}>
                {isProcessing ? <RotateCcw className="animate-spin" size={24} /> : <Save size={24} />} 儲存草稿
              </button>
              <button onClick={() => { if (workflowSteps.length === 0) return alert("請至少設定一名簽核人員"); onSubmit({ workflowPath: workflowSteps }); }} className={`flex-[2] py-4 text-white rounded-2xl font-black shadow-lg transition-all flex items-center justify-center gap-2 text-lg active:scale-95 ${workflowSteps.length > 0 && !isProcessing ? 'bg-[#1677FF] hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed opacity-50'}`} style={mingLiUStyle} disabled={workflowSteps.length === 0 || isProcessing}>
                {isProcessing ? <RotateCcw className="animate-spin" size={24} /> : <Check size={24} />} 確認無誤，發送申請
              </button>
          </div>
        </div>
    </div>
  );
};

// --- 組件：提交後的存根 ---
const SubmissionSummary = ({ schema, values, status, onReset, currentDocId, isViewOnly, onBack, currentUser, applicantId, canApprove, onApprove, onReject, canWithdraw, onWithdraw, onCloneToDraft, isProcessing, staffList, submitDate }) => {
  const [comment, setComment] = useState("");
  const [approvalAction, setApprovalAction] = useState('approve');
  const [rejectTarget, setRejectTarget] = useState("");
  const [editableWorkflow, setEditableWorkflow] = useState([]);
  const [newStaffId, setNewStaffId] = useState("");
  const [newRole, setNewRole] = useState("簽核");

  useEffect(() => {
    if (values && values.workflowPath) {
      setEditableWorkflow([...values.workflowPath]);
    }
  }, [values]);

  const applicantInfo = staffList.find(s => s.staffId === applicantId);
  const applicantName = applicantInfo ? applicantInfo.name : "系統人員";

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
  const currentStepIndex = safeValues.currentStep || 0;
  const currentRole = editableWorkflow[currentStepIndex]?.role;
  const isAssignee = currentRole === "交辦";

  const previousApprovers = editableWorkflow
    .slice(0, currentStepIndex)
    .filter((v,i,a) => a.findIndex(t => (t.staffId === v.staffId)) === i);

  const handleMoveStep = (index, direction) => {
    if (index <= currentStepIndex) return;
    const targetIndex = index + direction;
    if (targetIndex <= currentStepIndex || targetIndex >= editableWorkflow.length) return;
    const newFlow = [...editableWorkflow];
    [newFlow[index], newFlow[targetIndex]] = [newFlow[targetIndex], newFlow[index]];
    setEditableWorkflow(newFlow);
  };

  const handleRemoveStep = (index) => {
    if (index <= currentStepIndex) return;
    const newFlow = [...editableWorkflow];
    newFlow.splice(index, 1);
    setEditableWorkflow(newFlow);
  };

  const handleAddNewStep = () => {
    if (!newStaffId) return alert("請選擇人員");
    if (editableWorkflow.some(step => step.staffId === newStaffId)) return alert("此人員已在流程中");
    const staff = staffList.find(s => s.staffId === newStaffId);
    if (!staff) return;
    setEditableWorkflow([...editableWorkflow, { staffId: staff.staffId, name: staff.name, pos: staff.pos, dept: staff.dept, role: newRole }]);
    setNewStaffId("");
  };

  const handleDecisionSubmit = () => {
    let finalComment = comment;
    let actionType = 'approve';
    let finalWorkflow = [...editableWorkflow];

    switch (approvalAction) {
      case 'assign': 
        finalComment = `[分文] ${comment}`; 
        break;
      case 'escalate': 
        finalComment = `[呈上級決行] ${comment}`; 
        actionType = 'approve';
        break;
      case 'countersign': 
        finalComment = `[同意送會簽人員] ${comment}`; 
        actionType = 'approve';
        break;
      case 'reject_to_step':
        if (!rejectTarget) return alert("請選擇要退回重審的人員");
        const targetStaffName = previousApprovers.find(s => s.staffId === rejectTarget)?.name || rejectTarget;
        finalComment = `[退回給 ${targetStaffName} 重審] ${comment}`;
        actionType = 'reject_to_step';
        break;
      case 'reject':
        actionType = 'reject';
        finalComment = `[退回原發文者] ${comment}`;
        break;
      case 'approve':
      default:
        actionType = 'approve';
        break;
    }

    if (actionType === 'approve') {
      onApprove(currentDocId, finalComment, finalWorkflow);
    } else if (actionType === 'reject_to_step') {
      onReject(currentDocId, finalComment, rejectTarget);
    } else {
      onReject(currentDocId, finalComment);
    }
  };

  const statusConfig = {
    Completed: { text: '核准完成', colorClass: 'text-green-600', borderClass: 'border-green-600' },
    Rejected: { text: '已 退 回', colorClass: 'text-red-600', borderClass: 'border-red-600' },
    Pending: { text: '簽 核 中', colorClass: 'text-amber-500', borderClass: 'border-amber-500' }
  };
  const currentStatus = statusConfig[status] || statusConfig.Pending;

  const expInfo = (status === 'Pending' && submitDate) ? getExpirationStatus(submitDate) : null;

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500" style={mingLiUStyle}>
      <div className="flex justify-between items-center print:hidden">
        <button onClick={onBack || onReset} disabled={isProcessing} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 font-black text-sm hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm active:scale-95 disabled:opacity-50" style={mingLiUStyle}><ArrowLeft size={18} /> 返回上一頁</button>
        <div className="flex gap-2">
          {canWithdraw && (
            <button onClick={() => { if(window.confirm('確定要撤回此項表單申請（抽單）嗎？')) onWithdraw(currentDocId); }} disabled={isProcessing} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-100 rounded-2xl text-red-500 font-black text-sm hover:bg-red-50 transition-all shadow-sm active:scale-95 disabled:opacity-50" style={mingLiUStyle}><Undo2 size={18} /> 撤回申請 (抽單)</button>
          )}
          {(status === 'Rejected' || status === 'Completed') && applicantId === currentUser?.staffId && onCloneToDraft && (
            <button onClick={() => onCloneToDraft(currentDocId)} disabled={isProcessing} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-indigo-100 rounded-2xl text-indigo-600 font-black text-sm hover:bg-indigo-50 transition-all shadow-sm active:scale-95 disabled:opacity-50" style={mingLiUStyle}><RotateCcw size={18} /> 複製為新草稿重填</button>
          )}
        </div>
      </div>

      <div id="printable-stub" className="bg-white border-2 border-slate-200 rounded-3xl p-10 shadow-2xl relative font-serif print:shadow-none print:border-slate-400">
        <div className={`absolute top-10 right-10 w-32 h-32 border-4 rounded-full flex flex-col items-center justify-center rotate-12 opacity-80 pointer-events-none font-black ${currentStatus.borderClass} ${currentStatus.colorClass}`}>
          <span className="text-xs" style={mingLiUStyle}>先啟智慧表單件</span>
          <span className={`text-lg border-y-2 my-1 ${currentStatus.borderClass}`} style={mingLiUStyle}>{currentStatus.text}</span>
          <span className="text-xs" style={mingLiUStyle}>{new Date().toLocaleDateString()}</span>
        </div>
        
        {expInfo && (
          <div className={`mb-8 p-5 rounded-2xl border flex items-center justify-between shadow-sm print:hidden ${expInfo.isExpired ? 'bg-red-50 border-red-200' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-inner ${expInfo.isExpired ? 'bg-red-500' : 'bg-amber-500'}`}>
                <Timer size={24} className={expInfo.isExpired ? '' : 'animate-pulse'} />
              </div>
              <div>
                <h4 className={`font-black text-base flex items-center gap-2 ${expInfo.isExpired ? 'text-red-800' : 'text-amber-900'}`} style={mingLiUStyle}>
                  {expInfo.isExpired ? '此單據已逾期' : '單據簽核倒數計時'}
                  {expInfo.isExpired && <AlertCircle size={16} className="text-red-600"/>}
                </h4>
                <p className={`text-xs font-bold mt-1 ${expInfo.isExpired ? 'text-red-600' : 'text-amber-700'}`} style={mingLiUStyle}>
                  系統規定表單送出後 7 日內需完成所有簽核流程。
                </p>
              </div>
            </div>
            <div className={`px-5 py-2.5 rounded-xl border-2 text-sm font-black tracking-widest bg-white shadow-sm ${expInfo.isExpired ? 'text-red-600 border-red-200' : 'text-orange-600 border-orange-200'}`} style={mingLiUStyle}>
              {expInfo.text}
            </div>
          </div>
        )}

        <div className="text-center mb-10"><h2 className="text-2xl font-black text-slate-800 underline decoration-4 underline-offset-8" style={mingLiUStyle}>電子表單申請存根</h2></div>
        <div className="mb-6 flex justify-between items-end border-b pb-4">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase" style={mingLiUStyle}>文件單號 Document ID</p>
              <p className="text-xl font-black text-blue-600" style={mingLiUStyle}>{currentDocId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-slate-400 uppercase" style={mingLiUStyle}>申請人 Applicant</p>
              <p className="text-sm font-bold text-slate-700" style={mingLiUStyle}>{applicantName}</p>
            </div>
        </div>
        <div className="flex flex-wrap -mx-2 gap-y-6 border-l-4 border-blue-500 pl-4 mb-10">
          {schema.fields.filter(f => f.type !== 'button' && f.type !== 'notice' && f.type !== 'ot_notice' && f.type !== 'anomaly_notice').map(field => {
             if (field.dependsOn) {
               const parentValue = safeValues[field.dependsOn];
               const showConditions = Array.isArray(field.showIf) ? field.showIf : [field.showIf];
               if (!showConditions.includes(parentValue)) return null;
             }
             const val = safeValues[field.id];
             return (
              <div key={field.id} className={`${field.width} px-2`} style={mingLiUStyle}>
                <p className="text-xs font-black text-slate-400 uppercase mb-1" style={mingLiUStyle}>{field.label}</p>
                <div className="flex items-center gap-2">
                  {field.type === 'file' ? (
                    val?.base64 ? (
                      <div className="flex flex-col gap-2"><p className="text-sm font-bold text-slate-700" style={mingLiUStyle}>📎 {val.name}</p>
                        <button type="button" onClick={() => handleViewFile(val)} className="print:hidden flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black hover:bg-blue-100 transition-colors" style={mingLiUStyle}><DownloadCloud size={14} /> 點擊下載/檢視附件</button>
                      </div>
                    ) : <p className="text-sm font-bold text-slate-400 italic" style={mingLiUStyle}>(無附件)</p>
                  ) : field.type === 'switch' ? (
                    <p className="text-sm font-bold text-slate-700" style={mingLiUStyle}>{val ? '✅ 是 (公開)' : '❌ 否 (不公開)'}</p>
                  ) : field.type === 'multi_select_staff' ? (
                    <p className="text-sm font-bold text-slate-700" style={mingLiUStyle}>{(Array.isArray(val) && val.length > 0) ? val.map(id => staffList.find(s => s.staffId === id)?.name || id).join('、') : '(未指定)'}</p>
                  ) : (<p className="text-sm font-bold text-slate-700" style={mingLiUStyle}>{val || '(未填寫)'}</p>)}
                </div>
              </div>
             );
          })}
        </div>
        
        {editableWorkflow.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest" style={mingLiUStyle}>簽核歷程與意見 Workflow History</p>
                {canApprove && status === 'Pending' && <p className="text-xs text-indigo-500 font-bold bg-indigo-50 px-2 py-1 rounded" style={mingLiUStyle}>💡 您可修改尚未到達之簽核步驟</p>}
              </div>
              <div className="space-y-4">
                {editableWorkflow.map((step, i) => {
                  const isCurrentStep = currentStepIndex === i;
                  const isProcessed = currentStepIndex > i || status === 'Completed' || (status === 'Rejected' && step.comment);
                  const canEditThisStep = canApprove && status === 'Pending' && i > currentStepIndex;

                  return (
                    <div key={step.staffId || i} className={`flex gap-4 p-4 rounded-2xl border transition-all group ${isCurrentStep ? 'bg-indigo-50 border-indigo-200 ring-4 ring-indigo-50' : isProcessed ? 'bg-slate-50/50 border-slate-100' : 'bg-transparent border-dashed border-slate-200 opacity-50 hover:opacity-100 hover:border-indigo-300 hover:bg-white'}`}>
                      <div className="shrink-0"><div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${isProcessed ? 'bg-green-500' : isCurrentStep ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300'}`}>{isProcessed ? <Check size={20} /> : <User size={20} />}</div></div>
                      <div className="flex-1 flex justify-between items-start">
                         <div className="flex-1">
                           <div className="flex items-center justify-between mb-1">
                             <div>
                               <span className="text-sm font-black text-slate-800" style={mingLiUStyle}>
                                 {step.name} <small className="text-slate-400">({step.pos})</small>
                                 {step.delegateNote && <span className="text-amber-600 ml-1.5 text-xs bg-amber-50 px-1.5 py-0.5 rounded">{step.delegateNote}</span>}
                               </span>
                               <span className="text-xs font-black px-2 py-0.5 ml-2 bg-white border rounded text-indigo-600 uppercase" style={mingLiUStyle}>{step.role}</span>
                             </div>
                           </div>
                           {step.processedDate && <p className="text-xs text-slate-400 font-bold mb-2" style={mingLiUStyle}>處理時間：{new Date(step.processedDate).toLocaleString()}</p>}
                           {step.comment ? (<div className="bg-white p-3 rounded-xl border border-slate-200 relative mt-2 w-full max-w-lg"><div className="absolute -top-2 left-4 px-1 bg-white text-xs font-black text-slate-400 flex items-center gap-1"><MessageSquare size={10} /> 簽核意見</div><p className="text-xs font-bold text-slate-600 italic" style={mingLiUStyle}>「 {step.comment} 」</p></div>) : isProcessed ? <p className="text-xs text-slate-400 italic" style={mingLiUStyle}>無填寫意見</p> : isCurrentStep ? <p className="text-xs text-indigo-600 font-black animate-pulse" style={mingLiUStyle}>等待簽核中...</p> : null}
                         </div>
                         {canEditThisStep && (
                           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 bg-white p-1 rounded-lg shadow-sm border border-slate-100">
                             <button type="button" onClick={() => handleMoveStep(i, -1)} disabled={i === currentStepIndex + 1} className="p-1 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 rounded disabled:opacity-20 transition-all"><ChevronUp size={16} /></button>
                             <button type="button" onClick={() => handleMoveStep(i, 1)} disabled={i === editableWorkflow.length - 1} className="p-1 text-slate-400 hover:text-indigo-600 rounded disabled:opacity-20 transition-all"><ChevronDown size={16} /></button>
                             <div className="w-px h-4 bg-slate-200 mx-1"></div>
                             <button type="button" onClick={() => handleRemoveStep(i)} className="p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded transition-all"><X size={16} /></button>
                           </div>
                         )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {canApprove && status === 'Pending' && (
                <div className="flex flex-col sm:flex-row items-center gap-3 p-4 mt-4 border border-dashed border-indigo-200 rounded-2xl bg-white/50 animate-in fade-in transition-all">
                    <div className="text-xs font-black text-indigo-500 whitespace-nowrap flex items-center gap-1" style={mingLiUStyle}><PlusCircle size={14}/> 增加後續簽核者</div>
                    <select value={newStaffId} onChange={e => setNewStaffId(e.target.value)} className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 font-bold" style={mingLiUStyle}>
                      <option value="">-- 選取指定人員 --</option>
                      {staffList.filter(s => s.staffId !== currentUser.staffId).map(s => <option key={s.staffId} value={s.staffId}>{s.name} ({s.pos}) - {s.dept}</option>)}
                    </select>
                    <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-24 p-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 font-bold" style={mingLiUStyle}>
                      {["簽核", "會簽", "串會", "交辦"].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <button type="button" onClick={handleAddNewStep} className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 text-sm font-black rounded-xl hover:bg-indigo-100 transition-all shrink-0 active:scale-95" style={mingLiUStyle}>加入</button>
                </div>
              )}
            </div>
        )}

        {canApprove && (
          <div className="mt-8 p-6 bg-indigo-50/50 border-2 border-indigo-200 rounded-[2rem] animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-indigo-700">
                <ListChecks size={18} />
                <h4 className="font-black text-sm" style={mingLiUStyle}>{isAssignee ? "填寫交辦執行意見" : "簽核決策與意見輸入"}</h4>
              </div>
            </div>

            {isAssignee ? (
              <textarea value={comment} disabled={isProcessing} onChange={(e) => setComment(e.target.value)} placeholder="請輸入交辦任務的執行狀況..." className="w-full h-24 p-4 border border-indigo-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-300 font-bold disabled:opacity-50" style={mingLiUStyle} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                <div className="flex flex-col">
                  <div className="text-xs text-indigo-800 font-black mb-3 flex items-center gap-1.5" style={mingLiUStyle}>
                    <div className="w-1 h-3 bg-indigo-500 rounded-full"></div> 簽核意見
                  </div>
                  <textarea 
                    value={comment} 
                    disabled={isProcessing} 
                    onChange={(e) => setComment(e.target.value)} 
                    placeholder="請在此輸入您的簽核意見補充說明..." 
                    className="flex-1 w-full p-4 border border-indigo-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-300 font-bold disabled:opacity-50 resize-none shadow-sm" 
                    style={mingLiUStyle} 
                  />
                </div>

                <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm flex flex-col justify-center">
                  <div className="text-xs text-indigo-800 font-black mb-3 flex items-center gap-1.5">
                    <div className="w-1 h-3 bg-indigo-500 rounded-full"></div> 簽核選項
                  </div>
                  <div className="space-y-3.5 pl-2">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="radio" name="approvalAction" value="approve" checked={approvalAction === 'approve'} onChange={(e) => setApprovalAction(e.target.value)} className="w-4 h-4 text-green-600 focus:ring-green-500 border-slate-300" />
                      <span className={`text-[13px] font-bold transition-colors ${approvalAction === 'approve' ? 'text-green-700' : 'text-slate-700'}`} style={mingLiUStyle}>同意</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="radio" name="approvalAction" value="assign" checked={approvalAction === 'assign'} onChange={(e) => setApprovalAction(e.target.value)} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300" />
                      <span className={`text-[13px] font-bold transition-colors ${approvalAction === 'assign' ? 'text-indigo-700' : 'text-slate-700'}`} style={mingLiUStyle}>分文</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="radio" name="approvalAction" value="escalate" checked={approvalAction === 'escalate'} onChange={(e) => setApprovalAction(e.target.value)} className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300" />
                      <span className={`text-[13px] font-bold transition-colors ${approvalAction === 'escalate' ? 'text-amber-700' : 'text-slate-700'}`} style={mingLiUStyle}>呈上級決行</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="radio" name="approvalAction" value="countersign" checked={approvalAction === 'countersign'} onChange={(e) => setApprovalAction(e.target.value)} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300" />
                      <span className={`text-[13px] font-bold transition-colors ${approvalAction === 'countersign' ? 'text-blue-700' : 'text-slate-700'}`} style={mingLiUStyle}>同意送會簽人員</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="radio" name="approvalAction" value="reject_to_step" checked={approvalAction === 'reject_to_step'} 
                               onChange={(e) => { 
                                 setApprovalAction(e.target.value); 
                                 if(!rejectTarget && previousApprovers.length > 0) setRejectTarget(previousApprovers[0].staffId); 
                               }} 
                               className="w-4 h-4 text-red-600 focus:ring-red-500 border-slate-300" />
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`text-[13px] font-bold transition-colors ${approvalAction === 'reject_to_step' ? 'text-red-600' : 'text-slate-700'}`} style={mingLiUStyle}>不同意 (退</span>
                        <select 
                          disabled={approvalAction !== 'reject_to_step'} 
                          value={rejectTarget} 
                          onChange={e => setRejectTarget(e.target.value)} 
                          className="border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-700 disabled:opacity-50 outline-none focus:border-red-400" 
                          onClick={e => e.stopPropagation()}
                          style={mingLiUStyle}
                        >
                          <option value="">-- 選擇人員 --</option>
                          {previousApprovers.map(step => (
                            <option key={step.staffId} value={step.staffId}>{step.name}</option>
                          ))}
                        </select>
                        <span className={`text-[13px] font-bold transition-colors ${approvalAction === 'reject_to_step' ? 'text-red-600' : 'text-slate-700'}`} style={mingLiUStyle}>重審)</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="radio" name="approvalAction" value="reject" checked={approvalAction === 'reject'} onChange={(e) => setApprovalAction(e.target.value)} className="w-4 h-4 text-red-600 focus:ring-red-500 border-slate-300" />
                      <span className={`text-[13px] font-bold transition-colors ${approvalAction === 'reject' ? 'text-red-600' : 'text-slate-700'}`} style={mingLiUStyle}>不同意 (退回原發文者並中斷流程)</span>
                    </label>
                  </div>
                </div>

              </div>
            )}
            
            <div className="mt-6 flex gap-3">
                <button 
                  type="button" 
                  disabled={isProcessing} 
                  onClick={isAssignee ? () => onApprove(currentDocId, comment) : handleDecisionSubmit} 
                  className={`w-full py-3.5 text-white rounded-xl text-sm font-black shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-colors ${
                    approvalAction.includes('reject') && !isAssignee ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`} 
                  style={mingLiUStyle}
                >
                  {isProcessing ? <RotateCcw className="animate-spin" size={16} /> : <CheckCircle size={16} />} {isAssignee ? "確認交辦完成" : "確認送出決策"}
                </button>
            </div>
          </div>
        )}

        {!canApprove && (
          <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end gap-3 items-center print:hidden">
            <button type="button" onClick={handlePrint} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 flex items-center gap-2 disabled:opacity-50" style={mingLiUStyle}><Printer size={14} /> 列印存根</button>
            <button type="button" onClick={onBack || onReset} className="px-8 py-2 bg-[#1677FF] text-white rounded-xl text-xs font-black shadow-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50" style={mingLiUStyle}>{isViewOnly ? <ArrowLeft size={14} /> : null} {isViewOnly ? "返回列表" : "完成返回"}</button>
          </div>
        )}
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDelegateModalOpen, setIsDelegateModalOpen] = useState(false);

  const [submittedForms, setSubmittedForms] = useState([]);
  const [currentDocId, setCurrentDocId] = useState('');
  const [viewingForm, setViewingForm] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [staffList, setStaffList] = useState([]);
  const [workflowRules, setWorkflowRules] = useState([]);

  // --- 全域攔截登出事件監聽 ---
  useEffect(() => {
    const handleSessionExpired = () => {
      alert("偵測到您的帳號已在其他裝置或瀏覽器登入，為保護帳號安全，系統已將您登出。");
      handleLogout();
    };
    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, []);

  const fetchWorkflowRules = async () => {
    if (isMockMode) {
      setWorkflowRules([
        {
          id: 'default-rule-1',
          category: '差勤類',
          formKind: '請假單',
          department: '所有組別',
          steps: [
            { staffId: 'FIN-01', role: '會簽' },
            { staffId: '0338', role: '簽核' }
          ]
        }
      ]);
      return;
    }
    try {
      const res = await apiFetch(`${API_URL_ROOT}/api/workflow_rules`, { headers: getRequestHeaders() });
      if (res.ok) {
        const data = await res.json();
        setWorkflowRules(data);
      }
    } catch (err) { console.error("流程規則讀取失敗", err); }
  };

  const handleSaveRule = async (newRule) => {
    try {
      if (!isMockMode) {
        setIsProcessing(true);
        const res = await apiFetch(`${API_URL_ROOT}/api/workflow_rules`, {
          method: 'POST',
          headers: getRequestHeaders(),
          body: JSON.stringify(newRule)
        });
        if (!res.ok) throw new Error("儲存規則至資料庫失敗");
      }
      setWorkflowRules(prev => {
        const exists = prev.find(r => r.id === newRule.id);
        if (exists) return prev.map(r => r.id === newRule.id ? newRule : r);
        return [...prev, newRule];
      });
      alert("規則儲存成功！未來員工發起此類單據將自動帶入此流程。");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if(window.confirm('確定要刪除這條自動化規則嗎？')) {
      try {
        if (!isMockMode) {
          setIsProcessing(true);
          const res = await apiFetch(`${API_URL_ROOT}/api/workflow_rules/${ruleId}`, {
            method: 'DELETE',
            headers: getRequestHeaders()
          });
          if (!res.ok) throw new Error("從資料庫刪除規則失敗");
        }
        setWorkflowRules(prev => prev.filter(r => r.id !== ruleId));
      } catch (err) {
        alert(err.message);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const fetchPersonnel = async () => {
    if (isMockMode) {
      setStaffList([
        { staffId: 'ADMIN-01', name: '系統管理員', pos: 'Administrator', dept: '系統組', isAdmin: true },
        { staffId: 'GM-01', name: '陳總', pos: '總經理', dept: '總經理室', isAdmin: true },
        { staffId: '0338', name: '王管理', pos: '系統總監', dept: '總經理室', isAdmin: true },
        { staffId: 'FIN-01', name: '王大美', pos: '經理', dept: '財務行政部', isAdmin: false },
        { staffId: 'FIN-02', name: '李專員', pos: '專員', dept: '財務行政部', isAdmin: false },
        { staffId: 'SAL-01', name: '李小明', pos: '組長', dept: '業務部', isAdmin: false },
        { staffId: 'ENG-01', name: '張技術', pos: '協理', dept: '系統暨工程部', isAdmin: false }
      ]);
      return;
    }
    try {
      const res = await apiFetch(`${API_URL_ROOT}/api/personnel`, { headers: getRequestHeaders() });
      const data = await res.json();
      setStaffList(data);
    } catch (err) { console.error("人員列表讀取失敗"); }
  };

  const fetchMyForms = async (userId) => {
    if (isMockMode || !userId) return;
    try {
      let res = await apiFetch(`${API_URL_ROOT}/api/forms`, { headers: getRequestHeaders() });
      
      if (!res.ok || res.status === 404) {
        res = await apiFetch(`${API_URL_ROOT}/api/forms/${userId}`, { headers: getRequestHeaders() });
      }

      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType || !contentType.includes("application/json")) return;
      const data = await res.json();
      setSubmittedForms(data.map(item => ({
        ...item,
        values: typeof item.form_values === 'string' ? JSON.parse(item.form_values) : item.form_values
      })));
    } catch (err) { console.error("無法載入表單資料:", err.message); }
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // 初次連線測試，如果沒登入不會被 apiFetch 的 401 影響，因為只是單純 fetch 測試
        const res = await fetch(`${API_URL_ROOT}/api/personnel`, { headers: getRequestHeaders() });
        if (res.ok) setIsMockMode(false);
      } catch (err) { setIsMockMode(true); }
    };
    checkConnection();
  }, []);

  // --- Session 每 15 秒同步檢查防踢功能 ---
  useEffect(() => {
    if (!currentUser || isMockMode) return;
    const interval = setInterval(() => {
      apiFetch(`${API_URL_ROOT}/api/personnel`, { headers: getRequestHeaders() })
        .catch(err => { /* 若被登出，apiFetch 內會自動拋錯並發送全域事件 */ });
    }, 15000);
    return () => clearInterval(interval);
  }, [currentUser, isMockMode]);

  useEffect(() => {
    if (currentUser) { 
      fetchMyForms(currentUser.staffId); 
      fetchPersonnel(); 
      fetchWorkflowRules();
    }
  }, [currentUser, activeTab]);

  const handleLogout = () => { 
    setCurrentUser(null);
    clearGlobalToken(); 
    setActiveTab('dashboard'); 
    setFormValues({}); 
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setGlobalToken(user.staffId, user.sessionToken);
    setActiveTab('dashboard'); 
    setFormValues({});
    setCurrentDocId('');
    setIsSubmitted(false);
    setIsPreviewing(false);
    setViewingForm(null);
  };

  const TEAM_OPTIONS = ["總經理室", "財務行政部", "北區營業組", "中區營業組", "南區營業組", "客服組", "產品組", "工程組", "系統組"];
  const LEAVE_TYPES = ["特休", "事假", "病假", "喪假", "補休", "婚假", "公假", "產假", "家庭照顧假"];

  const myFormSchema = {
    title: "電子智慧表單",
    fields: [
      { id: "form_subject", label: "單據主旨", type: "text", width: "w-full" },
      { id: "employee_id", label: "員工編號", type: "text", width: "w-1/2" },
      { id: "department", label: "組別", type: "select", options: TEAM_OPTIONS, width: "w-1/2" },
      { id: "category", label: "選擇類別", type: "select", options: ["行政類", "銷售類", "差勤類", "系統類"], width: "w-full" },
      
      { id: "form_kind", label: "表單種類", type: "select", options: ["出勤異常單", "銷假單", "加班單", "請假單"], dependsOn: "category", showIf: "差勤類", width: "w-full" },
      
      { id: "anomaly_rules_notice", type: "anomaly_notice", dependsOn: "form_kind", showIf: "出勤異常單", width: "w-full" },
      { id: "leave_rules_notice", type: "notice", dependsOn: "form_kind", showIf: ["請假單", "銷假單"], width: "w-full" },
      { id: "ot_rules_notice", type: "ot_notice", dependsOn: "form_kind", showIf: "加班單", width: "w-full" },

      { id: "anomaly_reason", label: "異常原因", type: "select", options: ["公務外出", "逾時登出，無加班申請事實", "其他"], dependsOn: "form_kind", showIf: "出勤異常單", width: "w-full" },
      { id: "anomaly_detail", label: "請詳述", type: "text", dependsOn: "anomaly_reason", showIf: "其他", width: "w-full" },
      { id: "anomaly_clock_in", label: "上班時間", type: "time_picker", dependsOn: "anomaly_reason", showIf: ["公務外出", "逾時登出，無加班申請事實", "其他"], width: "w-1/2" },
      { id: "anomaly_clock_out", label: "下班時間", type: "time_picker", dependsOn: "anomaly_reason", showIf: ["公務外出", "逾時登出，無加班申請事實", "其他"], width: "w-1/2" },

      { id: "leave_type", label: "假單類別", type: "select", options: LEAVE_TYPES, dependsOn: "form_kind", showIf: ["請假單", "銷假單"], width: "w-full" },
      { id: "agent", label: "代理人", type: "text", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "leave_start_time", label: "請假開始日期時間", type: "datetime", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "leave_end_time", label: "請假結束日期時間", type: "datetime", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "leave_total", label: "共計", type: "leave_duration", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "leave_reason", label: "請假/銷假事由", type: "text", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "leave_comment", label: "意見", type: "text", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "leave_attachment", label: "附加檔案", type: "file", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      
      { id: "ot_type", label: "加班類型", type: "select", options: ["事前", "事後"], dependsOn: "form_kind", showIf: "加班單", width: "w-full" },
      { id: "ot_start_time", label: "加班開始日期時間", type: "datetime", dependsOn: "ot_type", showIf: ["事前", "事後"], width: "w-full" },
      { id: "ot_end_time", label: "加班結束日期時間", type: "datetime", dependsOn: "ot_type", showIf: ["事前", "事後"], width: "w-full" },
      { id: "ot_duration", label: "工時數", type: "duration", dependsOn: "ot_type", showIf: ["事前", "事後"], width: "w-full" },
      { id: "ot_compensation", label: "補償方式", type: "select", options: ["換補休", "計薪"], dependsOn: "ot_type", showIf: ["事前", "事後"], width: "w-full" },
      { id: "ot_reason", label: "加班事由", type: "text", dependsOn: "ot_type", showIf: ["事前", "事後"], width: "w-full" },
      
      { id: "shared_with", label: "選擇公開對象", type: "multi_select_staff", description: "表單送出後，這些被指定的同仁將可於系統中檢視此單據內容", width: "w-full" },
      
      { id: "submit_btn", label: "預覽填寫內容", type: "button", width: "w-full" }
    ]
  };

  const handleInputChange = (id, value) => {
    setFormValues(prev => {
      const nextValues = { ...prev, [id]: value };
      const cleanupChildren = (parentId) => {
        myFormSchema.fields.forEach(field => {
          if (field.dependsOn === parentId) {
            const cond = Array.isArray(field.showIf) ? field.showIf : [field.showIf];
            if (!cond.includes(nextValues[parentId])) { delete nextValues[field.id]; cleanupChildren(field.id); }
          }
        });
      };
      cleanupChildren(id);
      return nextValues;
    });
  };

  const generateSequentialId = (currentForms) => {
    const now = new Date();
    const dateStr = now.getFullYear().toString() + 
                    (now.getMonth() + 1).toString().padStart(2, '0') + 
                    now.getDate().toString().padStart(2, '0');
    const prefix = `F${dateStr}-${currentUser.staffId}-`;
    const todaySerials = currentForms
      .filter(f => f.id && f.id.startsWith(prefix))
      .map(f => {
        const parts = f.id.split('-');
        const serialStr = parts[parts.length - 1];
        const serial = parseInt(serialStr, 10);
        return isNaN(serial) ? 0 : serial;
      });
    const maxSerial = todaySerials.length > 0 ? Math.max(...todaySerials) : 0;
    const nextSerial = (maxSerial + 1).toString().padStart(3, '0');
    return `${prefix}${nextSerial}`;
  };

  const handleFinalSubmit = async (approvalFlow) => {
    let docId = currentDocId;
    let isNew = false;
    setIsProcessing(true);
    try {
      if (!docId) {
        const res = await apiFetch(`${API_URL_ROOT}/api/forms/${currentUser.staffId}`, { headers: getRequestHeaders() });
        const list = await res.json();
        docId = generateSequentialId(list);
        isNew = true;
      }
      const submissionData = { 
        id: docId, 
        staffId: currentUser.staffId, 
        form_subject: formValues.form_subject || '未命名表單', 
        values: { ...formValues, ...approvalFlow, currentStep: 0 }, 
        status: 'Pending' 
      };
      if (isMockMode) {
        if (isNew) {
          setSubmittedForms([...submittedForms, { ...submissionData, submitDate: new Date().toISOString() }]);
        } else {
          setSubmittedForms(prev => prev.map(f => f.id === docId ? { ...f, ...submissionData } : f));
        }
      } 
      else {
        if (isNew) {
          const response = await apiFetch(`${API_URL_ROOT}/api/forms`, { 
            method: 'POST', 
            headers: getRequestHeaders(), 
            body: JSON.stringify(submissionData) 
          });
          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(`提交失敗: ${errData.details || response.statusText}`);
          }
        } else {
          const response = await apiFetch(`${API_URL_ROOT}/api/forms/${docId}`, { 
            method: 'PUT', 
            headers: getRequestHeaders(), 
            body: JSON.stringify({
              status: submissionData.status,
              values: submissionData.values
            }) 
          });
          if (!response.ok) throw new Error("伺服器更新失敗");
        }
        await fetchMyForms(currentUser.staffId);
      }
      setCurrentDocId(docId); setIsPreviewing(false); setIsSubmitted(true);
    } catch (err) { 
      alert(err.message); 
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveDraft = async (approvalFlow) => {
    let docId = currentDocId;
    let isNew = false;
    setIsProcessing(true);
    try {
      if (!docId) {
        const res = await apiFetch(`${API_URL_ROOT}/api/forms/${currentUser.staffId}`, { headers: getRequestHeaders() });
        const list = await res.json();
        docId = generateSequentialId(list);
        isNew = true;
      }
      const draftData = { 
        id: docId, 
        staffId: currentUser.staffId, 
        form_subject: formValues.form_subject || '未命名表單(草稿)', 
        values: { ...formValues, ...approvalFlow, currentStep: 0 }, 
        status: 'Draft' 
      };
      if (isMockMode) {
        if (isNew) {
          setSubmittedForms([...submittedForms, { ...draftData, submitDate: new Date().toISOString() }]);
        } else {
          setSubmittedForms(prev => prev.map(f => f.id === docId ? { ...f, ...draftData } : f));
        }
      } else {
        if (isNew) {
          const response = await apiFetch(`${API_URL_ROOT}/api/forms`, { 
            method: 'POST', 
            headers: getRequestHeaders(), 
            body: JSON.stringify(draftData) 
          });
          await apiFetch(`${API_URL_ROOT}/api/forms/${docId}`, { 
            method: 'PUT', 
            headers: getRequestHeaders(), 
            body: JSON.stringify({ status: 'Draft', values: draftData.values }) 
          });
        } else {
          await apiFetch(`${API_URL_ROOT}/api/forms/${docId}`, { 
            method: 'PUT', 
            headers: getRequestHeaders(), 
            body: JSON.stringify({ status: 'Draft', values: draftData.values }) 
          });
        }
        await fetchMyForms(currentUser.staffId);
      }
      alert('已成功儲存至草稿匣！');
      setFormValues({});
      setCurrentDocId('');
      setIsPreviewing(false);
      setActiveTab('draft_list');
    } catch (err) { 
      alert(err.message); 
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessForm = async (docId, action, comment, optionalNewWorkflow = null, targetRejectId = null) => {
    const formToProcess = submittedForms.find(f => f.id === docId);
    if (!formToProcess) return;

    let newStatus = formToProcess.status;
    let newStepIndex = formToProcess.values.currentStep || 0;
    const workflow = optionalNewWorkflow ? [...optionalNewWorkflow] : [...(formToProcess.values.workflowPath || [])];

    setIsProcessing(true);
    try {
      if (workflow[newStepIndex] && action !== 'withdraw' && action !== 'reject_to_step') {
        workflow[newStepIndex] = { ...workflow[newStepIndex], comment: comment || "", processedDate: new Date().toISOString() };
      }

      if (action === 'approve') {
        if (newStepIndex < workflow.length - 1) newStepIndex += 1;
        else newStatus = 'Completed';
      } else if (action === 'reject') { 
        newStatus = 'Rejected'; 
      } else if (action === 'reject_to_step') {
        if (workflow[newStepIndex]) {
          workflow[newStepIndex] = { ...workflow[newStepIndex], comment: comment || "", processedDate: new Date().toISOString() };
        }
        const targetIndex = workflow.findIndex(step => step.staffId === targetRejectId);
        if (targetIndex !== -1) {
          newStepIndex = targetIndex;
          newStatus = 'Pending';
          for (let i = targetIndex; i < workflow.length; i++) {
            if (i !== formToProcess.values.currentStep) {
              workflow[i].comment = "";
              workflow[i].processedDate = null;
            }
          }
        } else {
          newStatus = 'Rejected';
        }
      } else if (action === 'withdraw') {
        newStatus = 'Rejected';
        if (workflow[newStepIndex]) {
          workflow[newStepIndex] = { ...workflow[newStepIndex], comment: "申請人自行撤回 (抽單)", processedDate: new Date().toISOString() };
        }
      }

      const updatedValues = { ...formToProcess.values, workflowPath: workflow, currentStep: newStepIndex };

      if (isMockMode) { 
        setSubmittedForms(prev => prev.map(f => f.id === docId ? { ...f, status: newStatus, values: updatedValues } : f)); 
      } 
      else {
        const response = await apiFetch(`${API_URL_ROOT}/api/forms/${docId}`, { 
          method: 'PUT', 
          headers: getRequestHeaders(), 
          body: JSON.stringify({ status: newStatus, values: updatedValues }) 
        });
        if (!response.ok) throw new Error("伺服器更新失敗");
        await fetchMyForms(currentUser.staffId);
      }

      if (newStatus === 'Completed' && updatedValues.category === '差勤類') {
        const formKind = updatedValues.form_kind;
        if (formKind === '請假單' || formKind === '銷假單') {
          const leaveType = updatedValues.leave_type;
          if (leaveType === '特休' || leaveType === '補休') {
            const leaveTotalStr = updatedValues.leave_total || "0 日 0 時";
            const match = leaveTotalStr.match(/(\d+)\s*日\s*(\d+)\s*時/);
            if (match) {
              const totalProcessHours = (parseInt(match[1], 10) * 8) + parseInt(match[2], 10);
              const targetStaffId = updatedValues.employee_id || formToProcess.staffId;
              const applicant = staffList.find(s => s.staffId === targetStaffId);
              
              if (applicant && totalProcessHours > 0) {
                const updatedApplicant = { ...applicant };
                const isDeducting = formKind === '請假單'; 
                if (leaveType === '特休') {
                  const currentAnnual = parseFloat(updatedApplicant.annualLeave) || 0;
                  updatedApplicant.annualLeave = isDeducting 
                    ? Math.max(0, parseFloat((currentAnnual - totalProcessHours).toFixed(1)))
                    : parseFloat((currentAnnual + totalProcessHours).toFixed(1));
                } else if (leaveType === '補休') {
                  const currentComp = parseFloat(updatedApplicant.compLeave) || 0;
                  updatedApplicant.compLeave = isDeducting
                    ? Math.max(0, parseFloat((currentComp - totalProcessHours).toFixed(1)))
                    : parseFloat((currentComp + totalProcessHours).toFixed(1));
                }
                
                if (isMockMode) {
                  setStaffList(prev => prev.map(s => s.staffId === updatedApplicant.staffId ? updatedApplicant : s));
                  if (currentUser.staffId === updatedApplicant.staffId) setCurrentUser(updatedApplicant);
                } else {
                  await apiFetch(`${API_URL_ROOT}/api/personnel/${updatedApplicant.staffId}`, {
                    method: 'PUT',
                    headers: getRequestHeaders(),
                    body: JSON.stringify(updatedApplicant)
                  });
                  await fetchPersonnel();
                  if (currentUser.staffId === updatedApplicant.staffId) {
                    setCurrentUser(prev => ({...prev, annualLeave: updatedApplicant.annualLeave, compLeave: updatedApplicant.compLeave}));
                  }
                }
              }
            }
          }
        }
      }

      alert(action === 'withdraw' ? '表單已成功抽回！' : action === 'approve' ? '已核准表單！' : action === 'reject_to_step' ? '已退回至指定人員重審！' : '已退回申請！');
      setViewingForm(null);
    } catch (err) { 
      alert(`操作失敗：${err.message}`); 
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteForm = async (formItem) => {
    const isAlreadyInTrash = formItem.status === 'Deleted';
    const confirmMsg = isAlreadyInTrash 
      ? `確定要永久刪除單據 [${formItem.id}] 嗎？此操作不可還原。` 
      : `確定要將單據 [${formItem.id}] 移至垃圾桶嗎？`;
    if (!window.confirm(confirmMsg)) return;
    setIsProcessing(true);
    try {
      if (isAlreadyInTrash) {
        if (isMockMode) {
          setSubmittedForms(prev => prev.filter(f => f.id !== formItem.id));
        } else {
          const response = await apiFetch(`${API_URL_ROOT}/api/forms/${formItem.id}`, {
            method: 'DELETE',
            headers: getRequestHeaders()
          });
          if (!response.ok) throw new Error("資料庫刪除失敗");
          await fetchMyForms(currentUser.staffId);
        }
        alert('單據已永久刪除');
      } else {
        const updatedItem = { ...formItem, status: 'Deleted' };
        if (isMockMode) {
          setSubmittedForms(prev => prev.map(f => f.id === formItem.id ? updatedItem : f));
        } else {
          const response = await apiFetch(`${API_URL_ROOT}/api/forms/${formItem.id}`, {
            method: 'PUT',
            headers: getRequestHeaders(),
            body: JSON.stringify({ status: 'Deleted', values: formItem.values })
          });
          if (!response.ok) throw new Error("移至垃圾桶失敗");
          await fetchMyForms(currentUser.staffId);
        }
        alert('單據已移至垃圾桶');
      }
    } catch (err) { 
      alert(`操作失敗：${err.message}`); 
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditDraft = (draft) => {
    setFormValues(draft.values || {});
    setCurrentDocId(draft.id);
    setIsSubmitted(false);
    setIsPreviewing(false);
    setActiveTab('inbox');
    setViewingForm(null);
  };

  const handleCloneToDraft = (docId) => {
    const formToClone = submittedForms.find(f => f.id === docId);
    if (!formToClone) return;

    if (!window.confirm("確定要將此單據內容複製為一份新草稿並重新編輯嗎？\n(系統將為您帶入原內容，並產生全新的文件單號)")) return;

    const clonedValues = { ...formToClone.values };
    delete clonedValues.workflowPath; // 清除舊的簽核路徑
    delete clonedValues.currentStep;  // 清除舊的進度

    setFormValues(clonedValues);
    setCurrentDocId(''); // 清空 ID，讓系統在儲存/送出時產生新單號
    setIsSubmitted(false);
    setIsPreviewing(false);
    setViewingForm(null);
    setActiveTab('inbox');
  };

  if (!currentUser) return <LoginView onLoginSuccess={handleLoginSuccess} isMockMode={isMockMode} />;

  const myPendingList = submittedForms.filter(f => 
    (f.staffId === currentUser?.staffId || (f.values?.shared_with || []).includes(currentUser?.staffId)) && 
    f.status === 'Pending'
  );
  
  const myCompletedList = submittedForms.filter(f => 
    (f.staffId === currentUser?.staffId || (f.values?.shared_with || []).includes(currentUser?.staffId)) && 
    f.status === 'Completed'
  );

  const draftList = submittedForms.filter(f => f.staffId === currentUser?.staffId && f.status === 'Draft');
  const trashList = submittedForms.filter(f => f.staffId === currentUser?.staffId && f.status === 'Deleted');
  
  const inboxList = submittedForms.filter(f => {
    if (f.status !== 'Pending') return false; 
    const step = f.values?.currentStep || 0;
    return f.values?.workflowPath?.[step]?.staffId === currentUser?.staffId;
  });

  const isUserAdmin = currentUser?.isAdmin || currentUser?.staffId === '0338' || currentUser?.staffId === 'ADMIN-01';

  const renderMainContent = () => {
    if (viewingForm) { 
      const step = viewingForm.values?.currentStep || 0;
      const canApprove = viewingForm.status === 'Pending' && viewingForm.values?.workflowPath?.[step]?.staffId === currentUser?.staffId;
      const canWithdraw = viewingForm.staffId === currentUser?.staffId && viewingForm.status === 'Pending';
      return (
        <SubmissionSummary 
          schema={myFormSchema} values={viewingForm.values} status={viewingForm.status} currentDocId={viewingForm.id} isViewOnly={true} onBack={() => setViewingForm(null)} onReset={() => setViewingForm(null)} currentUser={currentUser} applicantId={viewingForm.staffId} canApprove={canApprove}
          onApprove={(id, comm, newFlow) => handleProcessForm(id, 'approve', comm, newFlow)} onReject={(id, comm, targetId) => handleProcessForm(id, targetId ? 'reject_to_step' : 'reject', comm, null, targetId)} canWithdraw={canWithdraw} onWithdraw={(id) => handleProcessForm(id, 'withdraw')}
          onCloneToDraft={handleCloneToDraft}
          isProcessing={isProcessing} staffList={staffList} submitDate={viewingForm.submitDate}
        />
      ); 
    }

    if ((activeTab === 'personnel_management' || activeTab === 'workflow_settings' || activeTab === 'audit_log') && !isUserAdmin) {
      setActiveTab('dashboard');
      return null;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500" style={mingLiUStyle}>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-2/3 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute right-[-30px] top-[-30px] opacity-10 rotate-12"><Layers size={240} /></div>
                  <div className="relative z-10">
                    <h2 className="text-3xl font-black mb-3 flex items-center gap-2" style={mingLiUStyle}>
                      早安，{currentUser.name} {currentUser.pos}
                      {isUserAdmin && <span className="px-2 py-1 bg-white/20 text-xs rounded border border-white/30 backdrop-blur-md">系統管理員</span>}
                    </h2>
                    <p className="text-blue-100 text-sm max-w-md leading-relaxed" style={mingLiUStyle}>您的員編為 {currentUser.staffId}，隸屬 {currentUser.dept}。目前系統運作正常，您可以點擊下方按鈕開始建單。</p>
                    <button onClick={() => { setFormValues({}); setCurrentDocId(''); setIsSubmitted(false); setIsPreviewing(false); setActiveTab('inbox'); }} className="bg-white text-blue-700 px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg mt-8" style={mingLiUStyle}><Plus size={18} /> 開始建立表單</button>
                  </div>
                </div>
                <div className="lg:w-1/3 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-6"><h4 className="text-lg font-black text-slate-700 flex items-center gap-2" style={mingLiUStyle}><Clock size={20} className="text-blue-600" /> 休假剩餘時數</h4><span className="text-xs font-bold text-slate-400 tracking-widest uppercase" style={mingLiUStyle}>Balance</span></div>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50"><div className="flex justify-between items-end mb-2"><span className="text-sm font-bold text-slate-600" style={mingLiUStyle}>特休 (Annual)</span><span className="text-xl font-black text-blue-600" style={mingLiUStyle}>{currentUser?.annualLeave || 0} <small className="text-xs text-slate-400" style={mingLiUStyle}>hr</small></span></div><div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(((currentUser?.annualLeave || 0) / 240) * 100, 100)}%` }}></div></div></div>
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50"><div className="flex justify-between items-end mb-2"><span className="text-sm font-bold text-slate-600" style={mingLiUStyle}>補休 (Comp.)</span><span className="text-xl font-black text-emerald-600" style={mingLiUStyle}>{currentUser?.compLeave || 0} <small className="text-xs text-slate-400" style={mingLiUStyle}>hr</small></span></div><div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(((currentUser?.compLeave || 0) / 80) * 100, 100)}%` }}></div></div></div>
                    
                    <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-600" style={mingLiUStyle}>職務代理狀態</span>
                        <span className={`px-2 py-1 rounded text-xs font-black ${currentUser?.oooActive ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`} style={mingLiUStyle}>
                          {currentUser?.oooActive ? '已啟用' : '未啟用'}
                        </span>
                      </div>
                      <button onClick={() => setIsDelegateModalOpen(true)} className="w-full py-2.5 bg-white border border-purple-200 text-purple-700 rounded-xl text-xs font-black hover:bg-purple-50 transition-colors flex justify-center items-center gap-1.5 shadow-sm" style={mingLiUStyle}>
                        <UserCog size={14} /> 設定代理人
                      </button>
                    </div>
                  </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'inbox_stat', label: '收件匣', value: inboxList.length, color: 'text-blue-600', bg: 'bg-blue-600', icon: Inbox, targetTab: 'inbox_list' },
                { id: 'pending_stat', label: '流程中案件', value: myPendingList.length, color: 'text-amber-600', bg: 'bg-amber-600', icon: Activity, targetTab: 'pending_list' },
                { id: 'completed_stat', label: '已結案', value: myCompletedList.length, color: 'text-green-600', bg: 'bg-green-600', icon: FileCheck, targetTab: 'completed_list' },
                { id: 'draft_stat', label: '草稿匣', value: draftList.length, color: 'text-indigo-600', bg: 'bg-indigo-600', icon: FileSearch, targetTab: 'draft_list' },
                { id: 'rejected_stat', label: '退件/抽單', value: submittedForms.filter(f => f.staffId === currentUser?.staffId && f.status === 'Rejected').length, color: 'text-red-600', bg: 'bg-red-600', icon: FileX, targetTab: 'rejected' },
                { id: 'trash_stat', label: '垃圾桶', value: trashList.length, color: 'text-slate-600', bg: 'bg-slate-600', icon: Trash, targetTab: 'trash_list' },
              ].map((stat, idx) => (
                <div key={idx} onClick={() => setActiveTab(stat.targetTab)} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1.5 cursor-pointer active:scale-95 group">
                  <div className="flex justify-between items-start"><div><p className="text-xs text-slate-400 mb-1 font-bold" style={mingLiUStyle}>{stat.label}</p><h3 className="text-2xl font-black" style={{ ...mingLiUStyle, color: 'inherit' }}>{stat.value}</h3></div><div className={`p-2.5 rounded-xl ${stat.bg} text-white shadow-lg`}><stat.icon size={18} /></div></div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'personnel_management': return <PersonnelManagementView isMockMode={isMockMode} />;
      case 'workflow_settings': 
        return <WorkflowSettingsView staffList={staffList} rules={workflowRules} onSaveRule={handleSaveRule} onDeleteRule={handleDeleteRule} teamOptions={TEAM_OPTIONS} />;
      case 'audit_log': 
        return <AuditLogView isMockMode={isMockMode} />;
      case 'inbox':
        return (
          <div className="h-full flex justify-center animate-in fade-in duration-500"><div className="w-full max-w-4xl bg-[#F8FAFC] rounded-[3rem] border border-gray-200 p-12 overflow-y-auto shadow-inner relative">
            {isSubmitted ? <SubmissionSummary schema={myFormSchema} values={formValues} status="Pending" onReset={() => { setFormValues({}); setCurrentDocId(''); setIsSubmitted(false); setActiveTab('dashboard'); }} currentDocId={currentDocId} currentUser={currentUser} applicantId={currentUser.staffId} onBack={() => { setFormValues({}); setCurrentDocId(''); setIsSubmitted(false); setActiveTab('dashboard'); }} isProcessing={isProcessing} staffList={staffList} submitDate={currentDocId ? submittedForms.find(f=>f.id===currentDocId)?.submitDate || new Date().toISOString() : new Date().toISOString()} /> : 
              isPreviewing ? <SubmissionPreview schema={myFormSchema} values={formValues} onEdit={() => setIsPreviewing(false)} onSubmit={handleFinalSubmit} onSaveDraft={handleSaveDraft} staffList={staffList} isProcessing={isProcessing} workflowRules={workflowRules} currentUser={currentUser} /> : 
              <SmartFormEngine schema={myFormSchema} formValues={formValues} onInputChange={handleInputChange} onPreview={() => setIsPreviewing(true)} isProcessing={isProcessing} staffList={staffList} />}
          </div></div>
        );
      case 'inbox_list': return <ListView title="收件匣" icon={Inbox} color="bg-blue-600" data={inboxList} onItemClick={setViewingForm} />;
      case 'pending_list': return <ListView title="流程中案件" icon={Activity} color="bg-amber-600" data={myPendingList} onItemClick={setViewingForm} />;
      case 'completed_list': return <ListView title="已結案案件" icon={FileCheck} color="bg-green-600" data={myCompletedList} onItemClick={setViewingForm} onDelete={handleDeleteForm} />;
      case 'rejected': return <ListView title="退回/抽單" icon={FileX} color="bg-red-600" data={submittedForms.filter(f => f.staffId === currentUser?.staffId && f.status === 'Rejected')} onItemClick={setViewingForm} onDelete={handleDeleteForm} />;
      case 'draft_list': return <ListView title="草稿匣" icon={FileSearch} color="bg-indigo-600" data={draftList} onItemClick={handleEditDraft} onDelete={handleDeleteForm} />;
      case 'trash_list': return <ListView title="垃圾桶" icon={Trash} color="bg-slate-600" data={trashList} onItemClick={setViewingForm} onDelete={handleDeleteForm} />;
      default: return null;
    }
  };

  const navItems = [
    { id: 'dashboard', label: '首頁', icon: LayoutDashboard }
  ];
  if (isUserAdmin) {
    navItems.push({ id: 'personnel_management', label: '人員管理', icon: Users });
    navItems.push({ id: 'workflow_settings', label: '流程設定', icon: Sliders }); 
    navItems.push({ id: 'audit_log', label: '稽核日誌', icon: History }); 
  }

  const handleSaveDelegateSettings = async (settingsData) => {
    try {
      setIsProcessing(true);
      const updatedUser = { ...currentUser, ...settingsData };
      if (isMockMode) {
        setStaffList(prev => prev.map(s => s.staffId === updatedUser.staffId ? updatedUser : s));
        setCurrentUser(updatedUser);
      } else {
        const res = await apiFetch(`${API_URL_ROOT}/api/personnel/${updatedUser.staffId}`, {
          method: 'PUT',
          headers: getRequestHeaders(),
          body: JSON.stringify(updatedUser)
        });
        if (!res.ok) throw new Error("儲存失敗");
        setCurrentUser(updatedUser);
        await fetchPersonnel();
      }
      alert("職務代理設定已更新！");
      setIsDelegateModalOpen(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F0F2F5] text-[#262626]" style={mingLiUStyle}>
      <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'} print:hidden`}>
        <div className="p-8 flex items-center justify-between"><div className="flex items-center gap-3 overflow-hidden"><div className="w-10 h-10 bg-[#1677FF] rounded-2xl flex items-center justify-center shadow-xl text-white shrink-0"><Layers size={24} /></div>{!isSidebarCollapsed && (<span className="font-black text-lg tracking-tighter text-slate-800 italic animate-in slide-in-from-left-2" style={mingLiUStyle}>先啟智慧表單</span>)}</div></div>
        <nav className="flex-1 px-4 space-y-1 mt-6">
          {navItems.map((item) => (<button key={item.id} onClick={() => { setActiveTab(item.id); setViewingForm(null); }} className={`w-full flex items-center px-5 py-3.5 rounded-2xl transition-all font-black text-sm ${activeTab === item.id || activeTab.includes('_list') ? 'bg-blue-50 text-[#1677FF]' : 'text-slate-400 hover:bg-slate-50'} ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-start gap-3'}`} style={mingLiUStyle}><item.icon size={20} />{!isSidebarCollapsed && <span style={mingLiUStyle}>{item.label}</span>}</button>))}
          <div className="pt-8 mt-8 border-t border-slate-100"><button onClick={handleLogout} className={`w-full flex items-center px-5 py-3.5 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all font-black text-sm ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`} style={mingLiUStyle}><LogOut size={20} />{!isSidebarCollapsed && <span style={mingLiUStyle}>登出系統</span>}</button></div>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 z-10 print:hidden">
          <div className="text-slate-800 font-black text-lg" style={mingLiUStyle}>
            {activeTab === 'dashboard' ? '數位儀表板' : 
             activeTab === 'personnel_management' ? '人員管理中心' : 
             activeTab === 'workflow_settings' ? '簽核流程配置' : 
             activeTab === 'audit_log' ? '稽核日誌檢視' : '智慧管理系統'}
          </div>
          <div className="flex items-center gap-4 border-l border-gray-100 pl-6">
            <div className="text-right">
              <p className="text-[14px] font-black text-slate-800 leading-tight flex items-center justify-end gap-1.5" style={mingLiUStyle}>
                {currentUser.name} 
                {isUserAdmin && <ShieldCheck size={14} className="text-indigo-600" />}
              </p>
              <p className="text-[14px] text-slate-400 font-black uppercase" style={mingLiUStyle}>{currentUser.pos}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl border-2 border-white shadow-lg overflow-hidden">
              <img src={`https://robohash.org/${encodeURIComponent(currentUser.name)}?set=set4`} alt="avatar" />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-12 bg-[#F8FAFC] print:p-0 print:bg-white">{renderMainContent()}</div>
      </main>
      <DelegateSettingsModal 
        isOpen={isDelegateModalOpen} 
        onClose={() => setIsDelegateModalOpen(false)} 
        onSave={handleSaveDelegateSettings} 
        currentUser={currentUser} 
        staffList={staffList} 
      />
    </div>
  );
};

export default App;