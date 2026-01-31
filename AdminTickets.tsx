import React from 'react';
import { loadState, saveState } from './services/localStorage';

interface Ticket { id: string; user: string; message: string; status: 'open' | 'in-progress' | 'closed'; createdAt: string }
const KEY = 'onepaper.tickets';

const AdminTickets: React.FC<{ lang: 'th' | 'en'; addNotify: (s: string) => void }> = ({ lang, addNotify }) => {
  const [tickets, setTickets] = React.useState<Ticket[]>(() => loadState<Ticket[]>(KEY, []));

  const closeTicket = (id: string) => {
    const updated = tickets.map(t => t.id === id ? { ...t, status: 'closed' } : t);
    setTickets(updated); saveState(KEY, updated); addNotify(lang === 'th' ? 'ปิดเคสแล้ว' : 'Ticket closed');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-black mb-4">{lang === 'th' ? 'Inbox / Tickets' : 'Support Tickets'}</h3>
      {tickets.length === 0 ? <div className="text-slate-400">{lang === 'th' ? 'ไม่มีเรื่องร้องเรียน' : 'No tickets'}</div> : (
        <div className="space-y-3">
          {tickets.map(t => (
            <div key={t.id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-bold">{t.user}</div>
                <div className="text-xs text-slate-500">{t.message}</div>
              </div>
              <div className="flex gap-2">
                {t.status !== 'closed' && <button onClick={() => closeTicket(t.id)} className="px-3 py-2 bg-emerald-500 text-white rounded">{lang === 'th' ? 'ปิด' : 'Close'}</button>}
                <div className="text-xs text-slate-400">{t.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
