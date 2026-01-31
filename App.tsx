
import React, { useState, useEffect } from 'react';
import { 
  Printer, LogOut, Crown, Plus, Award, MapPin, Wallet, UserCog, 
  Bell, Star, Receipt, FileText, Sparkles, ChevronLeft, Languages, 
  MessageCircle, Quote, Users, History, Clock, Search, Filter,
  CreditCard, LayoutDashboard, Settings, Info, ShoppingBag, X, ArrowRight
} from 'lucide-react';
import { Page, User, Order, MembershipTier, Product, Reward, Branch, PaperStock } from './types';
import { getPrintAdvice } from './services/geminiService';
import { translations } from './translations';
import AdminDashboard from './AdminDashboard';
import AuthSystem from './AuthSystem';
import AdminLogin from './AdminLogin';
import LandingPage from './LandingPage';
import OrderFlow from './OrderFlow';
import HistoryPage from './HistoryPage';
import ProfilePage from './ProfilePage';
import LoyaltyStore from './LoyaltyStore';
import BranchLocator from './BranchLocator';
import CatalogPage from './CatalogPage';
import ReferralPage from './ReferralPage';
import NotificationPage from './NotificationPage';
import OrderStatusPage from './OrderStatusPage';
import TaxInvoicePage from './TaxInvoicePage';
import TopUpPage from './TopUpPage';

const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'ขาว-ดำ A4 (มาตรฐาน)', pricePerUnit: 1.5, unit: 'หน้า', category: 'Standard', description: 'กระดาษ 80 แกรม คมชัดมาตรฐาน เหมาะสำหรับเอกสารทั่วไป', spec: '80gsm / Laser BW', icon: 'FileText' },
  { id: 'p2', name: 'สี A4 (มาตรฐาน)', pricePerUnit: 6.5, unit: 'หน้า', category: 'Standard', description: 'พิมพ์สีคุณภาพมาตรฐาน เหมาะสำหรับเอกสารประกอบการนำเสนอ', spec: '80gsm / Laser Color', icon: 'ImageIcon' },
  { id: 'p3', name: 'สี A4 (พรีเมียม)', pricePerUnit: 9.0, unit: 'หน้า', category: 'Premium', description: 'สีสดใส ความละเอียดสูง เหมาะสำหรับโปสเตอร์และงานโฆษณา', spec: 'Premium Color / High Res', icon: 'ImageIcon' },
  { id: 'p4', name: 'สติกเกอร์ PP (A3+)', pricePerUnit: 80.0, unit: 'แผ่น', category: 'Advertising', description: 'สติกเกอร์เนื้อพลาสติก ทนทาน กันน้ำ', spec: 'PP Sticker Glossy/Matte', icon: 'Palette' },
  { id: 'p5', name: 'เข้าเล่ม (กระดูกงู)', pricePerUnit: 45.0, unit: 'เล่ม', category: 'Binding', description: 'เข้าเล่มพลาสติก แข็งแรง ทนทาน', spec: 'Plastic Spiral / Cover PVC', icon: 'Book' },
  { id: 'p6', name: 'นามบัตร (Matte 260g)', pricePerUnit: 350.0, unit: 'กล่อง (100 ใบ)', category: 'Premium', description: 'นามบัตรพิมพ์ 2 หน้า เนื้อด้าน พรีเมียม', spec: '260gsm Matte / Digital Print', icon: 'CreditCard' },
];

const INITIAL_INVENTORY: PaperStock[] = [
  { id: 'st1', name: 'Double A 80gsm', gsm: 80, remaining: 5000, unit: 'Sheets', status: 'available' },
  { id: 'st2', name: 'Art Paper 120gsm', gsm: 120, remaining: 450, unit: 'Sheets', status: 'available' },
  { id: 'st3', name: 'PP Sticker', gsm: 150, remaining: 80, unit: 'Sheets', status: 'low' },
];

