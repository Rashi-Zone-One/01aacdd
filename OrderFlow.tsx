
import React, { useState } from 'react';
import { UploadCloud, FileText, ChevronRight, ChevronLeft, CheckCircle2, ShieldCheck, Box, Zap } from 'lucide-react';
import { Product, User, Order } from './types';
import { translations } from './translations';

interface OrderFlowProps {
  user: User;
  setUser: (u: User) => void;
  products: Product[];
  orders: Order[];
  setOrders: (o: Order[]) => void;
  onComplete: () => void;
  addNotify: (msg: string) => void;
  onBack: () => void;
  lang: 'th' | 'en';
}

const OrderFlow: React.FC<OrderFlowProps> = ({ user, setUser, products, orders, setOrders, onComplete, addNotify, onBack, lang }) => {
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [file, setFile] = useState<File | null>(null);
  type LocalOrderConfig = {
    quantity: number;
    paperType: string;
    color: 'bw' | 'color';
    isUrgent: boolean;
    delivery: 'pickup' | 'delivery';
  };

  const [config, setConfig] = useState<LocalOrderConfig>({
    quantity: 1,
    paperType: '80g Standard',
    color: 'bw',
    isUrgent: false,
    delivery: 'pickup'
  });

  const t = translations[lang];
  const total = selectedProduct ? (selectedProduct.pricePerUnit * config.quantity) + (config.isUrgent ? 50 : 0) : 0;

  const handleConfirm = () => {
    if (user.balance < total) {
      addNotify(lang === 'th' ? "ยอดเงินคงเหลือไม่เพียงพอ" : "Insufficient Balance");
      return;
    }

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(Math.random() * 900000 + 100000),
      customer: user.name,
      items: `${selectedProduct?.name} x ${config.quantity}`,
      price: total,
      status: 'รอดำเนินการ',
      date: new Date().toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US'),
      points: Math.floor(total / 10),
      file: file?.name,
      config: {
        productId: selectedProduct?.id || '',
        quantity: config.quantity,
        paperTypeId: config.paperType,
        sizeId: 'A4',
        bindingTypeId: 'none',
        color: config.color,
        isUrgent: config.isUrgent,
        deliveryMethod: config.delivery
      }
    };

    setOrders([newOrder, ...orders]);
    setUser({ ...user, balance: user.balance - total, points: user.points + newOrder.points, totalOrders: (user.totalOrders || 0) + 1 });
    addNotify(lang === 'th' ? "สั่งงานพิมพ์สำเร็จ!" : "Order placed successfully!");
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex items-center gap-6 mb-8">
        <button onClick={onBack} className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-2xl text-[#4f46e5] font-black hover:bg-slate-50 transition-all uppercase text-[12px] tracking-widest shadow-sm">
          <ChevronLeft size={20}/> {t.btn_back}
        </button>
      </div>

      <div className="flex justify-between items-center mb-12 px-6">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-[#4f46e5] text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>{s}</div>
            <div className={`h-1 w-12 rounded-full hidden sm:block ${step > s ? 'bg-[#4f46e5]' : 'bg-slate-100'}`}></div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="fade-in space-y-8">
          <h2 className="text-4xl font-black text-slate-800">{t.step_service}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map(p => (
              <div key={p.id} onClick={() => setSelectedProduct(p)} className={`p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all flex items-center gap-6 ${selectedProduct?.id === p.id ? 'border-[#4f46e5] bg-indigo-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-[#4f46e5]"><FileText size={28}/></div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-sm text-slate-400">฿{p.pricePerUnit}/{p.unit}</p>
                </div>
                {selectedProduct?.id === p.id && <CheckCircle2 className="text-[#4f46e5]" />}
              </div>
            ))}
          </div>
          <button disabled={!selectedProduct} onClick={() => setStep(2)} className="w-full py-6 bg-[#4f46e5] text-white rounded-3xl font-bold disabled:opacity-50 shadow-xl flex items-center justify-center gap-3">{t.btn_next} <ChevronRight size={20}/></button>
        </div>
      )}

      {step === 2 && (
        <div className="fade-in space-y-8 text-center">
          <h2 className="text-4xl font-black text-slate-800">{t.step_upload}</h2>
          <div onClick={() => document.getElementById('file-in')?.click()} className="p-24 border-4 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50 hover:bg-indigo-50/30 transition-all cursor-pointer group">
            <UploadCloud size={60} className="mx-auto mb-6 text-slate-300 group-hover:text-[#4f46e5]" />
            <p className="text-xl font-bold text-slate-600">{lang === 'th' ? 'คลิกหรือลากไฟล์มาที่นี่' : 'Click or Drag File Here'}</p>
            <input id="file-in" type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
            {file && <div className="mt-8 px-6 py-3 bg-white rounded-2xl shadow-sm inline-flex items-center gap-3 border border-slate-100 font-bold">{file.name}</div>}
          </div>
          <div className="flex gap-6">
            <button onClick={() => setStep(1)} className="flex-1 py-6 bg-slate-100 text-slate-600 rounded-3xl font-bold hover:bg-slate-200 transition-all">{t.btn_back}</button>
            <button disabled={!file} onClick={() => setStep(3)} className="flex-1 py-6 bg-[#4f46e5] text-white rounded-3xl font-bold disabled:opacity-50 shadow-xl">{t.btn_next}</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="fade-in space-y-8">
          <h2 className="text-4xl font-black text-slate-800">{t.step_config}</h2>
          <div className="airy-card p-12 space-y-10">
            <div className="space-y-4">
              <label className="text-sm font-black uppercase text-slate-400 ml-4">{lang === 'th' ? 'จำนวน' : 'Quantity'}</label>
              <div className="flex items-center gap-6">
                <button onClick={() => setConfig({...config, quantity: Math.max(1, config.quantity-1)})} className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-2xl">-</button>
                <input type="number" value={config.quantity} onChange={e => setConfig({...config, quantity: parseInt(e.target.value)||1})} className="flex-1 text-center py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-2xl outline-none" />
                <button onClick={() => setConfig({...config, quantity: config.quantity+1})} className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-2xl">+</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-black uppercase text-slate-400 ml-4">{lang === 'th' ? 'ความเร่งด่วน' : 'Priority'}</label>
                <div className="flex gap-4">
                  <button onClick={() => setConfig({...config, isUrgent: false})} className={`flex-1 py-4 rounded-2xl font-bold border-2 ${!config.isUrgent ? 'border-[#4f46e5] bg-indigo-50/30' : 'border-slate-100'}`}>{lang === 'th' ? 'ปกติ' : 'Standard'}</button>
                  <button onClick={() => setConfig({...config, isUrgent: true})} className={`flex-1 py-4 rounded-2xl font-bold border-2 flex items-center justify-center gap-2 ${config.isUrgent ? 'border-rose-500 bg-rose-50/30 text-rose-600' : 'border-slate-100'}`}>{lang === 'th' ? 'ด่วน (+฿50)' : 'Express (+฿50)'} <Zap size={16}/></button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-6">
            <button onClick={() => setStep(2)} className="flex-1 py-6 bg-slate-100 text-slate-600 rounded-3xl font-bold">{t.btn_back}</button>
            <button onClick={() => setStep(4)} className="flex-1 py-6 bg-[#4f46e5] text-white rounded-3xl font-bold shadow-xl">{t.btn_next}</button>
          </div>
        </div>
      )}

      {step === 4 && (selectedProduct) && (
        <div className="fade-in space-y-8">
          <h2 className="text-4xl font-black text-slate-800">{t.step_confirm}</h2>
          <div className="airy-card p-12 bg-slate-900 text-white space-y-8 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Service Ordered</p>
                <h3 className="text-3xl font-black">{selectedProduct.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Total Amount</p>
                <p className="text-5xl font-black tracking-tighter">฿{total.toLocaleString()}</p>
              </div>
            </div>
            <div className="pt-8 flex items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/5">
              <div className="w-12 h-12 bg-[#4f46e5] rounded-full flex items-center justify-center"><Box size={24} /></div>
              <div>
                <p className="text-[9px] font-black uppercase text-slate-500">{t.balance}</p>
                <p className="font-bold">฿{user.balance.toLocaleString()} Available</p>
              </div>
            </div>
          </div>
          <div className="flex gap-6">
            <button onClick={() => setStep(3)} className="flex-1 py-6 bg-slate-100 text-slate-600 rounded-3xl font-bold">{t.btn_back}</button>
            <button onClick={handleConfirm} className="flex-1 py-6 bg-[#4f46e5] text-white rounded-3xl font-black shadow-xl flex items-center justify-center gap-3">{t.btn_confirm} <ShieldCheck size={24}/></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFlow;
