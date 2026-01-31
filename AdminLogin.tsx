
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AdminLoginProps {
  show: boolean;
  onClose: () => void;
  onLogin: (email: string, pass: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ show, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[1100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden relative shadow-2xl flex flex-col border border-slate-100 p-10 space-y-8">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24}/>
        </button>

        <h2 className="text-[#0f172a] text-3xl font-bold tracking-tight">
          Admin Login
        </h2>

        <div className="space-y-4">
          <input 
            type="email"
            placeholder="admin@theonepaper.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-slate-900 transition-all font-semibold text-slate-900"
          />
          <input 
            type="password"
            placeholder="......"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-slate-900 transition-all font-semibold tracking-widest text-slate-900"
          />
        </div>

        <button 
          onClick={() => onLogin(email, pass)}
          className="w-full py-5 bg-[#1e293b] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-slate-900 transition-all active:scale-[0.98]"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
