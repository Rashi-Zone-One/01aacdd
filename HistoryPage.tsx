
import React from 'react';
import { History, FileText, ChevronRight, Search, ChevronLeft } from 'lucide-react';
import { Order } from './types';

// Added lang property to the component props definition to match usage in App.tsx
const HistoryPage: React.FC<{ orders: Order[], onBack: () => void, lang: 'th' | 'en' }> = ({ orders, onBack, lang }) => {
  return (
    <div className="fade-in space-y-10">
      <div className="flex items-center gap-6">
        <button 
          onClick={onBack} 
          className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-2xl text-[#4f46e5] font-black hover:bg-slate-50 transition-all uppercase text-[12px] tracking-widest shadow-sm"
        >
          <ChevronLeft size={20}/> ย้อนกลับ
        </button>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-4">
          <History size={36} className="text-[#4f46e5]" /> ประวัติการสั่งงาน
        </h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input placeholder="ค้นหาเลขออร์เดอร์..." className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl font-bold outline-none focus:border-[#4f46e5] shadow-sm w-64" />
        </div>
      </div>

      <div className="airy-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">เลขออร์เดอร์</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">รายการ</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">วันที่</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ราคา</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-bold">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <td className="px-8 py-6 text-[#4f46e5] font-black">{o.id}</td>
                <td className="px-8 py-6 text-slate-600 truncate max-w-[200px]">{o.items}</td>
                <td className="px-8 py-6 text-slate-400 text-sm">{o.date}</td>
                <td className="px-8 py-6 text-xl tracking-tighter">฿{o.price.toLocaleString()}</td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest block text-center shadow-sm border border-white ${
                    o.status === 'เสร็จสิ้น' ? 'bg-emerald-50 text-emerald-600' : 
                    o.status === 'ยกเลิก' ? 'bg-rose-50 text-rose-500' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="py-32 text-center text-slate-200 font-black uppercase tracking-[0.5em] text-3xl">ยังไม่มีประวัติการสั่ง</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;
