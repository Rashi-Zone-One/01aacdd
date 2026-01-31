
import React from 'react';
import { MapPin, Phone, Clock, Navigation, Search, ChevronLeft } from 'lucide-react';
import { Branch } from './types';

const BRANCHES: Branch[] = [
  { id: 'b1', name: 'สาขาสยามสแควร์', location: 'อาคารสยามสแควร์วัน ชั้น 4 (ใกล้ทางเชื่อม BTS)', distance: '0.8 km', open: '10:00 - 21:00', phone: '02-123-4567' },
  { id: 'b2', name: 'สาขาจามจุรีสแควร์', location: 'ชั้น B โซนศูนย์อาหาร (ติด MRT สามย่าน)', distance: '1.5 km', open: '09:00 - 20:00', phone: '02-123-4568' },
  { id: 'b3', name: 'สาขาอารีย์', location: 'พหลโยธิน ซอย 7 ตรงข้ามตึกยศวดี', distance: '4.2 km', open: '08:00 - 19:00', phone: '02-123-4569' },
];

const BranchLocator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="fade-in space-y-12">
      <button 
        onClick={onBack} 
        className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-2xl text-[#4f46e5] font-black hover:bg-slate-50 transition-all uppercase text-[12px] tracking-widest shadow-sm"
      >
        <ChevronLeft size={20}/> ย้อนกลับ
      </button>

      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <h2 className="text-5xl font-black text-slate-800 tracking-tighter mb-4">Branch <br/><span className="text-[#4f46e5]">Locator.</span></h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.5em]">Find the nearest printing hub</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input placeholder="ค้นหาตามเขต หรือ ชื่อสาขา..." className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[2.5rem] font-bold outline-none shadow-xl focus:border-[#4f46e5]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6 overflow-y-auto max-h-[600px] scrollbar-hide pr-2">
          {BRANCHES.map(b => (
            <div key={b.id} className="airy-card p-10 flex gap-8 items-start hover:border-[#4f46e5] transition-all group">
              <div className="w-16 h-16 bg-indigo-50 text-[#4f46e5] rounded-3xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><MapPin size={32}/></div>
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-black text-slate-800">{b.name}</h3>
                  <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">{b.distance} away</span>
                </div>
                <p className="text-slate-500 font-medium">{b.location}</p>
                <div className="flex gap-6 pt-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <span className="flex items-center gap-2"><Clock size={14}/> {b.open}</span>
                  <span className="flex items-center gap-2"><Phone size={14}/> {b.phone}</span>
                </div>
                <button className="w-full py-4 mt-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:bg-[#4f46e5] transition-all flex items-center justify-center gap-3">Get Directions <Navigation size={14}/></button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-slate-100 rounded-[4rem] min-h-[400px] flex items-center justify-center text-slate-300 font-black uppercase tracking-[0.5em] border-4 border-dashed border-slate-200">
           Map Visualization Mode
        </div>
      </div>
    </div>
  );
};

export default BranchLocator;
