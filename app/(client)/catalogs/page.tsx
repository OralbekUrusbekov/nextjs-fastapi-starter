'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';

interface Catalog {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  location: string;
  rating: number;
}

export default function Catalogs() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    async function fetchCatalogs() {
      if (catalogs.length > 0) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/catalogs`);
        if (!response.ok) {
          throw new Error('Failed to fetch catalogs');
        }

        const data = await response.json();
        setCatalogs(data);
      } catch (err: unknown) {
        setError((err as Error).message || 'Error');
      } finally {
        setLoading(false);
      }
    }
    fetchCatalogs();
  }, [catalogs.length]);
  if (loading) {
    return <div className="text-center py-8 sm:py-12">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8 sm:py-12">
        Error: {error}
      </div>
    );
  }

  const handleBookNow = (catalogId: number) => {
    const selectedCatalog = catalogs.find(
      (catalog) => catalog.id === catalogId
    );
    if (selectedCatalog) {
      const bookedCatalogs: Array<Catalog & { quantity: number }> = JSON.parse(
        localStorage.getItem('bookedCatalogs') || '[]'
      );
      const existingItem = bookedCatalogs.find((item) => item.id === catalogId);

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        bookedCatalogs.push({ ...selectedCatalog, quantity: 1 });
      }

      localStorage.setItem('bookedCatalogs', JSON.stringify(bookedCatalogs));
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = catalogs.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(catalogs.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">
        Explore Our Catalogs
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {currentItems.map((catalog) => (
          <div
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 hover:scale-[1.01] cursor-pointer"
            key={catalog.id}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_URL_IMAGE}/${catalog.image}`}
              alt={catalog.title}
              width={1200}
              height={800}
              priority={true}
              className="w-full h-48 sm:h-64 object-cover"
              quality={90}
            />
            <div className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                {catalog.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                {catalog.description}
              </p>
              <div className="flex items-center mb-2 sm:mb-4">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2" />
                <span className="text-xs sm:text-sm text-gray-600">
                  {catalog.location}
                </span>
              </div>
              <div className="flex items-center mb-4">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-2" />
                <span className="text-xs sm:text-sm text-gray-600">
                  {catalog.rating} / 5
                </span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <span className="text-xl sm:text-2xl font-bold text-purple-600 mb-2 sm:mb-0">
                  ${catalog.price}
                </span>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Link href={`/catalogs/${catalog.id}`}>
                    <button className="bg-purple-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-purple-700 transition duration-300 flex items-center justify-center w-full sm:w-auto">
                      <Ticket className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                      Learn More
                    </button>
                  </Link>
                  <button
                    onClick={() => handleBookNow(catalog.id)}
                    className="bg-purple-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-purple-700 transition duration-300 flex items-center justify-center w-full sm:w-auto"
                  >
                    <Ticket className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 sm:mt-8">
        <nav className="inline-flex rounded-md shadow">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 sm:px-3 sm:py-2 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium ${
                currentPage === number
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === pageNumbers.length}
            className="px-2 py-1 sm:px-3 sm:py-2 rounded-r-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </nav>
      </div>
    </div>
  );
}
