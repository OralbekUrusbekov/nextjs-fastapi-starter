'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Star,
  Save,
  Plus,
  Minus,
  Router,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { toast } from '@/app/components/ui/use-toast';
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

export default function AdminCatalogDetail() {
  const { id } = useParams();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCatalog() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/catalogs/${id}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch catalog');
        }
        const data = await response.json();
        setCatalog(data);
      } catch (err: unknown) {
        setError((err as Error).message || 'Error');
      } finally {
        setIsLoading(false);
      }
    }
    fetchCatalog();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCatalog((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);
  };

  const handleInformationChange = (index: number, value: string) => {
    setCatalog((prev) => {
      if (!prev) return null;
      const newInformation = [...prev.information];
      newInformation[index] = value;
      return { ...prev, information: newInformation };
    });
  };

  const addInformation = () => {
    setCatalog((prev) => {
      if (!prev) return null;
      return { ...prev, information: [...prev.information, ''] };
    });
  };

  const removeInformation = (index: number) => {
    setCatalog((prev) => {
      if (!prev) return null;
      const newInformation = prev.information.filter((_, i) => i !== index);
      return { ...prev, information: newInformation };
    });
  };

  const handleSave = async () => {
    if (!catalog) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', catalog.title);
      formData.append('description', catalog.description);
      formData.append('price', catalog.price.toString());
      formData.append('location', catalog.location);
      formData.append('rating', catalog.rating.toString());
      formData.append('information', JSON.stringify(catalog.information));

      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      console.log(JSON.stringify(catalog.information));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/catalogs/${id}`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update catalog');
      }

      toast({
        title: 'Success',
        description: 'Catalog updated successfully',
      });

      router.refresh();

      setIsEditing(false);
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: (err as Error).message || 'Failed to update catalog',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-20">Error: {error}</div>;
  }

  if (!catalog) {
    return <div className="text-center py-20">Catalog not found</div>;
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/catalogs/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete catalog with id ${id}`);
      }

      console.log(`Catalog with id ${id} deleted successfully`);

      router.push('/admin');
    } catch (error) {
      console.error('Error deleting catalog:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
      <Card className="overflow-hidden">
        <div className="relative h-48 sm:h-64 md:h-96">
          <Image
            src={`${process.env.NEXT_PUBLIC_URL_IMAGE}/${catalog.image}`}
            alt={catalog.title}
            layout="fill"
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
          />
        </div>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
            <div className="w-full sm:w-2/3">
              {isEditing ? (
                <Input
                  name="title"
                  value={catalog.title}
                  onChange={handleInputChange}
                  className="text-xl sm:text-2xl md:text-3xl font-bold mb-2"
                />
              ) : (
                <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                  {catalog.title}
                </CardTitle>
              )}
              {isEditing ? (
                <Textarea
                  name="description"
                  value={catalog.description}
                  onChange={handleInputChange}
                  className="text-sm sm:text-base md:text-lg text-gray-600 mb-4"
                  rows={4}
                />
              ) : (
                <CardDescription className="text-sm sm:text-base md:text-lg text-gray-600 mb-4">
                  {catalog.description}
                </CardDescription>
              )}
            </div>
            <div className="text-left sm:text-right w-full sm:w-1/3">
              {isEditing ? (
                <Input
                  name="price"
                  type="number"
                  value={catalog.price}
                  onChange={handleInputChange}
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600"
                />
              ) : (
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600">
                  ${catalog.price}
                </div>
              )}
              <div className="text-xs sm:text-sm text-gray-500">per person</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 mb-4 sm:mb-6">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2" />
              {isEditing ? (
                <Input
                  name="location"
                  value={catalog.location}
                  onChange={handleInputChange}
                  className="text-sm sm:text-base"
                />
              ) : (
                <span className="text-sm sm:text-base">{catalog.location}</span>
              )}
            </div>
          </div>
          <div className="flex items-center mb-4 sm:mb-6">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-2" />
            {isEditing ? (
              <Input
                name="rating"
                type="number"
                value={catalog.rating}
                onChange={handleInputChange}
                className="text-sm sm:text-base md:text-lg font-semibold w-16"
              />
            ) : (
              <span className="text-sm sm:text-base md:text-lg font-semibold">
                {catalog.rating}
              </span>
            )}
            <span className="text-xs sm:text-sm text-gray-500 ml-2">
              (123 reviews)
            </span>
          </div>

          {catalog.information.length > 0 && (
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-8">
              <ol className="list-decimal pl-5">
                {catalog.information.map((info, index) => (
                  <li key={index} className="mb-2">
                    {isEditing ? (
                      <div className="flex items-center">
                        <Input
                          value={info}
                          onChange={(e) =>
                            handleInformationChange(index, e.target.value)
                          }
                          className="mr-2 text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeInformation(index)}
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    ) : (
                      info
                    )}
                  </li>
                ))}
              </ol>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addInformation}
                  className="mt-2 text-xs sm:text-sm"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Add Information
                </Button>
              )}
            </div>
          )}
        </CardContent>
        {isEditing && (
          <div className="mb-4">
            <Label htmlFor="image-upload">Upload Photo</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        )}
        <CardFooter>
          {isEditing ? (
            <Button
              className="w-full h-[50%] text-sm sm:text-base md:text-lg"
              size="lg"
              onClick={handleSave}
              disabled={isLoading}
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          ) : (
            <>
              <Button
                className="w-full text-sm sm:text-base md:text-lg mb-4"
                size="lg"
                onClick={() => setIsEditing(true)}
              >
                Edit Catalog
              </Button>
              <Button
                className="w-full text-sm sm:text-base md:text-lg"
                size="lg"
                onClick={() => handleDelete(catalog.id)}
              >
                Delete Catalog
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
