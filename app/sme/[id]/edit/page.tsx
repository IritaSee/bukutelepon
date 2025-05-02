'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface Image {
  id?: string;
  url: string;
  alt?: string;
  isFeatured?: boolean;
}

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  images: Image[];
}

interface SMEFormData {
  name: string;
  description: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  website?: string;
  blog?: string;
  address: string;
  city: string;
  district: string;
  village: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  images: Image[];
}

export default function EditSMEPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<SMEFormData>({
    name: '',
    description: '',
    address: '',
    city: '',
    district: '',
    village: '',
    images: [],
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    // Redirect if not logged in or not the owner
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session.user?.sme?.id !== params.id) {
      router.push(`/sme/${params.id}`);
    }
  }, [status, session, params.id, router]);

  useEffect(() => {
    const fetchSME = async () => {
      try {
        const response = await fetch(`/api/sme/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch SME data');
        
        const data = await response.json();
        setFormData({
          name: data.name,
          description: data.description,
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp,
          facebook: data.facebook,
          instagram: data.instagram,
          twitter: data.twitter,
          tiktok: data.tiktok,
          website: data.website,
          blog: data.blog,
          address: data.address,
          city: data.city,
          district: data.district,
          village: data.village,
          postalCode: data.postalCode,
          latitude: data.latitude,
          longitude: data.longitude,
          images: data.images,
        });
        setProducts(data.products);
      } catch (err) {
        setError('Failed to load SME data');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchSME();
    }
  }, [params.id, status]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploadingImage(true);
    setError('');

    try {
      const newImages = await Promise.all(
        Array.from(files).map(async (file) => {
          const filename = encodeURIComponent(file.name);
          const res = await fetch(`/api/upload?filename=${filename}`, {
            method: 'POST',
            body: file,
          });

          if (!res.ok) throw new Error('Upload failed');

          const data = await res.json();
          return {
            url: data.url,
            alt: file.name,
          };
        })
      );

      if (selectedProduct) {
        setSelectedProduct({
          ...selectedProduct,
          images: [...selectedProduct.images, ...newImages],
        });
      } else {
        setFormData({
          ...formData,
          images: [...formData.images, ...newImages],
        });
      }
    } catch (err) {
      setError('Failed to upload image(s)');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/sme/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update SME');

      router.push(`/sme/${params.id}`);
    } catch (err) {
      setError('Failed to update SME');
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setLoading(true);
    setError('');

    try {
      const url = selectedProduct.id
        ? `/api/sme/${params.id}/products/${selectedProduct.id}`
        : `/api/sme/${params.id}/products`;
      
      const response = await fetch(url, {
        method: selectedProduct.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedProduct),
      });

      if (!response.ok) throw new Error('Failed to save product');

      const updatedProduct = await response.json();
      
      setProducts(prev => 
        selectedProduct.id
          ? prev.map(p => p.id === selectedProduct.id ? updatedProduct : p)
          : [...prev, updatedProduct]
      );
      
      setSelectedProduct(null);
      setShowProductForm(false);
    } catch (err) {
      setError('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/sme/${params.id}/products/${productId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to delete product');

      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      setError('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  if (loading && status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Edit UMKM</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* SME Details Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <h2 className="text-xl font-semibold mb-4">Informasi Umum</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama UMKM*
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi*
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                type="tel"
                value={formData.whatsapp || ''}
                onChange={e => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="text"
                  value={formData.instagram || ''}
                  onChange={e => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="text"
                  value={formData.facebook || ''}
                  onChange={e => setFormData(prev => ({ ...prev, facebook: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <input
                  type="text"
                  value={formData.twitter || ''}
                  onChange={e => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TikTok
                </label>
                <input
                  type="text"
                  value={formData.tiktok || ''}
                  onChange={e => setFormData(prev => ({ ...prev, tiktok: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blog
                </label>
                <input
                  type="url"
                  value={formData.blog || ''}
                  onChange={e => setFormData(prev => ({ ...prev, blog: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat*
              </label>
              <textarea
                value={formData.address}
                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                required
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kota/Kabupaten*
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kecamatan*
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={e => setFormData(prev => ({ ...prev, district: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desa/Kelurahan*
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={e => setFormData(prev => ({ ...prev, village: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kode Pos
                </label>
                <input
                  type="text"
                  value={formData.postalCode || ''}
                  onChange={e => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Foto UMKM
              </label>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={image.url}
                      alt={image.alt || ''}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 33vw, 25vw"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
                      }))}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-red-50 file:text-red-600
                  hover:file:bg-red-100"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push(`/sme/${params.id}`)}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>

          {/* Products Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Produk</h2>
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct({
                    name: '',
                    description: '',
                    price: 0,
                    isAvailable: true,
                    images: []
                  });
                  setShowProductForm(true);
                }}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Tambah Produk
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map(product => (
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
                    <p className="text-blue-600 font-semibold mb-4">
                      Rp {product.price.toLocaleString('id-ID')}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowProductForm(true);
                        }}
                        className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => product.id && handleDeleteProduct(product.id)}
                        className="px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Form Modal */}
        {showProductForm && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h3 className="text-xl font-semibold mb-6">
                {selectedProduct.id ? 'Edit Produk' : 'Tambah Produk'}
              </h3>

              <form onSubmit={handleProductSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Produk*
                  </label>
                  <input
                    type="text"
                    value={selectedProduct.name}
                    onChange={e => setSelectedProduct(prev => prev ? ({
                      ...prev,
                      name: e.target.value
                    }) : null)}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi*
                  </label>
                  <textarea
                    value={selectedProduct.description}
                    onChange={e => setSelectedProduct(prev => prev ? ({
                      ...prev,
                      description: e.target.value
                    }) : null)}
                    required
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga*
                  </label>
                  <input
                    type="number"
                    value={selectedProduct.price}
                    onChange={e => setSelectedProduct(prev => prev ? ({
                      ...prev,
                      price: Number(e.target.value)
                    }) : null)}
                    required
                    min="0"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={selectedProduct.isAvailable}
                    onChange={e => setSelectedProduct(prev => prev ? ({
                      ...prev,
                      isAvailable: e.target.checked
                    }) : null)}
                    className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAvailable" className="text-sm text-gray-700">
                    Produk tersedia
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto Produk
                  </label>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {selectedProduct.images.map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={image.url}
                          alt={image.alt || ''}
                          fill
                          className="object-cover rounded-lg"
                          sizes="(max-width: 768px) 33vw, 25vw"
                        />
                        <button
                          type="button"
                          onClick={() => setSelectedProduct(prev => prev ? ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                          }) : null)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-red-50 file:text-red-600
                      hover:file:bg-red-100"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(null);
                      setShowProductForm(false);
                    }}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}