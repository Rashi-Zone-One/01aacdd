
export type OrderStatus = 'รอชำระเงิน' | 'รอดำเนินการ' | 'กำลังผลิต' | 'เสร็จสิ้น' | 'ยกเลิก';

export interface Product {
  id: string;
  name: string;
  pricePerUnit: number;
  unit: string;
  category: 'Standard' | 'Premium' | 'Binding' | 'Bulk' | 'Advertising' | 'Service';
  description: string;
  spec?: string;
  icon?: string;
} 

export interface Coupon {
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
}

export interface Transaction {
  id: string;
  type: 'top-up' | 'spent' | 'reward' | 'refund' | 'referral';
  amount: number;
  date: string;
  description: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  distance: string;
  open: string;
  phone: string;
}

export interface Reward {
  id: string;
  name: string;
  points: number;
  image: string;
  category: string;
}

export interface Order {
  id: string;
  customer: string;
  items: string;
  price: number;
  status: OrderStatus;
  date: string;
  file?: string;
  points: number;
  config: {
    productId: string;
    quantity: number;
    paperTypeId: string;
    sizeId: string;
    bindingTypeId: string;
    color: 'bw' | 'color';
    isUrgent?: boolean;
    deliveryMethod: 'pickup' | 'delivery';
  };
  address?: string;
}

export type MembershipTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system';
  date: string;
  read: boolean;
}

export interface PaperStock {
  id: string;
  name: string;
  gsm: number;
  remaining: number;
  unit: string;
  status: 'available' | 'low' | 'out';
}

export interface User {
  uid: string;
  email?: string;
  name: string;
  phone: string;
  pin: string;
  avatar: string | null;
  points: number;
  balance: number;
  isAdmin?: boolean;
  tier: MembershipTier;
  role?: 'User' | 'VIP' | 'Admin';
  status?: 'active' | 'suspended' | 'banned';
  signupDate?: string;
  transactions: Transaction[];
  notifications: AppNotification[];
  referralCode?: string;
  totalOrders?: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

export type Page = 
  | 'landing' 
  | 'dashboard' 
  | 'history' 
  | 'admin-dashboard' 
  | 'order-flow' 
  | 'profile' 
  | 'top-up' 
  | 'branch-locator' 
  | 'loyalty-store' 
  | 'catalog'
  | 'referral'
  | 'notifications'
  | 'reviews'
  | 'order-status'
  | 'tax-invoice';
