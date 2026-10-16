import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatSom } from '../utils/formatters';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartCount,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    setIsCheckoutOpen,
    setActiveView,
    settings,
  } = useStore();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-[#F5F0E8] h-full shadow-2xl flex flex-col justify-between border-l border-[#D9CDB8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E0D3BF] flex items-center justify-between bg-[#EFE6D6]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={22} className="text-[#111111]" />
            <h2 className="font-serif-brand text-xl font-bold text-[#111111]">
              Savat ({cartCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-[#DFD1BE] text-stone-800 transition-colors"
            aria-label="Yopish"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E5D7C3] flex items-center justify-center text-stone-600">
                <ShoppingBag size={32} />
              </div>
              <div>
                <h3 className="font-serif-brand text-lg font-bold text-stone-900 mb-1">
                  Savatingiz hozircha bo'sh
                </h3>
                <p className="text-xs text-stone-600 max-w-xs leading-relaxed">
                  Do'konimizdagi premium kiyimlarni ko'ring va o'zingizga ma'qulini tanlang.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveView('catalog');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
              >
                Kiyimlarni ko'rish
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#ECE1CF] border border-[#DDD0BC] flex items-center gap-3.5 shadow-2xs"
              >
                {/* Thumbnail */}
                <div className="w-18 h-22 rounded-xl overflow-hidden bg-[#DDD0BC] shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-stone-900 text-sm truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-stone-600 mt-0.5 mb-2">
                    <span className="flex items-center gap-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-stone-400"
                        style={{ backgroundColor: item.color.hex }}
                      />
                      <span>{item.color.name}</span>
                    </span>
                    <span>•</span>
                    <span>O'lcham: <strong className="text-stone-800">{item.size}</strong></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#111111]">
                      {formatSom(item.price)}
                    </span>

                    {/* Stepper */}
                    <div className="flex items-center rounded-lg border border-[#CDBEAA] bg-[#F5F0E8] px-1.5 py-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="w-5 h-5 flex items-center justify-center text-xs font-bold text-stone-700 hover:text-black cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="w-5 h-5 flex items-center justify-center text-xs font-bold text-stone-700 hover:text-black cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 text-stone-500 hover:text-red-600 transition-colors cursor-pointer"
                  title="Olib tashlash"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#DFD1BE] bg-[#EFE6D6] space-y-3">
            <div className="space-y-1.5 text-xs text-stone-700">
              <div className="flex justify-between">
                <span>Mahsulotlar narxi:</span>
                <span className="font-medium text-stone-900">{formatSom(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Yetkazib berish:</span>
                {deliveryFee === 0 ? (
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                    BEPUL
                  </span>
                ) : (
                  <span className="font-medium text-stone-900">{formatSom(deliveryFee)}</span>
                )}
              </div>
              {deliveryFee > 0 && settings.delivery.freeDeliveryThreshold > 0 && cartSubtotal < settings.delivery.freeDeliveryThreshold && (
                <p className="text-[10px] text-stone-500 italic">
                  Yana {formatSom(settings.delivery.freeDeliveryThreshold - cartSubtotal)} lik xarid qiling va yetkazib berish bepul bo'ladi!
                </p>
              )}
              <div className="flex justify-between text-base font-bold text-[#111111] pt-2 border-t border-[#DFD1BE]">
                <span>Umumiy summa:</span>
                <span>{formatSom(cartTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 px-4 rounded-xl bg-[#111111] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md cursor-pointer"
            >
              <span>Buyurtmani rasmiylashtirish</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
