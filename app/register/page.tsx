'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import Map component
const Map = dynamic(() => import('@/app/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
  ),
});

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface SMEFormData {
  name: string;
  description: string;
  address: string;
  city: string;
  district: string;
  village: string;
  postalCode: string;
  categories: string[];
  latitude?: number;
  longitude?: number;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [userFormData, setUserFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [smeFormData, setSmeFormData] = useState<SMEFormData>({
    name: '',
    description: '',
    address: '',
    city: '',
    district: '',
    village: '',
    postalCode: '',
    categories: [],
  });

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.name || !userFormData.email || !userFormData.password) {
      setError('Mohon lengkapi semua bagian yang wajib diisi');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSMESubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smeFormData.name || !smeFormData.description || !smeFormData.address || 
        !smeFormData.city || !smeFormData.district || !smeFormData.village) {
      setError('Mohon lengkapi semua bagian yang wajib diisi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userFormData,
          sme: smeFormData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to SME page or dashboard
      router.push(`/sme/${data.smeId}`);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mendaftar');
    } finally {
      setLoading(false);
    }
  };

  // Add geocoding effect
  useEffect(() => {
    if (!smeFormData.address || !smeFormData.city || !smeFormData.district || !smeFormData.village) {
      return;
    }

    let fullAddress = `${smeFormData.address}, ${smeFormData.village}, ${smeFormData.district}, ${smeFormData.city}`;
    if (smeFormData.postalCode) {
      fullAddress += `, ${smeFormData.postalCode}`;
    }
    
    const timer = setTimeout(async () => {
      try {
        setGeocoding(true);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`);
        const data = await res.json();
        
        if (data && data.length > 0) {
          setSmeFormData(prev => ({
            ...prev,
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
          }));
        }
      } catch (err) {
        console.error("Geocoding error:", err);
      } finally {
        setGeocoding(false);
      }
    }, 1000); // debounce for 1 second
    
    return () => clearTimeout(timer);
  }, [smeFormData.address, smeFormData.city, smeFormData.district, smeFormData.village, smeFormData.postalCode]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 1 ? 'Data Pemilik UMKM' : 'Informasi UMKM'}
            </h1>
            <p className="text-gray-600">
              {step === 1 
                ? 'Lengkapi data diri Anda sebagai pemilik UMKM'
                : 'Lengkapi informasi tentang UMKM Anda'
              }
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleUserSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap*
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={userFormData.name}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={userFormData.phone}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password*
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Lanjutkan
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSMESubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="sme-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama UMKM*
                  </label>
                  <input
                    type="text"
                    id="sme-name"
                    value={smeFormData.name}
                    onChange={(e) => setSmeFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi UMKM*
                  </label>
                  <textarea
                    id="description"
                    value={smeFormData.description}
                    onChange={(e) => setSmeFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat*
                  </label>
                  <textarea
                    id="address"
                    value={smeFormData.address}
                    onChange={(e) => setSmeFormData(prev => ({ ...prev, address: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Kota/Kabupaten*
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={smeFormData.city}
                      onChange={(e) => setSmeFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                      Kecamatan*
                    </label>
                    <input
                      type="text"
                      id="district"
                      value={smeFormData.district}
                      onChange={(e) => setSmeFormData(prev => ({ ...prev, district: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="village" className="block text-sm font-medium text-gray-700 mb-1">
                      Desa/Kelurahan*
                    </label>
                    <input
                      type="text"
                      id="village"
                      value={smeFormData.village}
                      onChange={(e) => setSmeFormData(prev => ({ ...prev, village: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700 mb-1">
                      Kode Pos
                    </label>
                    <input
                      type="text"
                      id="postal-code"
                      value={smeFormData.postalCode}
                      onChange={(e) => setSmeFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Location Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Lokasi pada Peta</h3>
                    {geocoding && (
                      <span className="text-sm text-gray-500">Mencari lokasi...</span>
                    )}
                  </div>
                  
                  {smeFormData.latitude && smeFormData.longitude ? (
                    <div className="h-64 rounded-lg overflow-hidden">
                      <Map
                        latitude={smeFormData.latitude}
                        longitude={smeFormData.longitude}
                        name={smeFormData.name}
                        address={`${smeFormData.address}, ${smeFormData.village}, ${smeFormData.district}, ${smeFormData.city}`}
                      />
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 text-sm text-center px-4">
                        Lokasi akan muncul di sini setelah Anda mengisi alamat lengkap
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Mendaftar...' : 'Daftar'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}