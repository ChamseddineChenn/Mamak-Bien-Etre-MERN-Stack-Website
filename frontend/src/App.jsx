import React, { useEffect, useState } from 'react';
import './i18n';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from './pages/UserProfile';
import OrderConfirmation from './pages/OrderConfirmation';
import NewsletterVerification from './pages/NewsletterVerification';
import NewsletterUnsubscribe from './pages/NewsletterUnsubscribe';
import { LanguageProvider } from './context/LanguageContext';
import LoadingPage from './components/LoadingPage';
import { AnimatePresence } from 'framer-motion';
import { assets } from './assets/assets';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  return null;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    // Preload critical images
    const preloadImages = () => {
      const imageUrls = [
        assets.bg_image, // Hero background image
        // Add other critical images here
      ];

      let loadedCount = 0;

      const promises = imageUrls.map((url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = () => {
            loadedCount++;
            const progress = (loadedCount / imageUrls.length) * 70; // 70% for images
            setLoadProgress(progress);
            resolve();
          };
          img.onerror = () => {
            loadedCount++;
            const progress = (loadedCount / imageUrls.length) * 80;
            setLoadProgress(progress);
            resolve(); // Continue even if some images fail
          };
        });
      });

      return Promise.all(promises);
    };

    // Start loading process
    const startTime = Date.now();
    const minimumLoadTime = 2000; // 2 seconds minimum

    setLoadProgress(10); // Start at 10%

    const loadingPromises = [
      preloadImages(),
      new Promise((resolve) => setTimeout(resolve, 500)), // Initial delay
    ];

    Promise.all(loadingPromises)
      .then(() => {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minimumLoadTime - elapsed);

        // Smoothly progress to 100%
        const interval = setInterval(() => {
          setLoadProgress((prev) => {
            if (prev >= 95) {
              clearInterval(interval);
              return 100;
            }
            return prev + (100 - prev) * 0.1; // Exponential approach to 100
          });
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          setLoadProgress(100);
          // Small delay to show 100% before hiding
          setTimeout(() => setIsLoading(false), 300);
        }, remainingTime);
      })
      .catch((error) => {
        console.warn('Loading failed:', error);
        setLoadProgress(100);
        setTimeout(() => setIsLoading(false), 300);
      });
  }, []);

  return (
    <div>
      <ScrollToTop />
      <ToastContainer />
      <LanguageProvider>
        <AnimatePresence mode="wait">
          {isLoading && <LoadingPage progress={loadProgress} />}
        </AnimatePresence>

        {!isLoading && (
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:productId" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/place-order" element={<PlaceOrder />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route
                path="/order-confirmation/:orderId"
                element={<OrderConfirmation />}
              />
              <Route
                path="/verify-newsletter"
                element={<NewsletterVerification />}
              />
              <Route path="/unsubscribe" element={<NewsletterUnsubscribe />} />
            </Routes>
            <Footer />
          </>
        )}
      </LanguageProvider>
    </div>
  );
};

export default App;
