'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { MapPin, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

interface Catalog {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  information: string[];
  location: string;
  rating: number;
}

export default function CatalogDetail() {
  const { id } = useParams();
  const [error, setError] = useState<string>('');
  const [catalog, setCatalog] = useState<Catalog | null>(null);

  useEffect(() => {
    async function fetchCatalogs() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/catalogs/${id}`
        );
        if (!response.ok) {
          setCatalog(null);
          throw new Error('Failed to fetch catalogs');
        }
        const data = await response.json();
        setCatalog(data);
      } catch (err: unknown) {
        setError((err as Error).message || 'Error');
      }
    }
    fetchCatalogs();
  }, [id]);

  if (!catalog) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-20">Error: {error}</div>;
  }

  const handleBookNow = (catalogId: number) => {
    if (catalog) {
      const bookedCatalogs: Array<Catalog & { quantity: number }> = JSON.parse(
        localStorage.getItem('bookedCatalogs') || '[]'
      );
      const existingItem = bookedCatalogs.find((item) => item.id === catalogId);

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        bookedCatalogs.push({ ...catalog, quantity: 1 });
      }

      localStorage.setItem('bookedCatalogs', JSON.stringify(bookedCatalogs));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <Card className="overflow-hidden">
        <div className="relative h-64 sm:h-96">
          <Image
            src={`${process.env.NEXT_PUBLIC_URL_IMAGE}/${catalog.image}`}
            alt={catalog.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold mb-2">
                {catalog.title}
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-gray-600 mb-4">
                {catalog.description}
              </CardDescription>
            </div>
            <div className="text-left sm:text-right mt-4 sm:mt-0">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                ${catalog.price}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">per person</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-6">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2" />
              <span className="text-sm sm:text-base">{catalog.location}</span>
            </div>
          </div>
          <div className="flex items-center mb-4 sm:mb-6">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-2" />
            <span className="text-base sm:text-lg font-semibold">
              {catalog.rating}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 ml-2">
              (123 reviews)
            </span>
          </div>

          {catalog.information.length > 0 && (
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-8">
              <ol className="list-decimal pl-5">
                {catalog.information.map((info, index) => (
                  <li key={index} className="mb-2">
                    {info}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full text-base sm:text-lg"
            size="lg"
            onClick={() => {
              handleBookNow(catalog.id);
            }}
          >
            Book Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
