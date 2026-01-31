import React from 'react';
import { loadState, saveState } from './services/localStorage';

interface ReportItem {
  id: string;
  type: 'content' | 'user' | 'other';
  reportedId: string;
  reason: string;
  reporter: string;
  createdAt: string;
  resolved?: boolean;
}

const KEY = 'onepaper.reports';

const AdminReports: React.FC<{ lang: 'th' | 'en'; addNotify: (s: string) => void }> = ({ lang, addNotify }) => {
  const [reports, setReports] = React.useState<ReportItem[]>(() => loadState<ReportItem[]>(KEY, []));

  const resolve = (id: string) => {
    const updated = reports.map(r => r.id === id ? { ...r, resolved: true } : r);
    setReports(updated);
    saveState(KEY, updated);
    addNotify(lang === 'th' ? 'ดำเนินการกับรายงานแล้ว' : 'Report handled');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-black mb-4">{lang === 'th' ? 'รายการรายงาน' : 'Report Queue'}</h3>
      {reports.length === 0 ? (
        <div className="text-slate-400">{lang === 'th' ? 'ไม่มีรายงาน' : 'No reports'}</div>
      ) : (
        <div className="space-y-3">
          {reports.map(r => (
            <div key={r.id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-bold">{r.type} • {r.reportedId}</div>
                <div className="text-xs text-slate-400">{r.reason} • {r.reporter} • {new Date(r.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <button onClick={() => resolve(r.id)} className="px-3 py-2 bg-emerald-500 text-white rounded">{lang === 'th' ? 'จัดการ' : 'Handle'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReports;
