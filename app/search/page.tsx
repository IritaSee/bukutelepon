'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import SMECard from '../components/SMECard';
import Link from 'next/link';

interface SearchResult {
  smes: Array<{
    id: string;
    name: string;
    location: string;
    phone: string;
    featuredImage: string;
  }>;
  total: number;
  totalPages: number;
  currentPage: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${page}`);
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching results:', error);
        setError('Terjadi kesalahan saat mencari. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchResults();
    } else {
      setResults(null);
      setIsLoading(false);
    }
  }, [query, page]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with SearchBar */}
      <nav className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-red-600">
              LokaPedia Bali
            </Link>
            <div className="w-2/3">
              <SearchBar defaultValue={query} className="max-w-3xl mx-auto" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isLoading
              ? 'Mencari...'
              : query
              ? `${results?.total || 0} hasil pencarian untuk "${query}"`
              : 'Cari UMKM, produk, atau layanan...'}
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Results Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm h-80 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : query && results?.smes.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Ape sing tepuk hehe</h3>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada hasil</h3>
            <p className="text-gray-500">
              Coba kata kunci lain atau ubah filter pencarian Anda
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results?.smes.map((sme) => (
                <SMECard
                  key={sme.id}
                  id={sme.id}
                  name={sme.name}
                  location={sme.location}
                  phone={sme.phone || '-'}
                  imageUrl={sme.featuredImage}
                />
              ))}
            </div>

            {/* Pagination */}
            {results && results.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Sebelumnya
                  </Link>
                )}
                {[...Array(results.totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isCurrentPage = pageNum === page;
                  const isNearCurrent = Math.abs(pageNum - page) <= 2;
                  const isEndPage = pageNum === 1 || pageNum === results.totalPages;

                  if (!isNearCurrent && !isEndPage) {
                    if (pageNum === 2 || pageNum === results.totalPages - 1) {
                      return <span key={i} className="px-4 py-2">...</span>;
                    }
                    return null;
                  }

                  return (
                    <Link
                      key={i}
                      href={`/search?q=${encodeURIComponent(query)}&page=${pageNum}`}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        isCurrentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
                {page < results.totalPages && (
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Selanjutnya
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}