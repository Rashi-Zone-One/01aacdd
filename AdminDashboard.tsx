
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ClipboardList, Database, Users, Tag, Percent, 
  Medal, Landmark, MapPin, Bell, Settings2, Download, TrendingUp, 
  Clock, Trash2, Edit2, Plus, Box, Megaphone, Receipt, Calendar, 
  ArrowUpRight, UserPlus, Wallet, BarChart3, LogOut, Search, Save, Package
} from 'lucide-react';import { saveState } from './services/localStorage';
import { appendLog } from './services/logService';import { Order, User, PaperStock, OrderStatus, Product, Coupon } from './types';
import { translations } from './translations';

import AdminCMS from './AdminCMS';
import AdminReports from './AdminReports';
import AdminSettings from './AdminSettings';
import AdminLogs from './AdminLogs';
import AdminTickets from './AdminTickets';
import AdminNotifications from './AdminNotifications';

interface AdminDashboardProps {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  allUsers: User[];
  setAllUsers: (users: User[]) => void;
  currentUser: User;
  onLogout: () => void;
  addNotify: (msg: string) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  lang: 'th' | 'en';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  orders, setOrders, allUsers, setAllUsers, currentUser, onLogout, addNotify, products, setProducts, lang
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // User edit modal
  const [editingUserPhone, setEditingUserPhone] = useState<string | null>(null);
  const [tempUser, setTempUser] = useState<Partial<User> | null>(null);

  const t = translations[lang];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Orders & Pricing management state
  const [orderQuery, setOrderQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | OrderStatus | 'ยกเลิก'>('all');
  const [selectedOrders, setSelectedOrders] = useState<Record<string, boolean>>({});
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState<Partial<Product>>({ name: '', category: 'Standard', unit: 'unit', pricePerUnit: 0, description: '' });

  const toggleSelectOrder = (id: string) => setSelectedOrders(prev => ({ ...prev, [id]: !prev[id] }));

  const toggleSelectAllOrders = (visibleIds: string[]) => {
    const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedOrders[id]);
    if (allSelected) setSelectedOrders({});
    else {
      const map: Record<string, boolean> = {};
      visibleIds.forEach(id => (map[id] = true));
      setSelectedOrders(map);
    }
  };

  const filteredOrders = orders.filter(o => {
    const q = orderQuery.trim().toLowerCase();
    const matchesQuery = !q || o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.items.toLowerCase().includes(q);
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    return matchesQuery && matchesFilter;
  });

  const bulkUpdateStatus = (newStatus: OrderStatus) => {
    const count = Object.keys(selectedOrders).filter(k => selectedOrders[k]).length;
    if (!count) return addNotify(lang === 'th' ? 'กรุณาเลือกออเดอร์ก่อน' : 'Please select orders first');
    const updated = orders.map(o => selectedOrders[o.id] ? { ...o, status: newStatus } : o);
    setOrders(updated);
    setSelectedOrders({});
    addNotify(lang === 'th' ? `อัปเดตสถานะเป็น ${newStatus} จำนวน ${count} รายการ` : `Bulk updated ${count} orders`);
  };

  const deleteSelectedOrders = () => {
    const ids = Object.keys(selectedOrders).filter(k => selectedOrders[k]);
    if (!ids.length) return addNotify(lang === 'th' ? 'กรุณาเลือกออเดอร์ก่อน' : 'Please select orders first');
    const remain = orders.filter(o => !selectedOrders[o.id]);
    setOrders(remain);
    setSelectedOrders({});
    addNotify(lang === 'th' ? 'ลบรายการที่เลือกแล้ว' : 'Deleted selected orders');
  };

  const deleteOrder = (id: string) => {
    if (!confirm(lang === 'th' ? 'ลบออเดอร์นี้จริงหรือไม่?' : 'Delete this order?')) return;
    setOrders(orders.filter(o => o.id !== id));
    addNotify(lang === 'th' ? 'ลบออเดอร์แล้ว' : 'Order deleted');
  };

  const openOrder = (o: Order) => setActiveOrder(o);
  const closeOrder = () => setActiveOrder(null);

