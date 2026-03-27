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
  FileX2,
  FileSearch,
  Filter,
  MoreVertical,
  Info,
  DownloadCloud,
  FileSpreadsheet,
  FileDown,
  ArrowLeft,
  Users,
  LogOut,
  Lock,
  User
} from 'lucide-react';

// --- 全域設計規範 (Design Tokens) ---
const mingLiUStyle = { fontFamily: '"PMingLiU", "新細明體", "MingLiU", serif' };

// --- 員工資料庫 (從 EXCEL 擷取之索引資料) ---
const EMPLOYEE_DB = [
  { id: "0039", name: "謝明宏", gender: "男", dept: "系統暨工程部", group: "", title: "協理" },
  { id: "0086", name: "黃曉文", gender: "男", dept: "系統暨工程部", group: "工程組", title: "工程師" },
  { id: "0176", name: "蔡文凱", gender: "男", dept: "系統暨工程部", group: "工程組", title: "工程師" },
  { id: "0338", name: "林昱成", gender: "男", dept: "系統暨工程部", group: "工程組", title: "工程師" },
  { id: "0133", name: "蔡秋雄", gender: "男", dept: "系統暨工程部", group: "工程組", title: "二級資深工程師" },
  { id: "0124", name: "林山傑", gender: "男", dept: "系統暨工程部", group: "工程組", title: "二級資深工程師" },
  { id: "0097", name: "馮金財", gender: "男", dept: "系統暨工程部", group: "工程組", title: "一級資深工程師" },
  { id: "0244", name: "黃憲政", gender: "男", dept: "系統暨工程部", group: "工程組", title: "二級資深工程師" },
  { id: "0153", name: "陳俊安", gender: "男", dept: "系統暨工程部", group: "工程組", title: "一級資深工程師" },
  { id: "0271", name: "吳孟達", gender: "男", dept: "系統暨工程部", group: "工程組", title: "二級資深工程師" },
  { id: "0262", name: "陳俊邦", gender: "男", dept: "系統暨工程部", group: "系統組", title: "經理" },
  { id: "0367", name: "李成富", gender: "男", dept: "系統暨工程部", group: "系統組", title: "工程師" },
  { id: "0348", name: "楊大宇", gender: "男", dept: "系統暨工程部", group: "系統組", title: "工程師" },
  { id: "0074", name: "邱培增", gender: "男", dept: "系統暨工程部", group: "系統組", title: "一級資深工程師" },
  { id: "0199", name: "蔡木坤", gender: "男", dept: "系統暨工程部", group: "系統組", title: "二級資深工程師" },
  { id: "0234", name: "吳志清", gender: "男", dept: "系統暨工程部", group: "系統組", title: "二級資深工程師" }
];

