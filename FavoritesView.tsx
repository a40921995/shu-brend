import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { products, favorites, setActiveView } = useStore();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <section className="py-10 sm:py-14 bg-[#F5F0E8] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#DECDB7]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Heart size={24} className="fill-red-600 text-red-600" />
              <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#111111]">
                Sevimlilar ro'yxati ({favoriteProducts.length})
              </h1>
            </div>
            <p className="text-xs text-stone-600">
              Sizga yoqqan va keyinroq xarid qilish uchun saqlab qo'yilgan mahsulotlar
            </p>
          </div>

          <button
            onClick={() => setActiveView('catalog')}
            className="text-xs font-bold text-stone-900 bg-[#E8DDD0] hover:bg-[#DFD1BF] px-4 py-2.5 rounded-xl border border-[#D5C5B0] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Katalogga qaytish</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="py-20 text-center bg-[#EDE2D0] rounded-3xl border border-[#DECDB7] p-8 space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#DFD0BC] flex items-center justify-center mx-auto text-stone-500">
              <Heart size={30} />
            </div>
            <h3 className="font-serif-brand text-xl font-bold text-stone-900">
              Hozircha sevimli mahsulotlaringiz yo'q
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Mahsulot kartasidagi yurakcha belgisini bosish orqali kiyimlarni ushbu bo'limga saqlashingiz mumkin.
            </p>
            <button
              onClick={() => setActiveView('catalog')}
              className="px-6 py-3 rounded-xl bg-[#111111] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
            >
              Mahsulotlarni ko'rish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
