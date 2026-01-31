import React from 'react';
import { loadState, saveState } from './services/localStorage';

const KEY = 'onepaper.settings';

interface SettingsState {
  maintenance: boolean;
  announcement: string;
  seoTitle: string;
  seoDesc: string;
}

const AdminSettings: React.FC<{ lang: 'th' | 'en'; addNotify: (s: string) => void }> = ({ lang, addNotify }) => {
  const [state, setState] = React.useState<SettingsState>(() => loadState<SettingsState>(KEY, { maintenance: false, announcement: '', seoTitle: '', seoDesc: '' }));

  const save = () => { saveState(KEY, state); addNotify(lang === 'th' ? 'บันทึกการตั้งค่าแล้ว' : 'Settings saved'); };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-black mb-4">{lang === 'th' ? 'การตั้งค่าเว็บไซต์' : 'Site Settings'}</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <label className="font-bold">{lang === 'th' ? 'Maintenance mode' : 'Maintenance'}</label>
          <input type="checkbox" checked={state.maintenance} onChange={e => setState({ ...state, maintenance: e.target.checked })} />
        </div>
        <div>
          <label className="font-bold">{lang === 'th' ? 'ประกาศ' : 'Announcement'}</label>
          <input value={state.announcement} onChange={e => setState({ ...state, announcement: e.target.value })} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="font-bold">SEO Title</label>
          <input value={state.seoTitle} onChange={e => setState({ ...state, seoTitle: e.target.value })} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="font-bold">SEO Description</label>
          <textarea value={state.seoDesc} onChange={e => setState({ ...state, seoDesc: e.target.value })} className="w-full p-2 border rounded" />
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={save} className="px-4 py-2 bg-emerald-600 text-white rounded">{lang === 'th' ? 'บันทึก' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
