import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatSom } from '../utils/formatters';
import { UZBEKISTAN_REGIONS, calculateDeliveryFee } from '../data/initialData';
import { Order } from '../types';
import {
  X,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  Send,
  ExternalLink,
  Info,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    createOrder,
    settings,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [region, setRegion] = useState('Toshkent shahri');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [yandexMapUrl, setYandexMapUrl] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card_agreement'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  // Real dynamic delivery fee calculation based on current region & settings
  const dynamicDeliveryFee = calculateDeliveryFee(cartSubtotal, region, settings.delivery);
  const dynamicTotal = cartSubtotal + dynamicDeliveryFee;

  // Phone number input formatter
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+998')) {
      val = '+998 ';
    }
    setPhone(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Minimum order amount check
    if (settings.delivery.minOrderAmount > 0 && cartSubtotal < settings.delivery.minOrderAmount) {
      setErrorMessage(`Minimal buyurtma summasi: ${formatSom(settings.delivery.minOrderAmount)}. Sizning savatingiz: ${formatSom(cartSubtotal)}.`);
      return;
    }

    // Strict validation
    if (!customerName.trim() || customerName.trim().length < 3) {
      setErrorMessage("Iltimos, ism va familiyangizni to'liq kiriting (kamida 3 harf).");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 12) {
      setErrorMessage("Telefon raqami noto'g'ri. Kamida 9 ta raqamli o'zbek raqamini kiriting (+998 ...)");
      return;
    }
    if (!city.trim()) {
      setErrorMessage("Iltimos, tuman yoki shahar nomini kiriting.");
      return;
    }
    if (!address.trim() || address.trim().length < 5) {
      setErrorMessage("Iltimos, ko'cha va xonadon raqamini o'z ichiga olgan to'liq manzilni kiriting.");
      return;
    }

    try {
      setIsSubmitting(true);
      const newOrder = await createOrder({
        customerName,
        phone,
        region,
        city,
        address,
        yandexMapUrl: yandexMapUrl || undefined,
        note: note || undefined,
        paymentMethod,
      });
      setCompletedOrder(newOrder);
    } catch (err: any) {
      setErrorMessage(err.message || "Buyurtma berishda xatolik yuz berdi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-[#F5F0E8] w-full max-w-4xl rounded-3xl shadow-2xl border border-[#D9CDB8] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => {
            setIsCheckoutOpen(false);
            setCompletedOrder(null);
          }}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#E5D7C3] text-stone-900 hover:bg-[#D5C5AE] transition-colors cursor-pointer"
          aria-label="Yopish"
        >
          <X size={20} />
        </button>

        {completedOrder ? (
          /* Order Success Confirmation Screen */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={46} />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Muvaffaqiyatli qabul qilindi
              </span>
              <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-stone-900 mt-3 mb-2">
                Rahmat, buyurtmangiz rasmiylashtirildi!
              </h2>
              <p className="text-sm text-stone-600 max-w-lg mx-auto">
                Buyurtma raqami: <strong className="text-stone-900 font-bold text-base">{completedOrder.orderNumber}</strong>.
                Operatorimiz tez orada siz bilan bog'lanib, o'lcham va yetkazib berish vaqtini tasdiqlaydi.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#EFE6D6] rounded-2xl p-6 max-w-md mx-auto text-left border border-[#DCD0BD] space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-[#D5C5B0] pb-2">
                <span className="text-stone-600">Qabul qiluvchi:</span>
                <span className="font-semibold text-stone-900">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-[#D5C5B0] pb-2">
                <span className="text-stone-600">Telefon:</span>
                <span className="font-semibold text-stone-900">{completedOrder.phone}</span>
              </div>
              <div className="flex justify-between border-b border-[#D5C5B0] pb-2">
                <span className="text-stone-600">Manzil:</span>
                <span className="font-semibold text-stone-900 text-right max-w-xs truncate">
                  {completedOrder.region}, {completedOrder.city}, {completedOrder.address}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#D5C5B0] pb-2">
                <span className="text-stone-600">To'lov turi:</span>
                <span className="font-semibold text-stone-900">
                  {completedOrder.paymentMethod === 'cash' ? "Naqd to'lov" : 'Karta orqali / Kelishilgan'}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#111111] pt-1">
                <span>Jami to'lov:</span>
                <span>{formatSom(completedOrder.total)}</span>
              </div>
            </div>

            {/* Telegram notification notice */}
            <div className="p-3 bg-sky-50 text-sky-900 rounded-xl max-w-md mx-auto text-xs flex items-center gap-2 border border-sky-200">
              <Send size={16} className="text-sky-600 shrink-0" />
              <span>
                Administratorga buyurtma haqida Telegram orqali xabar yuborildi.
              </span>
            </div>

            <button
              onClick={() => {
                setIsCheckoutOpen(false);
                setCompletedOrder(null);
              }}
              className="px-8 py-3 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-black transition-colors cursor-pointer"
            >
              Do'konga qaytish
            </button>
          </div>
        ) : (
          /* Checkout Form & Cart Overview Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
            {/* Left Form Column (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8">
              <h2 className="font-serif-brand text-2xl font-bold text-[#111111] mb-1">
                Buyurtma rasmiylashtirish
              </h2>
              <p className="text-xs text-stone-600 mb-4">
                Iltimos, kuryer aniq yetkazib berishi uchun ma'lumotlaringizni to'ldiring.
              </p>

              {/* Dynamic delivery notice banner from settings */}
              {settings.delivery.deliveryNotice && (
                <div className="mb-5 p-3 rounded-xl bg-[#EBE0CD] border border-[#D5C5B0] text-stone-800 text-xs flex items-start gap-2">
                  <Info size={16} className="text-[#9E7B4F] shrink-0 mt-0.5" />
                  <span>{settings.delivery.deliveryNotice}</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                {/* Ism va familiya */}
                <div>
                  <label className="block text-stone-800 font-bold mb-1.5">
                    Ism va familiya <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3.5 text-stone-500" />
                    <input
                      type="text"
                      required
                      placeholder="Ismingiz va familiyangiz"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#D5C5B0] bg-[#EDE4D5] focus:outline-hidden focus:ring-2 focus:ring-[#111111] transition-all"
                    />
                  </div>
                </div>

                {/* Telefon raqami */}
                <div>
                  <label className="block text-stone-800 font-bold mb-1.5">
                    Telefon raqami <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-3.5 text-stone-500" />
                    <input
                      type="tel"
                      required
                      placeholder="+998 90 123 45 67"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#D5C5B0] bg-[#EDE4D5] focus:outline-hidden focus:ring-2 focus:ring-[#111111] transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Viloyat & Shahar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-stone-800 font-bold mb-1.5">
                      Viloyat / Hudud <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-[#D5C5B0] bg-[#EDE4D5] focus:outline-hidden focus:ring-2 focus:ring-[#111111] transition-all cursor-pointer font-medium"
                    >
                      {UZBEKISTAN_REGIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-800 font-bold mb-1.5">
                      Shahar yoki tuman <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: Toshkent sh., Chilonzor"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-[#D5C5B0] bg-[#EDE4D5] focus:outline-hidden focus:ring-2 focus:ring-[#111111] transition-all"
                    />
                  </div>
                </div>

                {/* To'liq manzil */}
                <div>
                  <label className="block text-stone-800 font-bold mb-1.5">
                    To'liq manzil (ko'cha, uy, xonadon) <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-3.5 text-stone-500" />
                    <input
                      type="text"
                      required
                      placeholder="Ko'cha nomi, uy raqami, xonadon yoki mo'ljal"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#D5C5B0] bg-[#EDE4D5] focus:outline-hidden focus:ring-2 focus:ring-[#111111] transition-all"
                    />
                  </div>
                </div>

                {/* Yandex Xaritalar havolasi */}
                <div>
                  <label className="block text-stone-800 font-bold mb-1.5 flex items-center justify-between">
                    <span>Yandex Xarita havolasi (ixtiyoriy)</span>
                    <a
                      href={settings.storeInfo.mapUrl || "https://yandex.uz/maps"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#9E7B4F] hover:underline flex items-center gap-1 font-normal"
                    >
                      <span>Xaritani ochish</span>
                      <ExternalLink size={12} />
                    </a>
                  </label>
                  <input
                    type="url"
                    placeholder="https://yandex.uz/maps/-/..."
                    value={yandexMapUrl}
                    onChange={(e) => setYandexMapUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#EDE4D5] focus:outline-hidden focus:ring-2 focus:ring-[#111111] transition-all text-xs"
                  />
                </div>

                {/* Izoh */}
                <div>
                  <label className="block text-stone-800 font-bold mb-1.5">
                    Yetkazib berish bo'yicha izoh
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Kuryer uchun maxsus eslatma yoki qo'ng'iroq vaqti..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#EDE4D5] focus:outline-hidden focus:ring-2 focus:ring-[#111111] transition-all text-xs"
                  />
                </div>

                {/* To'lov usuli */}
                <div className="pt-2">
                  <label className="block text-stone-800 font-bold mb-2">
                    To'lov usuli:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`p-3 rounded-xl border-2 flex items-center gap-2.5 cursor-pointer transition-all ${
                        paymentMethod === 'cash'
                          ? 'border-[#111111] bg-[#E3D4BF]'
                          : 'border-[#D9CBB7] bg-[#EDE4D5]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={() => setPaymentMethod('cash')}
                        className="sr-only"
                      />
                      <Truck size={18} className="text-stone-800" />
                      <div>
                        <p className="font-bold text-xs text-stone-900">Naqd to'lov</p>
                        <p className="text-[10px] text-stone-600">Qabul qilinganda</p>
                      </div>
                    </label>

                    <label
                      className={`p-3 rounded-xl border-2 flex items-center gap-2.5 cursor-pointer transition-all ${
                        paymentMethod === 'card_agreement'
                          ? 'border-[#111111] bg-[#E3D4BF]'
                          : 'border-[#D9CBB7] bg-[#EDE4D5]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="card_agreement"
                        checked={paymentMethod === 'card_agreement'}
                        onChange={() => setPaymentMethod('card_agreement')}
                        className="sr-only"
                      />
                      <CreditCard size={18} className="text-stone-800" />
                      <div>
                        <p className="font-bold text-xs text-stone-900">Karta / Kelishilgan</p>
                        <p className="text-[10px] text-stone-600">Click / Payme / Karta</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || cart.length === 0}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#111111] text-white font-bold text-sm hover:bg-black transition-all shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Buyurtma yuborilmoqda..." : "Buyurtmani tasdiqlash"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Overview Column (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-[#EFE6D6] border-t lg:border-t-0 lg:border-l border-[#DCD0BD] flex flex-col justify-between">
              <div>
                <h3 className="font-serif-brand text-lg font-bold text-stone-900 mb-4">
                  Buyurtma tarkibi ({cart.length})
                </h3>

                {/* Mini Item List */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-[#E8DDD0] border border-[#D5C5B0]"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-14 object-cover rounded-lg bg-stone-300 shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-semibold text-stone-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-stone-600">
                          {item.color.name} • {item.size} • {item.quantity} dona
                        </p>
                        <p className="font-bold text-[#111111] mt-0.5">
                          {formatSom(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Calculations */}
              <div className="border-t border-[#D5C5B0] pt-4 mt-6 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-stone-700">
                  <span>Jami mahsulotlar:</span>
                  <span className="font-medium text-stone-900">{formatSom(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-700">
                  <span>Yetkazib berish ({region}):</span>
                  {dynamicDeliveryFee === 0 ? (
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-xs">
                      BEPUL
                    </span>
                  ) : (
                    <span className="font-medium text-stone-900">{formatSom(dynamicDeliveryFee)}</span>
                  )}
                </div>

                {settings.delivery.freeDeliveryThreshold > 0 && dynamicDeliveryFee > 0 && (
                  <p className="text-[10px] text-stone-500">
                    Yetkazib berish {formatSom(settings.delivery.freeDeliveryThreshold)} dan boshlab bepul.
                  </p>
                )}

                <div className="flex justify-between text-base font-bold text-[#111111] pt-2 border-t border-[#D5C5B0]">
                  <span>To'lov summasi:</span>
                  <span>{formatSom(dynamicTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
