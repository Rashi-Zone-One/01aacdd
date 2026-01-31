
import React from 'react';
// Added FileText to the import list
import { Clock, CheckCircle2, Package, Printer, ChevronRight, ChevronLeft, Truck, Search, Loader2, FileText } from 'lucide-react';
import { Order } from './types';
import { translations } from './translations';

interface OrderStatusPageProps {
  orders: Order[];
  onBack: () => void;
  lang?: 'th' | 'en';
}

const OrderStatusPage: React.FC<OrderStatusPageProps> = ({ orders, onBack, lang = 'th' }) => {
  const activeOrders = orders.filter(o => o.status !== 'เสร็จสิ้น' && o.status !== 'ยกเลิก');
  const t = translations[lang];

  return (
    <div className="fade-in space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-[#4f46e5] font-black uppercase text-[10px] tracking-widest hover:gap-4 transition-all"
          >
            <ChevronLeft size={16}/> {t.btn_back}
          </button>
          <h2 className="text-5xl font-black text-slate-800 tracking-tighter leading-none">
            {lang === 'th' ? 'ติดตาม' : 'Track'} <span className="text-[#4f46e5]">{lang === 'th' ? 'สถานะงาน.' : 'Your Jobs.'}</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.5em]">{lang === 'th' ? 'ระบบตรวจสอบสถานะการผลิตแบบเรียลไทม์' : 'Real-time production monitoring'}</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input placeholder={lang === 'th' ? "ระบุเลขออร์เดอร์..." : "Search Order ID..."} className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[2.5rem] font-bold outline-none shadow-xl focus:border-[#4f46e5] transition-all" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {activeOrders.map(o => (
          <div key={o.id} className="airy-card overflow-hidden group hover:shadow-2xl transition-all duration-500 border-slate-50">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-indigo-600/10 animate-pulse"></div>
              <div className="relative z-10">
                <p className="text-[9px] font-black uppercase text-indigo-400 mb-1">Order ID</p>
                <h4 className="text-xl font-black">{o.id}</h4>
              </div>
              <div className={`relative z-10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                o.status === 'กำลังผลิต' ? 'bg-orange-500 text-white' : 'bg-white/10 text-white'
              }`}>
                {o.status}
              </div>
            </div>
            <div className="p-8 space-y-8">
              <div className="relative px-2">
                 {/* Visual Progress Bar */}
                 <div className="absolute top-1/2 left-10 right-10 h-1 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
                    <div className={`h-full bg-[#4f46e5] transition-all duration-1000 ${
                       o.status === 'รอดำเนินการ' ? 'w-[20%]' : o.status === 'กำลังผลิต' ? 'w-[60%]' : 'w-[100%]'
                    }`}></div>
                 </div>
                 
                 <div className="flex justify-between items-center relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${o.status === 'รอดำเนินการ' ? 'bg-[#4f46e5] text-white scale-110 shadow-indigo-200' : 'bg-emerald-50 text-emerald-600'}`}>
                       <Clock size={24}/>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                       o.status === 'กำลังผลิต' ? 'bg-[#4f46e5] text-white scale-110 shadow-indigo-200' : 
                       o.status === 'รอดำเนินการ' ? 'bg-white border-2 border-slate-50 text-slate-100' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                       {o.status === 'กำลังผลิต' ? <Loader2 size={24} className="animate-spin" /> : <Printer size={24}/>}
                    </div>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                       o.status === 'เสร็จสิ้น' ? 'bg-[#4f46e5] text-white scale-110 shadow-indigo-200' : 'bg-white border-2 border-slate-50 text-slate-100'
                    }`}>
                       <Package size={24}/>
                    </div>
                 </div>
                 
                 <div className="flex justify-between mt-4 text-[9px] font-black uppercase tracking-widest text-slate-300">
                    <span>Pending</span>
                    <span className={o.status === 'กำลังผลิต' ? 'text-orange-500' : ''}>Producing</span>
                    <span>Ready</span>
                 </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300"><FileText size={20}/></div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Detail</p>
                  <p className="font-bold text-slate-700 truncate">{o.items}</p>
                </div>
              </div>

              <button className="w-full py-4 bg-slate-50 text-[#4f46e5] rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-3 group/btn">
                View Receipt <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
        
        {activeOrders.length === 0 && (
          <div className="col-span-full py-40 text-center space-y-10 fade-in">
            <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
               <div className="absolute inset-0 bg-indigo-50 rounded-full animate-ping opacity-20"></div>
               <Package size={80} className="relative z-10 text-slate-200" />
            </div>
            <div className="space-y-4">
               <p className="text-4xl font-black text-slate-200 uppercase tracking-[0.5em]">{lang === 'th' ? 'ไม่มีงานที่ค้าง' : 'No Active Jobs'}</p>
               <p className="text-slate-400 font-bold">{lang === 'th' ? 'คุณสามารถเริ่มต้นสั่งงานพิมพ์ใหม่ได้ทันที' : 'Start your next printing project now'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatusPage;
