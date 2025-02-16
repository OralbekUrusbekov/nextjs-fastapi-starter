import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Music, Ticket } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl shadow-xl">
        <h1 className="text-5xl font-bold mb-6">Welcome to TicketMaster</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Your gateway to unforgettable experiences. Discover and book tickets
          for the most exciting events, tours, and attractions worldwide!
        </p>
        <Link
          href="/catalogs"
          className="bg-white text-purple-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300 inline-flex items-center"
        >
          <Ticket className="mr-2" />
          Explore Tickets
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
          <Calendar className="w-12 h-12 text-purple-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Wide Selection</h2>
          <p className="text-gray-600">
            Choose from a vast array of events, tours, and attractions to suit
            every interest and budget.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
          <MapPin className="w-12 h-12 text-purple-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Easy Booking</h2>
          <p className="text-gray-600">
            Book your tickets with just a few clicks, anytime, anywhere. Simple,
            fast, and secure.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
          <Music className="w-12 h-12 text-purple-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Exclusive Deals</h2>
          <p className="text-gray-600">
            Enjoy competitive prices and access to exclusive deals on premium
            events and experiences.
          </p>
        </div>
      </section>

      <section className="bg-gray-100 p-12 rounded-3xl">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <Image
                src={`https://source.unsplash.com/800x600/?event${i}`}
                alt={`Event ${i}`}
                width={800}
                height={600}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Exciting Event {i}
                </h3>
                <p className="text-gray-600 mb-4">
                  Join us for an unforgettable experience at this amazing event!
                </p>
                <Link
                  href="/catalogs"
                  className="text-purple-600 font-semibold hover:text-purple-800 transition duration-300"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Experience Something Amazing?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Don't miss out on the best events and attractions. Start exploring our
          wide selection of tickets now!
        </p>
        <Link
          href="/catalogs"
          className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition duration-300 inline-flex items-center"
        >
          <Ticket className="mr-2" />
          Browse Catalogs
        </Link>
      </section>
    </div>
  );
}
