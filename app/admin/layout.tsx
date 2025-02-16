'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Ticket,
  BarChart,
  ShoppingBag,
  Users,
  Settings,
  Menu,
  X,
  Heart,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>
      <aside
        className={`w-64 bg-gray-800 text-white fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-40`}
      >
        <div className="p-4">
          <Link href="/admin" className="text-2xl font-bold flex items-center">
            <Ticket className="mr-2" />
            TicketMaster
          </Link>
        </div>
        <nav className="mt-8">
          <Link
            href="/admin"
            className="block py-2 px-4 hover:bg-gray-700 transition duration-200"
          >
            <BarChart className="inline-block mr-2" /> Dashboard
          </Link>
          <Link
            href="/admin/catalogs"
            className="block py-2 px-4 hover:bg-gray-700 transition duration-200"
          >
            <ShoppingBag className="inline-block mr-2" /> Catalogs
          </Link>
          <Link
            href="/admin/favorites"
            className="block py-2 px-4 hover:bg-gray-700 transition duration-200"
          >
            <Heart className="inline-block mr-2" /> Favorites
          </Link>
          <Link
            href="/admin"
            className="block py-2 px-4 hover:bg-gray-700 transition duration-200"
          >
            <Users className="inline-block mr-2" /> Users
          </Link>
          <Link
            href="/admin"
            className="block py-2 px-4 hover:bg-gray-700 transition duration-200"
          >
            <Settings className="inline-block mr-2" /> Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
