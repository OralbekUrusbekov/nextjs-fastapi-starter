'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';
import Image from 'next/image';

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

export default function AdminCatalogs() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [newCatalog, setNewCatalog] = useState<Omit<Catalog, 'id'>>({
    title: '',
    description: '',
    price: 0,
    information: [],
    image: '',
    location: '',
    rating: 0,
  });
  const [newInformation, setNewInformation] = useState<string>('');
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    fetchCatalogs();
  }, []);

  async function fetchCatalogs() {
    try {
      const response = await fetch('http://127.0.0.1:8000/catalogs');
      if (!response.ok) {
        throw new Error('Failed to fetch catalogs');
      }
      const data = await response.json();
      setCatalogs(data);
    } catch (err: unknown) {
      console.log('Error fetching catalogs:', err);
      setCatalogs([]);
    }
  }

  const handleNewCatalogChange = (
    field: keyof Omit<Catalog, 'id'>,
    value: string | number
  ) => {
    if (field === 'price') {
      setNewCatalog({ ...newCatalog, [field]: parseInt(value as string) || 0 });
    } else {
      setNewCatalog({ ...newCatalog, [field]: value });
    }
  };

  const handleAddInformation = () => {
    if (newInformation.trim() !== '') {
      setNewCatalog({
        ...newCatalog,
        information: [...newCatalog.information, newInformation.trim()],
      });
      setNewInformation('');
    }
  };

  const handleRemoveInformation = (index: number) => {
    setNewCatalog({
      ...newCatalog,
      information: newCatalog.information.filter((_, i) => i !== index),
    });
  };

  const validateCatalogData = () => {
    const { title, description, price, location, rating } = newCatalog;
    if (
      !title ||
      !description.trim() ||
      price <= 0 ||
      !location ||
      rating < 0 ||
      rating > 5
    ) {
      alert('Барлық қажетті өрістерді дұрыс толтырыңыз!');
      return false;
    }
    return true;
  };

  const handleAddCatalog = async () => {
    if (!validateCatalogData()) return;

    try {
      if (!newImage) {
        throw new Error('Image is required');
      }

      const formData = new FormData();
      formData.append('title', newCatalog.title);
      formData.append('description', newCatalog.description);
      formData.append('price', newCatalog.price.toString());
      formData.append('location', newCatalog.location);
      formData.append('rating', newCatalog.rating.toString());
      formData.append('information', JSON.stringify(newCatalog.information));

      if (newImage) {
        formData.append('image', newImage);
      } else {
        throw new Error('Image is required');
      }

      console.log('Catalog data before sending:', newCatalog);

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/catalogs/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData: { message: string } = await response.json();
        throw new Error(`Server error: ${JSON.stringify(errorData)}`);
      }

      const addedCatalog: Catalog = await response.json();
      setCatalogs([...catalogs, addedCatalog]);
      setNewCatalog({
        title: '',
        description: '',
        price: 0,
        information: [],
        image: '',
        location: '',
        rating: 0,
      });
      setNewImage(null);
      alert('Catalog added successfully!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Manage Catalogs</h2>

      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Catalog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={newCatalog.title}
            onChange={(e) => handleNewCatalogChange('title', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newCatalog.description}
            onChange={(e) =>
              handleNewCatalogChange('description', e.target.value)
            }
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newCatalog.price || 0}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (value >= 0) {
                handleNewCatalogChange('price', value);
              }
            }}
            min="0"
            step="1"
            className="w-full px-3 py-2 border rounded"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={newCatalog.location}
            onChange={(e) => handleNewCatalogChange('location', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Rating (0-5)"
            value={newCatalog.rating || 0}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value >= 0 && value <= 5) {
                handleNewCatalogChange('rating', value);
              }
            }}
            min="0"
            max="5"
            step="0.1"
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Information</h3>
          <div className="flex items-center mb-2">
            <input
              type="text"
              placeholder="Add information"
              value={newInformation}
              onChange={(e) => setNewInformation(e.target.value)}
              className="flex-grow px-3 py-2 border rounded-l"
            />
            <button
              onClick={handleAddInformation}
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition duration-200"
            >
              Add
            </button>
          </div>
          <ul className="list-disc pl-5">
            {newCatalog.information.map((info, index) => (
              <li
                key={index}
                className="flex items-center justify-between mb-1"
              >
                <span>{info}</span>
                <button
                  onClick={() => handleRemoveInformation(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleAddCatalog}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 flex items-center"
        >
          <Plus className="mr-2" /> Add Catalog
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6 pt-6">Edit Catalogs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogs.map((catalog) => (
          <div
            key={catalog.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_URL_IMAGE}/${catalog.image}`}
              alt={catalog.title}
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{catalog.title}</h2>
              <p className="text-gray-600 mb-2">{catalog.description}</p>
              <p className="text-lg font-bold mb-2">${catalog.price}</p>
              <p className="text-sm text-gray-500 mb-1">{catalog.location}</p>
              <p className="text-sm text-gray-500 mb-2">
                {catalog.rating} Stars
              </p>
              {catalog.information && catalog.information.length > 0 && (
                <div className="mb-2">
                  <h3 className="text-sm font-semibold">Information:</h3>
                  <ul className="list-disc pl-5 text-sm">
                    {catalog.information.map((info, index) => (
                      <li key={index}>{info}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Link href={`/admin/catalogs/${catalog.id}`}>
                  <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-200">
                    <Pencil className="w-8 h-7" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