  const addService = () => {
    if (!newService.name) return addNotify(lang === 'th' ? 'กรุณากรอกชื่อบริการ' : 'Please enter service name');
    const p: Product = {
      id: `svc_${Date.now()}`,
      name: newService.name!,
      category: (newService.category || 'Standard') as Product['category'],
      pricePerUnit: Number(newService.pricePerUnit || 0),
      unit: newService.unit || 'unit',
      description: newService.description || '',
    }; 
    setProducts([...products, p]);
    setShowAddService(false);
    setNewService({ name: '', category: 'Standard', unit: 'unit', pricePerUnit: 0, description: '' });
    addNotify(lang === 'th' ? 'เพิ่มบริการเรียบร้อย' : 'Service added');
  };

  const removeService = (id: string) => {
    if (!confirm(lang === 'th' ? 'ลบบริการนี้จริงหรือไม่?' : 'Remove this service?')) return;
    setProducts(products.filter(p => p.id !== id));
    addNotify(lang === 'th' ? 'ลบบริการเรียบร้อย' : 'Service removed');
  };

  const totalRevenue = orders.filter(o => o.status === 'เสร็จสิ้น').reduce((acc, curr) => acc + curr.price, 0);
  const pendingOrders = orders.filter(o => o.status !== 'เสร็จสิ้น' && o.status !== 'ยกเลิก').length;
  const totalBalance = allUsers.reduce((acc, u) => acc + (u.balance || 0), 0);

  const revenuePoints = [45, 52, 48, 70, 65, 85, 95]; 
  const userGrowthPoints = [20, 35, 40, 30, 55, 60, 75];

  const updateOrderStatus = (id: string, newStatus: OrderStatus) => {
    const updated = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setOrders(updated);
    addNotify(lang === 'th' ? `อัปเดตสถานะออเดอร์ ${id} สำเร็จ` : `Order ${id} status updated`);
  };

  const saveProductPrice = (id: string) => {
    const updated = products.map(p => p.id === id ? { ...p, pricePerUnit: tempPrice } : p);
    setProducts(updated);
    setEditingProduct(null);
    addNotify(lang === 'th' ? "อัปเดตราคาสำเร็จ" : "Price updated successfully");
  };

  const saveUserEdit = () => {
    if (!tempUser || !editingUserPhone) return;
    // validate phone unique (allow unchanged)
    const phoneTaken = allUsers.some(u => u.phone === tempUser.phone && u.phone !== editingUserPhone);
    if (phoneTaken) return addNotify(lang === 'th' ? 'เบอร์นี้ถูกใช้แล้ว' : 'Phone already exists');

    const updated = allUsers.map(u => u.phone === editingUserPhone ? { ...u, ...tempUser, phone: tempUser.phone || u.phone } : u);
    setAllUsers(updated);
    setEditingUserPhone(null);
    setTempUser(null);
    addNotify(lang === 'th' ? 'อัปเดตข้อมูลผู้ใช้เรียบร้อย' : 'User updated');
  };

  const cancelUserEdit = () => {
    setEditingUserPhone(null);
    setTempUser(null);
  };

