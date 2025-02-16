'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trash2, ShoppingCart, X } from 'lucide-react';
import locales from '@/locales/common.json';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { useLanguage } from '@/app/context/LanguageContext';

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  rating: number;
  quantity: number;
}

interface ClientInfo {
  name: string;
  phoneNumber: string;
  purchaseDate: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { lang, setLang } = useLanguage();
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: '',
    phoneNumber: '',
    purchaseDate: '',
  });

  useEffect(() => {
    const storedItems = localStorage.getItem('bookedCatalogs');
    if (storedItems) {
      setCartItems(JSON.parse(storedItems));
    }
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    const updatedItems = cartItems
      .map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      )
      .filter((item) => item.quantity > 0);

    setCartItems(updatedItems);
    localStorage.setItem('bookedCatalogs', JSON.stringify(updatedItems));
  };

  const removeItem = (id: number) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('bookedCatalogs', JSON.stringify(updatedItems));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  const handleClientInfoChange = (field: keyof ClientInfo, value: string) => {
    if (clientInfo) {
      setClientInfo({ ...clientInfo, [field]: value });
    }
  };

  const handleSubmit = async () => {
    if (!clientInfo) return;

    const checkoutData = cartItems.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      clientInfo: clientInfo,
    }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: checkoutData }),
      });
      console.log(JSON.stringify({ items: checkoutData }));

      if (response.ok) {
        setCartItems([]);
        localStorage.removeItem('bookedCatalogs');
        setIsModalOpen(false);
        alert(locales[lang].cart.checkoutSuccess);
      } else {
        throw new Error('Checkout failed');
      }
    } catch (error) {
      alert(locales[lang].cart.checkoutError);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">
        {locales[lang].cart.pageTitle}
      </h1>
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600">
          <ShoppingCart className="w-24 h-24 mx-auto mb-4 text-gray-400" />
          <p className="text-2xl font-semibold mb-2">
            {locales[lang].cart.emptyCart.message}
          </p>
          <p>{locales[lang].cart.emptyCart.description}</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center p-4 border-b last:border-b-0"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_URL_IMAGE}/${item.image}`}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="rounded-md mr-4"
                />
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-l"
                  >
                    -
                  </button>
                  <span className="bg-gray-100 px-4 py-1">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-r"
                  >
                    +
                  </button>
                </div>
                <p className="font-semibold ml-4 w-24 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">
                {locales[lang].cart.total}
              </span>
              <span className="text-2xl font-bold">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
            >
              {locales[lang].cart.checkoutButton}
            </button>
          </div>
        </>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{locales[lang].cart.checkoutModal.title}</DialogTitle>
            <DialogDescription>
              {locales[lang].cart.checkoutModal.description}
            </DialogDescription>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>

          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <span key={item.id}>
                {item.title}
                {index < cartItems.length - 1 && ', '}
              </span>
            ))}

            <div>
              <Label htmlFor="name">
                {locales[lang].cart.checkoutModal.nameLabel}
              </Label>
              <Input
                id="name"
                value={clientInfo?.name || ''}
                onChange={(e) => handleClientInfoChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">
                {locales[lang].cart.checkoutModal.phoneLabel}
              </Label>
              <Input
                id="phone"
                value={clientInfo?.phoneNumber || ''}
                onChange={(e) =>
                  handleClientInfoChange('phoneNumber', e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="date">
                {locales[lang].cart.checkoutModal.dateLabel}
              </Label>
              <Input
                id="date"
                type="date"
                value={clientInfo?.purchaseDate || ''}
                onChange={(e) =>
                  handleClientInfoChange('purchaseDate', e.target.value)
                }
              />
            </div>
          </div>

          <Button onClick={handleSubmit}>
            {locales[lang].cart.checkoutModal.submitButton}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