const App: React.FC = () => {
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [inventory, setInventory] = useState<PaperStock[]>(INITIAL_INVENTORY);
  const [notifications, setNotifications] = useState<{ id: number; msg: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [aiWorking, setAiWorking] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const t = translations[lang];

  // Load Data
  useEffect(() => {
    const u = localStorage.getItem('onepaper_user');
    const al = localStorage.getItem('onepaper_all_users');
    const o = localStorage.getItem('onepaper_orders');
    const p = localStorage.getItem('onepaper_products');
    const inv = localStorage.getItem('onepaper_inventory');
    const l = localStorage.getItem('onepaper_lang');

    if (al) {
      try {
        const parsed = JSON.parse(al) as User[];
        // Normalize older user records to required fields
        const normalized = parsed.map(u => ({
          uid: u.uid || `u_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
          email: u.email || undefined,
          name: u.name || u.email || 'User',
          phone: u.phone || '',
          pin: u.pin || '',
          avatar: u.avatar ?? null,
          points: typeof u.points === 'number' ? u.points : 0,
          balance: typeof u.balance === 'number' ? u.balance : 0,
          isAdmin: !!u.isAdmin,
          tier: u.tier || 'Bronze',
          role: (u as any).role || 'User',
          status: (u as any).status || 'active',
          signupDate: u.signupDate || new Date().toISOString(),
          transactions: u.transactions || [],
          notifications: u.notifications || [],
          referralCode: u.referralCode,
          totalOrders: u.totalOrders || 0,
        } as User));
        setAllUsers(normalized);
      } catch (err) {
        console.warn('Failed to parse users from localStorage', err);
      }
    }
    if (u) {
      try {
        const cu = JSON.parse(u) as User;
        setCurrentUser({
          uid: cu.uid || `u_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
          email: cu.email || undefined,
          name: cu.name || 'User',
          phone: cu.phone || '',
          pin: cu.pin || '',
          avatar: cu.avatar ?? null,
          points: cu.points ?? 0,
          balance: cu.balance ?? 0,
          isAdmin: !!cu.isAdmin,
          tier: cu.tier || 'Bronze',
          role: (cu as any).role || (cu.isAdmin ? 'Admin' : 'User'),
          status: (cu as any).status || 'active',
          signupDate: cu.signupDate || new Date().toISOString(),
          transactions: cu.transactions || [],
          notifications: cu.notifications || [],
          referralCode: cu.referralCode,
          totalOrders: cu.totalOrders || 0,
        } as User);
      } catch (err) {
        console.warn('Failed to parse currentUser from localStorage', err);
      }
    }

    if (o) setOrders(JSON.parse(o));
    if (p) setProducts(JSON.parse(p));
    if (inv) setInventory(JSON.parse(inv));
    if (l) setLang(l as 'th' | 'en');
  }, []);

  // Save Data
  useEffect(() => {
    localStorage.setItem('onepaper_products', JSON.stringify(products));
    localStorage.setItem('onepaper_inventory', JSON.stringify(inventory));
    localStorage.setItem('onepaper_lang', lang);
    if (currentUser) localStorage.setItem('onepaper_user', JSON.stringify(currentUser));
    localStorage.setItem('onepaper_all_users', JSON.stringify(allUsers));
    localStorage.setItem('onepaper_orders', JSON.stringify(orders));
  }, [products, inventory, lang, currentUser, allUsers, orders]);

  const addNotify = (msg: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const navigateTo = (p: Page) => {
    if (!currentUser && !['landing', 'catalog'].includes(p)) {
      setShowAuth(true);
      return;
    }
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminAuth = (email: string, pass: string) => {
    if (email === 'admin@theonepaper.com' && pass === '123456') {
      const admin: User = { 
        uid: `admin_${Date.now()}`,
        email,
        name: 'Super Admin',
        phone: email,
        pin: pass,
        avatar: null,
        points: 9999,
        balance: 9999,
        isAdmin: true,
        tier: 'Platinum',
        role: 'Admin',
        status: 'active',
        signupDate: new Date().toISOString(),
        transactions: [],
        notifications: [],
        totalOrders: 999,
      };
      setCurrentUser(admin);
      // ensure admin is present in users list
      setAllUsers(prev => {
        const exists = prev.some(u => u.uid === admin.uid || u.email === admin.email);
        const updated = exists ? prev.map(u => u.email === admin.email ? admin : u) : [admin, ...prev];
        localStorage.setItem('onepaper_all_users', JSON.stringify(updated));
        return updated;
      });
      setShowAdminLogin(false);
      navigateTo('admin-dashboard');
      addNotify("Admin Hub Online");
    } else alert("Invalid Admin Credentials");
  };

  const handleAuth = (ph: string, pi: string, na?: string): boolean => {
    if (!na) {
      const u = allUsers.find(x => x.phone === ph && x.pin === pi);
      if (u) {
        setCurrentUser(u);
        setShowAuth(false);
        navigateTo('dashboard');
        addNotify(`${t.hello}, ${u.name}`);
        return true;
      } else {
        // Invalid credentials
        return false;
      }
    } else {
      if (allUsers.some(u => u.phone === ph)) {
        alert(lang === 'th' ? "เบอร์นี้ถูกใช้แล้ว" : "Phone already exists");
        return false;
      }
      const newUser: User = { 
        uid: `u_${Date.now()}`,
        email: undefined,
        name: na,
        phone: ph,
        pin: pi,
        avatar: null,
        points: 0,
        balance: 100,
        isAdmin: false,
        tier: 'Bronze',
        role: 'User',
        status: 'active',
        signupDate: new Date().toISOString(),
        transactions: [],
        notifications: [],
        referralCode: undefined,
        totalOrders: 0,
      };
      const updatedUsers = [...allUsers, newUser];
      setAllUsers(updatedUsers);
      localStorage.setItem('onepaper_all_users', JSON.stringify(updatedUsers));
      setCurrentUser(newUser);
      setShowAuth(false);
      navigateTo('dashboard');
      addNotify(lang === 'th' ? "ยินดีต้อนรับ!" : "Welcome!");
      return true;
    }
  };

  const chatWithAI = async () => {
    if (!chatInput.trim() || aiWorking) return;
    const msg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: msg }]);
    setAiWorking(true);
    const resp = await getPrintAdvice(msg);
    setChatHistory(prev => [...prev, { role: 'bot', text: resp || "Server error" }]);
    setAiWorking(false);
  };

  const renderContent = () => {
    if (currentPage === 'landing') return <LandingPage products={products} onStart={() => navigateTo('dashboard')} onNavigate={navigateTo} lang={lang} />;
    
    // Admin Protected Page
    if (currentPage === 'admin-dashboard') {
      if (!currentUser?.isAdmin) return <div className="text-center py-40 font-black">ACCESS DENIED</div>;
      return (
        <AdminDashboard 
          orders={orders} setOrders={setOrders} allUsers={allUsers} setAllUsers={setAllUsers} 
          currentUser={currentUser} onLogout={() => { setCurrentUser(null); navigateTo('landing'); }} addNotify={addNotify}
          products={products} setProducts={setProducts} lang={lang}
        />
      );
    }

    if (!currentUser) return null;
    const onBack = () => navigateTo('dashboard');

    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="fade-in space-y-12">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-10 bg-slate-50/50 p-12 rounded-[4rem] border border-slate-100 relative overflow-hidden group">
               <div className="absolute inset-0 bg-[#4f46e5]/5 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
               <div className="flex items-center gap-8 relative z-10">
                  <div className="w-28 h-28 bg-white rounded-[2.5rem] shadow-2xl border-4 border-white flex items-center justify-center text-5xl font-black text-[#4f46e5] overflow-hidden">
                    {currentUser.avatar ? <img src={currentUser.avatar} className="w-full h-full object-cover" /> : currentUser.name[0]}
                  </div>
                  <div>
                    <h2 className="text-5xl font-black tracking-tighter mb-3 uppercase leading-none">{t.hello}, <span className="text-[#4f46e5]">{currentUser.name}</span></h2>
                    <span className="px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest bg-slate-900 text-white flex items-center gap-2 w-fit">
                      <Crown size={14}/> {currentUser.tier} {t.tier_member}
                    </span>
                  </div>
               </div>
               <div className="flex gap-4 relative z-10 w-full lg:w-auto">
                  <div onClick={() => navigateTo('top-up')} className="airy-card px-10 py-6 text-center cursor-pointer hover:bg-[#4f46e5] hover:text-white transition-all group flex-1">
                    <div className="text-4xl font-black text-[#4f46e5] group-hover:text-white tracking-tighter">฿{currentUser.balance.toLocaleString()}</div>
                    <div className="text-[10px] font-black uppercase text-slate-400 group-hover:text-indigo-100 mt-2 tracking-widest">{t.balance}</div>
                  </div>
                  <button onClick={() => { setCurrentUser(null); navigateTo('landing'); }} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] text-slate-300 hover:text-rose-600 transition-all"><LogOut size={32}/></button>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { id: 'order-flow', icon: <Plus size={32}/>, label: lang === 'th' ? 'สั่งงานใหม่' : 'New Order', color: 'bg-blue-50 text-blue-600' },
                { id: 'order-status', icon: <Clock size={32}/>, label: lang === 'th' ? 'สถานะงาน' : 'Order Track', color: 'bg-orange-50 text-orange-600' },
                { id: 'history', icon: <History size={32}/>, label: lang === 'th' ? 'ประวัติสั่ง' : 'History', color: 'bg-emerald-50 text-emerald-600' },
                { id: 'loyalty-store', icon: <Award size={32}/>, label: lang === 'th' ? 'แลกรางวัล' : 'Rewards', color: 'bg-purple-50 text-purple-600' },
                { id: 'top-up', icon: <Wallet size={32}/>, label: lang === 'th' ? 'เติมเงิน' : 'Top Up', color: 'bg-amber-50 text-amber-600' },
                { id: 'profile', icon: <UserCog size={32}/>, label: lang === 'th' ? 'โปรไฟล์' : 'Profile', color: 'bg-slate-50 text-slate-600' },
                { id: 'branch-locator', icon: <MapPin size={32}/>, label: lang === 'th' ? 'สาขา' : 'Branches', color: 'bg-indigo-50 text-indigo-600' },
                { id: 'notifications', icon: <Bell size={32}/>, label: lang === 'th' ? 'แจ้งเตือน' : 'Alerts', color: 'bg-rose-50 text-rose-600' },
              ].map(module => (
                <button key={module.id} onClick={() => navigateTo(module.id as Page)} className="airy-card p-10 flex flex-col items-center gap-6 hover:-translate-y-2 transition-all">
                  <div className={`w-20 h-20 ${module.color} rounded-3xl flex items-center justify-center shadow-inner`}>{module.icon}</div>
                  <span className="text-[12px] font-black uppercase tracking-widest text-slate-800">{module.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'order-flow': return <OrderFlow user={currentUser} setUser={setCurrentUser} products={products} orders={orders} setOrders={setOrders} onComplete={() => navigateTo('order-status')} addNotify={addNotify} onBack={onBack} lang={lang} />;
      case 'history': return <HistoryPage orders={orders.filter(o => o.customer === currentUser.name)} onBack={onBack} lang={lang} />;
      case 'profile': return <ProfilePage user={currentUser} setUser={setCurrentUser} onBack={onBack} />;
      case 'loyalty-store': return <LoyaltyStore user={currentUser} setUser={setCurrentUser} addNotify={addNotify} onBack={onBack} />;
      case 'branch-locator': return <BranchLocator onBack={onBack} />;
      case 'catalog': return <CatalogPage products={products} onBack={onBack} lang={lang} />;
      case 'top-up': return <TopUpPage user={currentUser} setUser={setCurrentUser} addNotify={addNotify} onBack={onBack} lang={lang} />;
      case 'notifications': return <NotificationPage user={currentUser} onBack={onBack} />;
      case 'order-status': return <OrderStatusPage orders={orders.filter(o => o.customer === currentUser.name)} onBack={onBack} lang={lang} />;
      default: return <div className="text-center py-40 font-black text-slate-200">Coming Soon</div>;
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 h-20 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('landing')} onDoubleClick={() => setShowAdminLogin(true)}>
            <div className="w-10 h-10 bg-[#4f46e5] rounded-xl flex items-center justify-center text-white"><Printer size={20}/></div>
            <span className="text-xl font-black tracking-tight hidden lg:block">The One Paper</span>
          </div>

          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            <button 
              onClick={() => navigateTo(currentUser ? 'dashboard' : 'landing')} 
              className={`text-[13px] font-black uppercase tracking-widest transition-all hover:text-[#4f46e5] relative group ${['landing', 'dashboard'].includes(currentPage) ? 'text-[#4f46e5]' : 'text-slate-400'}`}
            >
              {t.nav_home}
              {['landing', 'dashboard'].includes(currentPage) && <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#4f46e5] rounded-full"></div>}
            </button>
            <button 
              onClick={() => navigateTo('catalog')} 
              className={`text-[13px] font-black uppercase tracking-widest transition-all hover:text-[#4f46e5] relative group ${currentPage === 'catalog' ? 'text-[#4f46e5]' : 'text-slate-400'}`}
            >
              {t.nav_pricing}
              {currentPage === 'catalog' && <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#4f46e5] rounded-full"></div>}
            </button>
            <button 
              onClick={() => navigateTo('order-status')} 
              className={`text-[13px] font-black uppercase tracking-widest transition-all hover:text-[#4f46e5] relative group ${currentPage === 'order-status' ? 'text-[#4f46e5]' : 'text-slate-400'}`}
            >
              {t.nav_track}
              {currentPage === 'order-status' && <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#4f46e5] rounded-full"></div>}
            </button>
          </div>

          {/* User & Language Section */}
          <div className="flex items-center gap-4">
             <button onClick={() => setLang(lang === 'th' ? 'en' : 'th')} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:text-[#4f46e5] flex items-center gap-2 group transition-all">
               <Languages size={18}/> <span className="text-[12px] font-black">{lang === 'th' ? 'TH' : 'EN'}</span>
             </button>
             {currentUser ? (
               <div className="flex items-center gap-3 bg-white pl-1 pr-5 py-1.5 rounded-full border border-slate-100 shadow-sm cursor-pointer" onClick={() => navigateTo('dashboard')}>
                  <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-black text-xs text-[#4f46e5] overflow-hidden">
                    {currentUser.avatar ? <img src={currentUser.avatar} className="w-full h-full object-cover" /> : currentUser.name[0]}
                  </div>
                  <div className="flex flex-col"><span className="text-[11px] font-black uppercase leading-none">{currentUser.name}</span><span className="text-[9px] font-black text-[#4f46e5]">฿{currentUser.balance.toLocaleString()}</span></div>
               </div>
             ) : (
               <button onClick={() => setShowAuth(true)} className="px-7 py-2.5 bg-[#4f46e5] text-white rounded-full text-[12px] font-black uppercase shadow-xl">{t.nav_login}</button>
             )}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        {renderContent()}
      </main>

      <div className="fixed bottom-12 right-12 z-[200]">
        <button onClick={() => document.getElementById('ai-chat')?.classList.toggle('hidden')} className="w-20 h-20 bg-slate-950 text-white rounded-[2rem] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all border-4 border-white/10 relative">
           <MessageCircle size={32}/>
        </button>
      </div>

      <div id="ai-chat" className="hidden fixed bottom-32 right-12 w-[400px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-slide-up z-[200]">
         <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
            <span className="font-black text-xs uppercase tracking-widest">Assistant</span>
            <button onClick={() => document.getElementById('ai-chat')?.classList.add('hidden')} className="p-2 hover:bg-white/10 rounded-xl"><X size={20}/></button>
         </div>
         <div className="flex-1 p-8 space-y-6 max-h-[400px] overflow-y-auto bg-slate-50/30">
            {chatHistory.map((m, i) => (
              <div key={i} className={`p-4 rounded-2xl shadow-sm ${m.role === 'user' ? 'bg-[#4f46e5] text-white ml-8' : 'bg-white border border-slate-100 mr-8'}`}>{m.text}</div>
            ))}
            {aiWorking && <div className="text-[10px] font-black text-[#4f46e5] animate-pulse uppercase">Thinking...</div>}
         </div>
         <div className="p-6 bg-white border-t border-slate-50 flex gap-4">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && chatWithAI()} placeholder="..." className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none"/>
            <button onClick={chatWithAI} className="w-14 h-14 bg-[#4f46e5] text-white rounded-2xl flex items-center justify-center hover:scale-105"><ArrowRight size={24}/></button>
         </div>
      </div>

      <AuthSystem show={showAuth} onClose={() => setShowAuth(false)} onAuth={handleAuth} onAdminTrigger={() => { setShowAuth(false); setShowAdminLogin(true); }} lang={lang} />
      <AdminLogin show={showAdminLogin} onClose={() => setShowAdminLogin(false)} onLogin={handleAdminAuth} />

      <div className="fixed top-24 right-12 z-[300] space-y-4">
        {notifications.map(n => (
          <div key={n.id} className="px-8 py-4 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-up">
            <Bell size={18} className="text-[#4f46e5]"/>
            <span className="text-[11px] font-black uppercase tracking-widest">{n.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
