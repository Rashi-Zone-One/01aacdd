
import React from 'react';
import { Award, ShoppingBag, Gift, Star, Zap, ChevronLeft } from 'lucide-react';
import { User, Reward } from './types';

const REWARDS: Reward[] = [
  { id: 'r1', name: 'คูปองส่วนลด 50 บาท', points: 500, image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=400', category: 'Coupon' },
  { id: 'r2', name: 'พวงกุญแจ The One Limited', points: 1200, image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=400', category: 'Gift' },
  { id: 'r3', name: 'ปริ้นฟรี 50 หน้า (ขาวดำ)', points: 1500, image: 'https://images.unsplash.com/photo-1563214154-159e99a4e82d?auto=format&fit=crop&q=80&w=400', category: 'Service' },
];

interface LoyaltyStoreProps {
  user: User;
  setUser: (u: User) => void;
  addNotify: (msg: string) => void;
  onBack: () => void;
}

const LoyaltyStore: React.FC<LoyaltyStoreProps> = ({ user, setUser, addNotify, onBack }) => {
  const handleRedeem = (r: Reward) => {
    if (user.points < r.points) {
      addNotify("แต้มสะสมไม่เพียงพอ");
      return;
    }
    const updatedUser = { ...user, points: user.points - r.points };
    setUser(updatedUser);
    localStorage.setItem('onepaper_user', JSON.stringify(updatedUser));
    addNotify(`แลก ${r.name} สำเร็จ!`);
  };

  return (
    <div className="fade-in space-y-12">
      <button 
        onClick={onBack} 
        className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-2xl text-[#4f46e5] font-black hover:bg-slate-50 transition-all uppercase text-[12px] tracking-widest shadow-sm"
      >
        <ChevronLeft size={20}/> ย้อนกลับ
      </button>

      <div className="bg-slate-900 p-16 rounded-[4rem] text-white flex flex-col md:flex-row justify-between items-center gap-10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[#4f46e5]/10 blur-3xl"></div>
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-6xl font-black uppercase tracking-tighter mb-4">Loyalty <br/><span className="text-[#4f46e5]">Privileges.</span></h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.5em]">Redeem your points for exclusive rewards</p>
        </div>
        <div className="relative z-10 p-10 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 text-center min-w-[240px]">
           <Award className="mx-auto mb-4 text-[#4f46e5]" size={40} />
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Available Points</p>
           <p className="text-5xl font-black tracking-tighter">{user.points.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {REWARDS.map(r => (
          <div key={r.id} className="airy-card overflow-hidden group hover:-translate-y-3 transition-all duration-500">
            <div className="h-64 relative overflow-hidden">
              <img src={r.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-[#4f46e5] shadow-lg">{r.category}</div>
            </div>
            <div className="p-8 space-y-6">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{r.name}</h3>
              <div className="flex justify-between items-end">
                <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Required Points</span><span className="text-3xl font-black text-[#4f46e5] tracking-tighter">{r.points} <span className="text-sm">Pts</span></span></div>
                <button onClick={() => handleRedeem(r)} className="px-8 py-3 bg-[#4f46e5] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 active:scale-95 transition-all">Redeem Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoyaltyStore;
