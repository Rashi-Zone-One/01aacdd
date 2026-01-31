
import React, { useRef } from 'react';
import { UserCog, Camera, Shield, Bell, Languages, LogOut, ChevronRight, Award, ChevronLeft } from 'lucide-react';
import { User } from './types';

interface ProfilePageProps {
  user: User;
  setUser: (u: User) => void;
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, setUser, onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updatedUser = { ...user, avatar: base64String };
        setUser(updatedUser);
        localStorage.setItem('onepaper_user', JSON.stringify(updatedUser));
        
        // Also update the global allUsers list in localStorage for persistence
        const allUsersStr = localStorage.getItem('onepaper_all_users');
        if (allUsersStr) {
          const allUsers: User[] = JSON.parse(allUsersStr);
          const updatedAllUsers = allUsers.map(u => 
            u.phone === user.phone ? { ...u, avatar: base64String } : u
          );
          localStorage.setItem('onepaper_all_users', JSON.stringify(updatedAllUsers));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fade-in max-w-4xl mx-auto space-y-12">
      <button 
        onClick={onBack} 
        className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-2xl text-[#4f46e5] font-black hover:bg-slate-50 transition-all uppercase text-[12px] tracking-widest shadow-sm"
      >
        <ChevronLeft size={20}/> ย้อนกลับ
      </button>

      <div className="flex items-center gap-10 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative">
          <div className="w-40 h-40 bg-slate-100 rounded-[3rem] border-4 border-white shadow-2xl flex items-center justify-center text-6xl font-black text-[#4f46e5] overflow-hidden">
            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name[0]}
          </div>
          <button 
            onClick={triggerUpload}
            className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#4f46e5] text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white hover:scale-110 active:scale-90 transition-all"
          >
            <Camera size={20}/>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-slate-800 mb-2">{user.name}</h2>
          <p className="text-lg text-slate-400 font-bold mb-4">{user.phone}</p>
          <div className="flex gap-2">
            <span className="px-5 py-2 bg-[#4f46e5] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">{user.tier} Tier</span>
            <span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Verified</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="airy-card p-10 space-y-8">
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">Account Settings</h3>
          <div className="space-y-4">
            {[
              { icon: <Shield size={20}/>, label: 'Password & Security', color: 'text-blue-500' },
              { icon: <Bell size={20}/>, label: 'Notification Preferences', color: 'text-rose-500' },
              { icon: <Languages size={20}/>, label: 'Language Settings', color: 'text-emerald-500' },
            ].map((item, i) => (
              <button key={i} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-lg transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-white rounded-xl shadow-sm ${item.color}`}>{item.icon}</div>
                  <span className="font-bold text-slate-700">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-[#4f46e5] transition-all" />
              </button>
            ))}
          </div>
        </div>
        
        <div className="airy-card p-10 space-y-8">
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">Loyalty & Points</h3>
          <div className="p-8 bg-indigo-50 rounded-3xl space-y-4 border border-indigo-100">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Total Points</span>
              <Award className="text-[#4f46e5]" />
            </div>
            <p className="text-5xl font-black text-[#4f46e5] tracking-tighter">{user.points.toLocaleString()}</p>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden mt-6">
              <div className="h-full bg-[#4f46e5]" style={{ width: '45%' }}></div>
            </div>
            <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest pt-2">450 points to Gold Tier</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
