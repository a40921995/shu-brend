import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatSom } from '../utils/formatters';
import { Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';

export const ReadyLooksSection: React.FC = () => {
  const { readyLooks, addReadyLookToCart, setActiveView } = useStore();

  return (
    <section className="py-10 sm:py-16 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8DCC9] text-[#111111] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={14} className="text-[#9E7B4F]" />
              <span>Stilist tavsiyalari</span>
            </div>
            <h2 className="font-serif-brand text-3xl sm:text-4xl font-extrabold text-[#111111]">
              Tayyor obrazlar to'plami
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-xl">
              Professional stilistlar tomonidan sinovdan o'tgan, har bir vaziyat va mavsumga mos keladigan to'liq kiyim to'plamlari.
            </p>
          </div>

          <button
            onClick={() => setActiveView('catalog')}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-900 bg-[#E8DDD0] hover:bg-[#DFD1BF] px-4 py-2.5 rounded-xl border border-[#D5C5B0] transition-all self-start sm:self-auto cursor-pointer"
          >
            <span>Katalogga o'tish</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Looks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {readyLooks.map((look) => (
            <div
              key={look.id}
              className="group bg-[#EDE4D6] rounded-2xl border border-[#DECDB7] overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-[#BFAB91] transition-all duration-300"
            >
              {/* Image with Tag */}
              <div className="relative aspect-4/5 w-full overflow-hidden bg-[#E5D9C7]">
                <img
                  src={look.image}
                  alt={look.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-[#111111]/85 backdrop-blur-xs text-white text-[11px] font-bold">
                  {look.style}
                </span>
              </div>

              {/* Look Info & CTA */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-serif-brand font-bold text-lg text-stone-900 mb-1">
                    {look.name}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                    {look.description}
                  </p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-base font-extrabold text-[#111111]">
                      {formatSom(look.totalEstimate)}
                    </span>
                    {look.discountPrice && (
                      <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                        Chegirmada
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => addReadyLookToCart(look)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-all flex items-center justify-center gap-2 group-hover:bg-[#9E7B4F] cursor-pointer shadow-2xs"
                >
                  <ShoppingBag size={14} />
                  <span>To'plamni savatga qo'shish</span>
                </button>
              </div>
            </div>
          ))}

          {/* Special Banner Card in the Grid */}
          <div className="bg-[#111111] text-[#F5F0E8] rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-stone-800 shadow-md">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mb-2">
                SHU BREND Stilistlari
              </span>
              <h3 className="font-serif-brand text-2xl font-bold leading-tight mb-3">
                O'zingizning uslubingizni tanlang!
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Tayyor obrazlar — sizning vaqtingiz va qulayligingiz uchun.
                Har bir mahsulot bir-biriga mukammal mos tushadi.
              </p>
            </div>

            <button
              onClick={() => setActiveView('catalog')}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-[#9E7B4F] text-white text-xs font-bold hover:bg-[#886940] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Katalogni ko'rish</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
