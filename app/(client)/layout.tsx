'use client';

import Link from 'next/link';
import { Ticket, ShoppingCart, Globe, Menu, X } from 'lucide-react';
import { Language } from '@/types/lang';
import { useEffect, useState } from 'react';
import locales from '@/locales/common.json';
import { useLanguage } from '@/src/app/context/LanguageContext';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lang, setLang } = useLanguage();
  const [loading, setLoading] = useState<boolean>(true);
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const updateCartCount = () => {
    const storedItems = localStorage.getItem('bookedCatalogs');
    if (storedItems) {
      const items = JSON.parse(storedItems);
      setCartCount(items.length);
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bookedCatalogs') {
        updateCartCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const intervalId = setInterval(() => {
      updateCartCount();
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  function setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  }

  const handleChangeLang = (selectedLang: string) => {
    setCookie('lang', selectedLang, 365);
    setIsSelectVisible(false);
    if (['kz', 'ru', 'en'].includes(selectedLang)) {
      setLang(selectedLang as Language);
    }
    console.log('Current Language:', lang);
  };

  const toggleSelect = () => {
    setIsSelectVisible(!isSelectVisible);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-2 sm:py-4">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="text-lg sm:text-2xl font-bold flex items-center space-x-2"
            >
              <Ticket size={24} className="sm:w-8 sm:h-8" />
              <span className="inline">BirgeTours</span>
            </Link>
            <nav className="hidden md:block">
              <ul className="flex space-x-4 sm:space-x-6 text-xs sm:text-sm font-semibold">
                <li>
                  <Link
                    href="/"
                    className="hover:text-purple-200 transition duration-300"
                  >
                    {locales[lang].header.links.labelH}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalogs"
                    className="hover:text-purple-200 transition duration-300"
                  >
                    {locales[lang].header.links.labelC}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-purple-200 transition duration-300"
                  >
                    {locales[lang].header.links.labelA}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-purple-200 transition duration-300"
                  >
                    {locales[lang].header.links.labelCo}
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/cart"
                className="hover:text-purple-200 transition duration-300 relative"
              >
                <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="relative">
                <button
                  onClick={toggleSelect}
                  className="hover:text-purple-200 transition duration-300"
                >
                  <Globe className="w-5 h-5 sm:w-[20px] sm:h-[20px]" />
                </button>
                {isSelectVisible && (
                  <div className="absolute right-0 mt-2 bg-white shadow-lg rounded z-10">
                    <ul className="text-xs sm:text-sm text-gray-800">
                      <li
                        className="px-3 py-2 sm:px-4 sm:py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleChangeLang('kz')}
                      >
                        {locales[lang].languages.kz}
                      </li>
                      <li
                        className="px-3 py-2 sm:px-4 sm:py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleChangeLang('ru')}
                      >
                        {locales[lang].languages.ru}
                      </li>
                      <li
                        className="px-3 py-2 sm:px-4 sm:py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleChangeLang('en')}
                      >
                        {locales[lang].languages.en}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <button onClick={toggleMenu} className="md:hidden">
                {isMenuOpen ? (
                  <X size={20} className="sm:w-6 sm:h-6" />
                ) : (
                  <Menu size={20} className="sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <nav className="mt-2 sm:mt-4 md:hidden">
              <ul className="flex flex-col space-y-1 sm:space-y-2 text-xs sm:text-sm font-semibold">
                <li>
                  <Link
                    href="/"
                    className="block hover:text-purple-200 transition duration-300"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalogs"
                    className="block hover:text-purple-200 transition duration-300"
                  >
                    Catalogs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="block hover:text-purple-200 transition duration-300"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="block hover:text-purple-200 transition duration-300"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-4 sm:py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
                {locales[lang].footer.about.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                {locales[lang].footer.about.description}
              </p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
                {locales[lang].footer.quickLinks.title}
              </h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <Link
                    href="/"
                    className="hover:text-white transition duration-300"
                  >
                    {locales[lang].footer.quickLinks.links.labelH}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalogs"
                    className="hover:text-white transition duration-300"
                  >
                    {locales[lang].footer.quickLinks.links.labelC}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition duration-300"
                  >
                    {locales[lang].footer.quickLinks.links.labelA}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition duration-300"
                  >
                    {locales[lang].footer.quickLinks.links.labelCo}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
                {locales[lang].footer.contact.title}
              </h3>
              <address className="text-xs sm:text-sm text-gray-400 not-italic">
                <p>{locales[lang].footer.contact.address.location}</p>
                <p>{locales[lang].footer.contact.address.phone}</p>
                <p>{locales[lang].footer.contact.address.email}</p>
              </address>
            </div>
          </div>
          <div className="mt-5 sm:mt-8 pt-5 sm:pt-8 border-t border-gray-700 text-center text-xs sm:text-sm text-gray-400">
            <p>
              {' '}
              {new Date().getFullYear()}
              {locales[lang].footer.about.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
