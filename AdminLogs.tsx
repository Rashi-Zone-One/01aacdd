import React from 'react';
import { loadLogs } from './services/logService';

const AdminLogs: React.FC<{ lang: 'th' | 'en' }> = ({ lang }) => {
  const [logs, setLogs] = React.useState(() => loadLogs());

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-black mb-4">{lang === 'th' ? 'Activity Logs' : 'Activity Logs'}</h3>
      {logs.length === 0 ? <div className="text-slate-400">{lang === 'th' ? 'ไม่มีบันทึก' : 'No logs'}</div> : (
        <div className="space-y-2 max-h-80 overflow-auto">
          {logs.map(l => (
            <div key={l.id} className="text-xs text-slate-600 border-b py-2">
              <div className="font-bold">{l.admin}</div>
              <div>{l.action}</div>
              <div className="text-[10px] text-slate-400">{new Date(l.time).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLogs;