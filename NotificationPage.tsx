
import React from 'react';
import { Bell, Info, Tag, MessageSquare, Clock, ChevronLeft } from 'lucide-react';
import { User } from './types';

const NotificationPage: React.FC<{ user: User, onBack: () => void }> = ({ user, onBack }) => {
  const MOCK_NOTIFS = [
    { id: '1', title: 'โปรโมชั่นต้อนรับเพื่อนใหม่!', msg: 'รับแต้มสะสม x2 เมื่อสั่งงานพิมพ์ครั้งแรกของเดือนนี้', type: 'promo', date: '2 ชั่วโมงที่แล้ว' },
    { id: '2', title: 'เปิดสาขาใหม่ที่สยามสแควร์', msg: 'แวะมาใช้บริการได้แล้ววันนี้ พร้อมโปรโมชั่นลด 10%', type: 'system', date: 'เมื่อวานนี้' },
    { id: '3', title: 'อัปเดตสถานะออร์เดอร์ ORD-123456', msg: 'งานพิมพ์ของคุณเสร็จสิ้นแล้ว สามารถมารับได้ที่หน้าสาขา', type: 'order', date: '2 วันที่แล้ว' },
  ];

  return (
    <div className="fade-in max-w-3xl mx-auto space-y-10">
      <button 
        onClick={onBack} 
        className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-2xl text-[#4f46e5] font-black hover:bg-slate-50 transition-all uppercase text-[12px] tracking-widest shadow-sm"
      >
        <ChevronLeft size={20}/> ย้อนกลับ
      </button>

      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter flex items-center gap-4">
          <Bell size={36} className="text-[#4f46e5]" /> การแจ้งเตือน
        </h2>
        <button className="text-[10px] font-black uppercase tracking-widest text-[#4f46e5]">Mark all as read</button>
      </div>

      <div className="space-y-6">
        {MOCK_NOTIFS.map(n => (
          <div key={n.id} className="airy-card p-8 flex gap-6 items-start hover:shadow-2xl transition-all cursor-pointer border-slate-50 group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
              n.type === 'promo' ? 'bg-indigo-50 text-[#4f46e5]' : n.type === 'order' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {n.type === 'promo' ? <Tag size={24}/> : n.type === 'order' ? <MessageSquare size={24}/> : <Info size={24}/>}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-black text-slate-800">{n.title}</h3>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1"><Clock size={12}/> {n.date}</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">{n.msg}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
