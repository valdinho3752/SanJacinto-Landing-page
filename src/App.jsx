import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WorkShowcase from './components/WorkShowcase';
import PricingSection from './components/PricingSection';
import ImplantSpecialty from './components/ImplantSpecialty';
import AppointmentSection from './components/AppointmentSection';
import ReviewsSection from './components/ReviewsSection';
import MapSection from './components/MapSection';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import { translations } from './data/translations';
import { Phone, ShoppingCart, Calendar } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('es');
  const [isLargeText, setIsLargeText] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [bookingService, setBookingService] = useState('');

  // Routing for Terms and Privacy pages
  const getInitialRoute = () => {
    try {
      const path = decodeURIComponent(window.location.pathname).toLowerCase();
      if (path.includes('terminos')) return 'terms';
      if (path.includes('politica') || path.includes('privasidad') || path.includes('privacidad') || path.includes('privacy')) return 'privacy';
    } catch (e) {}
    return 'home';
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(getInitialRoute());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart state initialized from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('sj_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sj_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Handle large text mode
  useEffect(() => {
    if (isLargeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  }, [isLargeText]);

  const t = translations[lang];

  // Cart operations
  const addToCart = (service, arch = 'both') => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === service.id && item.arch === arch
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: service.id,
            name: service.name,
            spanishName: service.spanishName,
            arch: arch,
            price: service.price,
            quantity: 1
          }
        ];
      }
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, arch, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id, arch);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.arch === arch
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (id, arch) => {
    setCartItems(prev =>
      prev.filter(item => !(item.id === id && item.arch === arch))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Smooth scroll to the appointment section on the main landing page
  const scrollToAppointment = (serviceName = '') => {
    if (serviceName) {
      setBookingService(serviceName);
    }
    const element = document.getElementById('citas');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (currentRoute === 'terms') {
    return <TermsPage onBackToHome={() => navigateTo('/')} lang={lang} setLang={setLang} />;
  }

  if (currentRoute === 'privacy') {
    return <PrivacyPage onBackToHome={() => navigateTo('/')} lang={lang} setLang={setLang} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Header with Navigation and Accessibility Controls */}
      <Header
        lang={lang}
        setLang={setLang}
        t={t}
        cartCount={totalCartCount}
        setIsCartOpen={setIsCartOpen}
        isLargeText={isLargeText}
        setIsLargeText={setIsLargeText}
        onBookClick={() => scrollToAppointment()}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero 
          t={t} 
          onBookClick={() => scrollToAppointment()} 
        />

        {/* Real Work Showcase with denture_ex.jpg */}
        <WorkShowcase 
          t={t} 
          onBookClick={() => scrollToAppointment()} 
        />

        {/* Pricing & Services Section with Cart triggers */}
        <PricingSection
          t={t}
          lang={lang}
          addToCart={addToCart}
          cartItems={cartItems}
          onBookClick={(service) => scrollToAppointment(service)}
        />

        {/* Implant Specialty Section */}
        <ImplantSpecialty 
          t={t} 
          onBookClick={(service) => scrollToAppointment(service)} 
        />

        {/* Online Appointment Booking Section directly on the main landing page */}
        <AppointmentSection 
          t={t} 
          lang={lang}
          initialService={bookingService} 
          onNavigate={navigateTo}
        />

        {/* Real Patient Reviews */}
        <ReviewsSection 
          t={t} 
          lang={lang} 
        />

        {/* Map Location Section with Google Maps Widget */}
        <MapSection 
          t={t} 
          lang={lang}
        />
      </main>

      {/* Footer */}
      <Footer t={t} lang={lang} onNavigate={navigateTo} />

      {/* Shopping Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        t={t}
        lang={lang}
        onNavigate={navigateTo}
      />

      {/* Floating Quick Action Bar for Elderly Convenience on Mobile */}
      <div className="fixed bottom-4 left-4 right-4 z-30 flex items-center justify-between gap-2 max-w-md mx-auto sm:hidden">
        <a
          href="tel:+14423742450"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-blue text-white py-3 px-3 rounded-2xl shadow-2xl font-black text-xs border-2 border-blue-400/40"
        >
          <Phone className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>{lang === 'es' ? 'Llamar' : 'Call'}</span>
        </a>

        <button
          onClick={() => scrollToAppointment()}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-navy-900 text-amber-300 py-3 px-3 rounded-2xl shadow-2xl font-black text-xs border-2 border-slate-700"
        >
          <Calendar className="w-4 h-4 text-sky-400" />
          <span>{lang === 'es' ? 'Pedir Cita' : 'Book Visit'}</span>
        </button>

        {totalCartCount > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center justify-center gap-1 bg-navy-900 text-white p-3 rounded-2xl shadow-2xl font-black border-2 border-slate-700"
            aria-label="Ver carrito"
          >
            <ShoppingCart className="w-4 h-4 text-amber-400" />
            <span className="bg-amber-400 text-navy-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-black">
              {totalCartCount}
            </span>
          </button>
        )}
      </div>

    </div>
  );
}
