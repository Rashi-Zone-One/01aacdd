
import React from 'react';
import { ShoppingBag, FileText, Image as ImageIcon, Box, Palette, Book, ChevronLeft, ArrowRight } from 'lucide-react';
import { Product } from './types';
import { translations } from './translations';

interface CatalogPageProps {
  products: Product[];
  onBack: () => void;
  lang?: 'th' | 'en';
}

const CatalogPage: React.FC<CatalogPageProps> = ({ products, onBack, lang = 'th' }) => {
  const t = translations[lang];

  return (
    <div className="fade-in space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-[#4f46e5] font-black uppercase text-[10px] tracking-widest hover:gap-4 transition-all"
          >
            <ChevronLeft size={16}/> {t.btn_back}
          </button>
          <h2 className="text-5xl font-black text-slate-800 tracking-tighter leading-none">
            {lang === 'th' ? 'รายการ' : 'Service'} <span className="text-[#4f46e5]">{lang === 'th' ? 'บริการ' : 'Catalog.'}</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.5em]">{lang === 'th' ? 'วัสดุคุณภาพสูงและงานพิมพ์มืออาชีพ' : 'Premium materials & Professional finish'}</p>
        </div>
        <div className="px-8 py-4 bg-slate-900 text-white rounded-[2rem] flex items-center gap-6 shadow-2xl">
           <div className="text-right">
              <p className="text-[9px] font-black uppercase text-indigo-400">Total Services</p>
              <p className="text-2xl font-black tracking-tighter">{products.length} Items</p>
           </div>
           <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><Box size={24}/></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map(p => (
          <div key={p.id} className="airy-card p-10 space-y-8 group hover:-translate-y-3 hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
               <FileText size={150}/>
            </div>
            <div className="flex justify-between items-start relative z-10">
              <div className="w-16 h-16 bg-slate-50 text-[#4f46e5] rounded-3xl flex items-center justify-center group-hover:bg-[#4f46e5] group-hover:text-white transition-all shadow-inner">
                {p.id === 'p1' ? <FileText size={28}/> : p.id === 'p2' ? <ImageIcon size={28}/> : p.id === 'p3' ? <Palette size={28}/> : <Box size={28}/>}
              </div>
              <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">{p.category}</span>
            </div>
            <div className="space-y-3 relative z-10">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{p.name}</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">{p.description}</p>
              <div className="pt-2 flex flex-wrap gap-2">
                 <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-400">{p.spec}</span>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-50 flex justify-between items-end relative z-10">
              <div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Starting Price</p>
                <p className="text-3xl font-black text-[#4f46e5] tracking-tighter">฿{p.pricePerUnit.toLocaleString()}<span className="text-sm font-bold text-slate-400">/{p.unit}</span></p>
              </div>
              <button className="px-6 py-4 bg-slate-950 text-white rounded-2xl hover:bg-[#4f46e5] transition-all shadow-xl flex items-center gap-2 group/btn font-black text-[10px] uppercase tracking-widest">
                Order <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;
