
import React from 'react';
import { Users, Gift, Copy, Share2, Award, ChevronLeft } from 'lucide-react';
import { User } from './types';

const ReferralPage: React.FC<{ user: User, onBack: () => void }> = ({ user, onBack }) => {
  return (
    <div className="fade-in max-w-4xl mx-auto space-y-12">
      <button 
        onClick={onBack} 
        className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-2xl text-[#4f46e5] font-black hover:bg-slate-50 transition-all uppercase text-[12px] tracking-widest shadow-sm"
      >
        <ChevronLeft size={20}/> ย้อนกลับ
      </button>

      <div className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] p-20 rounded-[4rem] text-white text-center space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 p-12 opacity-10"><Gift size={250}/></div>
        <h2 className="text-6xl font-black uppercase tracking-tighter relative z-10">Refer a Friend <br/>Get <span className="text-yellow-300">฿50</span> Free!</h2>
        <p className="text-indigo-100 font-bold uppercase text-[10px] tracking-[0.5em] relative z-10">Sharing is rewarding with The One Paper</p>
        
        <div className="mx-auto max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 relative z-10 space-y-6 mt-12">
           <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Your Unique Referral Code</p>
           <div className="text-4xl font-black tracking-[0.3em] uppercase">{user.referralCode || 'ONEPAPER-123'}</div>
           <div className="flex gap-4">
              <button onClick={() => { navigator.clipboard.writeText(user.referralCode || ''); alert("คัดลอกรหัสแล้ว!"); }} className="flex-1 py-4 bg-white text-[#4f46e5] rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-lg"><Copy size={14}/> Copy Code</button>
              <button className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all"><Share2 size={20}/></button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="airy-card p-12 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-[#4f46e5] rounded-2xl flex items-center justify-center"><Users size={24}/></div>
            <h3 className="text-xl font-black text-slate-800">Your Referrals</h3>
          </div>
          <div className="py-20 text-center space-y-4">
            <p className="text-slate-300 font-black uppercase text-4xl">0</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No friends joined yet</p>
          </div>
        </div>
        <div className="airy-card p-12 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center"><Award size={24}/></div>
            <h3 className="text-xl font-black text-slate-800">Earned Bonus</h3>
          </div>
          <div className="py-20 text-center space-y-4">
            <p className="text-slate-300 font-black uppercase text-4xl">฿0</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Share more to earn more!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;
