/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { CatalogSection } from './components/CatalogSection';
import { ReadyLooksSection } from './components/ReadyLooksSection';
import { FavoritesView } from './components/FavoritesView';
import { ContactSection } from './components/ContactSection';
import { AdminPanel } from './components/AdminPanel';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { ToastContainer } from './components/ToastContainer';
import { BottomMobileNav } from './components/BottomMobileNav';
import { Footer } from './components/Footer';

const StoreContent: React.FC = () => {
  const { activeView } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8] text-[#111111]">
      {/* Top Header Navbar */}
      <Navbar />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeView === 'home' && <HomePage />}
        {activeView === 'catalog' && <CatalogSection />}
        {activeView === 'ready-looks' && <ReadyLooksSection />}
        {activeView === 'favorites' && <FavoritesView />}
        {activeView === 'contact' && <ContactSection />}
        {activeView === 'admin' && <AdminPanel />}
      </main>

      {/* Footer */}
      {activeView !== 'admin' && <Footer />}

      {/* Bottom Floating Navigation for Mobile Phones */}
      <BottomMobileNav />

      {/* Global Modals and Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <SearchModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
