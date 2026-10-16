import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { formatSom } from '../utils/formatters';
import { Search, X, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    openProductDetail,
    setSelectedCategory,
    setActiveView,
  } = useStore();

  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryNameUz.toLowerCase().includes(q)
      );
    });
  }, [query, products]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-fadeIn">
      <div
        className="bg-[#F5F0E8] w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-[#D5C4AC] max-h-[80vh] flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#D5C4AC]">
            <div className="flex items-center gap-3 flex-1">
              <Search size={22} className="text-stone-500" />
              <input
                type="text"
                autoFocus
                placeholder="Kiyim nomi, mato yoki kategoriya bo'yicha qidiring..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base font-medium text-stone-900 placeholder:text-stone-500 focus:outline-hidden"
              />
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1.5 rounded-full hover:bg-[#E5D7C3] text-stone-700 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Popular Search Suggestions */}
          {!query && (
            <div className="py-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Ommabop qidiruvlar:
              </p>
              <div className="flex flex-wrap gap-2">
                {['Kurtka', 'Klassik ko\'ylak', 'Kostyum', 'Jinsi', 'Krossovka', 'Kashemir sviter', 'Soat'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3.5 py-1.5 rounded-full bg-[#EDE2D0] hover:bg-[#DFD1BE] text-xs font-semibold text-stone-800 transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {query && (
            <div className="py-4 overflow-y-auto max-h-[50vh] space-y-2">
              <p className="text-xs text-stone-500 mb-2">
                Natijalar: <strong>{searchResults.length} ta</strong> mahsulot topildi
              </p>
              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-stone-500 text-xs">
                  "{query}" bo'yicha hech narsa topilmadi.
                </div>
              ) : (
                searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      openProductDetail(product);
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#EDE2D0] hover:bg-[#DFD0BC] transition-colors cursor-pointer border border-[#DECDB7]"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt=""
                        className="w-12 h-14 object-cover rounded-xl bg-stone-300"
                      />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-500">
                          {product.categoryNameUz}
                        </span>
                        <h4 className="font-bold text-stone-900 text-sm">{product.name}</h4>
                        <p className="font-extrabold text-[#111111] text-xs mt-0.5">
                          {formatSom(product.price)}
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-stone-400" />
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-[#D5C4AC] flex justify-between items-center text-xs text-stone-600">
          <span>Qidirish uchun matn yozing</span>
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setSelectedCategory('all');
              setActiveView('catalog');
            }}
            className="font-bold text-stone-900 hover:underline cursor-pointer"
          >
            Katalogga o'tish →
          </button>
        </div>
      </div>
    </div>
  );
};
