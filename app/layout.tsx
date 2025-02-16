import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { LanguageProvider } from '@/app/context/LanguageContext';

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TicketMaster - Your Premier Ticketing Platform',
  description: 'Book tickets for events, tours, and attractions worldwide',
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <html lang="en" className={poppins.className}>
        <body className="bg-gray-50 text-gray-900 flex flex-col min-h-screen">
          {children}
        </body>
      </html>
    </LanguageProvider>
  );
}
