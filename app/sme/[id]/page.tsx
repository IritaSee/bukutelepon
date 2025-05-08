'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// Dynamically import the Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/app/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 rounded-lg animate-pulse" />
  ),
});

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: Array<{
    url: string;
    alt: string | null;
  }>;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface SMEDetails {
  id: string;
  name: string;
  description: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  tiktok: string | null;
  website: string | null;
  blog: string | null;
  address: string;
  city: string;
  district: string;
  village: string;
  postalCode: string | null;
  latitude: number;
  longitude: number;
  location: string;
  images: Array<{
    url: string;
    alt: string | null;
  }>;
  products: Product[];
  categories: Category[];
}

export default function SMEDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [sme, setSME] = useState<SMEDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSME = async () => {
      try {
        const response = await fetch(`/api/sme/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch SME details');
        }
        const data = await response.json();
        setSME(data);
      } catch (error) {
        console.error('Error:', error);
        setError('Terjadi kesalahan saat memuat data. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSME();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !sme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'UMKM tidak ditemukan'}
          </h1>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = session?.user?.sme?.id === sme.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{sme.name}</h1>
            </div>
            {isOwner && (
              <Link
                href={`/sme/${sme.id}/edit`}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Edit UMKM
              </Link>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Galeri</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {sme.images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={image.url}
                      alt={image.alt || sme.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Tentang</h2>
              <p className="text-gray-600 whitespace-pre-line">{sme.description}</p>
            </div>

            {/* Products */}
            {sme.products.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Produk</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {sme.products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-gray-50 rounded-lg overflow-hidden"
                    >
                      {product.images[0] && (
                        <div className="relative h-48">
                          <Image
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {product.description}
                        </p>
                        <p className="text-blue-600 font-semibold">
                          Rp {product.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Kontak</h2>
              <div className="space-y-4">
                {sme.phone && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${sme.phone}`} className="text-blue-600 hover:text-blue-800">
                      {sme.phone}
                    </a>
                  </div>
                )}
                {sme.whatsapp && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"/>
                    </svg>
                    <a
                      href={`https://wa.me/${sme.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      WhatsApp
                    </a>
                  </div>
                )}
                {sme.email && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${sme.email}`} className="text-blue-600 hover:text-blue-800">
                      {sme.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Social Media */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-4">Media Sosial</h3>
                <div className="flex flex-wrap gap-4">
                  {sme.instagram && (
                    <a
                      href={`https://instagram.com/${sme.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-800"
                    >
                      Instagram
                    </a>
                  )}
                  {sme.facebook && (
                    <a
                      href={`https://facebook.com/${sme.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Facebook
                    </a>
                  )}
                  {sme.twitter && (
                    <a
                      href={`https://twitter.com/${sme.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-600"
                    >
                      Twitter
                    </a>
                  )}
                  {sme.tiktok && (
                    <a
                      href={`https://tiktok.com/@${sme.tiktok}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:text-gray-700"
                    >
                      TikTok
                    </a>
                  )}
                </div>
              </div>

              {/* Website/Blog */}
              {(sme.website || sme.blog) && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Website & Blog</h3>
                  <div className="space-y-2">
                    {sme.website && (
                      <a
                        href={sme.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:text-blue-800"
                      >
                        Website
                      </a>
                    )}
                    {sme.blog && (
                      <a
                        href={sme.blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:text-blue-800"
                      >
                        Blog
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Categories */}
            {sme.categories.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Kategori</h2>
                <div className="flex flex-wrap gap-2">
                  {sme.categories.map((category) => (
                    <span
                      key={category.id}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Location */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Lokasi</h2>
              <p className="text-gray-600 mb-4">{sme.location}</p>
              {typeof sme.latitude === 'number' && typeof sme.longitude === 'number' ? (
                <Map
                  latitude={sme.latitude}
                  longitude={sme.longitude}
                  name={sme.name}
                  address={sme.location}
                />
              ) : (
                <div className="text-gray-500 italic">Lokasi tidak tersedia atau belum ditentukan.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}