import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, CreditCard, Headphones, Sparkles, ArrowRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setActiveView, setSelectedCategory, settings } = useStore();

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Card */}
        <div className="relative rounded-3xl bg-[#E8DEC9] border border-[#D5C6AC] overflow-hidden shadow-sm">
          {/* Subtle background ornament */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#DFD3BE]/60 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[480px]">
            {/* Left Content Column */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 z-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111]/90 text-white text-xs font-semibold tracking-wider uppercase mb-5 w-fit">
                <Sparkles size={14} className="text-[#D4AF37]" />
                <span>{settings.homeTexts.heroBadge || "Yangi To'plam"}</span>
              </div>

              <h1 className="font-brand-logo text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] tracking-tight leading-[1.1] mb-4">
                {settings.homeTexts.heroTitle || settings.storeInfo.name}
              </h1>

              <h2 className="font-serif-brand text-xl sm:text-2xl lg:text-3xl font-medium text-stone-900 mb-4 leading-snug">
                {settings.homeTexts.heroSubtitle}
              </h2>

              <p className="text-stone-700 text-sm sm:text-base max-w-xl mb-8 leading-relaxed font-normal">
                {settings.homeTexts.heroDescription}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setActiveView('catalog');
                  }}
                  className="px-7 py-3.5 rounded-xl bg-[#111111] text-[#F5F0E8] font-semibold text-sm sm:text-base hover:bg-black transition-all shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
                >
                  <span>Kiyimlarni ko'rish</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveView('ready-looks')}
                  className="px-7 py-3.5 rounded-xl bg-[#E0D1BB] text-stone-900 font-semibold text-sm sm:text-base hover:bg-[#D5C4AC] transition-all border border-[#C5B49C] shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Tayyor to'plamlar</span>
                </button>
              </div>
            </div>

            {/* Right Model Photo Column */}
            <div className="lg:col-span-5 relative h-80 sm:h-96 lg:h-[500px] w-full flex items-end justify-center">
              <div className="relative h-full w-full max-w-md mx-auto flex items-end justify-center">
                <img
                  src={settings.homeTexts.heroImageUrl || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=85"}
                  alt="SHU BREND erkaklar kolleksiyasi"
                  className="h-full w-full object-cover object-top rounded-b-2xl lg:rounded-b-none lg:rounded-r-2xl filter contrast-[1.05]"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#E8DEC9] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#E8DEC9] lg:via-transparent lg:to-transparent" />
                
                {/* Floating badge over image */}
                <div className="absolute bottom-6 right-6 bg-[#111111]/85 backdrop-blur-md text-[#F5F0E8] p-3 rounded-xl border border-white/10 shadow-lg text-xs hidden sm:block">
                  <p className="font-semibold">Kurtka klassik & Kostyum</p>
                  <p className="text-stone-300 text-[10px]">100% tabiiy va nozik matolar</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Value Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#EFE7D8] border border-[#DFD3C0] transition-transform hover:-translate-y-0.5">
            <div className="p-2.5 rounded-xl bg-[#DFD0BA] text-[#111111] shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#111111]">Sifat kafolati</h4>
              <p className="text-[11px] text-stone-600">100% original mahsulotlar</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#EFE7D8] border border-[#DFD3C0] transition-transform hover:-translate-y-0.5">
            <div className="p-2.5 rounded-xl bg-[#DFD0BA] text-[#111111] shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#111111]">Tez yetkazib berish</h4>
              <p className="text-[11px] text-stone-600">Barcha viloyat va shaharlarga</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#EFE7D8] border border-[#DFD3C0] transition-transform hover:-translate-y-0.5">
            <div className="p-2.5 rounded-xl bg-[#DFD0BA] text-[#111111] shrink-0">
              <CreditCard size={22} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#111111]">Qulay to'lov</h4>
              <p className="text-[11px] text-stone-600">Naqd yoki qabul qilib to'lash</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#EFE7D8] border border-[#DFD3C0] transition-transform hover:-translate-y-0.5">
            <div className="p-2.5 rounded-xl bg-[#DFD0BA] text-[#111111] shrink-0">
              <Headphones size={22} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#111111]">24/7 qo'llab-quvvatlash</h4>
              <p className="text-[11px] text-stone-600">{settings.storeInfo.contactNote || "Biz har doim siz bilan"}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
