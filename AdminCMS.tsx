import React from 'react';
import { translations } from './translations';
import { loadState, saveState } from './services/localStorage';
import { Product } from './types';

interface ContentItem {
  id: string;
  title: string;
  author: string;
  status: 'pending' | 'published' | 'rejected';
  createdAt: string;
}

const CMS_KEY = 'onepaper.cms';

const AdminCMS: React.FC<{ lang: 'th' | 'en'; addNotify: (s: string) => void }> = ({ lang, addNotify }) => {
  const t = translations[lang];
  const [items, setItems] = React.useState<ContentItem[]>(() => loadState<ContentItem[]>(CMS_KEY, []));

  const approve = (id: string) => {
    const updated = items.map(i => i.id === id ? { ...i, status: 'published' as ContentItem['status'] } : i);
    setItems(updated);
    saveState(CMS_KEY, updated);
    addNotify(lang === 'th' ? 'อนุมัติเนื้อหาเรียบร้อย' : 'Content approved');
  };

  const remove = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    saveState(CMS_KEY, updated);
    addNotify(lang === 'th' ? 'ลบเนื้อหาแล้ว' : 'Content removed');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-black mb-4">{lang === 'th' ? 'ระบบจัดการเนื้อหา' : 'Content Management'}</h3>
      {items.length === 0 ? (
        <div className="text-slate-400">{lang === 'th' ? 'ไม่มีเนื้อหารออนุมัติ' : 'No pending content'}</div>
      ) : (
        <div className="space-y-3">
          {items.map(i => (
            <div key={i.id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-bold">{i.title}</div>
                <div className="text-xs text-slate-400">{i.author} • {new Date(i.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                {i.status === 'pending' && <button onClick={() => approve(i.id)} className="px-3 py-2 bg-emerald-500 text-white rounded">{lang === 'th' ? 'อนุมัติ' : 'Approve'}</button>}
                <button onClick={() => remove(i.id)} className="px-3 py-2 bg-rose-50 text-rose-500 rounded">{lang === 'th' ? 'ลบ' : 'Delete'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCMS;
