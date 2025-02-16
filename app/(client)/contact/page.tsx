'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import locales from '@/locales/common.json';
import { useLanguage } from '@/src/app/context/LanguageContext';

export default function Contact() {
  const { lang, setLang } = useLanguage();
  const [loading, setLoading] = useState<boolean>(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert("Thank you for your message. We'll get back to you soon!");
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">
        {locales[lang].contact.pageTitle}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {locales[lang].contact.getInTouch.title}
          </h2>
          <p className="mb-6 text-gray-600">
            {locales[lang].contact.getInTouch.description}
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <MapPin className="w-6 h-6 text-purple-600 mr-4" />
              <p>{locales[lang].contact.getInTouch.address}</p>
            </div>
            <div className="flex items-center">
              <Phone className="w-6 h-6 text-purple-600 mr-4" />
              <p>{locales[lang].contact.getInTouch.phone}</p>
            </div>
            <div className="flex items-center">
              <Mail className="w-6 h-6 text-purple-600 mr-4" />
              <p>{locales[lang].contact.getInTouch.email}</p>
            </div>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2 font-semibold">
                {locales[lang].contact.form.nameLabel}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 font-semibold">
                {locales[lang].contact.form.emailLabel}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 font-semibold">
                {locales[lang].contact.form.messageLabel}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition duration-300 flex items-center justify-center w-full"
            >
              <Send className="w-5 h-5 mr-2" />
              {locales[lang].contact.form.submitButton}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
