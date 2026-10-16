import React from 'react';
import { useStore, ActiveView } from '../context/StoreContext';
import { Home, Grid, Heart, ShoppingBag } from 'lucide-react';

export const BottomMobileNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartCount,
    setIsCartOpen,
    favorites,
    setSelectedCategory,
  } = useStore();

  const handleNav = (view: ActiveView, category?: 'all') => {
    setActiveView(view);
    if (category) {
      setSelectedCategory(category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#F5F0E8]/98 backdrop-blur-lg border-t border-[#D9CEBE] px-2 py-1.5 shadow-xl">
      <div className="grid grid-cols-4 items-center justify-around">
        {/* Bosh sahifa */}
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeView === 'home' ? 'text-[#111111] font-semibold' : 'text-stone-500'
          }`}
        >
          <Home size={20} className={activeView === 'home' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] mt-0.5">Bosh sahifa</span>
        </button>

        {/* Kategoriyalar */}
        <button
          onClick={() => handleNav('catalog', 'all')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeView === 'catalog' ? 'text-[#111111] font-semibold' : 'text-stone-500'
          }`}
        >
          <Grid size={20} className={activeView === 'catalog' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] mt-0.5">Katalog</span>
        </button>

        {/* Sevimlilar */}
        <button
          onClick={() => handleNav('favorites')}
          className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
            activeView === 'favorites' ? 'text-red-600 font-semibold' : 'text-stone-500'
          }`}
        >
          <Heart size={20} className={favorites.length > 0 && activeView === 'favorites' ? 'fill-red-600' : ''} />
          {favorites.length > 0 && (
            <span className="absolute top-0 right-5 bg-red-600 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {favorites.length}
            </span>
          )}
          <span className="text-[10px] mt-0.5">Sevimlilar</span>
        </button>

        {/* Savat */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 text-stone-600"
        >
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute top-0 right-5 bg-[#111111] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] mt-0.5">Savat</span>
        </button>
      </div>
    </nav>
  );
};
