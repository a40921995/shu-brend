import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, Send, ChevronDown, ChevronUp, Instagram, ExternalLink } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { settings } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Yetkazib berish qancha vaqt oladi va narxi qanday?",
      a: settings.delivery.deliveryNotice || "Toshkent shahri bo'ylab buyurtmalar 24 soat ichida yetkaziladi. Barcha viloyat va tuman markazlariga esa 1-3 ish kunida kuryer yoki pochta orqali yetkazib beriladi.",
    },
    {
      q: "Kiyim o'lchami to'g'ri kelmasa nima qilish kerak?",
      a: "Xavotir olmang! " + settings.storeInfo.name + " mijozlariga 14 kun ichida kiyimni boshqa o'lchamga bepul almashtirish imkoniyatini taqdim etadi. Faqat kiyim yorliqlari saqlangan va kiyilmagan bo'lishi lozim.",
    },
    {
      q: "To'lovni qanday amalga oshirishim mumkin?",
      a: "Siz mahsulotni qabul qilib, o'zingiz kiyib ko'rganingizdan so'ng kuryerga naqd to'lashingiz yoki Click / Payme / Uzum Bank orqali to'lov qilishingiz mumkin.",
    },
    {
      q: settings.storeInfo.name + " kiyimlari sifati qanday?",
      a: "Barcha mahsulotlarimiz yuqori sifatli tabiiy matolardan (Misr paxtasi, tabiiy charm, merinos juni, kashemir) tayyorlanadi va qat'iy sifat nazoratidan o'tkaziladi.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9E7B4F]">
            {settings.storeInfo.name} Ma'lumot markazi
          </span>
          <h2 className="font-serif-brand text-3xl sm:text-4xl font-extrabold text-[#111111] mt-1 mb-3">
            Biz bilan bog'lanish va do'konimiz
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Savollaringiz bormi? Mutaxassislarimiz har doim sizga to'g'ri o'lcham va uslubni tanlashda yordam berishga tayyor.
          </p>
        </div>

        {/* Contact Cards Grid (4 cards: Phone, Telegram, Instagram, Address) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {/* Phone Card */}
          <div className="p-6 rounded-2xl bg-[#EDE2D0] border border-[#DECDB7] text-center space-y-3 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-full bg-[#DFD0BC] flex items-center justify-center mx-auto text-[#111111]">
              <Phone size={22} />
            </div>
            <div>
              <h3 className="font-serif-brand font-bold text-base text-stone-900">Telefon</h3>
              <a
                href={`tel:${settings.storeInfo.phone.replace(/[^\d+]/g, '')}`}
                className="text-sm font-semibold text-stone-900 hover:underline block mt-1"
              >
                {settings.storeInfo.phone}
              </a>
              {settings.storeInfo.secondaryPhone && (
                <a
                  href={`tel:${settings.storeInfo.secondaryPhone.replace(/[^\d+]/g, '')}`}
                  className="text-xs text-stone-700 hover:underline block mt-0.5"
                >
                  {settings.storeInfo.secondaryPhone}
                </a>
              )}
            </div>
            <p className="text-xs text-stone-500">{settings.storeInfo.contactNote}</p>
          </div>

          {/* Telegram Card */}
          <div className="p-6 rounded-2xl bg-[#EDE2D0] border border-[#DECDB7] text-center space-y-3 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-full bg-[#DFD0BC] flex items-center justify-center mx-auto text-sky-700">
              <Send size={22} />
            </div>
            <div>
              <h3 className="font-serif-brand font-bold text-base text-stone-900">Telegram</h3>
              <a
                href={settings.storeInfo.telegramChannelUrl || `https://t.me/${settings.storeInfo.telegramUsername.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-sky-800 hover:underline block mt-1"
              >
                {settings.storeInfo.telegramUsername}
              </a>
            </div>
            <p className="text-xs text-stone-500">24/7 onlayn konsultatsiya</p>
          </div>

          {/* Instagram Card */}
          <div className="p-6 rounded-2xl bg-[#EDE2D0] border border-[#DECDB7] text-center space-y-3 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-full bg-[#DFD0BC] flex items-center justify-center mx-auto text-pink-700">
              <Instagram size={22} />
            </div>
            <div>
              <h3 className="font-serif-brand font-bold text-base text-stone-900">Instagram</h3>
              <a
                href={settings.storeInfo.instagramUrl || `https://instagram.com/${settings.storeInfo.instagramUsername.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-pink-800 hover:underline block mt-1"
              >
                {settings.storeInfo.instagramUsername}
              </a>
            </div>
            <p className="text-xs text-stone-500">Yangi to'plamlar va fotolar</p>
          </div>

          {/* Address Card */}
          <div className="p-6 rounded-2xl bg-[#EDE2D0] border border-[#DECDB7] text-center space-y-3 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-full bg-[#DFD0BC] flex items-center justify-center mx-auto text-[#111111]">
              <MapPin size={22} />
            </div>
            <div>
              <h3 className="font-serif-brand font-bold text-base text-stone-900">Do'kon manzili</h3>
              <p className="text-xs font-semibold text-stone-900 mt-1">
                {settings.storeInfo.city}, {settings.storeInfo.address}
              </p>
              {settings.storeInfo.mapUrl && (
                <a
                  href={settings.storeInfo.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#9E7B4F] hover:underline inline-flex items-center gap-1 font-semibold mt-1"
                >
                  <span>Xaritada ko'rish</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
            <p className="text-xs text-stone-500">{settings.storeInfo.workingHours}</p>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto bg-[#EDE2D0] rounded-3xl p-6 sm:p-8 border border-[#DECDB7]">
          <h3 className="font-serif-brand text-xl font-bold text-stone-900 mb-6 text-center">
            Ko'p beriladigan savollar (FAQ)
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-[#F5F0E8] border border-[#D5C5B0] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-stone-900 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed border-t border-[#E5D7C3] pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
