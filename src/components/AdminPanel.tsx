import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { formatSom, formatUzbekDate } from '../utils/formatters';
import { Order, OrderStatus, Product, CategoryType, AppSettings } from '../types';
import { CATEGORIES_LIST } from '../data/initialData';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  ExternalLink,
  Send,
  LogOut,
  ChevronRight,
  BarChart3,
  Lock,
  Truck,
  Settings,
  FileText,
  KeyRound,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

type AdminTab = 
  | 'dashboard' 
  | 'orders' 
  | 'products' 
  | 'store-settings' 
  | 'delivery' 
  | 'home-texts' 
  | 'security' 
  | 'telegram';

export const AdminPanel: React.FC = () => {
  const {
    isAdminLoggedIn,
    adminUsername,
    adminLogin,
    adminLogout,
    changeAdminCredentials,
    orders,
    updateOrderStatus,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    settings,
    updateSettings,
    telegramConfig,
    updateTelegramConfig,
    sendTelegramTest,
    setActiveView,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Login form state
  const [loginUser, setLoginUser] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Orders tab state
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Product tab state
  const [productSearch, setProductSearch] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product modal form state
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<CategoryType>('Kurtkalar');
  const [prodPrice, setProdPrice] = useState(799000);
  const [prodOldPrice, setProdOldPrice] = useState<number | undefined>(999000);
  const [prodStock, setProdStock] = useState(15);
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodColors, setProdColors] = useState('Qora (#111111), Oq (#ffffff)');
  const [prodSizes, setProdSizes] = useState('S, M, L, XL');

  // Telegram form state
  const [botToken, setBotToken] = useState(telegramConfig.botToken);
  const [chatId, setChatId] = useState(telegramConfig.chatId);
  const [botEnabled, setBotEnabled] = useState(telegramConfig.enabled);

  // -----------------------------------------------------------
  // 1. STORE SETTINGS FORM STATE
  // -----------------------------------------------------------
  const [storeForm, setStoreForm] = useState(settings.storeInfo);
  const [isStoreDirty, setIsStoreDirty] = useState(false);

  useEffect(() => {
    setStoreForm(settings.storeInfo);
    setIsStoreDirty(false);
  }, [settings.storeInfo]);

  const handleStoreChange = (field: keyof typeof storeForm, value: string) => {
    setStoreForm((prev) => ({ ...prev, [field]: value }));
    setIsStoreDirty(true);
  };

  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeForm.name.trim()) {
      showToast("Do'kon nomi bo'sh bo'lishi mumkin emas", 'warning');
      return;
    }
    if (!storeForm.phone.trim()) {
      showToast("Telefon raqami kiritilishi shart", 'warning');
      return;
    }
    const success = await updateSettings({ storeInfo: storeForm });
    if (success) {
      setIsStoreDirty(false);
    }
  };

  // -----------------------------------------------------------
  // 2. DELIVERY SETTINGS FORM STATE
  // -----------------------------------------------------------
  const [deliveryForm, setDeliveryForm] = useState(settings.delivery);
  const [isDeliveryDirty, setIsDeliveryDirty] = useState(false);

  useEffect(() => {
    setDeliveryForm(settings.delivery);
    setIsDeliveryDirty(false);
  }, [settings.delivery]);

  const handleDeliveryNumberChange = (field: keyof typeof deliveryForm, value: string) => {
    const num = Math.max(0, Number(value) || 0);
    setDeliveryForm((prev) => ({ ...prev, [field]: num }));
    setIsDeliveryDirty(true);
  };

  const handleSaveDeliverySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryForm.freeDeliveryThreshold < 0) {
      showToast("Bepul yetkazib berish chegarasi manfiy bo'lishi mumkin emas", 'warning');
      return;
    }
    const success = await updateSettings({ delivery: deliveryForm });
    if (success) {
      setIsDeliveryDirty(false);
    }
  };

  // -----------------------------------------------------------
  // 3. HOMEPAGE & TEXTS FORM STATE
  // -----------------------------------------------------------
  const [homeTextsForm, setHomeTextsForm] = useState(settings.homeTexts);
  const [isHomeTextsDirty, setIsHomeTextsDirty] = useState(false);

  useEffect(() => {
    setHomeTextsForm(settings.homeTexts);
    setIsHomeTextsDirty(false);
  }, [settings.homeTexts]);

  const handleHomeTextChange = (field: keyof typeof homeTextsForm, value: string) => {
    setHomeTextsForm((prev) => ({ ...prev, [field]: value }));
    setIsHomeTextsDirty(true);
  };

  const handleSaveHomeTexts = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateSettings({ homeTexts: homeTextsForm });
    if (success) {
      setIsHomeTextsDirty(false);
    }
  };

  // -----------------------------------------------------------
  // 4. SECURITY / CREDENTIALS CHANGE STATE
  // -----------------------------------------------------------
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(adminUsername || 'admin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [securityMessage, setSecurityMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangeCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage(null);

    if (!currentPassword) {
      setSecurityMessage({ type: 'error', text: "Iltimos, amaldagi joriy parolingizni kiriting" });
      return;
    }

    if (!newUsername.trim() || newUsername.trim().length < 3) {
      setSecurityMessage({ type: 'error', text: "Yangi login kamida 3 ta belgidan iborat bo'lishi lozim" });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setSecurityMessage({ type: 'error', text: "Yangi parol kamida 6 ta belgidan iborat bo'lishi lozim" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityMessage({ type: 'error', text: "Yangi parol va uning tasdig'i bir-biriga mos kelmadi" });
      return;
    }

    try {
      setIsChangingPass(true);
      const res = await changeAdminCredentials({
        currentPassword,
        newUsername: newUsername.trim(),
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        setSecurityMessage({ type: 'success', text: "Login va parol muvaffaqiyatli saqlandi va yangilandi!" });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setSecurityMessage({ type: 'error', text: res.message || "Xatolik yuz berdi" });
      }
    } catch (err: any) {
      setSecurityMessage({ type: 'error', text: err.message || "Parolni yangilashda xatolik yuz berdi" });
    } finally {
      setIsChangingPass(false);
    }
  };

  // -----------------------------------------------------------
  // DASHBOARD CALCULATIONS
  // -----------------------------------------------------------
  const totalOrders = orders.length;
  const newOrders = orders.filter((o) => o.status === 'Yangi').length;
  const confirmedOrders = orders.filter((o) => o.status === 'Tasdiqlandi').length;
  const inDeliveryOrders = orders.filter((o) => o.status === 'Yetkazilmoqda').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Yetkazib berildi').length;
  const cancelledOrders = orders.filter((o) => o.status === 'Bekor qilindi').length;

  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== 'Bekor qilindi')
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const totalStock = useMemo(() => {
    return products.reduce((sum, p) => sum + p.inStock, 0);
  }, [products]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
        return false;
      }
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase().trim();
        const matchNum = o.orderNumber.toLowerCase().includes(q);
        const matchName = o.customerName.toLowerCase().includes(q);
        const matchPhone = o.phone.toLowerCase().includes(q);
        if (!matchNum && !matchName && !matchPhone) return false;
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  // Product modal handlers
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('Kurtkalar');
    setProdPrice(500000);
    setProdOldPrice(undefined);
    setProdStock(10);
    setProdDescription('');
    setProdImage('https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80');
    setProdColors('Qora (#111111), To\'q ko\'k (#1B263B)');
    setProdSizes('S, M, L, XL');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdCategory(product.category);
    setProdPrice(product.price);
    setProdOldPrice(product.oldPrice);
    setProdStock(product.inStock);
    setProdDescription(product.description);
    setProdImage(product.images[0] || '');
    setProdColors(product.colors.map((c) => `${c.name} (${c.hex})`).join(', '));
    setProdSizes(product.sizes.join(', '));
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedColors = prodColors.split(',').map((item) => {
      const match = item.match(/(.+)\((#.+)\)/);
      if (match) {
        return { name: match[1].trim(), hex: match[2].trim() };
      }
      return { name: item.trim(), hex: '#111111' };
    });
    const parsedSizes = prodSizes.split(',').map((s) => s.trim()).filter(Boolean);
    const catNameUz = CATEGORIES_LIST.find((c) => c.id === prodCategory)?.name || prodCategory;

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: prodName,
        category: prodCategory,
        categoryNameUz: catNameUz,
        price: Number(prodPrice),
        oldPrice: prodOldPrice ? Number(prodOldPrice) : undefined,
        inStock: Number(prodStock),
        description: prodDescription,
        images: [prodImage, ...(editingProduct.images.slice(1) || [])],
        colors: parsedColors,
        sizes: parsedSizes,
      });
    } else {
      await addProduct({
        name: prodName,
        slug: prodName.toLowerCase().replace(/\s+/g, '-'),
        description: prodDescription,
        category: prodCategory,
        categoryNameUz: catNameUz,
        price: Number(prodPrice),
        oldPrice: prodOldPrice ? Number(prodOldPrice) : undefined,
        inStock: Number(prodStock),
        rating: 5.0,
        reviewsCount: 1,
        images: [prodImage],
        colors: parsedColors,
        sizes: parsedSizes,
        isActive: true,
        details: {
          fabric: "Premium paxta va sintetik astar",
          care: "Mashinada nozik yuvish yoki quruq tozalash",
          origin: "SHU BREND kolleksiyasi",
        },
      });
    }
    setIsProductModalOpen(false);
  };

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    await adminLogin(loginUser, loginPassword);
    setIsLoggingIn(false);
  };

  // -----------------------------------------------------------
  // IF NOT LOGGED IN: SECURE LOGIN SCREEN
  // -----------------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#F5F0E8]">
        <div className="w-full max-w-md bg-[#EDE2D0] rounded-3xl p-8 border border-[#DECDB7] shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#111111] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Lock size={32} />
          </div>
          <div>
            <h2 className="font-brand-logo text-2xl font-bold tracking-wider text-[#111111]">
              {settings.storeInfo.name} ADMIN
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Do'kon boshqaruv markaziga xavfsiz kirish
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Administrator Logini:
              </label>
              <input
                type="text"
                required
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="Masalan: admin"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Admin Paroli:
              </label>
              <input
                type="password"
                required
                placeholder="Parolni kiriting"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] font-mono tracking-widest text-sm focus:outline-hidden focus:ring-2 focus:ring-[#111111]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 rounded-xl bg-[#111111] text-white font-bold text-sm hover:bg-black transition-all shadow-md cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoggingIn ? "Tekshirilmoqda..." : "Tizimga kirish"}
            </button>
          </form>

          <div className="p-3.5 rounded-xl bg-[#E4D5BF] text-[11px] text-stone-700 text-left border border-[#D5C4AC] space-y-1">
            <p className="font-bold text-stone-900">Birlamchi ma'lumotlar:</p>
            <p>Login: <code className="font-mono font-bold text-stone-950">admin</code></p>
            <p>Parol: <code className="font-mono font-bold text-stone-950">shubrend2026</code> yoki <code className="font-mono font-bold text-stone-950">7777</code></p>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -----------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F5F0E8] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="bg-[#EFE6D6] rounded-2xl p-4 sm:p-6 border border-[#DECDB7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#111111] text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-brand-logo text-xl sm:text-2xl font-bold tracking-wider text-[#111111]">
                  {settings.storeInfo.name}
                </h1>
                <span className="text-[10px] bg-emerald-800 text-white font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Admin: {adminUsername}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Boshqaruv tizimi • Bugun: <strong>{new Date().toLocaleDateString('uz-UZ')}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => setActiveView('home')}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#E3D4C0] hover:bg-[#D5C5AE] text-stone-900 text-xs font-semibold transition-colors cursor-pointer"
            >
              Do'konga o'tish
            </button>
            <button
              onClick={adminLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Chiqish</span>
            </button>
          </div>
        </div>

        {/* Admin Layout: Sidebar + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Navigation Sidebar (3 cols) */}
          <div className="lg:col-span-3 bg-[#EFE6D6] p-3 rounded-2xl border border-[#DECDB7] space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-stone-800 hover:bg-[#E5D7C3]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 size={18} />
                <span>Boshqaruv paneli</span>
              </div>
              <ChevronRight size={14} />
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-stone-800 hover:bg-[#E5D7C3]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} />
                <span>Buyurtmalar</span>
              </div>
              {newOrders > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                  {newOrders} yangi
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-stone-800 hover:bg-[#E5D7C3]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package size={18} />
                <span>Mahsulotlar</span>
              </div>
              <span className="text-[10px] text-stone-500 font-semibold">
                {products.length} ta
              </span>
            </button>

            <div className="pt-2 pb-1 border-t border-[#DECDB7]/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-3 block">
                Do'kon sozlamalari
              </span>
            </div>

            {/* TAB: STORE INFO */}
            <button
              onClick={() => setActiveTab('store-settings')}
              className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'store-settings'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-stone-800 hover:bg-[#E5D7C3]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings size={18} className="text-[#9E7B4F]" />
                <span>Do'kon sozlamalari</span>
              </div>
              {isStoreDirty && <span className="w-2 h-2 rounded-full bg-amber-500" />}
            </button>

            {/* TAB: DELIVERY & FREIGHT */}
            <button
              onClick={() => setActiveTab('delivery')}
              className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'delivery'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-stone-800 hover:bg-[#E5D7C3]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck size={18} className="text-emerald-700" />
                <span>Yetkazib berish</span>
              </div>
              {isDeliveryDirty && <span className="w-2 h-2 rounded-full bg-amber-500" />}
            </button>

            {/* TAB: HOMEPAGE & TEXTS */}
            <button
              onClick={() => setActiveTab('home-texts')}
              className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'home-texts'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-stone-800 hover:bg-[#E5D7C3]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText size={18} className="text-stone-700" />
                <span>Bosh sahifa va matnlar</span>
              </div>
              {isHomeTextsDirty && <span className="w-2 h-2 rounded-full bg-amber-500" />}
            </button>

            {/* TAB: SECURITY & CREDENTIALS */}
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-stone-800 hover:bg-[#E5D7C3]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <KeyRound size={18} className="text-purple-700" />
                <span>Xavfsizlik va kirish</span>
              </div>
              <ChevronRight size={14} />
            </button>

            {/* TAB: TELEGRAM */}
            <button
              onClick={() => setActiveTab('telegram')}
              className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'telegram'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-stone-800 hover:bg-[#E5D7C3]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Send size={18} className="text-sky-600" />
                <span>Telegram bildirishnoma</span>
              </div>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Main Tab Area (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* ========================================================= */}
            {/* TAB 1: DASHBOARD */}
            {/* ========================================================= */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-2xl bg-[#EDE2D0] border border-[#DDCFBA]">
                    <span className="text-[11px] font-bold text-stone-600 block">Jami buyurtmalar</span>
                    <span className="text-2xl font-extrabold text-[#111111] mt-1 block">
                      {totalOrders}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <span className="text-[11px] font-bold text-amber-800 block">Yangi buyurtmalar</span>
                    <span className="text-2xl font-extrabold text-amber-900 mt-1 block">
                      {newOrders}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                    <span className="text-[11px] font-bold text-blue-800 block">Tasdiqlangan</span>
                    <span className="text-2xl font-extrabold text-blue-900 mt-1 block">
                      {confirmedOrders}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                    <span className="text-[11px] font-bold text-purple-800 block">Yetkazilmoqda</span>
                    <span className="text-2xl font-extrabold text-purple-900 mt-1 block">
                      {inDeliveryOrders}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-800 block">Yetkazilgan</span>
                    <span className="text-2xl font-extrabold text-emerald-900 mt-1 block">
                      {deliveredOrders}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                    <span className="text-[11px] font-bold text-rose-800 block">Bekor qilingan</span>
                    <span className="text-2xl font-extrabold text-rose-900 mt-1 block">
                      {cancelledOrders}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#EDE2D0] border border-[#DDCFBA] col-span-2 sm:col-span-2">
                    <span className="text-[11px] font-bold text-stone-600 block">Jami savdo summasi</span>
                    <span className="text-2xl font-extrabold text-emerald-900 mt-1 block">
                      {formatSom(totalRevenue)}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Ombordagi qoldiq: {totalStock} dona mahsulot
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Sales trend graphic */}
                  <div className="md:col-span-7 bg-[#EDE2D0] p-5 rounded-2xl border border-[#DDCFBA]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif-brand font-bold text-sm text-stone-900">
                        Savdo statistikasi tendensiyasi
                      </h3>
                      <span className="text-[10px] bg-[#DFD0BC] px-2.5 py-1 rounded-md font-bold text-stone-700">
                        Haftalik tahlil
                      </span>
                    </div>

                    <div className="h-44 w-full flex items-end">
                      <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#9E7B4F" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#9E7B4F" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <line x1="0" y1="30" x2="400" y2="30" stroke="#DFD1BE" strokeDasharray="3 3" />
                        <line x1="0" y1="75" x2="400" y2="75" stroke="#DFD1BE" strokeDasharray="3 3" />
                        <line x1="0" y1="120" x2="400" y2="120" stroke="#DFD1BE" strokeDasharray="3 3" />
                        <path
                          d="M 10 130 Q 70 110 120 70 T 220 50 T 310 90 T 390 20 L 390 140 L 10 140 Z"
                          fill="url(#chartGradient)"
                        />
                        <path
                          d="M 10 130 Q 70 110 120 70 T 220 50 T 310 90 T 390 20"
                          fill="none"
                          stroke="#111111"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <circle cx="120" cy="70" r="4" fill="#9E7B4F" />
                        <circle cx="220" cy="50" r="4" fill="#9E7B4F" />
                        <circle cx="310" cy="90" r="4" fill="#9E7B4F" />
                        <circle cx="390" cy="20" r="5" fill="#111111" />
                      </svg>
                    </div>
                    <div className="flex justify-between text-[10px] text-stone-500 pt-2 border-t border-[#D5C5B0] mt-2">
                      <span>Dushanba</span>
                      <span>Chorshanba</span>
                      <span>Juma</span>
                      <span>Yakshanba</span>
                    </div>
                  </div>

                  {/* Top Sold Products */}
                  <div className="md:col-span-5 bg-[#EDE2D0] p-5 rounded-2xl border border-[#DDCFBA]">
                    <h3 className="font-serif-brand font-bold text-sm text-stone-900 mb-3">
                      Eng ko'p sotilgan mahsulotlar
                    </h3>
                    <div className="space-y-3">
                      {products.slice(0, 4).map((p, idx) => (
                        <div key={p.id} className="flex items-center gap-3 text-xs">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg bg-stone-300 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-stone-900 truncate">{p.name}</p>
                            <p className="text-[10px] text-stone-600">{formatSom(p.price)}</p>
                          </div>
                          <span className="font-bold text-stone-900 bg-[#DFD1BE] px-2 py-1 rounded-md text-[11px]">
                            {120 - idx * 25} ta
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: ORDERS MANAGEMENT */}
            {/* ========================================================= */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="bg-[#EDE2D0] p-4 rounded-2xl border border-[#DDCFBA] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {['all', 'Yangi', 'Tasdiqlandi', 'Yetkazilmoqda', 'Yetkazib berildi', 'Bekor qilindi'].map(
                      (st) => (
                        <button
                          key={st}
                          onClick={() => setOrderStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                            orderStatusFilter === st
                              ? 'bg-[#111111] text-white shadow-xs'
                              : 'bg-[#DFD1BE] text-stone-800 hover:bg-[#D5C5AE]'
                          }`}
                        >
                          {st === 'all' ? 'Barchasi' : st}
                        </button>
                      )
                    )}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search size={16} className="absolute left-3 top-2.5 text-stone-500" />
                    <input
                      type="text"
                      placeholder="Buyurtma yoki telefon..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] text-xs focus:ring-2 focus:ring-[#111111]"
                    />
                  </div>
                </div>

                <div className="bg-[#EDE2D0] rounded-2xl border border-[#DDCFBA] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#DFD1BE] text-stone-900 font-bold border-b border-[#D5C5B0]">
                          <th className="p-3">Raqami & Sana</th>
                          <th className="p-3">Mijoz & Telefon</th>
                          <th className="p-3">Manzil</th>
                          <th className="p-3">Summa</th>
                          <th className="p-3">Holat</th>
                          <th className="p-3 text-right">Amallar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2D5C3]">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-stone-500">
                              Buyurtmalar topilmadi.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((ord) => (
                            <tr key={ord.id} className="hover:bg-[#E5D7C3] transition-colors">
                              <td className="p-3">
                                <span className="font-bold text-stone-950 block">
                                  {ord.orderNumber}
                                </span>
                                <span className="text-[10px] text-stone-500">
                                  {formatUzbekDate(ord.createdAt)}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="font-bold text-stone-900 block">
                                  {ord.customerName}
                                </span>
                                <span className="text-[11px] text-stone-600 font-mono">
                                  {ord.phone}
                                </span>
                              </td>
                              <td className="p-3 max-w-[180px] truncate text-stone-700">
                                {ord.region}, {ord.city}
                              </td>
                              <td className="p-3 font-bold text-[#111111]">
                                {formatSom(ord.total)}
                              </td>
                              <td className="p-3">
                                <select
                                  value={ord.status}
                                  onChange={(e) =>
                                    updateOrderStatus(ord.id, e.target.value as OrderStatus)
                                  }
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                                    ord.status === 'Yangi'
                                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                                      : ord.status === 'Tasdiqlandi'
                                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                                      : ord.status === 'Yetkazilmoqda'
                                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                                      : ord.status === 'Yetkazib berildi'
                                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                      : 'bg-rose-100 text-rose-900 border-rose-300'
                                  }`}
                                >
                                  <option value="Yangi">Yangi</option>
                                  <option value="Tasdiqlandi">Tasdiqlandi</option>
                                  <option value="Tayyorlanmoqda">Tayyorlanmoqda</option>
                                  <option value="Yetkazilmoqda">Yetkazilmoqda</option>
                                  <option value="Yetkazib berildi">Yetkazib berildi</option>
                                  <option value="Bekor qilindi">Bekor qilindi</option>
                                </select>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => setSelectedOrderDetails(ord)}
                                  className="px-3 py-1 rounded-lg bg-[#111111] text-white text-[11px] font-semibold hover:bg-black transition-colors cursor-pointer"
                                >
                                  Tafsilot
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: PRODUCTS MANAGEMENT */}
            {/* ========================================================= */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="bg-[#EDE2D0] p-4 rounded-2xl border border-[#DDCFBA] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={openNewProductModal}
                      className="px-4 py-2 rounded-xl bg-[#111111] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-black transition-all cursor-pointer shadow-xs"
                    >
                      <Plus size={16} />
                      <span>Yangi mahsulot</span>
                    </button>
                    <span className="text-xs text-stone-600 font-medium">
                      Jami: {products.length} ta
                    </span>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search size={16} className="absolute left-3 top-2.5 text-stone-500" />
                    <input
                      type="text"
                      placeholder="Qidirish..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] text-xs focus:ring-2 focus:ring-[#111111]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products
                    .filter((p) =>
                      productSearch
                        ? p.name.toLowerCase().includes(productSearch.toLowerCase())
                        : true
                    )
                    .map((prod) => (
                      <div
                        key={prod.id}
                        className="p-4 rounded-2xl bg-[#EDE2D0] border border-[#DDCFBA] flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-16 h-18 object-cover rounded-xl bg-stone-300 shrink-0"
                          />
                          <div className="flex-1 min-w-0 text-xs">
                            <span className="text-[10px] uppercase font-bold text-stone-500">
                              {prod.categoryNameUz}
                            </span>
                            <h4 className="font-bold text-stone-900 truncate">{prod.name}</h4>
                            <p className="font-extrabold text-[#111111] mt-0.5">
                              {formatSom(prod.price)}
                            </p>
                            <p className="text-[11px] text-stone-600">
                              Qoldiq: <strong className="text-stone-900">{prod.inStock} dona</strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#D5C5B0] text-xs">
                          <button
                            onClick={() => toggleProductStatus(prod.id)}
                            className={`flex items-center gap-1 font-semibold cursor-pointer ${
                              prod.isActive ? 'text-emerald-800' : 'text-stone-500'
                            }`}
                          >
                            {prod.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                            <span>{prod.isActive ? 'Faol' : 'Yashirilgan'}</span>
                          </button>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEditProductModal(prod)}
                              className="p-1.5 rounded-lg bg-[#E0D2C0] hover:bg-[#D5C5AE] text-stone-800 cursor-pointer"
                              title="Tahrirlash"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`"${prod.name}" mahsulotini o'chirmoqchimisiz?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 cursor-pointer"
                              title="O'chirish"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 4: STORE SETTINGS (DO'KON SOZLAMALARI) */}
            {/* ========================================================= */}
            {activeTab === 'store-settings' && (
              <div className="bg-[#EDE2D0] p-6 rounded-2xl border border-[#DDCFBA] space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#DECDB7]">
                  <div>
                    <h3 className="font-serif-brand text-lg font-bold text-stone-900 flex items-center gap-2">
                      <Settings size={20} className="text-[#9E7B4F]" />
                      <span>Do'kon asosiy sozlamalari</span>
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Do'kon nomi, telefon raqamlari, manzil va ijtimoiy tarmoqlar havolalari
                    </p>
                  </div>

                  {isStoreDirty && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold">
                      <AlertTriangle size={13} className="text-amber-700" />
                      <span>Saqlanmagan o'zgarishlar mavjud</span>
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveStoreSettings} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Do'kon nomi */}
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        Do'kon nomi <span className="text-red-600">*</span>:
                      </label>
                      <input
                        type="text"
                        required
                        value={storeForm.name}
                        onChange={(e) => handleStoreChange('name', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] font-bold text-stone-900 focus:ring-2 focus:ring-[#111111]"
                      />
                    </div>

                    {/* Shior / Tagline */}
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        Shior yoki qo'shimcha nom:
                      </label>
                      <input
                        type="text"
                        value={storeForm.tagline}
                        onChange={(e) => handleStoreChange('tagline', e.target.value)}
                        placeholder="Erkaklar kiyimlari"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] focus:ring-2 focus:ring-[#111111]"
                      />
                    </div>

                    {/* Asosiy Telefon raqami */}
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        Asosiy telefon raqami <span className="text-red-600">*</span>:
                      </label>
                      <input
                        type="text"
                        required
                        value={storeForm.phone}
                        onChange={(e) => handleStoreChange('phone', e.target.value)}
                        placeholder="+998 (90) 123-45-67"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] font-mono focus:ring-2 focus:ring-[#111111]"
                      />
                    </div>

                    {/* Qo'shimcha telefon raqami */}
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        Qo'shimcha telefon raqami (ixtiyoriy):
                      </label>
                      <input
                        type="text"
                        value={storeForm.secondaryPhone || ''}
                        onChange={(e) => handleStoreChange('secondaryPhone', e.target.value)}
                        placeholder="+998 (93) 456-78-90"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] font-mono focus:ring-2 focus:ring-[#111111]"
                      />
                    </div>

                    {/* Shahar / Hudud */}
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        Shahar / Hudud:
                      </label>
                      <input
                        type="text"
                        value={storeForm.city}
                        onChange={(e) => handleStoreChange('city', e.target.value)}
                        placeholder="Toshkent shahri"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] focus:ring-2 focus:ring-[#111111]"
                      />
                    </div>

                    {/* To'liq manzil */}
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        To'liq do'kon manzili:
                      </label>
                      <input
                        type="text"
                        value={storeForm.address}
                        onChange={(e) => handleStoreChange('address', e.target.value)}
                        placeholder="Amir Temur shoh ko'chasi, 45-uy"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] focus:ring-2 focus:ring-[#111111]"
                      />
                    </div>

                    {/* Xarita havolasi */}
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-stone-800 mb-1 flex items-center justify-between">
                        <span>Xarita havolasi (Yandex / Google Maps):</span>
                        {storeForm.mapUrl && (
                          <a
                            href={storeForm.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#9E7B4F] hover:underline inline-flex items-center gap-1 font-normal"
                          >
                            <span>Xaritada sinab ko'rish</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </label>
                      <input
                        type="url"
                        value={storeForm.mapUrl || ''}
                        onChange={(e) => handleStoreChange('mapUrl', e.target.value)}
                        placeholder="https://yandex.uz/maps/-/..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] text-xs focus:ring-2 focus:ring-[#111111]"
                      />
                    </div>

                    {/* Telegram manzili */}
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        Telegram foydalanuvchi nomi (@...):
                      </label>
                      <input
                        type="text"
                        value={storeForm.telegramUsername}
                        onChange={(e) => handleStoreChange('telegramUsername', e.target.value)}
                        placeholder="@shubrend_official"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] font-mono focus:ring-2 focus:ring-[#111111]"
                      />
                    </div>

                    {/* Instagram manzili */}
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        Instagram akkaunt nomi (@...):
                      </label>
                      <input
                        type="text"
                        value={storeForm.instagramUsername}
                        onChange={(e) => handleStoreChange('instagramUsername', e.target.value)}
                        placeholder="@shubrend.uz"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] font-mono focus:ring-2 focus:ring-[#111111]"
                      />
                    </div>

                    {/* Ish vaqti */}
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        Ish vaqti:
                      </label>
                      <input
                        type="text"
                        value={storeForm.workingHours}
                        onChange={(e) => handleStoreChange('workingHours', e.target.value)}
                        placeholder="Har kuni: 10:00 — 22:00"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] focus:ring-2 focus:ring-[#111111]"
                      />
                    </div>

                    {/* Qo'ng'iroq izohi */}
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        Qo'llab-quvvatlash eslatmasi:
                      </label>
                      <input
                        type="text"
                        value={storeForm.contactNote}
                        onChange={(e) => handleStoreChange('contactNote', e.target.value)}
                        placeholder="Qo'ng'iroqlarga har kuni javob beramiz"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] focus:ring-2 focus:ring-[#111111]"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#DECDB7] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setStoreForm(settings.storeInfo);
                        setIsStoreDirty(false);
                      }}
                      disabled={!isStoreDirty}
                      className="px-4 py-2.5 rounded-xl border border-[#D5C5B0] text-stone-700 hover:bg-[#E5D7C3] disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      <RotateCcw size={14} />
                      <span>Bekor qilish</span>
                    </button>

                    <button
                      type="submit"
                      className="px-7 py-3 rounded-xl bg-[#111111] text-white font-bold text-xs sm:text-sm hover:bg-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Check size={16} />
                      <span>Saqlash</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 5: DELIVERY SETTINGS (YETKAZIB BERISH VA YO'LKIRA) */}
            {/* ========================================================= */}
            {activeTab === 'delivery' && (
              <div className="bg-[#EDE2D0] p-6 rounded-2xl border border-[#DDCFBA] space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#DECDB7]">
                  <div>
                    <h3 className="font-serif-brand text-lg font-bold text-stone-900 flex items-center gap-2">
                      <Truck size={20} className="text-emerald-700" />
                      <span>Yetkazib berish va yo'lkira narxlari</span>
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Hududlar bo'yicha narxlar, bepul yetkazib berish chegarasi va minimal xarid summasi
                    </p>
                  </div>

                  {isDeliveryDirty && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold">
                      <AlertTriangle size={13} className="text-amber-700" />
                      <span>Saqlanmagan o'zgarishlar</span>
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveDeliverySettings} className="space-y-5 text-xs sm:text-sm">
                  {/* Delivery Enabled toggle */}
                  <div className="p-4 rounded-xl bg-[#F5F0E8] border border-[#D5C5B0] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-stone-900 text-sm">Yetkazib berish xizmati holati</p>
                      <p className="text-xs text-stone-600">
                        {deliveryForm.isDeliveryEnabled ? "Faol (Buyurtmalarda yo'lkira hisoblanadi)" : "Vaqtincha to'xtatilgan (Faqat o'zi olib ketish)"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryForm((prev) => ({ ...prev, isDeliveryEnabled: !prev.isDeliveryEnabled }));
                        setIsDeliveryDirty(true);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        deliveryForm.isDeliveryEnabled
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-stone-300 text-stone-700'
                      }`}
                    >
                      {deliveryForm.isDeliveryEnabled ? "Xizmat Yoqilgan" : "O'chirilgan"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Toshkent shahri */}
                    <div className="p-4 rounded-xl bg-[#F5F0E8] border border-[#D5C5B0]">
                      <label className="block font-bold text-stone-900 mb-1">
                        Toshkent shahri narxi (so'm):
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        required
                        value={deliveryForm.tashkentCityPrice}
                        onChange={(e) => handleDeliveryNumberChange('tashkentCityPrice', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#D5C5B0] bg-white font-mono font-bold text-stone-900 focus:ring-2 focus:ring-[#111111]"
                      />
                      <span className="text-[11px] text-stone-500 mt-1 block">
                        Joriy: {formatSom(deliveryForm.tashkentCityPrice)}
                      </span>
                    </div>

                    {/* Toshkent viloyati */}
                    <div className="p-4 rounded-xl bg-[#F5F0E8] border border-[#D5C5B0]">
                      <label className="block font-bold text-stone-900 mb-1">
                        Toshkent viloyati narxi (so'm):
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        required
                        value={deliveryForm.tashkentRegionPrice}
                        onChange={(e) => handleDeliveryNumberChange('tashkentRegionPrice', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#D5C5B0] bg-white font-mono font-bold text-stone-900 focus:ring-2 focus:ring-[#111111]"
                      />
                      <span className="text-[11px] text-stone-500 mt-1 block">
                        Joriy: {formatSom(deliveryForm.tashkentRegionPrice)}
                      </span>
                    </div>

                    {/* Boshqa viloyatlar */}
                    <div className="p-4 rounded-xl bg-[#F5F0E8] border border-[#D5C5B0]">
                      <label className="block font-bold text-stone-900 mb-1">
                        Boshqa viloyatlar narxi (so'm):
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        required
                        value={deliveryForm.otherRegionsPrice}
                        onChange={(e) => handleDeliveryNumberChange('otherRegionsPrice', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#D5C5B0] bg-white font-mono font-bold text-stone-900 focus:ring-2 focus:ring-[#111111]"
                      />
                      <span className="text-[11px] text-stone-500 mt-1 block">
                        Joriy: {formatSom(deliveryForm.otherRegionsPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Bepul yetkazib berish chegarasi */}
                    <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-300">
                      <label className="block font-bold text-emerald-950 mb-1">
                        Bepul yetkazib berish chegarasi (so'm):
                      </label>
                      <p className="text-[11px] text-emerald-800 mb-2">
                        Buyurtma summasi shu chegaradan oshganda yetkazib berish avtomatik <strong>BEPUL (0 so'm)</strong> bo'ladi.
                      </p>
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        required
                        value={deliveryForm.freeDeliveryThreshold}
                        onChange={(e) => handleDeliveryNumberChange('freeDeliveryThreshold', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-400 bg-white font-mono font-extrabold text-base text-emerald-900 focus:ring-2 focus:ring-emerald-800"
                      />
                      <span className="text-xs font-bold text-emerald-900 mt-1 block">
                        Ko'rinishi: {formatSom(deliveryForm.freeDeliveryThreshold)}
                      </span>
                    </div>

                    {/* Minimal buyurtma summasi */}
                    <div className="p-4 rounded-xl bg-[#F5F0E8] border border-[#D5C5B0]">
                      <label className="block font-bold text-stone-900 mb-1">
                        Minimal buyurtma summasi (so'm):
                      </label>
                      <p className="text-[11px] text-stone-600 mb-2">
                        0 qoldirilsa cheklov o'chiriladi. Masalan 50 000 so'm qilib qo'yishingiz mumkin.
                      </p>
                      <input
                        type="number"
                        min="0"
                        step="5000"
                        required
                        value={deliveryForm.minOrderAmount}
                        onChange={(e) => handleDeliveryNumberChange('minOrderAmount', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-white font-mono font-bold text-stone-900 focus:ring-2 focus:ring-[#111111]"
                      />
                      <span className="text-xs text-stone-600 mt-1 block">
                        {deliveryForm.minOrderAmount > 0 ? formatSom(deliveryForm.minOrderAmount) : "Cheklov yo'q (0 so'm)"}
                      </span>
                    </div>
                  </div>

                  {/* Yetkazib berish haqida izoh matni */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Mijozlarga ko'rsatiladigan yetkazib berish izohi:
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryForm.deliveryNotice}
                      onChange={(e) => {
                        setDeliveryForm((prev) => ({ ...prev, deliveryNotice: e.target.value }));
                        setIsDeliveryDirty(true);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] focus:ring-2 focus:ring-[#111111]"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#DECDB7] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryForm(settings.delivery);
                        setIsDeliveryDirty(false);
                      }}
                      disabled={!isDeliveryDirty}
                      className="px-4 py-2.5 rounded-xl border border-[#D5C5B0] text-stone-700 hover:bg-[#E5D7C3] disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      <RotateCcw size={14} />
                      <span>Bekor qilish</span>
                    </button>

                    <button
                      type="submit"
                      className="px-7 py-3 rounded-xl bg-[#111111] text-white font-bold text-xs sm:text-sm hover:bg-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Check size={16} />
                      <span>Yetkazib berish sozlamalarini saqlash</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 6: HOMEPAGE & TEXTS (BOSH SAHIFA VA MATNLAR) */}
            {/* ========================================================= */}
            {activeTab === 'home-texts' && (
              <div className="bg-[#EDE2D0] p-6 rounded-2xl border border-[#DDCFBA] space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#DECDB7]">
                  <div>
                    <h3 className="font-serif-brand text-lg font-bold text-stone-900 flex items-center gap-2">
                      <FileText size={20} className="text-stone-800" />
                      <span>Bosh sahifadagi matnlar va rasm</span>
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Sayt bosh sahifasidagi asosiy sarlavha, banner matnlari va rasmi
                    </p>
                  </div>

                  {isHomeTextsDirty && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold">
                      <AlertTriangle size={13} className="text-amber-700" />
                      <span>Saqlanmagan o'zgarishlar</span>
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveHomeTexts} className="space-y-4 text-xs sm:text-sm">
                  {/* Top announcement */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Yuqori qora tasmadagi e'lon matni:
                    </label>
                    <input
                      type="text"
                      value={homeTextsForm.announcementBanner}
                      onChange={(e) => handleHomeTextChange('announcementBanner', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] focus:ring-2 focus:ring-[#111111]"
                    />
                    <p className="text-[10px] text-stone-500 mt-1">
                      Eslatma: <code className="font-mono bg-[#DFD0BC] px-1 rounded">{'{free_threshold}'}</code> yozuvi avtomatik bepul yetkazib berish summasiga aylanadi.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Banner Nishoni */}
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        Banner ustki nishoni (Badge):
                      </label>
                      <input
                        type="text"
                        value={homeTextsForm.heroBadge}
                        onChange={(e) => handleHomeTextChange('heroBadge', e.target.value)}
                        placeholder="Yangi 2026 To'plami"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] focus:ring-2 focus:ring-[#111111]"
                      />
                    </div>

                    {/* Asosiy Sarlavha */}
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">
                        Bosh sahifadagi asosiy brend sarlavhasi:
                      </label>
                      <input
                        type="text"
                        value={homeTextsForm.heroTitle}
                        onChange={(e) => handleHomeTextChange('heroTitle', e.target.value)}
                        placeholder="SHU BREND"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] font-bold text-stone-900 focus:ring-2 focus:ring-[#111111]"
                      />
                    </div>
                  </div>

                  {/* Banner tag sarlavhasi */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Banner ostidagi ikkinchi sarlavha:
                    </label>
                    <input
                      type="text"
                      value={homeTextsForm.heroSubtitle}
                      onChange={(e) => handleHomeTextChange('heroSubtitle', e.target.value)}
                      placeholder="Zamonaviy erkaklar uchun sifatli va uslubiy kiyimlar"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] focus:ring-2 focus:ring-[#111111]"
                    />
                  </div>

                  {/* Banner izohi */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Bannerdagi tavsif matni:
                    </label>
                    <textarea
                      rows={3}
                      value={homeTextsForm.heroDescription}
                      onChange={(e) => handleHomeTextChange('heroDescription', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] focus:ring-2 focus:ring-[#111111]"
                    />
                  </div>

                  {/* Banner rasmi */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Banner rasmi havolasi (URL):
                    </label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="url"
                        value={homeTextsForm.heroImageUrl}
                        onChange={(e) => handleHomeTextChange('heroImageUrl', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] text-xs focus:ring-2 focus:ring-[#111111]"
                      />
                      {homeTextsForm.heroImageUrl && (
                        <img
                          src={homeTextsForm.heroImageUrl}
                          alt="Banner preview"
                          className="w-12 h-12 object-cover rounded-xl border border-[#D5C5B0] shrink-0"
                        />
                      )}
                    </div>
                  </div>

                  {/* Do'kon haqida footer matni */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Do'kon haqida matn (Footer):
                    </label>
                    <textarea
                      rows={2}
                      value={homeTextsForm.aboutText}
                      onChange={(e) => handleHomeTextChange('aboutText', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] focus:ring-2 focus:ring-[#111111]"
                    />
                  </div>

                  {/* Footer mualliflik matni */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Footer mualliflik huquqi qo'shimchasi:
                    </label>
                    <input
                      type="text"
                      value={homeTextsForm.footerText}
                      onChange={(e) => handleHomeTextChange('footerText', e.target.value)}
                      placeholder="Barcha huquqlar himoyalangan."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] focus:ring-2 focus:ring-[#111111]"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#DECDB7] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setHomeTextsForm(settings.homeTexts);
                        setIsHomeTextsDirty(false);
                      }}
                      disabled={!isHomeTextsDirty}
                      className="px-4 py-2.5 rounded-xl border border-[#D5C5B0] text-stone-700 hover:bg-[#E5D7C3] disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      <RotateCcw size={14} />
                      <span>Bekor qilish</span>
                    </button>

                    <button
                      type="submit"
                      className="px-7 py-3 rounded-xl bg-[#111111] text-white font-bold text-xs sm:text-sm hover:bg-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Check size={16} />
                      <span>Matnlarni saqlash</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 7: SECURITY & CREDENTIALS (XAVFSIZLIK VA KIRISH) */}
            {/* ========================================================= */}
            {activeTab === 'security' && (
              <div className="bg-[#EDE2D0] p-6 rounded-2xl border border-[#DDCFBA] space-y-6">
                <div className="pb-4 border-b border-[#DECDB7]">
                  <h3 className="font-serif-brand text-lg font-bold text-stone-900 flex items-center gap-2">
                    <KeyRound size={20} className="text-purple-700" />
                    <span>Xavfsizlik va kirish ma'lumotlarini o'zgartirish</span>
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Administrator login nomi va yangi parolini xavfsiz PBKDF2 shifrlash orqali yangilash
                  </p>
                </div>

                {securityMessage && (
                  <div
                    className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
                      securityMessage.type === 'success'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}
                  >
                    {securityMessage.type === 'success' ? (
                      <Check size={16} className="text-emerald-700 shrink-0" />
                    ) : (
                      <AlertTriangle size={16} className="text-rose-700 shrink-0" />
                    )}
                    <span className="font-medium">{securityMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleChangeCredentials} className="max-w-md space-y-4 text-xs sm:text-sm">
                  {/* Joriy parol */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Joriy parol <span className="text-red-600">*</span>:
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Amaldagi parolni kiriting"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] font-mono focus:ring-2 focus:ring-[#111111]"
                    />
                    <p className="text-[10px] text-stone-500 mt-1">
                      Xavfsizlik maqsadida o'zgarishdan oldin amaldagi parol tekshiriladi.
                    </p>
                  </div>

                  {/* Yangi Login */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Yangi login <span className="text-red-600">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] focus:ring-2 focus:ring-[#111111]"
                    />
                  </div>

                  {/* Yangi Parol */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Yangi parol (kamida 6 ta belgi) <span className="text-red-600">*</span>:
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Yangi mustahkam parol"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] font-mono focus:ring-2 focus:ring-[#111111]"
                    />
                  </div>

                  {/* Yangi Parolni Tasdiqlash */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Yangi parolni tasdiqlash <span className="text-red-600">*</span>:
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Yangi parolni qaytadan kiriting"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] font-mono focus:ring-2 focus:ring-[#111111]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isChangingPass}
                      className="w-full py-3 px-5 rounded-xl bg-[#111111] text-white font-bold text-xs sm:text-sm hover:bg-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Lock size={15} />
                      <span>{isChangingPass ? "Saqlanmoqda..." : "Yangi login va parolni saqlash"}</span>
                    </button>
                  </div>
                </form>

                <div className="p-4 rounded-xl bg-[#F5F0E8] border border-[#D5C5B0] text-xs text-stone-700 space-y-1.5">
                  <p className="font-bold text-stone-900">🛡 Xavfsizlik qoidalari:</p>
                  <p>• Parollar ochiq matnda saqlanmaydi, balki serverda 100 000 iteratsiyali PBKDF2 shifri orqali saqlanadi.</p>
                  <p>• Parol o'zgargandan keyin eski seanslar bekor qilinadi va yangi kiritilgan ma'lumotlar bilan tizimga kirish mumkin bo'ladi.</p>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 8: TELEGRAM NOTIFICATIONS */}
            {/* ========================================================= */}
            {activeTab === 'telegram' && (
              <div className="bg-[#EDE2D0] p-6 rounded-2xl border border-[#DDCFBA] space-y-6">
                <div>
                  <h3 className="font-serif-brand text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Send size={20} className="text-sky-600" />
                    <span>Telegram Bot orqali buyurtmalar xabardorligi</span>
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 max-w-xl">
                    Saytda yangi buyurtma qoldirilganda, barcha tafsilotlar administratorning shaxsiy Telegram botiga bir zumda kelib tushadi.
                  </p>
                </div>

                <div className="space-y-4 max-w-lg text-xs">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Telegram Bot Token:
                    </label>
                    <input
                      type="password"
                      placeholder="Masalan: 123456789:ABCdefGhIJKlmNoPQRstuVWXyz"
                      value={botToken}
                      onChange={(e) => setBotToken(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] font-mono text-xs focus:ring-2 focus:ring-[#111111]"
                    />
                    <p className="text-[10px] text-stone-500 mt-1">
                      Xavfsizlik: Bot tokeni backend serverida saqlanadi va brauzer konsolida oshkor etilmaydi.
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Administrator Chat ID:
                    </label>
                    <input
                      type="text"
                      placeholder="Masalan: 987654321"
                      value={chatId}
                      onChange={(e) => setChatId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] font-mono text-xs focus:ring-2 focus:ring-[#111111]"
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => updateTelegramConfig(botToken, chatId, botEnabled)}
                      className="px-5 py-2.5 rounded-xl bg-[#111111] text-white font-bold hover:bg-black transition-colors cursor-pointer"
                    >
                      Sozlamalarni saqlash
                    </button>
                    <button
                      onClick={sendTelegramTest}
                      className="px-5 py-2.5 rounded-xl bg-sky-700 text-white font-bold hover:bg-sky-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send size={14} />
                      <span>Test xabar yuborish</span>
                    </button>
                  </div>
                </div>

                {/* Example Message Preview */}
                <div className="p-4 rounded-xl bg-[#F5F0E8] border border-[#D5C5B0] max-w-lg text-xs font-mono space-y-1">
                  <p className="font-bold text-stone-900 font-sans">Telegram xabari namunasi:</p>
                  <p>🛍 <strong>YANGI BUYURTMA #SHU-2026-8841</strong></p>
                  <p>👤 <strong>Mijoz:</strong> Javohir Alimov</p>
                  <p>📞 <strong>Telefon:</strong> +998 90 123 45 67</p>
                  <p>📍 <strong>Manzil:</strong> Toshkent shahri, Yunusobod tumani</p>
                  <p>📦 <strong>Kiyimlar:</strong></p>
                  <p>1. Kurtka klassik (Qora / L) - 1 dona</p>
                  <p>2. Jins shim (To'q ko'k / 32) - 1 dona</p>
                  <p>💰 <strong>Jami summa:</strong> 1 198 000 so'm</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F5F0E8] rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#D5C4AC] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#D5C4AC] mb-4">
              <div>
                <h3 className="font-serif-brand text-xl font-bold text-stone-900">
                  Buyurtma {selectedOrderDetails.orderNumber}
                </h3>
                <p className="text-xs text-stone-500">
                  {formatUzbekDate(selectedOrderDetails.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 rounded-full hover:bg-[#E5D7C3] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-4 bg-[#EDE2D0] p-4 rounded-2xl">
                <div>
                  <span className="text-stone-500 text-xs block">Mijoz:</span>
                  <strong className="text-stone-900">{selectedOrderDetails.customerName}</strong>
                  <span className="text-stone-700 block font-mono">{selectedOrderDetails.phone}</span>
                </div>
                <div>
                  <span className="text-stone-500 text-xs block">Yetkazish manzili:</span>
                  <span className="text-stone-900 block font-semibold">
                    {selectedOrderDetails.region}, {selectedOrderDetails.city}
                  </span>
                  <span className="text-stone-700 block">{selectedOrderDetails.address}</span>
                  {selectedOrderDetails.yandexMapUrl && (
                    <a
                      href={selectedOrderDetails.yandexMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-700 hover:underline flex items-center gap-1 mt-1 font-bold"
                    >
                      <span>Yandex Xarita</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              {selectedOrderDetails.note && (
                <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
                  <strong>Mijoz izohi:</strong> {selectedOrderDetails.note}
                </div>
              )}

              <div>
                <h4 className="font-bold text-stone-900 mb-2">Buyurtma qilingan mahsulotlar:</h4>
                <div className="space-y-2">
                  {selectedOrderDetails.items.map((i, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#EDE2D0] border border-[#D5C5B0]"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={i.image}
                          alt=""
                          className="w-10 h-12 object-cover rounded-lg bg-stone-300"
                        />
                        <div>
                          <p className="font-bold text-stone-900">{i.name}</p>
                          <p className="text-xs text-stone-600">
                            Rang: {i.colorName} • O'lcham: {i.size} • {i.quantity} dona
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-stone-950">
                        {formatSom(i.price * i.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#D5C5B0] pt-3 flex justify-between items-baseline">
                <span className="font-bold text-stone-800">Jami to'lov:</span>
                <span className="text-lg font-extrabold text-[#111111]">
                  {formatSom(selectedOrderDetails.total)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-6 py-2.5 rounded-xl bg-[#111111] text-white text-xs font-bold hover:bg-black cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F5F0E8] rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#D5C4AC] shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif-brand text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-[#D5C4AC]">
              {editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-800 mb-1">Nomi:</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D5C5B0] bg-[#EDE4D5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Kategoriya:</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5C5B0] bg-[#EDE4D5]"
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Ombordagi soni:</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5C5B0] bg-[#EDE4D5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Narxi (so'm):</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5C5B0] bg-[#EDE4D5]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Eski narxi (ixtiyoriy):</label>
                  <input
                    type="number"
                    value={prodOldPrice || ''}
                    onChange={(e) =>
                      setProdOldPrice(e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#D5C5B0] bg-[#EDE4D5]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Rasm havolasi (URL):</label>
                <input
                  type="url"
                  required
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D5C5B0] bg-[#EDE4D5]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Ranglar (Nom va HEX):</label>
                <input
                  type="text"
                  placeholder="Qora (#111111), Oq (#ffffff)"
                  value={prodColors}
                  onChange={(e) => setProdColors(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D5C5B0] bg-[#EDE4D5]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">O'lchamlar:</label>
                <input
                  type="text"
                  placeholder="S, M, L, XL, XXL"
                  value={prodSizes}
                  onChange={(e) => setProdSizes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D5C5B0] bg-[#EDE4D5]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Tavsif:</label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D5C5B0] bg-[#EDE4D5]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-700 hover:bg-[#E5D7C3] cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#111111] text-white font-bold hover:bg-black cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
