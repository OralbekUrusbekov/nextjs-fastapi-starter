'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';
import { Button } from '@/src/app/components/ui/button';
import { Input } from '@/src/app/components/ui/input';
import { Textarea } from '@/src/app/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/app/components/ui/card';
import { useRouter } from 'next/navigation';

interface Favorite {
  id: number;
  name: string;
  photo: string;
  text: string;
  rating: number;
}

export default function AdminFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newFavorite, setNewFavorite] = useState<Omit<Favorite, 'id'>>({
    name: '',
    photo: '',
    text: '',
    rating: 0,
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    try {
      const response = await fetch('http://127.0.0.1:8000/favorites');
      if (!response.ok) {
        setFavorites([]);
        throw new Error('Failed to fetch favorites');
      }
      const data: Favorite[] = await response.json();
      setFavorites(data);
    } catch (err: unknown) {
      console.log('Error fetching favorites:', err);
    }
  }

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleSave = async (id: number) => {
    try {
      setError(null);
      const favorite = favorites.find((f) => f.id === id);
      if (!favorite) throw new Error('Favorite not found');

      const formData = new FormData();
      formData.append('name', favorite.name);
      formData.append('text', favorite.text);
      formData.append('rating', favorite.rating.toString());

      if (newImage) {
        formData.append('photo', newImage);
      }

      const response = await fetch(`http://127.0.0.1:8000/favorites/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Error updating favorite with id ${id}: ${errorData.message}`);
        throw new Error(`Failed to update favorite with id ${id}`);
      }

      const updatedFavorite = await response.json();
      setFavorites(favorites.map((f) => (f.id === id ? updatedFavorite : f)));
      setEditingId(null);
      setNewImage(null);
      console.log(`Favorite with id ${id} updated successfully`);
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Error fetching favorites: ${error.message}`);
        console.log('Error fetching favorites:', error);
      } else {
        setError('An unknown error occurred');
        console.log('Error fetching favorites:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleChange = (
    id: number,
    field: keyof Favorite,
    value: string | number
  ) => {
    if (field === 'rating') {
      const newValue = typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(newValue)) {
        return;
      }
      setFavorites(
        favorites.map((favorite) =>
          favorite.id === id ? { ...favorite, [field]: newValue } : favorite
        )
      );
    } else {
      setFavorites(
        favorites.map((favorite) =>
          favorite.id === id ? { ...favorite, [field]: value } : favorite
        )
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/favorites/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete favorite with id ${id}`);
      }

      setFavorites(favorites.filter((favorite) => favorite.id !== id));
      console.log(`Favorite with id ${id} deleted successfully`);
    } catch (error) {
      console.log('Error deleting favorite');
    }
  };

  const handleNewFavoriteChange = (
    field: keyof Omit<Favorite, 'id'>,
    value: string | number
  ) => {
    if (field === 'rating') {
      const numericValue =
        typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(numericValue)) {
        return;
      }
      setNewFavorite({ ...newFavorite, [field]: numericValue });
    } else {
      setNewFavorite({ ...newFavorite, [field]: value });
    }
  };

  const handleAddFavorite = async () => {
    try {
      setError(null);

      const formData = new FormData();
      formData.append('name', newFavorite.name);
      formData.append('text', newFavorite.text);
      formData.append('rating', newFavorite.rating.toString());

      if (newImage) {
        formData.append('photo', newImage);
      } else {
        throw new Error('Image is required');
      }

      console.log('Favorite data before sending:', newFavorite);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/favorites/`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server error: ${JSON.stringify(errorData)}`);
      }

      const addedFavorite = await response.json();
      setFavorites([...favorites, addedFavorite]);

      setNewFavorite({
        name: '',
        photo: '',
        text: '',
        rating: 0,
      });
      setNewImage(null);
      alert('Favorite added successfully!');
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
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
        Manage Favorites
      </h2>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Add New Favorite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <Input
              type="text"
              placeholder="Name"
              value={newFavorite.name}
              onChange={(e) => handleNewFavoriteChange('name', e.target.value)}
              required
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <Textarea
              placeholder="Text"
              value={newFavorite.text}
              onChange={(e) => handleNewFavoriteChange('text', e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="Rating"
              value={newFavorite.rating || 0}
              onChange={(e) =>
                handleNewFavoriteChange('rating', parseFloat(e.target.value))
              }
              required
              min="1"
              max="5"
              step="0.1"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddFavorite} className="w-full">
            <Plus className="mr-2" /> Add Favorite
          </Button>
        </CardFooter>
      </Card>

      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
        Edit Favorites
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {favorites.map((favorite) => (
          <Card key={favorite.id}>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">
                {favorite.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 mb-4">
                <Image
                  src={`${process.env.NEXT_PUBLIC_URL}/${favorite.photo}`}
                  alt={favorite.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              {editingId === favorite.id ? (
                <>
                  <Input
                    type="text"
                    value={favorite.name}
                    onChange={(e) =>
                      handleChange(favorite.id, 'name', e.target.value)
                    }
                    className="mb-2"
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                    className="mb-2"
                  />
                  <Textarea
                    value={favorite.text}
                    onChange={(e) =>
                      handleChange(favorite.id, 'text', e.target.value)
                    }
                    className="mb-2"
                  />
                  <Input
                    type="number"
                    value={favorite.rating}
                    onChange={(e) =>
                      handleChange(
                        favorite.id,
                        'rating',
                        parseFloat(e.target.value)
                      )
                    }
                    min="1"
                    max="5"
                  />
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-2 text-sm md:text-base">
                    {favorite.text}
                  </p>
                  <p className="text-sm text-gray-500">
                    Rating: {favorite.rating} Stars
                  </p>
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2">
              {editingId === favorite.id ? (
                <>
                  <Button
                    onClick={() => handleSave(favorite.id)}
                    variant="outline"
                    className="w-full md:w-auto"
                  >
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="w-full md:w-auto"
                  >
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => handleEdit(favorite.id)}
                    variant="outline"
                    className="w-full md:w-auto"
                  >
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(favorite.id)}
                    variant="outline"
                    className="w-full md:w-auto text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
