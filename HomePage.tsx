import React from 'react';
import { useStore } from '../context/StoreContext';
import { HeroBanner } from './HeroBanner';
import { ProductCard } from './ProductCard';
import { CATEGORIES_LIST } from '../data/initialData';
import { Sparkles, ArrowRight, Star, ChevronRight, Flame, ShoppingBag } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, setActiveView, setSelectedCategory, readyLooks, addReadyLookToCart } = useStore();

  const newProducts = products.filter((p) => p.isNew && p.isActive).slice(0, 4);
  const discountProducts = products.filter((p) => p.oldPrice && p.oldPrice > p.price && p.isActive).slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. Hero Banner with trust badges */}
      <HeroBanner />

      {/* 2. Yangi kelgan mahsulotlar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#DFD3C0]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} className="text-emerald-700" />
              <span>Yangi mavsum</span>
            </div>
            <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#111111]">
              Yangi kelgan mahsulotlar
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setActiveView('catalog');
            }}
            className="text-xs sm:text-sm font-bold text-stone-900 hover:text-[#9E7B4F] flex items-center gap-1 transition-colors group cursor-pointer"
          >
            <span>Barchasini ko'rish</span>
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Ommabop kategoriyalar (Quick Category Jumps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#EFE6D6] rounded-3xl p-6 sm:p-10 border border-[#DECDB7]">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9E7B4F]">
              Kiyim turlari
            </span>
            <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#111111] mt-1">
              Ommabop kategoriyalar
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              O'zingizga kerakli turdagi kiyimlarni tez va oson toping
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {CATEGORIES_LIST.slice(0, 7).map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveView('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 rounded-2xl bg-[#F5F0E8] hover:bg-[#E2D5C3] border border-[#D9CBB7] text-center transition-all hover:-translate-y-1 shadow-2xs group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#E5D7C3] group-hover:bg-[#111111] group-hover:text-white flex items-center justify-center mx-auto text-stone-800 transition-colors mb-2">
                  <span className="font-bold text-xs">SHU</span>
                </div>
                <h4 className="font-bold text-xs text-stone-900 group-hover:text-black">
                  {cat.name}
                </h4>
                <p className="text-[10px] text-stone-500 mt-0.5">
                  {cat.count} ta kiyim
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Mashhur tayyor obrazlar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#DFD3C0]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9E7B4F]">
              Stilist kapsulalari
            </span>
            <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#111111]">
              Mashhur tayyor obrazlar
            </h2>
          </div>
          <button
            onClick={() => setActiveView('ready-looks')}
            className="text-xs sm:text-sm font-bold text-stone-900 hover:text-[#9E7B4F] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Barcha obrazlar</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {readyLooks.slice(0, 3).map((look) => (
            <div
              key={look.id}
              className="bg-[#EDE4D6] rounded-2xl border border-[#DECDB7] overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all group"
            >
              <div className="relative aspect-4/5 w-full overflow-hidden bg-stone-300">
                <img
                  src={look.image}
                  alt={look.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-[#111111]/85 text-white text-[11px] font-bold">
                  {look.style}
                </span>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif-brand font-bold text-base text-stone-900 mb-1">
                    {look.name}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                    {look.description}
                  </p>
                </div>
                <button
                  onClick={() => addReadyLookToCart(look)}
                  className="w-full py-2.5 rounded-xl bg-[#111111] text-white text-xs font-bold hover:bg-[#9E7B4F] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag size={14} />
                  <span>To'plamni xarid qilish</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Chegirmalar va Maxsus takliflar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8 pb-3 border-b border-[#DFD3C0]">
          <Flame size={22} className="text-red-600" />
          <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#111111]">
            Maxsus chegirmadagi kiyimlar
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {discountProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Mijozlar sharhlari va e'tirofi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#EFE6D6] rounded-3xl p-6 sm:p-10 border border-[#DECDB7]">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9E7B4F]">
              Haqiqiy tajriba
            </span>
            <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#111111] mt-1">
              Mijozlarimiz fikrlari
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F5F0E8] p-5 rounded-2xl border border-[#D5C5B0] space-y-3">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs text-stone-700 leading-relaxed italic">
                "Klassik kurtka va jinsi shim sotib oldim. Tikilishi, matosi juda a'lo darajada. Kuryer buyurtma bergan kunimning o'zidayoq yetkazib berdi. Rahmat SHU BREND!"
              </p>
              <div className="pt-2 border-t border-[#E5D7C3] flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">Bekzod Yo'ldoshev</span>
                <span className="text-stone-500">Toshkent</span>
              </div>
            </div>

            <div className="bg-[#F5F0E8] p-5 rounded-2xl border border-[#D5C5B0] space-y-3">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs text-stone-700 leading-relaxed italic">
                "Sayt juda qulay va tushunarli ishlangan! Tanlagan kiyimlarim bir-biriga judayam yarashdi, matosi ham yumshoq va sifatli. Tezda savatga solib buyurtma berdim."
              </p>
              <div className="pt-2 border-t border-[#E5D7C3] flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">Sherzod Mahmudov</span>
                <span className="text-stone-500">Samarqand</span>
              </div>
            </div>

            <div className="bg-[#F5F0E8] p-5 rounded-2xl border border-[#D5C5B0] space-y-3">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs text-stone-700 leading-relaxed italic">
                "Dvoyka kostyum to'y uchun oldim. Kiyganda qomatga juda yaxshi o'tirdi. Matosi toza, qizdirib yubormaydi. Telegram orqali ham operator tez javob qaytardi."
              </p>
              <div className="pt-2 border-t border-[#E5D7C3] flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">Rustam Qodirov</span>
                <span className="text-stone-500">Farg'ona</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
