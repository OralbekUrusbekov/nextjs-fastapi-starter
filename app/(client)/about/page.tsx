'use client';
import Image from 'next/image';
import {
  Users,
  Ticket,
  Globe,
  ThumbsUp,
  ShieldCheck,
  HeadphonesIcon,
} from 'lucide-react';
import { useState } from 'react';
import locales from '@/locales/common.json';
import { Language } from '@/types/lang';
import { useLanguage } from '@/app/context/LanguageContext';

export default function About() {
  const { lang, setLang } = useLanguage();
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-8 sm:mb-12">
        <Image
          src="/images/GoldenTikket.jpeg"
          alt="BirgeTours Events"
          width={1250}
          height={250}
          className="rounded-xl shadow-lg"
        />
      </div>

      <div className="space-y-4 sm:space-y-8 text-base sm:text-lg text-gray-700">
        <p>{locales[lang].about.introduction}</p>
        <p>{locales[lang].about.mission}</p>

        <h2 className="text-xl sm:text-2xl font-bold mt-8 sm:mt-12 mb-4 sm:mb-6">
          {' '}
          {locales[lang].about.whatSetsUsApart}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <div className="flex items-start">
            <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mr-3 sm:mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                {' '}
                {locales[lang].about.features.wideSelection.title}
              </h3>
              <p className="text-sm sm:text-base">
                {locales[lang].about.features.wideSelection.description}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <Ticket className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mr-3 sm:mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                {locales[lang].about.features.easyBooking.title}
              </h3>
              <p className="text-sm sm:text-base">
                {locales[lang].about.features.easyBooking.description}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <ThumbsUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mr-3 sm:mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                {locales[lang].about.features.competitivePrices.title}
              </h3>
              <p className="text-sm sm:text-base">
                {locales[lang].about.features.competitivePrices.description}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <HeadphonesIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mr-3 sm:mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                {locales[lang].about.features.customerSupport.title}
              </h3>
              <p className="text-sm sm:text-base">
                {locales[lang].about.features.customerSupport.description}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mr-3 sm:mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                {locales[lang].about.features.secureTransactions.title}
              </h3>
              <p className="text-sm sm:text-base">
                {locales[lang].about.features.secureTransactions.description}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mr-3 sm:mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                {locales[lang].about.features.community.title}
              </h3>
              <p className="text-sm sm:text-base">
                {locales[lang].about.features.community.description}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 sm:mt-12">{locales[lang].about.closing}</p>
      </div>
    </div>
  );
}
