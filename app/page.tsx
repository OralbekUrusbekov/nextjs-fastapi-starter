'use client';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Music,
  Ticket,
  Star,
  ArrowRight,
  Users,
  ShoppingCart,
  Globe,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import locales from '@/locales/common.json';
import { useEffect, useState } from 'react';
import { Language } from '@/types/lang';
import { getLanguage } from '@/action/set-cookie';

interface Favorite {
  id: number;
  name: string;
  photo: string;
  text: string;
  rating: number;
}

export default function Home() {
  const [lang, setLanguage] = useState<Language>('ru');
  const [loading, setLoading] = useState<boolean>(true);
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/favorites`
        );
        if (!response.ok) {
          setFavorites([]);
          throw new Error('Failed to fetch favorites');
        }
        const data = await response.json();
        setFavorites(data);
      } catch (err: unknown) {
        console.log('Error fetching favorites:', err);
      }
    }
    fetchFavorites();
  }, []);

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
    getLang();
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
    setLanguage(selectedLang as Language);
    setCookie('lang', selectedLang, 365);
    setIsSelectVisible(false);
  };

  const toggleSelect = () => {
    setIsSelectVisible(!isSelectVisible);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const featuredEvents = [
    {
      id: 1,
      title: 'Ferrari World Abu Dhabi',
      description:
        "Explore the world's largest indoor theme park dedicated to Ferrari",
      price: 230,
      image: '/images/McLaren.jpeg',
      location: 'Yas Island, Abu Dhabi',
      rating: 4.7,
    },
    {
      id: 2,
      title: 'Ferrari World Abu Dhabi',
      description:
        "Explore the world's largest indoor theme park dedicated to Ferrari",
      price: 230,
      image: '/images/McLaren.jpeg',
      location: 'Yas Island, Abu Dhabi',
      rating: 4.7,
    },
    {
      id: 3,
      title: 'Ferrari World Abu Dhabi',
      description:
        "Explore the world's largest indoor theme park dedicated to Ferrari",
      price: 230,
      image: '/images/McLaren.jpeg',
      location: 'Yas Island, Abu Dhabi',
      rating: 4.7,
    },
  ];

  const getLang = async () => {
    setLanguage(await getLanguage());
    setLoading(false);
  };
  useEffect(() => {
    getLang();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setCurrentReviewIndex(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showNextReview = () => {
    setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % favorites.length);
  };

  const showPrevReview = () => {
    setCurrentReviewIndex(
      (prevIndex) => (prevIndex - 1 + favorites.length) % favorites.length
    );
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 text-white">
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

      <div className="space-y-8 sm:space-y-16">
        <section className="relative h-[60vh] sm:h-[75vh] flex items-center justify-center">
          <Image
            src="/images/Tourist.jpeg"
            alt="Hero background"
            fill
            style={{ objectFit: 'cover' }}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-3 sm:mb-6">
              {locales[lang].hero.title}
            </h1>
            <p className="text-sm sm:text-xl md:text-2xl mb-4 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto">
              {locales[lang].hero.description}
            </p>
            <Link
              href="/catalogs"
              className="bg-purple-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold hover:bg-purple-700 transition duration-300 inline-flex items-center"
            >
              <Ticket className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              {locales[lang].hero.button}
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
            {locales[lang].whyChoose.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {Object.entries(locales[lang].whyChoose.items).map(
              ([key, item]) => (
                <div
                  key={key}
                  className="bg-white p-4 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center"
                >
                  {key === 'Calendar' && (
                    <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-purple-600 mb-3 sm:mb-4 mx-auto" />
                  )}
                  {key === 'MapPin' && (
                    <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-purple-600 mb-3 sm:mb-4 mx-auto" />
                  )}
                  {key === 'Music' && (
                    <Music className="w-12 h-12 sm:w-16 sm:h-16 text-purple-600 mb-3 sm:mb-4 mx-auto" />
                  )}
                  {key === 'MapPinn' && (
                    <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-purple-600 mb-3 sm:mb-4 mx-auto" />
                  )}
                  {key === 'Users' && (
                    <Users className="w-12 h-12 sm:w-16 sm:h-16 text-purple-600 mb-3 sm:mb-4 mx-auto" />
                  )}
                  {key === 'Star' && (
                    <Star className="w-12 h-12 sm:w-16 sm:h-16 text-purple-600 mb-3 sm:mb-4 mx-auto" />
                  )}
                  <h3 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        <section className="bg-gray-100 py-8 sm:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
              {locales[lang].featuredEvents.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {featuredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                >
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={800}
                    height={600}
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-3 sm:mb-4">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">
                        {event.location}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg sm:text-2xl font-bold text-purple-600">
                        ${event.price}
                      </span>
                      <Link
                        href={`/catalogs/${event.id}`}
                        className="bg-purple-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-purple-700 transition duration-300 flex items-center"
                      >
                        {locales[lang].featuredEvents.bookNow}
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-6">
            {locales[lang].readyToExperience.title}
          </h2>
          <p className="text-sm sm:text-xl text-gray-600 mb-4 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto">
            {locales[lang].readyToExperience.description}
          </p>
          <Link
            href="/catalogs"
            className="bg-purple-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold hover:bg-purple-700 transition duration-300 inline-flex items-center"
          >
            <Ticket className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            {locales[lang].readyToExperience.browseCatalogs}
          </Link>
        </section>

        <section className="bg-purple-600 text-white py-8 sm:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              {locales[lang].customerReviews.title}
            </h2>
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${currentReviewIndex * 100}%)`,
                  }}
                >
                  {favorites.map((favorite, index) => (
                    <div
                      key={favorite.id}
                      className="w-full md:w-1/3 flex-shrink-0 px-2"
                    >
                      <div
                        className={`bg-white text-gray-800 p-4 sm:p-6 rounded-xl shadow-md h-full flex flex-col justify-between ${index >= currentReviewIndex && index < currentReviewIndex + 3 ? '' : 'hidden md:flex'}`}
                      >
                        <div>
                          <div className="flex items-center justify-center mb-4">
                            <Image
                              src={`http://127.0.0.1:8000/${favorite.photo}`}
                              alt={favorite.name}
                              width={120}
                              height={120}
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div className="flex items-center justify-center mb-3 sm:mb-4">
                            {[...Array(favorite.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                          <p className="text-sm sm:text-base mb-3 sm:mb-4">
                            {favorite.text}
                          </p>
                        </div>
                        <p className="text-sm sm:text-base font-semibold">
                          - {favorite.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={showPrevReview}
                disabled={currentReviewIndex === 0}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 text-purple-600 hover:bg-opacity-75 transition-all duration-1000"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={showNextReview}
                disabled={currentReviewIndex === favorites.length - 1}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 text-purple-600 hover:bg-opacity-75 transition-all duration-1000"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
