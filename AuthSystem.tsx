
import React, { useState } from 'react';
import { X, User as UserIcon, Phone, Key } from 'lucide-react';

interface AuthSystemProps {
  show: boolean;
  onClose: () => void;
  // onAuth returns true when authentication or registration succeeded, false otherwise
  onAuth: (phone: string, pin: string, name?: string) => boolean;
  onAdminTrigger?: () => void;
  initialMode?: 'login' | 'register';
  lang?: 'th' | 'en';
}

const AuthSystem: React.FC<AuthSystemProps> = ({ show, onClose, onAuth, onAdminTrigger, initialMode = 'login', lang = 'th' }) => {
  // Lock duration in milliseconds (change here to adjust global lock period). Default: 30 seconds
  const LOCK_DURATION_MS = 30_000;

  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pin: ''
  });
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [disabledUntil, setDisabledUntil] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // compute remaining seconds if disabled
  const disabledSecondsLeft = disabledUntil ? Math.max(0, Math.ceil((disabledUntil - Date.now()) / 1000)) : 0;

  if (!show) return null;

  const handleSubmit = () => {
    if (disabledUntil && Date.now() < disabledUntil) {
      setErrorMsg(`ล็อกอินถูกล็อกชั่วคราว กรุณาลองอีกครั้งใน ${disabledSecondsLeft} วินาที`);
      return;
    }

    const ok = onAuth(formData.phone, formData.pin, authMode === 'register' ? formData.name : undefined);
    if (!ok) {
      // failed authentication
      const next = failedAttempts + 1;
      setFailedAttempts(next);
      setErrorMsg(lang === 'th' ? 'เบอร์หรือรหัสผิด กรุณาลองใหม่' : 'Invalid phone or PIN');
      setFormData({ ...formData, pin: '' });

      // lock after 3 failed attempts for LOCK_DURATION_MS
      if (next >= 3) {
        const until = Date.now() + LOCK_DURATION_MS;
        setDisabledUntil(until);
        const seconds = Math.ceil(LOCK_DURATION_MS / 1000);
        setErrorMsg(lang === 'th' ? `ล็อกอินถูกล็อก ชั่วคราว ${seconds} วินาที` : `Login locked for ${seconds} seconds`);
        setFailedAttempts(0);
        // clear after timeout
        setTimeout(() => setDisabledUntil(null), LOCK_DURATION_MS);
      }
    } else {
      // success
      setFailedAttempts(0);
      setErrorMsg(null);
      setFormData({ name: '', phone: '', pin: '' });
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden relative shadow-2xl flex flex-col border border-slate-100">
        
        {/* Header Section with Blue Gradient */}
        <div className="bg-gradient-to-br from-[#4158f1] to-[#2b44e7] p-10 pb-16 text-center relative overflow-hidden">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 z-30"
          >
            <X size={24}/>
          </button>
          
          <h2 
            onDoubleClick={onAdminTrigger}
            className="text-white text-3xl font-bold tracking-tight mb-8 select-none relative z-10 cursor-default"
            title="Double click to access Admin"
          >
            ยินดีต้อนรับ
          </h2>

          {/* Tab Switcher - Matches Screenshot Style */}
          <div className="mx-auto w-[90%] bg-[#243bb5]/40 rounded-xl flex p-1 relative z-20">
            <button 
              onClick={() => setAuthMode('login')} 
              className={`flex-1 py-3 text-sm font-bold transition-all rounded-lg relative ${
                authMode === 'login' 
                ? 'text-white' 
                : 'text-white/60 hover:text-white/80'
              }`}
            >
              เข้าสู่ระบบ
              {authMode === 'login' && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-white rounded-full shadow-[0_0_8px_white]"></div>
              )}
            </button>
            <button 
              onClick={() => setAuthMode('register')} 
              className={`flex-1 py-3 text-sm font-bold transition-all rounded-lg border-2 ${
                authMode === 'register' 
                ? 'bg-[#1e32a1]/20 border-white text-white shadow-lg' 
                : 'border-transparent text-white/60 hover:text-white/80'
              }`}
            >
              สมัครสมาชิก
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 pt-12 space-y-6 bg-white">
          {authMode === 'register' && (
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#475569] ml-1">ชื่อผู้ใช้งาน</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within:text-[#4f46e5] transition-colors" size={20}/>
                <input 
                  type="text"
                  placeholder="กรอกชื่อผู้ใช้งาน"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl outline-none focus:bg-white focus:border-[#4f46e5] transition-all font-semibold text-[#1e293b]"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[14px] font-bold text-[#475569] ml-1">เบอร์โทรศัพท์</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within:text-[#4f46e5] transition-colors" size={20}/>
              <input 
                type="text"
                placeholder="08X-XXX-XXXX"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl outline-none focus:bg-white focus:border-[#4f46e5] transition-all font-semibold text-[#1e293b]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-bold text-[#475569] ml-1">รหัส PIN</label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within:text-[#4f46e5] transition-colors" size={20}/>
              <input 
                type="password"
                placeholder="****"
                value={formData.pin}
                onChange={(e) => setFormData({...formData, pin: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl outline-none focus:bg-white focus:border-[#4f46e5] transition-all font-semibold tracking-widest text-[#1e293b]"
              />
            </div>
          </div>

          {errorMsg && <div className="text-sm text-rose-500 font-bold">{errorMsg}</div>}

          <button 
            onClick={handleSubmit}
            disabled={!!(disabledUntil && Date.now() < disabledUntil)}
            className="w-full py-5 bg-[#4f46e5] text-white rounded-2xl font-bold text-lg shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:bg-[#4338ca] transition-all active:scale-[0.98] mt-4 disabled:opacity-60"
          >
            {authMode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthSystem;
