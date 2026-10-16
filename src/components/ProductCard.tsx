import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatSom } from '../utils/formatters';
import { Heart, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    openProductDetail,
    toggleFavorite,
    isFavorite,
    addToCart,
  } = useStore();

  const favorite = isFavorite(product.id);

  // Discount percentage if available
  const discountPercent = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.inStock <= 0) return;
    // Default to first color and size
    addToCart(product, product.colors[0], product.sizes[0] || 'Standart', 1);
  };

  return (
    <div
      onClick={() => openProductDetail(product)}
      className="group relative bg-[#EDE4D6] rounded-2xl border border-[#DECDB7] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#BFAB91] cursor-pointer flex flex-col justify-between"
    >
      {/* Top Badges & Favorite Heart */}
      <div className="relative aspect-4/5 w-full bg-[#E5D9C7] overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="px-2.5 py-1 rounded-md bg-emerald-800 text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
              Yangi
            </span>
          )}
          {discountPercent && (
            <span className="px-2.5 py-1 rounded-md bg-red-700 text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-xs text-stone-800 hover:bg-white hover:text-red-600 transition-colors shadow-xs z-10"
          title={favorite ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
          aria-label="Sevimlilar"
        >
          <Heart
            size={18}
            className={`transition-colors ${favorite ? 'fill-red-600 text-red-600' : 'text-stone-700'}`}
          />
        </button>

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={product.inStock <= 0}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#111111] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={14} />
            <span>{product.inStock > 0 ? 'Savatga' : 'Tugagan'}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProductDetail(product);
            }}
            className="p-2.5 rounded-xl bg-white/90 backdrop-blur-xs text-stone-900 hover:bg-white shadow-md transition-all"
            title="Tafsilotlar"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block mb-1">
            {product.categoryNameUz}
          </span>
          <h3 className="font-semibold text-stone-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-[#9E7B4F] transition-colors">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-1.5 mb-2.5">
            <span className="text-sm sm:text-base font-bold text-[#111111]">
              {formatSom(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-stone-500 line-through">
                {formatSom(product.oldPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Color swatches and Size preview */}
        <div className="pt-2 border-t border-[#DFD0BD] flex items-center justify-between">
          {/* Colors */}
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 4).map((c, idx) => (
              <span
                key={idx}
                className="w-3.5 h-3.5 rounded-full border border-stone-400 shadow-2xs"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-stone-500 font-medium">
                +{product.colors.length - 4}
              </span>
            )}
          </div>

          {/* Sizes */}
          <div className="flex items-center gap-1 text-[11px] text-stone-600 font-medium">
            {product.sizes.slice(0, 3).map((s, idx) => (
              <span key={idx} className="px-1 py-0.5 rounded bg-[#DFD3C2] text-stone-800">
                {s}
              </span>
            ))}
            {product.sizes.length > 3 && (
              <span className="text-[10px] text-stone-500">
                +{product.sizes.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
