
import React from 'react';
import { ChevronRight, FileText, Image as ImageIcon, Book } from 'lucide-react';
import { Product, Page } from './types';
import { translations } from './translations';

interface LandingPageProps {
  products: Product[];
  onStart: () => void;
  onNavigate: (section: Page) => void;
  lang: 'th' | 'en';
}

const LandingPage: React.FC<LandingPageProps> = ({ products, onStart, onNavigate, lang }) => {
  const t = translations[lang];

  return (
    <div className="fade-in">
      <section className="pt-20 pb-32 text-center space-y-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100 mb-4">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          {lang === 'th' ? 'ออนไลน์ - พร้อมให้บริการ' : 'Online - Ready to Print'}
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tight text-[#1e293b]">
          {lang === 'th' ? 'สั่งงานปริ้นเอกสาร' : 'Order Your Printing'} <br/>
          <span className="text-[#4f46e5]">{lang === 'th' ? 'ง่าย ได้งานไว สะสมแต้มคุ้ม' : 'Easy, Fast, and Rewarding'}</span>
        </h1>
        
        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
          {lang === 'th' ? 'บริการครบวงจร ปริ้นสี ขาวดำ เข้าเล่ม ส่งถึงที่ 24 ชม.' : 'All-in-one printing service: Color, B&W, and Binding 24/7.'}
        </p>
        
        <div className="pt-6">
          <button 
            onClick={onStart}
            className="px-12 py-5 bg-[#4f46e5] text-white rounded-full text-lg font-bold shadow-[0_15px_30px_-5px_rgba(79,70,229,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
          >
            {lang === 'th' ? 'เริ่มต้นใช้งานฟรี' : 'Get Started Free'} <ChevronRight size={22} />
          </button>
        </div>
      </section>

      <section className="pb-40">
        <h2 className="text-3xl font-bold text-center mb-16 text-[#0f172a] uppercase tracking-widest">{t.nav_pricing}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 text-center space-y-6 hover:-translate-y-2 transition-transform cursor-pointer">
            <div className="w-16 h-16 bg-[#f1f5f9] rounded-2xl flex items-center justify-center mx-auto text-slate-500">
              <FileText size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-800">{lang === 'th' ? 'ขาว-ดำ' : 'Black & White'}</h3>
              <p className="text-4xl font-black text-[#4f46e5]">฿2.00<span className="text-sm text-slate-400 font-bold">/{lang === 'th' ? 'หน้า' : 'page'}</span></p>
              <p className="text-sm text-slate-400 font-medium pt-2">80gsm Standard</p>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[2.5rem] border-2 border-[#4f46e5]/10 shadow-2xl shadow-indigo-100 text-center space-y-6 hover:-translate-y-2 transition-transform cursor-pointer relative overflow-hidden">
            <div className="w-16 h-16 bg-[#e0e7ff] rounded-2xl flex items-center justify-center mx-auto text-[#4f46e5]">
              <ImageIcon size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-800">{lang === 'th' ? 'สี (เอกสาร)' : 'Color (Docs)'}</h3>
              <p className="text-4xl font-black text-[#4f46e5]">฿5.00<span className="text-sm text-slate-400 font-bold">/{lang === 'th' ? 'หน้า' : 'page'}</span></p>
              <p className="text-sm text-slate-400 font-medium pt-2">Vivid & High-Res</p>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 text-center space-y-6 hover:-translate-y-2 transition-transform cursor-pointer">
            <div className="w-16 h-16 bg-[#fff7ed] rounded-2xl flex items-center justify-center mx-auto text-orange-400">
              <Book size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-800">{lang === 'th' ? 'เข้าเล่ม' : 'Binding'}</h3>
              <p className="text-4xl font-black text-[#4f46e5]">฿20<span className="text-sm text-slate-400 font-bold">/{lang === 'th' ? 'เล่ม' : 'book'}</span></p>
              <p className="text-sm text-slate-400 font-medium pt-2">Thermal / Spiral</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