  const adminModules = [
    { id: 'overview', icon: <LayoutDashboard size={20}/>, label: t.admin_analytics, desc: lang === 'th' ? 'ข้อมูลสรุปและกราฟ' : 'Summary & Insights' },
    { id: 'orders', icon: <ClipboardList size={20}/>, label: t.admin_orders, desc: lang === 'th' ? 'จัดการคิวงานพิมพ์' : 'Order Pipeline' },
    { id: 'pricing', icon: <Tag size={20}/>, label: t.admin_services, desc: lang === 'th' ? 'จัดการราคาและสเปก' : 'Service Pricing' },
    { id: 'users', icon: <Users size={20}/>, label: t.admin_users, desc: lang === 'th' ? 'รายชื่อสมาชิกทั้งหมด' : 'Member Directory' },
    { id: 'cms', icon: <Megaphone size={20}/>, label: lang === 'th' ? 'CMS' : 'CMS', desc: lang === 'th' ? 'จัดการคอนเทนต์' : 'Content Management' },
    { id: 'reports', icon: <Bell size={20}/>, label: lang === 'th' ? 'รายการรายงาน' : 'Reports', desc: lang === 'th' ? 'รายการรายงาน' : 'Reports' },
    { id: 'settings', icon: <Settings2 size={20}/>, label: lang === 'th' ? 'การตั้งค่า' : 'Settings', desc: lang === 'th' ? 'ตั้งค่าระบบ' : 'Configuration' },
    { id: 'logs', icon: <ClipboardList size={20}/>, label: lang === 'th' ? 'Logs' : 'Logs', desc: lang === 'th' ? 'บันทึกกิจกรรม' : 'Activity Logs' },
    { id: 'tickets', icon: <UserPlus size={20}/>, label: lang === 'th' ? 'Tickets' : 'Support', desc: lang === 'th' ? 'ระบบแจ้งปัญหา' : 'Support Tickets' },
    { id: 'notifications', icon: <Megaphone size={20}/>, label: lang === 'th' ? 'ประกาศ' : 'Broadcast', desc: lang === 'th' ? 'ส่งประกาศ' : 'Broadcast' },
    { id: 'inventory', icon: <Database size={20}/>, label: t.admin_inventory, desc: lang === 'th' ? 'สต็อกวัสดุและกระดาษ' : 'Stock Tracking' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-[300px] space-y-4">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Settings2 size={60}/></div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-2">One Paper ERP</p>
          <h3 className="text-xl font-black uppercase tracking-tight leading-none">{t.admin_hub}</h3>
        </div>

        <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-xl space-y-1">
          {adminModules.map(m => (
            <button 
              key={m.id} 
              onClick={() => setActiveTab(m.id)} 
              className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${activeTab === m.id ? 'bg-[#4f46e5] text-white shadow-lg' : 'hover:bg-slate-50 text-slate-500'}`}
            >
              <div className={`p-2 rounded-xl ${activeTab === m.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>{m.icon}</div>
              <div className="text-left">
                <p className="text-[12px] font-black uppercase leading-none mb-1">{m.label}</p>
                <p className={`text-[8px] font-bold uppercase tracking-widest ${activeTab === m.id ? 'text-white/60' : 'text-slate-300'}`}>{m.desc}</p>
              </div>
            </button>
          ))}
          <button onClick={onLogout} className="w-full p-4 mt-4 rounded-2xl flex items-center gap-4 text-rose-500 hover:bg-rose-50 transition-all">
             <div className="p-2 bg-rose-100 rounded-xl"><LogOut size={20}/></div>
             <p className="text-[12px] font-black uppercase">{t.nav_logout}</p>
          </button>
        </div>
      </aside>

      <div className="flex-1 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#4f46e5] shadow-inner">
               <Calendar size={28}/>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-2">
                {currentTime.toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h2>
              <div className="flex items-center gap-2 text-[#4f46e5] font-black">
                 <Clock size={16}/>
                 <span className="text-xl tracking-widest">{currentTime.toLocaleTimeString(lang === 'th' ? 'th-TH' : 'en-US')}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> System Live
             </div>
             <div className="px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-800 font-black text-[12px] flex items-center gap-4">
               <Users size={16} className="text-[#4f46e5]"/> <div className="text-sm">{allUsers.length} {lang === 'th' ? 'ผู้ใช้งาน' : 'users'}</div>
             </div>
             <div className="px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-800 font-black text-[12px] flex items-center gap-4">
               <Wallet size={16} className="text-amber-500"/> <div className="text-sm">฿{totalBalance.toLocaleString()}</div>
             </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8 fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { label: t.stat_revenue, val: `฿${totalRevenue.toLocaleString()}`, trend: '+15.4%', icon: <Landmark />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                 { label: t.stat_users, val: allUsers.length, trend: '+4 New', icon: <Users />, color: 'text-blue-500', bg: 'bg-blue-50' },
                 { label: t.stat_pending, val: pendingOrders, trend: 'Active', icon: <ClipboardList />, color: 'text-orange-500', bg: 'bg-orange-50' },
                 { label: t.stat_total_balance, val: `฿${totalBalance.toLocaleString()}`, trend: 'Live', icon: <Wallet />, color: 'text-purple-500', bg: 'bg-purple-50' },
               ].map((s, i) => (
                 <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-4 hover:-translate-y-1 transition-all">
                    <div className="flex justify-between items-start">
                       <div className={`p-4 ${s.bg} ${s.color} rounded-2xl shadow-inner`}>{s.icon}</div>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${s.color}`}>{s.trend}</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{s.label}</p>
                      <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{s.val}</h4>
                    </div>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                       <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{t.chart_revenue}</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.chart_days}</p>
                    </div>
                    <BarChart3 className="text-slate-200" size={32}/>
                  </div>
                  <div className="h-48 w-full relative pt-10">
                     <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="gradRev" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#4f46e5', stopOpacity: 0.2 }} />
                            <stop offset="100%" style={{ stopColor: '#4f46e5', stopOpacity: 0 }} />
                          </linearGradient>
                        </defs>
                        <path d={`M 0 100 ${revenuePoints.map((p, i) => `L ${(i / 6) * 100}% ${100 - p}`).join(' ')} L 100 100 Z`} fill="url(#gradRev)" />
                        <path d={`M 0 ${100 - revenuePoints[0]} ${revenuePoints.map((p, i) => `L ${(i / 6) * 100}% ${100 - p}`).join(' ')}`} fill="none" stroke="#4f46e5" strokeWidth="4" />
                     </svg>
                  </div>
               </div>

               <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                       <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{t.chart_growth}</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.chart_days}</p>
                    </div>
                    <TrendingUp className="text-slate-200" size={32}/>
                  </div>
                  <div className="h-48 w-full flex items-end gap-2 px-2">
                     {userGrowthPoints.map((p, i) => (
                        <div key={i} className="flex-1 bg-indigo-50 rounded-t-xl relative group" style={{ height: `${p}%` }}>
                           <div className="absolute inset-0 bg-[#4f46e5] rounded-t-xl opacity-0 group-hover:opacity-100 transition-all"></div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="airy-card overflow-hidden fade-in shadow-2xl">
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mr-2">{t.admin_orders}</h3>
                <input value={orderQuery} onChange={e => setOrderQuery(e.target.value)} placeholder={lang === 'th' ? 'ค้นหา ID / ลูกค้า / รายการ' : 'Search ID / customer / items'} className="p-2 border rounded-md text-sm" />
                <select value={orderFilter} onChange={e => setOrderFilter(e.target.value as any)} className="p-2 border rounded-md text-sm ml-2">
                  <option value="all">{lang === 'th' ? 'ทั้งหมด' : 'All'}</option>
                  <option value="รอดำเนินการ">{t.status_pending}</option>
                  <option value="กำลังผลิต">{t.status_producing}</option>
                  <option value="เสร็จสิ้น">{t.status_complete}</option>
                  <option value="ยกเลิก">{t.status_cancel}</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[12px] font-black">{Object.keys(selectedOrders).filter(k => selectedOrders[k]).length} {lang === 'th' ? 'เลือกแล้ว' : 'selected'}</div>
                <button onClick={() => bulkUpdateStatus('เสร็จสิ้น')} className="px-3 py-2 bg-emerald-500 text-white rounded text-xs">{lang === 'th' ? 'ทำเสร็จ' : 'Mark Complete'}</button>
                <button onClick={() => bulkUpdateStatus('กำลังผลิต')} className="px-3 py-2 bg-indigo-500 text-white rounded text-xs">{lang === 'th' ? 'ส่งผลิต' : 'Mark Producing'}</button>
                <button onClick={deleteSelectedOrders} className="px-3 py-2 bg-rose-500 text-white rounded text-xs">{lang === 'th' ? 'ลบที่เลือก' : 'Delete'}</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4"><input type="checkbox" checked={filteredOrders.length > 0 && filteredOrders.every(o => selectedOrders[o.id])} onChange={() => toggleSelectAllOrders(filteredOrders.map(o => o.id))} /></th>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/30 transition-all">
                      <td className="px-6 py-4"><input type="checkbox" checked={!!selectedOrders[o.id]} onChange={() => toggleSelectOrder(o.id)} /></td>
                      <td className="px-6 py-4 font-black text-indigo-600">{o.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-700">{o.customer}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{o.items}</td>
                      <td className="px-6 py-4">
                        <select 
                          value={o.status} 
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none"
                        >
                          <option value="รอดำเนินการ">{t.status_pending}</option>
                          <option value="กำลังผลิต">{t.status_producing}</option>
                          <option value="เสร็จสิ้น">{t.status_complete}</option>
                          <option value="ยกเลิก">{t.status_cancel}</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex gap-2 justify-center">
                           <button onClick={() => openOrder(o)} className="p-2 text-slate-300 hover:text-indigo-600"><ArrowUpRight size={18}/></button>
                           <button onClick={() => deleteOrder(o.id)} className="p-2 text-rose-400 hover:text-rose-600"><Trash2 size={18}/></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {activeOrder && (
              <div className="fixed inset-0 z-[400] bg-black/40 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                  <h3 className="text-xl font-black mb-2">{lang === 'th' ? 'รายละเอียดออเดอร์' : 'Order Details'}</h3>
                  <div className="space-y-2">
                    <p className="text-sm font-bold">ID: {activeOrder.id}</p>
                    <p className="text-sm">{lang === 'th' ? 'ลูกค้า' : 'Customer'}: {activeOrder.customer}</p>
                    <p className="text-sm">{lang === 'th' ? 'รายการ' : 'Items'}: {activeOrder.items}</p>
                    <p className="text-sm">{lang === 'th' ? 'ที่อยู่' : 'Address'}: {activeOrder.address || '-'}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <select value={activeOrder.status} onChange={(e) => { updateOrderStatus(activeOrder.id, e.target.value as OrderStatus); setActiveOrder({ ...activeOrder, status: e.target.value as OrderStatus }); }} className="p-2 border rounded">
                        <option value="รอดำเนินการ">{t.status_pending}</option>
                        <option value="กำลังผลิต">{t.status_producing}</option>
                        <option value="เสร็จสิ้น">{t.status_complete}</option>
                        <option value="ยกเลิก">{t.status_cancel}</option>
                      </select>
                      <div className="flex gap-2 ml-auto">
                        <button onClick={() => { closeOrder(); }} className="px-4 py-2 bg-slate-100 rounded">{lang === 'th' ? 'ปิด' : 'Close'}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="fade-in">
            <div className="flex justify-between items-center p-6 bg-white rounded-[1rem] border border-slate-100 mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{t.admin_services}</h3>
                <p className="text-xs text-slate-400">{lang === 'th' ? 'จัดการบริการและราคา' : 'Manage services & pricing'}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowAddService(true)} className="px-4 py-2 bg-emerald-500 text-white rounded">{lang === 'th' ? 'เพิ่มบริการ' : 'Add Service'}</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {products.map(p => (
                 <div key={p.id} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
                    <div className="flex justify-between items-start">
                       <div className="w-16 h-16 bg-slate-50 text-[#4f46e5] rounded-3xl flex items-center justify-center shadow-inner"><Package size={28}/></div>
                       <span className="px-4 py-1 bg-slate-100 rounded-full text-[9px] font-black uppercase text-slate-400">{p.category}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">{p.name}</h3>
                      <p className="text-slate-400 text-sm font-medium">{p.description}</p>
                    </div>
                    <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                       {editingProduct === p.id ? (
                         <div className="flex gap-2">
                            <input 
                              type="number" 
                              className="w-24 p-2 bg-slate-50 border border-slate-100 rounded-xl font-black outline-none"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(parseFloat(e.target.value))}
                            />
                            <button onClick={() => saveProductPrice(p.id)} className="p-2 bg-emerald-500 text-white rounded-xl"><Save size={18}/></button>
                         </div>
                       ) : (
                         <p className="text-3xl font-black text-[#4f46e5]">฿{p.pricePerUnit}<span className="text-xs font-bold text-slate-300 ml-1">/{p.unit}</span></p>
                       )}
                       <div className="flex items-center gap-2">
                         <button 
                           onClick={() => { setEditingProduct(p.id); setTempPrice(p.pricePerUnit); }}
                           className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all"
                         >
                            <Edit2 size={18}/>
                         </button>
                         <button onClick={() => removeService(p.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all"><Trash2 size={18}/></button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            {showAddService && (
              <div className="fixed inset-0 z-[400] bg-black/40 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                  <h3 className="text-xl font-black mb-4">{lang === 'th' ? 'เพิ่มบริการใหม่' : 'Add New Service'}</h3>
                  <div className="space-y-3">
                    <input value={newService.name || ''} onChange={e => setNewService({ ...newService, name: e.target.value })} className="w-full p-3 border rounded" placeholder={lang === 'th' ? 'ชื่อบริการ' : 'Service name'} />
                    <input value={newService.category || ''} onChange={e => setNewService({ ...newService, category: e.target.value as Product['category'] })} className="w-full p-3 border rounded" placeholder={lang === 'th' ? 'หมวดหมู่' : 'Category'} />
                    
                    <input type="number" value={newService.pricePerUnit ?? 0} onChange={e => setNewService({ ...newService, pricePerUnit: parseFloat(e.target.value) || 0 })} className="w-full p-3 border rounded" placeholder={lang === 'th' ? 'ราคา (ต่อหน่วย)' : 'Price per unit'} />
                    <input value={newService.unit || ''} onChange={e => setNewService({ ...newService, unit: e.target.value })} className="w-full p-3 border rounded" placeholder={lang === 'th' ? 'หน่วย' : 'Unit (e.g., sheet)'} />
                    <textarea value={newService.description || ''} onChange={e => setNewService({ ...newService, description: e.target.value })} className="w-full p-3 border rounded" placeholder={lang === 'th' ? 'คำอธิบาย' : 'Description'} />
                    <div className="flex gap-3 justify-end mt-4">
                      <button onClick={() => setShowAddService(false)} className="px-4 py-2 rounded bg-slate-100">{lang === 'th' ? 'ยกเลิก' : 'Cancel'}</button>
                      <button onClick={addService} className="px-4 py-2 rounded bg-emerald-600 text-white">{lang === 'th' ? 'เพิ่ม' : 'Add'}</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {activeTab === 'users' && (
          <div className="airy-card overflow-hidden fade-in shadow-2xl border-slate-100">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{t.admin_users}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.crm_desc}</p>
              </div>
              <div className="flex gap-2 items-center">
                <input placeholder={lang === 'th' ? 'ค้นหา ชื่อ/อีเมล/UID' : 'Search name/email/uid'} className="p-2 border rounded" onChange={e => setOrderQuery(e.target.value)} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">UID</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4 text-center">Wallet</th>
                    <th className="px-6 py-4 text-center">Role</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {allUsers.map(u => (
                    <tr key={u.uid} className="hover:bg-slate-50/30 transition-all">
                      <td className="px-6 py-4 font-black text-indigo-600">{u.uid}</td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{u.email || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-indigo-50 text-[#4f46e5] rounded-2xl flex items-center justify-center font-black text-lg shadow-inner uppercase overflow-hidden">
                           {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : u.name[0]}
                         </div>
                         <div>
                            <p className="text-lg font-black text-slate-800">{u.name}</p>
                            <p className="text-xs font-bold text-slate-400">{u.signupDate ? new Date(u.signupDate).toLocaleDateString() : '-'}</p>
                         </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">฿{Math.round(u.balance).toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <select value={u.role || 'User'} onChange={e => {
                          const updated = allUsers.map(x => x.uid === u.uid ? { ...x, role: e.target.value as User['role'] } : x);
                          setAllUsers(updated); saveState('onepaper.users', updated); appendLog(currentUser.name, `Changed role for ${u.name} to ${e.target.value}`); addNotify('Role updated');
                        }} className="p-2 border rounded">
                          <option value="User">User</option>
                          <option value="VIP">VIP</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className={`px-2 py-1 rounded text-xs ${u.status === 'banned' ? 'bg-rose-100 text-rose-600' : u.status === 'suspended' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>{u.status || 'active'}</div>
                          <button onClick={() => {
                            const newStatus = (u.status === 'banned' ? 'active' : 'banned') as User['status'];
                            const updated = allUsers.map(x => x.uid === u.uid ? { ...x, status: newStatus } : x);
                            setAllUsers(updated); saveState('onepaper.users', updated); appendLog(currentUser.name, `${newStatus === 'banned' ? 'Banned' : 'Unbanned'} user ${u.name}`); addNotify(newStatus === 'banned' ? 'User banned' : 'User unbanned');
                          }} className="px-2 py-1 bg-rose-50 text-rose-500 rounded">{u.status === 'banned' ? (lang === 'th' ? 'ยกเลิกแบน' : 'Unban') : (lang === 'th' ? 'แบน' : 'Ban')}</button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => { setEditingUserPhone(u.phone); setTempUser({ ...u }); }} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><Edit2 size={16}/></button>
                          <button onClick={() => {
                            // reset password (MVP): generate token and show as notification and log
                            const token = `${Math.random().toString(36).slice(2,10)}-${Date.now()}`;
                            appendLog(currentUser.name, `Generated reset token for ${u.name}`);
                            addNotify((lang === 'th' ? 'ลิงก์รีเซ็ตรหัสถูกสร้าง: ' : 'Reset link created: ') + token);
                          }} className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">{lang === 'th' ? 'Reset PW' : 'Reset PW'}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'cms' && (
          <AdminCMS lang={lang} addNotify={addNotify} />
        )}

        {activeTab === 'reports' && (
          <AdminReports lang={lang} addNotify={addNotify} />
        )}

        {activeTab === 'settings' && (
          <AdminSettings lang={lang} addNotify={addNotify} />
        )}

        {activeTab === 'logs' && (
          <AdminLogs lang={lang} />
        )}

        {activeTab === 'tickets' && (
          <AdminTickets lang={lang} addNotify={addNotify} />
        )}

        {activeTab === 'notifications' && (
          <AdminNotifications lang={lang} addNotify={addNotify} />
        )}

        {activeTab === 'inventory' && (
           <div className="py-40 bg-white rounded-[3rem] border border-slate-100 shadow-xl text-center space-y-6 fade-in">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] mx-auto flex items-center justify-center text-slate-200 shadow-inner">
                 <Database size={40} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tighter">Inventory System Active</h3>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">Tracking paper & ink consumption...</p>
              </div>
           </div>
        )}

        {/* Edit User Modal */}
        {editingUserPhone && tempUser && (
          <div className="fixed inset-0 z-[400] bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-black mb-4">{lang === 'th' ? 'แก้ไขผู้ใช้งาน' : 'Edit User'}</h3>
              <div className="space-y-3">
                <input value={tempUser.name || ''} onChange={e => setTempUser({ ...tempUser, name: e.target.value })} className="w-full p-3 border rounded" placeholder={lang === 'th' ? 'ชื่อ' : 'Name'} />
                <input value={tempUser.phone || ''} onChange={e => setTempUser({ ...tempUser, phone: e.target.value })} className="w-full p-3 border rounded" placeholder={lang === 'th' ? 'เบอร์โทร' : 'Phone'} />
                <input value={(tempUser.balance ?? 0).toString()} onChange={e => setTempUser({ ...tempUser, balance: parseFloat(e.target.value) || 0 })} className="w-full p-3 border rounded" placeholder={lang === 'th' ? 'ยอดเงิน' : 'Balance'} />
                <input value={(tempUser.points ?? 0).toString()} onChange={e => setTempUser({ ...tempUser, points: parseInt(e.target.value) || 0 })} className="w-full p-3 border rounded" placeholder={lang === 'th' ? 'คะแนน' : 'Points'} />
                <div className="flex gap-3 justify-end mt-4">
                  <button onClick={cancelUserEdit} className="px-4 py-2 rounded bg-slate-100">{lang === 'th' ? 'ยกเลิก' : 'Cancel'}</button>
                  <button onClick={saveUserEdit} className="px-4 py-2 rounded bg-emerald-600 text-white">{lang === 'th' ? 'บันทึก' : 'Save'}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
