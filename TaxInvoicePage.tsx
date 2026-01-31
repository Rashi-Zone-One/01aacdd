
import React, { useState } from 'react';
import { Receipt, FileText, ChevronRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Order } from './types';

const TaxInvoicePage: React.FC<{ orders: Order[], onBack: () => void }> = ({ orders, onBack }) => {
  const [step, setStep] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="fade-in max-w-4xl mx-auto space-y-12">
      <button 
        onClick={onBack} 
        className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-2xl text-[#4f46e5] font-black hover:bg-slate-50 transition-all uppercase text-[12px] tracking-widest shadow-sm"
      >
        <ChevronLeft size={20}/> ย้อนกลับ
      </button>

      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-slate-800 tracking-tighter">Tax <span className="text-[#4f46e5]">Invoice.</span></h2>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.5em]">Full tax receipt for completed orders</p>
      </div>

      {step === 1 && (
        <div className="airy-card p-10 space-y-8">
          <h3 className="text-xl font-black text-slate-800">1. เลือกออร์เดอร์ที่ต้องการขอใบกำกับภาษี</h3>
          <div className="space-y-4">
            {orders.map(o => (
              <div 
                key={o.id} 
                onClick={() => setSelectedOrder(o)}
                className={`p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all flex justify-between items-center ${selectedOrder?.id === o.id ? 'border-[#4f46e5] bg-indigo-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}
              >
                <div className="flex gap-6 items-center">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-[#4f46e5]"><FileText size={24}/></div>
                  <div>
                    <h4 className="font-bold text-lg">{o.id}</h4>
                    <p className="text-sm text-slate-400">{o.date} • ฿{o.price.toLocaleString()}</p>
                  </div>
                </div>
                {selectedOrder?.id === o.id && <CheckCircle2 className="text-[#4f46e5]" />}
              </div>
            ))}
            {orders.length === 0 && <p className="text-center py-20 text-slate-400 font-bold">ไม่พบรายการที่เสร็จสิ้น</p>}
          </div>
          <button 
            disabled={!selectedOrder}
            onClick={() => setStep(2)}
            className="w-full py-6 bg-[#4f46e5] text-white rounded-3xl font-black disabled:opacity-50 shadow-xl"
          >
            ระบุข้อมูลผู้เสียภาษี
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="airy-card p-12 space-y-10">
          <h3 className="text-xl font-black text-slate-800">2. กรอกข้อมูลผู้เสียภาษี</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4">ชื่อนิติบุคคล / บุคคลธรรมดา</label>
              <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4">เลขประจำตัวผู้เสียภาษี</label>
              <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" />
            </div>
            <div className="col-span-full space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4">ที่อยู่ตามทะเบียนภาษี</label>
              <textarea rows={3} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none resize-none" />
            </div>
          </div>
          <div className="flex gap-6 pt-6">
            <button onClick={() => setStep(1)} className="flex-1 py-6 bg-slate-100 text-slate-600 rounded-3xl font-bold">ย้อนกลับ</button>
            <button onClick={() => { alert("ส่งข้อมูลเรียบร้อย!"); setStep(1); setSelectedOrder(null); }} className="flex-1 py-6 bg-[#4f46e5] text-white rounded-3xl font-black shadow-xl">ยืนยันการขอใบกำกับ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxInvoicePage;
