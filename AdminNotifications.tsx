import React from 'react';
import { loadState, saveState } from './services/localStorage';

interface Broadcast { id: string; title: string; message: string; target?: string; createdAt: string }
const KEY = 'onepaper.broadcasts';

const AdminNotifications: React.FC<{ lang: 'th' | 'en'; addNotify: (s: string) => void }> = ({ lang, addNotify }) => {
  const [items, setItems] = React.useState<Broadcast[]>(() => loadState<Broadcast[]>(KEY, []));
  const [title, setTitle] = React.useState('');
  const [message, setMessage] = React.useState('');

  const send = () => {
    const b: Broadcast = { id: `${Date.now()}`, title, message, createdAt: new Date().toISOString() };
    const updated = [b, ...items];
    setItems(updated); saveState(KEY, updated); setTitle(''); setMessage(''); addNotify(lang === 'th' ? 'ส่งประกาศแล้ว' : 'Broadcast sent');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-black mb-4">{lang === 'th' ? 'ส่งประกาศ' : 'Broadcast & Notifications'}</h3>
      <div className="space-y-3">
        <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" placeholder={lang === 'th' ? 'หัวข้อ' : 'Title'} />
        <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full p-2 border rounded" placeholder={lang === 'th' ? 'ข้อความ' : 'Message'} />
        <div className="flex gap-3 justify-end">
          <button onClick={send} className="px-4 py-2 bg-emerald-600 text-white rounded">{lang === 'th' ? 'ส่ง' : 'Send'}</button>
        </div>
        <div className="mt-4 space-y-2">
          {items.map(b => (
            <div key={b.id} className="p-3 border rounded">
              <div className="font-bold">{b.title}</div>
              <div className="text-xs text-slate-400">{new Date(b.createdAt).toLocaleString()}</div>
              <div className="mt-2">{b.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;