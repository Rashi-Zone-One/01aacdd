
import React, { useState } from 'react';
import { Wallet, CreditCard, Landmark, ChevronRight, CheckCircle2, QrCode, ChevronLeft } from 'lucide-react';
import { User } from './types';
import { translations } from './translations';

interface TopUpPageProps {
  user: User;
  setUser: (u: User) => void;
  addNotify: (msg: string) => void;
  onBack: () => void;
  lang?: 'th' | 'en'; // Made optional just in case, though provided by App.tsx
}

const TopUpPage: React.FC<TopUpPageProps> = ({ user, setUser, addNotify, onBack, lang = 'th' }) => {
  const [amount, setAmount] = useState(100);
  const [step, setStep] = useState(1);
  const t = translations[lang];

  const handleTopUp = () => {
    const updatedUser = { ...user, balance: user.balance + amount };
    setUser(updatedUser);
    localStorage.setItem('onepaper_user', JSON.stringify(updatedUser));
    addNotify(lang === 'th' ? `เติมเงิน ฿${amount} สำเร็จ!` : `Topped up ฿${amount} successfully!`);
    onBack();
  };

  return (
    <div className="fade-in max-w-4xl mx-auto space-y-12">
      <button onClick={onBack} className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-2xl text-[#4f46e5] font-black hover:bg-slate-50 transition-all uppercase text-[12px] tracking-widest shadow-sm">
        <ChevronLeft size={20}/> {t.btn_back}
      </button>

      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-slate-800 tracking-tighter">Top Up <span className="text-[#4f46e5]">Wallet.</span></h2>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.5em]">{lang === 'th' ? 'เติมเงินเข้ากระเป๋าของคุณทันที' : 'Add credits to your account instantly'}</p>
      </div>

      {step === 1 && (
        <div className="airy-card p-12 space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[100, 300, 500, 1000, 2000, 5000].map(val => (
              <button key={val} onClick={() => setAmount(val)} className={`py-8 rounded-[2.5rem] border-2 transition-all font-black text-3xl tracking-tighter ${amount === val ? 'border-[#4f46e5] bg-indigo-50/30 text-[#4f46e5] shadow-xl' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                ฿{val.toLocaleString()}
              </button>
            ))}
          </div>
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-4">{lang === 'th' ? 'เลือกช่องทางชำระเงิน' : 'Select Payment Method'}</h3>
            <div className="space-y-4">
              {[
                { id: 'qr', icon: <QrCode />, label: 'PromptPay QR' },
                { id: 'bank', icon: <Landmark />, label: 'Bank Transfer' },
                { id: 'card', icon: <CreditCard />, label: 'Credit / Debit Card' },
              ].map(m => (
                <button key={m.id} onClick={() => setStep(2)} className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between hover:bg-white hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#4f46e5]">{m.icon}</div>
                    <span className="text-xl font-bold text-slate-700">{m.label}</span>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:text-[#4f46e5]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="airy-card p-16 text-center space-y-10">
          <h3 className="text-3xl font-black text-slate-800">{lang === 'th' ? 'สแกน QR เพื่อชำระเงิน' : 'Scan QR Code to Pay'}</h3>
          <div className="w-64 h-64 bg-slate-100 mx-auto rounded-[3rem] border-4 border-slate-50 shadow-inner flex items-center justify-center relative overflow-hidden">
             <div className="scanner-line"></div>
             <QrCode size={120} className="text-[#4f46e5]" />
          </div>
          <div className="p-8 bg-[#4f46e5] text-white rounded-[2.5rem] inline-block shadow-2xl">
             <p className="text-[10px] font-black uppercase text-indigo-200 mb-2">{lang === 'th' ? 'ยอดที่ต้องชำระ' : 'Total Payable'}</p>
             <p className="text-5xl font-black tracking-tighter">฿{amount.toLocaleString()}</p>
          </div>
          <div className="flex gap-6 max-w-md mx-auto">
            <button onClick={() => setStep(1)} className="flex-1 py-6 bg-slate-100 text-slate-600 rounded-3xl font-bold">{t.btn_back}</button>
            <button onClick={handleTopUp} className="flex-1 py-6 bg-slate-900 text-white rounded-3xl font-black shadow-xl">{lang === 'th' ? 'ยืนยัน' : 'Confirm'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopUpPage;