// --- 組件：登入畫面 ---
const LoginPage = ({ onLogin, employees }) => {
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = employees.find(emp => emp.id === empId);
    if (user && password === '123') { onLogin(user); }
    else { setError('員編或密碼錯誤 (預設密碼為 123)'); }
  };

  return (
    <div className="h-screen w-full bg-[#F0F2F5] flex items-center justify-center p-4 overflow-hidden" style={mingLiUStyle}>
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-[#1677FF] p-10 text-white relative overflow-hidden">
           <div className="absolute top-[-20px] right-[-20px] opacity-10 rotate-12"><Layers size={180} /></div>
           <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
                <Lock className="text-white w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black tracking-widest">先啟智慧表單</h1>
              <p className="text-blue-100 text-xs mt-1 font-bold uppercase tracking-tighter">Enterprise Sign-In Portal</p>
           </div>
        </div>
        
        <form onSubmit={handleLogin} className="p-10 space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">員工編號 (User ID)</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                placeholder="請輸入四位員編 (如 0039)"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">存取密碼 (Password)</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入密碼"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-[10px] font-bold p-3 rounded-xl flex items-center gap-2 animate-bounce">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-[#1677FF] text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 text-base"
          >
            登入系統
          </button>

          <div className="text-center pt-4">
             <p className="text-[10px] text-slate-400 font-bold">先啟資訊智慧財產權所有 © 2026</p>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- 子組件：時間選擇器 ---
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
              style={mingLiUStyle}
            >
              <Sun size={12} /> 上午
            </button>
            <button 
              type="button"
              onClick={() => handleConfirm('下午')}
              className={`px-3 py-1 text-xs font-bold rounded border transition-all flex items-center gap-1 ${value?.includes('下午') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
              style={mingLiUStyle}
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

// --- 組件：工時數選擇器 (日/時/分) ---
const DurationPicker = ({ id, value, onChange }) => {
  const [d, setD] = useState('0');
  const [h, setH] = useState('0');
  const [m, setM] = useState('00');

  useEffect(() => {
    if (value) {
      const match = value.match(/(\d+)\s*日\s*(\d+)\s*時\s*(\d+)\s*分/);
      if (match) {
        setD(match[1]);
        setH(match[2]);
        setM(match[3]);
      }
    }
  }, [value]);

  const updateDuration = (newD, newH, newM) => {
    const formatted = `${newD} 日 ${newH} 時 ${newM} 分`;
    onChange(id, formatted);
  };

  return (
    <div className="flex items-center gap-4 bg-slate-50 p-4 border border-slate-200 rounded-xl">
      <div className="flex items-center gap-2">
        <select 
          style={mingLiUStyle}
          value={d}
          onChange={(e) => { setD(e.target.value); updateDuration(e.target.value, h, m); }}
          className="border border-slate-300 rounded px-2 py-1 text-sm bg-white outline-none focus:border-blue-500"
        >
          {Array.from({length: 32}, (_, i) => i).map(num => <option key={num} value={num}>{num}</option>)}
        </select>
        <span className="text-sm font-bold text-slate-600">日</span>
      </div>
      <div className="flex items-center gap-2">
        <select 
          style={mingLiUStyle}
          value={h}
          onChange={(e) => { setH(e.target.value); updateDuration(d, e.target.value, m); }}
          className="border border-slate-300 rounded px-2 py-1 text-sm bg-white outline-none focus:border-blue-500"
        >
          {Array.from({length: 24}, (_, i) => i).map(num => <option key={num} value={num}>{num}</option>)}
        </select>
        <span className="text-sm font-bold text-slate-600">時</span>
      </div>
      <div className="flex items-center gap-2">
        <select 
          style={mingLiUStyle}
          value={m}
          onChange={(e) => { setM(e.target.value); updateDuration(d, h, e.target.value); }}
          className="border border-slate-300 rounded px-2 py-1 text-sm bg-white outline-none focus:border-blue-500"
        >
          <option value="00">00</option>
          <option value="30">30</option>
        </select>
        <span className="text-sm font-bold text-slate-600">分</span>
      </div>
      <div className="ml-auto text-[#1677FF] opacity-30"><Timer size={20} /></div>
    </div>
  );
};

// --- 組件：共計時數選擇器 (日/時) ---
const LeaveDurationPicker = ({ id, value, onChange }) => {
  const [d, setD] = useState('0');
  const [h, setH] = useState('0');

  useEffect(() => {
    if (value) {
      const match = value.match(/(\d+)\s*日\s*(\d+)\s*時/);
      if (match) {
        setD(match[1]);
        setH(match[2]);
      }
    }
  }, [value]);

  const updateDuration = (newD, newH) => {
    const formatted = `${newD} 日 ${newH} 時`;
    onChange(id, formatted);
  };

  return (
    <div className="flex items-center gap-4 bg-blue-50/30 p-4 border border-blue-100 rounded-xl">
      <div className="flex items-center gap-2">
        <select 
          style={mingLiUStyle}
          value={d}
          onChange={(e) => { setD(e.target.value); updateDuration(e.target.value, h); }}
          className="border border-slate-300 rounded px-2 py-1 text-sm bg-white outline-none focus:border-blue-500"
        >
          {Array.from({length: 32}, (_, i) => i).map(num => <option key={num} value={num}>{num}</option>)}
        </select>
        <span className="text-sm font-bold text-slate-600">日</span>
      </div>
      <div className="flex items-center gap-2">
        <select 
          style={mingLiUStyle}
          value={h}
          onChange={(e) => { setH(e.target.value); updateDuration(d, e.target.value); }}
          className="border border-slate-300 rounded px-2 py-1 text-sm bg-white outline-none focus:border-blue-500"
        >
          {Array.from({length: 24}, (_, i) => i).map(num => <option key={num} value={num}>{num}</option>)}
        </select>
        <span className="text-sm font-bold text-slate-600">時</span>
      </div>
      <div className="ml-auto text-blue-600 opacity-30"><ClipboardList size={20} /></div>
    </div>
  );
};

// --- 請假規章備註區塊 ---
const LeaveNoticeBlock = () => (
  <div className="bg-amber-50/40 border border-amber-200 rounded-2xl p-6 mt-4 shadow-inner" style={mingLiUStyle}>
    <div className="flex items-center gap-2 mb-4 text-amber-800 border-b border-amber-200 pb-2">
      <Info size={18} />
      <span className="font-black text-base">請假規章與簽核流程說明</span>
    </div>
    
    <div className="space-y-4 text-[13px] text-slate-700 leading-relaxed">
      <div>
        <div className="font-black text-amber-900 mb-1 flex items-center gap-1.5">
          <div className="w-1 h-3 bg-amber-500 rounded-full"></div> 簽核流程：
        </div>
        <div className="pl-3 border-l-2 border-amber-100 ml-0.5">
          申請人 → 經副理 (請假天數3日(含)以下) → 協理 (請假天數5日(含)以下) → 總經理 (請假天數5日以上) → 交辦 (財務行政部)。<br />
          <span className="text-red-600 font-bold underline">單位主管一天(含)以上由總經理核定。</span>
        </div>
      </div>

      <div>
        <div className="font-black text-amber-900 mb-1 flex items-center gap-1.5">
          <div className="w-1 h-3 bg-amber-500 rounded-full"></div> 一般規範：
        </div>
        <div className="pl-3 text-slate-600">連續日期之請假單不可分開簽核，並均須檢附相關證明文件或說明事項：</div>
      </div>

      <div className="grid grid-cols-1 gap-2 pl-3">
        {[
          { title: "婚假", content: "以日為單位，可分次或連續實施，於結婚之日前10日起三個月內休完。檢附結婚證明。" },
          { title: "喪假", content: "以日為單位，可分次或連續實施。檢附訃文。" },
          { title: "普通傷病假", content: "以日或時為單位，請假日數超過一日以上，檢附健保醫院或公立醫院或公司特約醫院診斷證明(附醫囑建議休息天數)。" },
          { title: "事假", content: "以日或時為單位。" },
          { title: "分娩假", content: "以日為單位。檢附診斷證明或出生證明。" },
          { title: "陪產假", content: "以日為單位，於配偶分娩之當日及其前後合計十五日期間內，擇其中之五日請假。檢附診斷證明或出生證明。" },
          { title: "產檢假", content: "以半日或小時為單位，一經選定不得更改。檢附診斷證明或媽媽手冊。" }
        ].map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <span className="font-black text-slate-800 shrink-0">{idx + 1}. {item.title}：</span>
            <span>{item.content}</span>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-amber-100 font-bold text-slate-500 italic">
        ※ 給假天數均依勞基法辦理。
      </div>
    </div>
  </div>
);

// --- 加班規章備註區塊 ---
const OvertimeNoticeBlock = () => (
  <div className="bg-blue-50/40 border border-blue-200 rounded-2xl p-6 mt-4 shadow-inner" style={mingLiUStyle}>
    <div className="flex items-center gap-2 mb-4 text-blue-800 border-b border-blue-200 pb-2">
      <Info size={18} />
      <span className="font-black text-base">加班申請規則與備註</span>
    </div>
    
    <div className="space-y-3 text-[13px] text-slate-700 leading-relaxed">
      <div className="flex gap-3">
        <span className="font-black text-blue-600 shrink-0">A.</span>
        <div>加班申請須事前由直屬主管核准，始得進行加班，並於事後呈主管審核確認。</div>
      </div>
      <div className="flex gap-3">
        <span className="font-black text-blue-600 shrink-0">B.</span>
        <div>此單由各部門編序號並於加班後七個工作日內交至財務行政部辦理，逾期不受理.</div>
      </div>
      <div className="flex gap-3">
        <span className="font-black text-blue-600 shrink-0">C.</span>
        <div>
          <span className="font-black">加班類別：</span>
          <span className="ml-2 px-2 py-0.5 bg-white border border-blue-100 rounded text-blue-700">1. 一般上班日</span>
          <span className="ml-1 px-2 py-0.5 bg-white border border-blue-100 rounded text-blue-700">2. 國定假日</span>
          <span className="ml-1 px-2 py-0.5 bg-white border border-blue-100 rounded text-blue-700">3. 休息日</span>
          <span className="ml-1 px-2 py-0.5 bg-white border border-blue-100 rounded text-blue-700">4. 出差加班</span>
        </div>
      </div>
      <div className="flex gap-3">
        <span className="font-black text-blue-600 shrink-0">D.</span>
        <div>此加班工時將依比率換算為補休時數或薪資。</div>
      </div>
      <div className="flex gap-3">
        <span className="font-black text-blue-600 shrink-0">E.</span>
        <div className="text-red-600 font-bold underline">每月加班時數上限不得超過46小時。</div>
      </div>
    </div>
  </div>
);

// --- 核心組件：智慧渲染引擎 ---
const SmartFormEngine = ({ schema, formValues, onInputChange, onPreview }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm font-serif relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] opacity-[0.03] rotate-12 pointer-events-none">
          <FileText size={200} />
        </div>

        <h3 className="text-xl font-bold mb-8 text-center tracking-widest text-slate-800 relative z-10" style={mingLiUStyle}>
          ** {schema.title.split('').join(' ')} **
        </h3>
        
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
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-[#1677FF] rounded-full"></div>
                    <label className="text-sm font-bold text-slate-700 underline decoration-slate-200 underline-offset-4" style={mingLiUStyle}>{field.label}：</label>
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
                    readOnly={field.id === 'employee_id' || field.id === 'department'} 
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

                {field.type === "duration" && (
                  <DurationPicker 
                    id={field.id}
                    value={formValues[field.id]}
                    onChange={onInputChange}
                  />
                )}

                {field.type === "leave_duration" && (
                  <LeaveDurationPicker 
                    id={field.id}
                    value={formValues[field.id]}
                    onChange={onInputChange}
                  />
                )}

                {field.type === "file" && (
                  <div className="relative group">
                    <input 
                      type="file" 
                      className="hidden" 
                      id={`file-${field.id}`}
                      onChange={(e) => onInputChange(field.id, e.target.files[0]?.name || "")}
                    />
                    <label 
                      htmlFor={`file-${field.id}`}
                      className="flex items-center gap-3 w-full border-2 border-dashed border-slate-300 p-4 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group"
                    >
                      <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Paperclip size={20} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-600 truncate" style={mingLiUStyle}>
                          {formValues[field.id] || "點擊或拖曳檔案至此處上傳"}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">支援 PDF, JPG, PNG (最大 5MB)</p>
                      </div>
                      <UploadCloud className="text-slate-200 group-hover:text-blue-300 transition-colors" size={24} />
                    </label>
                  </div>
                )}

                {field.type === "notice" && <LeaveNoticeBlock />}
                {field.type === "ot_notice" && <OvertimeNoticeBlock />}

                {field.type === "button" && (
                  <div className="w-full px-0 mt-4">
                    <button 
                      type="button"
                      onClick={onPreview}
                      className="w-full bg-[#1677FF] text-white py-4 rounded-xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
                      style={mingLiUStyle}
                    >
                      <Eye size={20} /> 預覽填寫內容
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 border-t border-dashed border-slate-200 pt-6 leading-relaxed text-red-600" style={mingLiUStyle}>
          <div className="font-bold mb-2 text-[14px]">智慧表單備註 ：</div>
          <div className="space-y-1.5 text-[13px]">
            <div className="flex gap-1" style={{ paddingLeft: '2em' }}><span className="font-bold">A.</span><span>時間欄位：選擇日期與小時/分鐘為預選，必須點擊「上午/下午」按鈕方完成確認。</span></div>
            <div className="flex gap-1" style={{ paddingLeft: '2em' }}><span className="font-bold">B.</span><span>此流程設計旨在降低誤觸風險並強化資料提交之嚴謹性。</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 組件：預覽校對畫面 ---
const SubmissionPreview = ({ schema, values, onEdit, onSubmit }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
       <div className="bg-white border-2 border-blue-100 rounded-3xl p-10 shadow-xl relative font-serif">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-blue-50">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                   <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800" style={mingLiUStyle}>簽核表單預覽校對</h2>
                  <p className="text-xs text-slate-400 font-bold" style={mingLiUStyle}>請確認下方資訊無誤後點擊送出</p>
                </div>
             </div>
          </div>

          <div className="flex flex-wrap -mx-2 gap-y-6">
             {schema.fields.filter(f => f.type !== 'button' && f.type !== 'notice' && f.type !== 'ot_notice').map(field => {
                if (field.dependsOn) {
                  const parentValue = values[field.dependsOn];
                  const showConditions = Array.isArray(field.showIf) ? field.showIf : [field.showIf];
                  if (!showConditions.includes(parentValue)) return null;
                }
                return (
                  <div key={field.id} className={`${field.width} px-2`}>
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 h-full flex flex-col justify-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest" style={mingLiUStyle}>{field.label}</p>
                      <p className="text-base font-bold text-slate-700" style={mingLiUStyle}>
                        {field.type === 'file' ? (values[field.id] ? `📎 ${values[field.id]}` : '( 未上傳檔案 )') : (values[field.id] || '( 未填寫 )')}
                      </p>
                    </div>
                  </div>
                );
             })}
          </div>

          <div className="mt-12 flex gap-4">
             <button 
                onClick={onEdit}
                className="flex-1 py-4 border-2 border-slate-200 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                style={mingLiUStyle}
             >
                <ChevronLeft size={20} /> 資訊有誤，回填單頁面
             </button>
             <button 
                onClick={onSubmit}
                className="flex-[2] py-4 bg-[#1677FF] text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-lg active:scale-95"
                style={mingLiUStyle}
             >
                <Check size={24} /> 確認無誤，正式提交申請
             </button>
          </div>
       </div>
    </div>
  );
};

// --- 組件：正式提交後的存根 ---
const SubmissionSummary = ({ schema, values, onReset, currentDocId, isViewOnly, onBack }) => {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handlePrintAction = () => {
    window.print();
    setIsDownloadOpen(false);
  };

  const handleDownloadExcel = () => {
    const visibleData = schema.fields.filter(field => {
      if (['button', 'notice', 'ot_notice'].includes(field.type)) return false;
      if (field.dependsOn) {
        const parentValue = values[field.dependsOn];
        const showConditions = Array.isArray(field.showIf) ? field.showIf : [field.showIf];
        if (!showConditions.includes(parentValue)) return false;
      }
      return true;
    });

    const headers = ["欄位標籤", "填寫內容"];
    const rows = [["單號", currentDocId], ...visibleData.map(f => [f.label, values[f.id] || ""])];
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `智慧表單存根_${currentDocId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsDownloadOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDownloadOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      {isViewOnly && (
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold transition-all print:hidden" style={mingLiUStyle}>
          <ArrowLeft size={18} /> 返回單據清單
        </button>
      )}

      <div id="printable-stub" className="bg-white border-2 border-slate-200 rounded-3xl p-10 shadow-2xl relative font-serif overflow-hidden print:shadow-none print:border-none print:p-0 print:m-0">
        <div className="absolute top-10 right-10 w-32 h-32 border-4 border-red-500 rounded-full flex flex-col items-center justify-center rotate-12 opacity-80 pointer-events-none">
          <span className="text-red-500 font-black text-xs" style={mingLiUStyle}>先啟智慧表單件</span>
          <span className="text-red-500 font-black text-lg border-y-2 border-red-500 my-1" style={mingLiUStyle}>已 收 訖</span>
          <span className="text-red-500 font-black text-[10px]" style={mingLiUStyle}>{new Date().toLocaleDateString()}</span>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-slate-800 tracking-[0.4em] underline decoration-4 underline-offset-8" style={mingLiUStyle}>電子表單申請存根</h2>
        </div>

        <div className="mb-6 flex justify-between items-end border-b border-slate-100 pb-4">
           <div><p className="text-[10px] font-black text-slate-400 uppercase" style={mingLiUStyle}>文件單號 Document ID</p><p className="text-xl font-black text-blue-600" style={mingLiUStyle}>{currentDocId}</p></div>
           <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase" style={mingLiUStyle}>單據狀態 Status</p><p className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block mt-1" style={mingLiUStyle}>{isViewOnly ? '流程中 (待簽核)' : '提交成功 (初始化)'}</p></div>
        </div>

        <div className="flex flex-wrap -mx-2 gap-y-6 border-l-4 border-blue-500 pl-4 mb-10">
          {schema.fields.filter(f => f.type !== 'button' && f.type !== 'notice' && f.type !== 'ot_notice').map(field => {
             if (field.dependsOn) {
               const parentValue = values[field.dependsOn];
               const showConditions = Array.isArray(field.showIf) ? field.showIf : [field.showIf];
               if (!showConditions.includes(parentValue)) return null;
             }
             return (
               <div key={field.id} className={`${field.width} px-2`}>
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1" style={mingLiUStyle}>{field.label}</p>
                 <p className="text-sm font-bold text-slate-700" style={mingLiUStyle}>{field.type === 'file' ? (values[field.id] ? `📎 ${values[field.id]}` : '( 無附加檔案 )') : (values[field.id] || '( 未填寫 )')}</p>
               </div>
             );
          })}
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 print:bg-white print:border-none print:pl-0">
          <p className="text-[10px] font-black text-slate-400 mb-4 flex items-center gap-2" style={mingLiUStyle}><UserCheck size={14} /> 表單流轉路徑</p>
          <div className="flex items-center gap-4">
            {[{ role: '申請人', name: values.employee_name || '資深設計師 Felix' }, { role: '部門主管', name: '張部長' }, { role: '行政部', name: '會簽單位' }].map((step, i, arr) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-1"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-green-500 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>{i === 0 ? <Check size={14}/> : i + 1}</div><p className="text-[10px] font-bold text-slate-600" style={mingLiUStyle}>{step.role}</p></div>
                {i < arr.length - 1 && <ArrowRight size={14} className="text-slate-200 mb-4" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center print:hidden">
           <p className="text-xs text-slate-400 italic" style={mingLiUStyle}>系統流水驗證碼: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
           <div className="flex items-center gap-3">
              <div className="relative" ref={dropdownRef}>
                 <button onClick={() => setIsDownloadOpen(!isDownloadOpen)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${isDownloadOpen ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`} style={mingLiUStyle}><DownloadCloud size={14} /> 下載 <ChevronDown size={12} className={`transition-transform duration-300 ${isDownloadOpen ? 'rotate-180' : ''}`} /></button>
                 {isDownloadOpen && (<div className="absolute bottom-full mb-2 left-0 w-44 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-50"><button onClick={handleDownloadExcel} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors group"><FileSpreadsheet size={14} className="text-green-600 group-hover:scale-110 transition-transform" /><span className="text-xs font-bold text-slate-700" style={mingLiUStyle}>下載 EXCEL 檔</span></button></div>)}
              </div>
              <button type="button" onClick={handlePrintAction} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all" style={mingLiUStyle}><Printer size={14} /> 列印存根</button>
              {!isViewOnly ? (<button type="button" onClick={onReset} className="flex items-center gap-2 px-6 py-2 bg-[#1677FF] text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-md shadow-blue-100" style={mingLiUStyle}><CheckCircle2 size={14} /> 完成</button>) : (<button type="button" onClick={onBack} className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-xl text-xs font-black hover:bg-black transition-all" style={mingLiUStyle}>關閉視窗</button>)}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- 通用清單檢視器 ---
const ListView = ({ title, icon: Icon, type, color, data, onItemClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredData = data.filter(item => 
    (item.id && item.id.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (item.values?.form_subject && item.values.form_subject.includes(searchTerm)) ||
    (item.name && item.name.includes(searchTerm))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shadow-inner text-white`}><Icon size={24} /></div>
          <div><h2 className="text-xl font-black text-slate-800" style={mingLiUStyle}>{title}</h2><p className="text-xs text-slate-400 font-bold" style={mingLiUStyle}>系統共找到 {filteredData.length} 筆資料</p></div>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
           <Search size={16} className="text-slate-300" />
           <input 
             type="text" 
             placeholder="輸入單號或內容搜尋..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="bg-transparent border-none outline-none text-xs font-bold w-48"
             style={mingLiUStyle}
           />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
         <table className="w-full text-left" style={mingLiUStyle}>
            <thead className="bg-slate-50/50 border-b border-slate-100">
               <tr>
                  {type === 'employee' ? (
                    <>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">員編 / 姓名</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">部門</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">職稱</th>
                    </>
                  ) : (
                    <>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">單號 / 主旨</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">申請日期</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">目前狀態</th>
                    </>
                  )}
                  <th className="px-8 py-4 text-right"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {filteredData.length > 0 ? filteredData.map((item, i) => (
                 <tr 
                   key={i} 
                   onClick={() => type !== 'employee' && onItemClick(item)}
                   className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                 >
                    {type === 'employee' ? (
                      <>
                        <td className="px-8 py-5">
                          <p className="text-[10px] font-bold text-blue-600 mb-1">{item.id}</p>
                          <p className="text-sm font-bold text-slate-700">{item.name} ({item.gender})</p>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-500 font-bold">{item.dept} {item.group && ` - ${item.group}`}</td>
                        <td className="px-6 py-5"><span className="px-3 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-600">{item.title}</span></td>
                      </>
                    ) : (
                      <>
                        <td className="px-8 py-5">
                          <p className="text-[10px] font-bold text-blue-600 mb-1">{item.id}</p>
                          <p className="text-sm font-bold text-slate-700 group-hover:text-blue-700">{item.values?.form_subject || '( 未命名表單 )'}</p>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-500 font-bold">{item.submitDate}</td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black ${item.status === 'Rejected' ? 'bg-red-50 text-red-500' : item.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{item.status === 'Pending' ? '流程中' : item.status === 'Completed' ? '已結案' : item.status === 'Rejected' ? '退件' : '草稿'}</span>
                        </td>
                      </>
                    )}
                    <td className="px-8 py-5 text-right">
                       {type !== 'employee' && <button className="p-2 text-slate-300 group-hover:text-blue-600 transition-all group-hover:translate-x-1 duration-300"><ChevronRight size={20} /></button>}
                    </td>
                 </tr>
               )) : (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-300 italic text-sm" style={mingLiUStyle}><Inbox size={48} className="mx-auto mb-4 opacity-10" />目前尚無任何符合資料</td></tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [submittedForms, setSubmittedForms] = useState([]);
  const [currentDocId, setCurrentDocId] = useState('');
  const [viewingForm, setViewingForm] = useState(null);

  const LEAVE_TYPES = ["特休", "事假", "病假", "喪假", "補休", "婚假", "公假", "產假", "家庭照顧假"];

  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    if (currentUser) {
      setFormValues(prev => ({
        ...prev,
        employee_id: currentUser.id,
        employee_name: currentUser.name,
        department: currentUser.dept + (currentUser.group ? ` - ${currentUser.group}` : '')
      }));
    }
  }, [currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setFormValues({});
    setActiveTab('dashboard');
  };

  const [myFormSchema, setMyFormSchema] = useState({
    title: "電子智慧表單",
    fields: [
      { id: "form_subject", label: "單據主旨", type: "text", width: "w-full" },
      { id: "employee_id", label: "員工編號", type: "text", width: "w-1/2" },
      { id: "department", label: "單位", type: "text", width: "w-1/2" },
      { id: "category", label: "選擇類別", type: "select", options: ["行政類", "銷售類", "差勤類", "系統類"], width: "w-full" },
      { id: "leave_type", label: "假單類別", type: "select", options: [...LEAVE_TYPES, "加班"], dependsOn: "category", showIf: "差勤類", width: "w-full" },
      { id: "agent", label: "代理人", type: "text", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "leave_start_time", label: "請假開始日期時間", type: "datetime", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "leave_end_time", label: "請假結束日期時間", type: "datetime", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "leave_total", label: "共計", type: "leave_duration", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
      { id: "leave_reason", label: "請假事由", type: "text", dependsOn: "leave_type", showIf: LEAVE_TYPES, width: "w-full" },
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
  });

  const handleInputChange = (id, value) => {
    setFormValues(prev => {
      const nextValues = { ...prev, [id]: value };
      const cleanupChildren = (parentId) => {
        myFormSchema.fields.forEach(field => {
          if (field.dependsOn === parentId) {
            const showConditions = Array.isArray(field.showIf) ? field.showIf : [field.showIf];
            if (!showConditions.includes(nextValues[parentId])) { delete nextValues[field.id]; cleanupChildren(field.id); }
          }
        });
      };
      cleanupChildren(id);
      return nextValues;
    });
  };

  const startPreview = () => { if (!formValues.category) return; setIsPreviewing(true); };

  const handleFinalSubmit = () => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const sequence = String(submittedForms.length + 1).padStart(3, '0');
    const newDocId = `EF-${today}-${sequence}`;
    
    const newFormEntry = {
      id: newDocId,
      values: { ...formValues },
      submitDate: new Date().toLocaleDateString(),
      status: 'Pending'
    };

    setSubmittedForms([...submittedForms, newFormEntry]);
    setCurrentDocId(newDocId);
    setIsPreviewing(false);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setFormValues({
      employee_id: currentUser.id,
      employee_name: currentUser.name,
      department: currentUser.dept + (currentUser.group ? ` - ${currentUser.group}` : '')
    });
    setIsSubmitted(false);
    setIsPreviewing(false);
    setActiveTab('dashboard');
  };

  const handleOpenDetail = (form) => {
    setViewingForm(form);
  };

  if (!currentUser) return <LoginPage onLogin={handleLogin} employees={EMPLOYEE_DB} />;

  const STATS = [
    { id: 'inbox_stat', label: '收件匣', value: 0, color: 'text-blue-600', bg: 'bg-blue-600', icon: Inbox, targetTab: 'inbox_list' },
    { id: 'pending_stat', label: '流程中案件', value: submittedForms.filter(f => f.status === 'Pending').length, color: 'text-amber-600', bg: 'bg-amber-600', icon: Activity, targetTab: 'pending_list' },
    { id: 'completed_stat', label: '已結案', value: submittedForms.filter(f => f.status === 'Completed').length, color: 'text-green-600', bg: 'bg-green-600', icon: FileCheck2, targetTab: 'completed_list' },
    { id: 'draft_stat', label: '草稿匣', value: 0, color: 'text-indigo-600', bg: 'bg-indigo-600', icon: FileSearch, targetTab: 'draft_list' },
    { id: 'rejected_stat', label: '退件/抽單', value: submittedForms.filter(f => f.status === 'Rejected').length, color: 'text-red-600', bg: 'bg-red-600', icon: FileX2, targetTab: 'rejected' },
    { id: 'trash_stat', label: '垃圾桶', value: 0, color: 'text-slate-600', bg: 'bg-slate-600', icon: Trash2, targetTab: 'trash' },
  ];

  const managerTitles = ["協理", "經理", "副理"];
  const isManager = managerTitles.includes(currentUser.title);

  const renderMainContent = () => {
    if (viewingForm) return <SubmissionSummary schema={myFormSchema} values={viewingForm.values} currentDocId={viewingForm.id} isViewOnly={true} onBack={() => setViewingForm(null)} />;

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row gap-6">
               <div className="lg:w-2/3 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute right-[-30px] top-[-30px] opacity-10 rotate-12"><Layers size={240} /></div>
                 <div className="relative z-10">
                   <h2 className="text-3xl font-black mb-3" style={mingLiUStyle}>早安，{currentUser.name} {currentUser.title}</h2>
                   <p className="text-blue-100 text-sm max-w-md leading-relaxed" style={mingLiUStyle}>歡迎登入先啟資訊。目前您的單位為 {currentUser.dept}{currentUser.group && ` - ${currentUser.group}`}，系統各項簽核功能運作正常。</p>
                   <div className="flex gap-4 mt-8">
                     <button onClick={() => setActiveTab('inbox')} className="bg-white text-blue-700 px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg shadow-black/10"><Plus size={18} /> 發起新表單</button>
                   </div>
                 </div>
               </div>
               <div className="lg:w-1/3 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
                 <div className="flex items-center justify-between mb-6"><h4 className="text-lg font-black text-slate-700 flex items-center gap-2" style={mingLiUStyle}><Clock size={20} className="text-blue-600" /> 休假剩餘時數</h4><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leave Balance</span></div>
                 <div className="space-y-6">
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50"><div className="flex justify-between items-end mb-2"><span className="text-sm font-bold text-slate-600" style={mingLiUStyle}>特休 (Annual)</span><span className="text-xl font-black text-blue-600">56.0 <small className="text-[10px] text-slate-400">hr</small></span></div><div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden"><div className="w-[70%] h-full bg-blue-500 rounded-full"></div></div></div>
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50"><div className="flex justify-between items-end mb-2"><span className="text-sm font-bold text-slate-600" style={mingLiUStyle}>補休 (Comp.)</span><span className="text-xl font-black text-emerald-600">12.5 <small className="text-[10px] text-slate-400">hr</small></span></div><div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden"><div className="w-[35%] h-full bg-emerald-500 rounded-full"></div></div></div>
                 </div>
                 <p className="mt-4 text-[10px] text-slate-400 font-bold text-center italic" style={mingLiUStyle}>※ 資料更新至：{new Date().toLocaleDateString()}</p>
               </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {STATS.map((stat, idx) => (
                <div key={idx} onClick={() => setActiveTab(stat.targetTab)} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1.5 cursor-pointer group active:scale-95">
                  <div className="flex justify-between items-start">
                    <div><p className="text-xs text-slate-400 mb-1 font-bold" style={mingLiUStyle}>{stat.label}</p><h3 className={`text-2xl font-black ${stat.color}`} style={mingLiUStyle}>{stat.value}</h3></div>
                    <div className={`p-3 rounded-2xl ${stat.bg} text-white shadow-lg transition-transform group-hover:rotate-6`}><stat.icon size={20} /></div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity"><span>進入檢視</span> <ArrowRight size={10} /></div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'inbox_list': return <ListView title="收件匣" icon={Inbox} color="bg-blue-600" type="inbox" data={[]} onItemClick={handleOpenDetail} />;
      case 'pending_list': return <ListView title="流程中案件" icon={Activity} color="bg-amber-600" type="pending" data={submittedForms.filter(f => f.status === 'Pending')} onItemClick={handleOpenDetail} />;
      case 'completed_list': return <ListView title="已結案" icon={FileCheck2} color="bg-green-600" type="completed" data={submittedForms.filter(f => f.status === 'Completed')} onItemClick={handleOpenDetail} />;
      case 'rejected': return <ListView title="退件 / 抽單" icon={FileX2} color="bg-red-600" type="rejected" data={submittedForms.filter(f => f.status === 'Rejected')} onItemClick={handleOpenDetail} />;
      case 'employee_list': 
        if (!isManager) return null;
        return <ListView title="員工管理" icon={Users} color="bg-indigo-600" type="employee" data={EMPLOYEE_DB} onItemClick={() => {}} />;
      case 'inbox':
        return (
          <div className="h-full flex justify-center animate-in fade-in duration-500">
            <div className="w-full max-w-4xl bg-[#F8FAFC] rounded-[3rem] border border-gray-200 p-12 overflow-y-auto shadow-inner relative">
              {isSubmitted ? (
                <SubmissionSummary schema={myFormSchema} values={formValues} onReset={resetForm} currentDocId={currentDocId} />
              ) : isPreviewing ? (
                <SubmissionPreview schema={myFormSchema} values={formValues} onEdit={() => setIsPreviewing(false)} onSubmit={handleFinalSubmit} />
              ) : (
                <><div className="absolute top-8 left-12 flex items-center gap-3"><div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#1677FF]"><Eye size={20} /></div><div><h3 className="font-black text-slate-800 text-lg" style={mingLiUStyle}>電子智慧表單填寫</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest" style={mingLiUStyle}>Step 1: Intelligent Data Input</p></div></div><div className="mt-16"><SmartFormEngine schema={myFormSchema} formValues={formValues} onInputChange={handleInputChange} onPreview={startPreview} /></div></>
              )}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="h-full flex gap-8 animate-in fade-in duration-500">
            <div className="w-1/3 flex flex-col gap-6">
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-6 text-[#1677FF]"><Box className="w-6 h-6" /><span className="font-black text-xl" style={mingLiUStyle}>智慧引擎邏輯配置</span></div>
                <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
                  {myFormSchema.fields.map((field) => (
                    <div key={field.id} onClick={() => setSelectedFieldId(field.id)} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col group ${selectedFieldId === field.id ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 hover:border-blue-200 bg-white'}`}>
                      <div className="flex items-center justify-between mb-1"><p className="text-sm font-bold text-slate-700" style={mingLiUStyle}>{field.label}</p><span className="text-[9px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-400 uppercase" style={mingLiUStyle}>{field.type}</span></div>
                      {field.dependsOn && <div className="flex items-center gap-1 text-[10px] text-[#1677FF] font-bold" style={mingLiUStyle}><ArrowRight size={10} />連動自: {field.dependsOn}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl overflow-y-auto">
               <div className="flex items-center gap-3 mb-10"><div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><Sliders size={20}/></div><div><h3 className="font-black text-xl" style={mingLiUStyle}>系統引擎屬性編輯</h3><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest" style={mingLiUStyle}>System Engine Management</p></div></div>
               {selectedFieldId ? (
                 <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div><label className="text-xs font-black text-slate-500 uppercase mb-3 block" style={mingLiUStyle}>欄位名稱 (Label)</label><input value={myFormSchema.fields.find(f => f.id === selectedFieldId)?.label} onChange={(e) => { const newFields = myFormSchema.fields.map(f => f.id === selectedFieldId ? {...f, label: e.target.value} : f); setMyFormSchema({...myFormSchema, fields: newFields}); }} className="w-full bg-slate-800 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white" style={mingLiUStyle} /></div>
                    <div className="bg-blue-600/10 p-6 rounded-[2rem] border border-blue-500/20"><p className="text-xs font-black text-blue-400 uppercase mb-2" style={mingLiUStyle}>條件連動詳細 (JSON Schema)</p><pre className="text-[10px] text-slate-400 font-mono leading-relaxed bg-black/20 p-4 rounded-xl">{JSON.stringify(myFormSchema.fields.find(f => f.id === selectedFieldId), null, 2)}</pre></div>
                 </div>
               ) : (<div className="h-64 flex flex-col items-center justify-center text-slate-600 italic gap-4"><MousePointer2 size={40} className="opacity-20" /><span style={mingLiUStyle}>請點擊左側元件清單進行邏輯調整</span></div>)}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#F0F2F5] text-[#262626]" style={mingLiUStyle}>
      <aside className={`bg-white border-r border-gray-200 flex flex-col shadow-[2px_0_12px_rgba(0,0,0,0.02)] z-20 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'} print:hidden`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-[#1677FF] rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100 shrink-0 transition-transform active:scale-95"><Layers className="text-white w-6 h-6" /></div>
            {!isSidebarCollapsed && (<span className="font-black text-lg tracking-tighter text-slate-800 italic animate-in slide-in-from-left-2 whitespace-nowrap">先啟智慧表單</span>)}
          </div>
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#1677FF] transition-all">{isSidebarCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}</button>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto scrollbar-hide">
          {[
            { id: 'dashboard', label: '首頁', icon: LayoutDashboard, role: 'all' }, 
            { id: 'inbox', label: '智慧建單', icon: MousePointer2, role: 'all' }, 
            { id: 'employee_list', label: '員工管理', icon: Users, role: 'manager' }, 
            { id: 'settings', label: '表單維護', icon: Settings, role: 'all' }
          ]
          .filter(item => item.role === 'all' || (item.role === 'manager' && isManager))
          .map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setViewingForm(null); }} className={`w-full flex items-center px-5 py-3.5 rounded-2xl transition-all font-black text-sm ${activeTab === item.id || (activeTab.includes('_list') && item.id === 'dashboard') ? 'bg-blue-50 text-[#1677FF] shadow-sm shadow-blue-50' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'} ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-start gap-3'}`} style={mingLiUStyle}>
              <item.icon size={20} className="shrink-0" />
              {!isSidebarCollapsed && <span className="animate-in fade-in truncate">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
           <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3.5 text-red-400 hover:bg-red-50 rounded-2xl transition-all font-black text-sm" style={mingLiUStyle}>
             <LogOut size={20} /> {!isSidebarCollapsed && <span>系統登出</span>}
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 shadow-sm z-10 print:hidden">
          <div className="relative w-[450px] group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1677FF] transition-colors" size={20} /><input type="text" placeholder="搜尋表單、員工姓名或部門..." className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs focus:bg-white focus:border-blue-300 outline-none transition-all font-bold shadow-inner" style={mingLiUStyle} /></div>
          <div className="flex items-center gap-6">
            <div className="p-3 text-slate-400 hover:bg-slate-100 rounded-full cursor-pointer relative"><Bell size={22} /><span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span></div>
            <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
              <div className="text-right"><p className="text-xs font-black text-slate-800" style={mingLiUStyle}>{currentUser.name}</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest" style={mingLiUStyle}>{currentUser.title} / {currentUser.dept}</p></div>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl border-2 border-white shadow-lg overflow-hidden ring-1 ring-slate-100 transform hover:scale-105 transition-transform cursor-pointer"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`} alt="avatar" /></div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-12 bg-[#F8FAFC] print:p-0 print:bg-white">{renderMainContent()}</div>
      </main>
    </div>
  );
};

export default App;