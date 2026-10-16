import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES_LIST } from '../data/initialData';
import { ProductCard } from './ProductCard';
import { Search, Filter, X } from 'lucide-react';

export const CatalogSection: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'newest'>('popular');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('all');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available unique colors and sizes for filter dropdowns
  const availableColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => set.add(c.name)));
    return Array.from(set);
  }, [products]);

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Active filter
        if (!p.isActive) return false;
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.categoryNameUz.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }
        // Color filter
        if (
          selectedColorFilter !== 'all' &&
          !p.colors.some((c) => c.name.toLowerCase() === selectedColorFilter.toLowerCase())
        ) {
          return false;
        }
        // Size filter
        if (selectedSizeFilter !== 'all' && !p.sizes.includes(selectedSizeFilter)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        // Default popular
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      });
  }, [products, selectedCategory, searchQuery, selectedColorFilter, selectedSizeFilter, sortBy]);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedColorFilter('all');
    setSelectedSizeFilter('all');
    setSortBy('popular');
  };

  return (
    <section className="py-8 sm:py-12 bg-[#F5F0E8] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Mobile Filter Button */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E0D3BF]">
          <div>
            <h1 className="font-serif-brand text-2xl sm:text-3xl font-extrabold text-[#111111]">
              Mahsulotlar katalogi
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Jami {filteredProducts.length} ta erkaklar kiyimi va aksessuarlari topildi
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E8DDD0] text-stone-900 text-xs font-bold border border-[#D5C5B0] cursor-pointer"
          >
            <Filter size={16} />
            <span>Kategoriyalar</span>
          </button>
        </div>

        {/* 2-Column Catalog Grid (Sidebar + Products) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Categories Sidebar (3 cols) */}
          <div
            className={`md:col-span-3 space-y-4 ${
              mobileFilterOpen ? 'block' : 'hidden md:block'
            }`}
          >
            <div className="bg-[#EFE6D6] p-4 rounded-2xl border border-[#DECDB7] shadow-2xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#DECDB7]">
                <h3 className="font-serif-brand font-bold text-sm text-stone-900">
                  Kategoriyalar
                </h3>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="text-[11px] text-stone-500 hover:text-black font-semibold cursor-pointer"
                  >
                    Barchasi
                  </button>
                )}
              </div>

              <div className="space-y-1">
                {/* All category */}
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMobileFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'text-stone-800 hover:bg-[#E5D7C3]'
                  }`}
                >
                  <span>Barcha mahsulotlar</span>
                  <span className="text-[10px] opacity-75">
                    {products.filter((p) => p.isActive).length}
                  </span>
                </button>

                {/* 14 specific categories */}
                {CATEGORIES_LIST.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const catCount = products.filter(
                    (p) => p.category === cat.id && p.isActive
                  ).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#111111] text-white shadow-xs'
                          : 'text-stone-700 hover:bg-[#E5D7C3]'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] opacity-75">{catCount}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Search, Filters & Products Grid (9 cols) */}
          <div className="md:col-span-9 space-y-6">
            {/* Search and Filters Bar */}
            <div className="bg-[#EFE6D6] p-4 rounded-2xl border border-[#DECDB7] space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-3 text-stone-500" />
                <input
                  type="text"
                  placeholder="Mahsulot nomini qidiring..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#111111] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-stone-500 hover:text-black cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Filter controls row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {/* Sort dropdown */}
                <div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] text-stone-800 font-semibold focus:outline-hidden cursor-pointer"
                  >
                    <option value="popular">Ommabop</option>
                    <option value="price-asc">Narx: Arzondan qimmatga</option>
                    <option value="price-desc">Narx: Qimmatdan arzonga</option>
                    <option value="newest">Yangi kelganlar</option>
                  </select>
                </div>

                {/* Color filter */}
                <div>
                  <select
                    value={selectedColorFilter}
                    onChange={(e) => setSelectedColorFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] text-stone-800 font-semibold focus:outline-hidden cursor-pointer"
                  >
                    <option value="all">Barcha ranglar</option>
                    {availableColors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Size filter */}
                <div>
                  <select
                    value={selectedSizeFilter}
                    onChange={(e) => setSelectedSizeFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5C5B0] bg-[#F5F0E8] text-stone-800 font-semibold focus:outline-hidden cursor-pointer"
                  >
                    <option value="all">Barcha o'lchamlar</option>
                    {availableSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters tags if any */}
            {(selectedCategory !== 'all' ||
              searchQuery ||
              selectedColorFilter !== 'all' ||
              selectedSizeFilter !== 'all') && (
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-stone-500 font-medium">Faol filtrlar:</span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#111111] text-white font-semibold">
                    Kategoriya
                    <button onClick={() => setSelectedCategory('all')}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#111111] text-white font-semibold">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedColorFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#111111] text-white font-semibold">
                    {selectedColorFilter}
                    <button onClick={() => setSelectedColorFilter('all')}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedSizeFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#111111] text-white font-semibold">
                    O'lcham: {selectedSizeFilter}
                    <button onClick={() => setSelectedSizeFilter('all')}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleClearFilters}
                  className="text-stone-600 hover:text-red-600 underline font-semibold ml-2 cursor-pointer"
                >
                  Hammasini tozalash
                </button>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-[#EFE6D6] rounded-2xl border border-[#DECDB7] space-y-3">
                <p className="text-stone-700 font-bold text-sm">
                  Hech qanday mahsulot topilmadi
                </p>
                <p className="text-stone-500 text-xs">
                  Iltimos, boshqa kalit so'z yoki filtr parametrlarini tanlab ko'ring.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2 rounded-xl bg-[#111111] text-white text-xs font-bold hover:bg-black cursor-pointer"
                >
                  Filtrlarni bekor qilish
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
