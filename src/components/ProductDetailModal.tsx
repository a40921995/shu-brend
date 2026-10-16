import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { formatSom } from '../utils/formatters';
import { ProductColor } from '../types';
import {
  X,
  Star,
  Check,
  Heart,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductDetail,
    closeProductDetail,
    addToCart,
    toggleFavorite,
    isFavorite,
    setIsCartOpen,
  } = useStore();

  const product = selectedProductDetail;
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Accordions
  const [openSection, setOpenSection] = useState<'desc' | 'sizes' | 'delivery' | null>('desc');

  useEffect(() => {
    if (product) {
      setActiveImageIdx(0);
      setSelectedColor(product.colors[0] || null);
      setSelectedSize(product.sizes[0] || 'Standart');
      setQuantity(1);
      setOpenSection('desc');
    }
  }, [product]);

  if (!product) return null;

  const favorite = isFavorite(product.id);
  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  const handleAddToCart = () => {
    if (!selectedColor) return;
    addToCart(product, selectedColor, selectedSize, quantity);
    setIsCartOpen(true);
    closeProductDetail();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-[#F5F0E8] w-full max-w-4xl rounded-3xl shadow-2xl border border-[#D9CDB8] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeProductDetail}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#E5D7C3] text-stone-900 hover:bg-[#D5C5AE] transition-colors"
          aria-label="Yopish"
        >
          <X size={20} />
        </button>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 p-4 sm:p-6 bg-[#EFE6D6] flex flex-col justify-between">
            {/* Main Image */}
            <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-[#E2D4BF] shadow-inner mb-4">
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {discountPercent && (
                <span className="absolute top-3 left-3 px-3 py-1 bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIdx === idx ? 'border-[#111111] scale-102 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-[#F5F0E8]">
            <div>
              {/* Category */}
              <span className="text-xs uppercase font-bold tracking-wider text-stone-500">
                {product.categoryNameUz}
              </span>

              {/* Title */}
              <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#111111] mt-1 mb-2">
                {product.name}
              </h2>

              {/* Price and Rating */}
              <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-[#E0D3C1]">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-bold text-[#111111]">
                    {formatSom(product.price)}
                  </span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="text-sm text-stone-500 line-through">
                      {formatSom(product.oldPrice)}
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 text-xs text-stone-700 bg-[#E8DDD0] px-2.5 py-1 rounded-lg">
                  <Star size={14} className="fill-amber-500 text-amber-500" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-stone-500">({product.reviewsCount})</span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-xs mb-5">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    product.inStock > 0 ? 'bg-emerald-600' : 'bg-red-500'
                  }`}
                />
                <span className="font-medium text-stone-800">
                  {product.inStock > 0
                    ? `Mavjud: ${product.inStock} dona omborda`
                    : 'Ayni vaqtda tugagan'}
                </span>
              </div>

              {/* Color Selection */}
              <div className="mb-5">
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-2">
                  Rang: <span className="font-normal text-stone-600 capitalize">{selectedColor?.name}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(c)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor?.name === c.name
                          ? 'border-[#111111] scale-110 shadow-md ring-2 ring-[#111111]/20'
                          : 'border-stone-400 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor?.name === c.name && (
                        <Check
                          size={14}
                          className={c.name === 'Oq' || c.hex === '#FFFFFF' ? 'text-black' : 'text-white'}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-2">
                  O'lcham:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        selectedSize === s
                          ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                          : 'bg-[#EDE4D5] text-stone-800 border-[#D9CBB7] hover:bg-[#E2D5C3]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector & Action CTAs */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center rounded-xl border border-[#D5C4AE] bg-[#EDE4D5] px-2 py-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 flex items-center justify-center text-stone-800 font-bold hover:bg-[#DFD1BF] rounded-lg"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.inStock, q + 1))}
                      className="w-7 h-7 flex items-center justify-center text-stone-800 font-bold hover:bg-[#DFD1BF] rounded-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Primary Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.inStock <= 0}
                    className="flex-1 py-3 px-5 rounded-xl bg-[#111111] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ShoppingBag size={18} />
                    <span>Savatga qo'shish</span>
                  </button>
                </div>

                {/* Favorite Secondary Button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#CDBEAA] bg-[#EFE6D7] text-stone-800 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#E5D9C7] transition-all cursor-pointer"
                >
                  <Heart
                    size={16}
                    className={favorite ? 'fill-red-600 text-red-600' : 'text-stone-700'}
                  />
                  <span>
                    {favorite ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
                  </span>
                </button>
              </div>

              {/* Information Accordions */}
              <div className="border-t border-[#DFD1BE] pt-4 space-y-2 text-xs">
                {/* Tavsif */}
                <div className="border-b border-[#E5D7C4] pb-2">
                  <button
                    onClick={() => setOpenSection(openSection === 'desc' ? null : 'desc')}
                    className="w-full flex items-center justify-between py-1.5 font-bold text-stone-900 text-left"
                  >
                    <span>Tavsif va mato tarkibi</span>
                    {openSection === 'desc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openSection === 'desc' && (
                    <div className="pt-2 text-stone-700 space-y-1.5 leading-relaxed">
                      <p>{product.description}</p>
                      <p><strong>Mato:</strong> {product.details.fabric}</p>
                      <p><strong>Parvarishlash:</strong> {product.details.care}</p>
                      <p><strong>Ishlab chiqaruvchi:</strong> {product.details.origin}</p>
                    </div>
                  )}
                </div>

                {/* O'lchamlar jadvali */}
                <div className="border-b border-[#E5D7C4] pb-2">
                  <button
                    onClick={() => setOpenSection(openSection === 'sizes' ? null : 'sizes')}
                    className="w-full flex items-center justify-between py-1.5 font-bold text-stone-900 text-left"
                  >
                    <span>O'lchamlar jadvali (sm)</span>
                    {openSection === 'sizes' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openSection === 'sizes' && (
                    <div className="pt-2 overflow-x-auto">
                      <table className="w-full text-center border-collapse text-[11px]">
                        <thead>
                          <tr className="bg-[#E4D5BF] text-stone-900 font-bold">
                            <th className="p-1.5 border border-[#D5C4AC]">O'lcham</th>
                            <th className="p-1.5 border border-[#D5C4AC]">Bo'y (sm)</th>
                            <th className="p-1.5 border border-[#D5C4AC]">Ko'krak (sm)</th>
                            <th className="p-1.5 border border-[#D5C4AC]">Yelka (sm)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-1 border border-[#D5C4AC] font-bold">S</td>
                            <td className="p-1 border border-[#D5C4AC]">165-172</td>
                            <td className="p-1 border border-[#D5C4AC]">90-95</td>
                            <td className="p-1 border border-[#D5C4AC]">43-44</td>
                          </tr>
                          <tr>
                            <td className="p-1 border border-[#D5C4AC] font-bold">M</td>
                            <td className="p-1 border border-[#D5C4AC]">170-178</td>
                            <td className="p-1 border border-[#D5C4AC]">96-101</td>
                            <td className="p-1 border border-[#D5C4AC]">45-46</td>
                          </tr>
                          <tr>
                            <td className="p-1 border border-[#D5C4AC] font-bold">L</td>
                            <td className="p-1 border border-[#D5C4AC]">175-182</td>
                            <td className="p-1 border border-[#D5C4AC]">102-107</td>
                            <td className="p-1 border border-[#D5C4AC]">47-48</td>
                          </tr>
                          <tr>
                            <td className="p-1 border border-[#D5C4AC] font-bold">XL</td>
                            <td className="p-1 border border-[#D5C4AC]">180-188</td>
                            <td className="p-1 border border-[#D5C4AC]">108-114</td>
                            <td className="p-1 border border-[#D5C4AC]">49-50</td>
                          </tr>
                          <tr>
                            <td className="p-1 border border-[#D5C4AC] font-bold">XXL</td>
                            <td className="p-1 border border-[#D5C4AC]">185-195</td>
                            <td className="p-1 border border-[#D5C4AC]">115-122</td>
                            <td className="p-1 border border-[#D5C4AC]">51-53</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Yetkazib berish va qaytarish */}
                <div className="pb-2">
                  <button
                    onClick={() => setOpenSection(openSection === 'delivery' ? null : 'delivery')}
                    className="w-full flex items-center justify-between py-1.5 font-bold text-stone-900 text-left"
                  >
                    <span>Yetkazib berish va qaytarish shartlari</span>
                    {openSection === 'delivery' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openSection === 'delivery' && (
                    <div className="pt-2 text-stone-700 space-y-1 leading-relaxed">
                      <p>📦 <strong>Toshkent shahri:</strong> Buyurtma berilgan kundan 24 soat ichida yetkaziladi.</p>
                      <p>🚚 <strong>Barcha viloyatlar:</strong> BTS yoki EMU pochtasi orqali 1-3 ish kunida yetkaziladi.</p>
                      <p>🔄 <strong>Almashtirish:</strong> O'lcham to'g'ri kelmasa, 14 kun ichida kiyim toza holatda almashtirib beriladi.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
