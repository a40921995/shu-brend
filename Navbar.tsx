import React, { useState } from 'react';
import { useStore, ActiveView } from '../context/StoreContext';
import { formatSom } from '../utils/formatters';
import {
  ShoppingBag,
  Heart,
  Search,
  ShieldCheck,
  Menu,
  X,
  Phone,
  Layers,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartCount,
    setIsCartOpen,
    favorites,
    setIsSearchOpen,
    isAdminLoggedIn,
    setSelectedCategory,
    settings,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: ActiveView, category?: 'all') => {
    setActiveView(view);
    if (category) {
      setSelectedCategory(category);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic announcement banner with threshold replacement
  const dynamicBannerText = (settings.homeTexts.announcementBanner || '')
    .replace('{free_threshold}', formatSom(settings.delivery.freeDeliveryThreshold));

  return (
    <header className="sticky top-0 z-40 bg-[#F5F0E8]/95 backdrop-blur-md border-b border-[#E3D9C9] transition-all">
      {/* Top micro banner with dynamic text and phone from settings */}
      <div className="bg-[#111111] text-[#F5F0E8] text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span>{dynamicBannerText}</span>
        <span className="hidden sm:inline opacity-40">|</span>
        <span className="hidden sm:inline text-stone-300">
          Bog'lanish: {settings.storeInfo.phone}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile hamburger button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#111111] hover:bg-[#E9DFD0] transition-colors cursor-pointer"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Brand Logo with dynamic store name */}
          <div className="flex-1 md:flex-initial flex items-center justify-center md:justify-start">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left group flex flex-col items-center md:items-start cursor-pointer"
            >
              <span className="font-brand-logo text-2xl sm:text-3xl font-extrabold tracking-[0.2em] text-[#111111] group-hover:opacity-80 transition-opacity">
                {settings.storeInfo.name}
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-stone-500 font-medium -mt-1">
                {settings.storeInfo.tagline || 'Erkaklar kiyimlari'}
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                activeView === 'home'
                  ? 'text-[#111111] font-semibold border-b-2 border-[#111111]'
                  : 'text-stone-700 hover:text-[#111111] hover:bg-[#EEE7DC]'
              }`}
            >
              Bosh sahifa
            </button>

            <button
              onClick={() => handleNavClick('catalog', 'all')}
              className={`px-3.5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                activeView === 'catalog'
                  ? 'text-[#111111] font-semibold border-b-2 border-[#111111]'
                  : 'text-stone-700 hover:text-[#111111] hover:bg-[#EEE7DC]'
              }`}
            >
              Mahsulotlar
            </button>

            <button
              onClick={() => handleNavClick('ready-looks')}
              className={`px-3.5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                activeView === 'ready-looks'
                  ? 'text-[#111111] font-semibold border-b-2 border-[#111111]'
                  : 'text-stone-700 hover:text-[#111111] hover:bg-[#EEE7DC]'
              }`}
            >
              Tayyor obrazlar
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3.5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                activeView === 'contact'
                  ? 'text-[#111111] font-semibold border-b-2 border-[#111111]'
                  : 'text-stone-700 hover:text-[#111111] hover:bg-[#EEE7DC]'
              }`}
            >
              Aloqa
            </button>
          </nav>

          {/* Action Icons (Search, Favorites, Cart, Admin) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-full text-stone-800 hover:bg-[#E9DFD0] transition-colors cursor-pointer"
              title="Qidiruv"
              aria-label="Qidirish"
            >
              <Search size={20} />
            </button>

            {/* Favorites */}
            <button
              onClick={() => handleNavClick('favorites')}
              className="p-2.5 rounded-full text-stone-800 hover:bg-[#E9DFD0] transition-colors relative cursor-pointer"
              title="Sevimlilar"
              aria-label="Sevimlilar"
            >
              <Heart size={20} className={favorites.length > 0 ? 'fill-red-600 text-red-600' : ''} />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 rounded-full text-stone-800 hover:bg-[#E9DFD0] transition-colors relative cursor-pointer"
              title="Savat"
              aria-label="Savat"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#111111] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Panel Link */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-xs'
                  : 'bg-[#E3D7C5] text-stone-800 hover:bg-[#D7C7B0]'
              }`}
              title="Admin boshqaruv paneli"
            >
              <ShieldCheck size={14} className={isAdminLoggedIn ? 'text-emerald-200' : 'text-stone-700'} />
              <span className="hidden lg:inline">{isAdminLoggedIn ? 'Admin (Faol)' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F5F0E8] border-b border-[#E3D9C9] px-4 pt-2 pb-6 space-y-2 shadow-lg animate-fadeIn">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium ${
              activeView === 'home' ? 'bg-[#111111] text-white' : 'text-stone-800 hover:bg-[#E9DFD0]'
            }`}
          >
            Bosh sahifa
          </button>

          <button
            onClick={() => handleNavClick('catalog', 'all')}
            className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium ${
              activeView === 'catalog' ? 'bg-[#111111] text-white' : 'text-stone-800 hover:bg-[#E9DFD0]'
            }`}
          >
            Barcha mahsulotlar
          </button>

          <button
            onClick={() => handleNavClick('ready-looks')}
            className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center gap-2 ${
              activeView === 'ready-looks' ? 'bg-[#111111] text-white' : 'text-stone-800 hover:bg-[#E9DFD0]'
            }`}
          >
            <Layers size={18} />
            <span>Tayyor obrazlar to'plami</span>
          </button>

          <button
            onClick={() => handleNavClick('favorites')}
            className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center justify-between ${
              activeView === 'favorites' ? 'bg-[#111111] text-white' : 'text-stone-800 hover:bg-[#E9DFD0]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart size={18} />
              <span>Sevimlilar</span>
            </div>
            {favorites.length > 0 && (
              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">
                {favorites.length}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center gap-2 ${
              activeView === 'contact' ? 'bg-[#111111] text-white' : 'text-stone-800 hover:bg-[#E9DFD0]'
            }`}
          >
            <Phone size={18} />
            <span>Aloqa va do'kon manzili</span>
          </button>

          <div className="pt-2 border-t border-[#E3D9C9]">
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 bg-[#E3D7C5] text-stone-900 cursor-pointer"
            >
              <ShieldCheck size={18} />
              <span>{isAdminLoggedIn ? "Admin boshqaruv paneli (Kirilgan)" : "Admin paneliga kirish"}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
