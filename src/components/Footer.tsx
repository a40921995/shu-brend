import React from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedCategory, settings } = useStore();

  return (
    <footer className="bg-[#111111] text-[#F5F0E8] pt-14 pb-24 md:pb-14 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-stone-800">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-brand-logo text-2xl font-bold tracking-[0.2em] text-[#F5F0E8] block">
              {settings.storeInfo.name}
            </span>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              {settings.homeTexts.aboutText}
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-[#9E7B4F]" />
                <span>{settings.storeInfo.city}, {settings.storeInfo.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-[#9E7B4F]" />
                <span>{settings.storeInfo.phone}</span>
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Navigatsiya
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setActiveView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bosh sahifa
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setActiveView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Mahsulotlar katalogi
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('ready-looks');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tayyor obrazlar
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('favorites');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sevimlilar ro'yxati
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Aloqa va manzil
                </button>
              </li>
            </ul>
          </div>

          {/* Kategoriyalar */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Kategoriyalar
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Kurtkalar');
                    setActiveView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Kurtkalar va paltolar
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Koylaklar');
                    setActiveView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Klassik ko'ylaklar
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Kostyumlar');
                    setActiveView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Kostyumlar va dvoykalar
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Jinsilar');
                    setActiveView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Jinsi va chinos shimlar
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('OyoqKiyimlar');
                    setActiveView('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Oyoq kiyimlar
                </button>
              </li>
            </ul>
          </div>

          {/* Qulayliklar va Xavfsizlik */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Xizmatlar
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Yetkazib berish: {settings.delivery.deliveryNotice}</li>
              <li>14 kunlik almashtirish kafolati</li>
              <li>O'lchamlar jadvali</li>
              <li>Ish vaqti: {settings.storeInfo.workingHours}</li>
            </ul>
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-stone-500 block mb-1">
                To'lov turlari:
              </span>
              <p className="text-[11px] text-stone-300">
                Naqd to'lov • Click • Payme • Uzum
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {settings.storeInfo.name}. {settings.homeTexts.footerText}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('admin')}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Administrator kirish
            </button>
            <span>•</span>
            <span>O'zbekistonda ishlab chiqarilgan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
