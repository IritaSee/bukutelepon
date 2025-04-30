'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SMECard from '../components/SMECard';
import Link from 'next/link';

interface SearchResult {
  smes: Array<{
    id: string;
    name: string;
    location: string;
    phone: string | null;
    featuredImage: string;
  }>;
  total: number;
  totalPages: number;
  currentPage: number;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
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
      }
    };

    if (query) {
      fetchResults();
    } else {
      setResults(null);
    }
  }, [query, page]);

  if (!query) {
    return (
      <div className="text-center text-gray-600">
        Silakan masukkan kata kunci pencarian
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!results) {
    return null;
  }

  if (results.smes.length === 0) {
    return (
      <div className="text-center text-gray-600">
        Tidak ditemukan hasil untuk &quot;{query}&quot;
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-gray-600">
        Ditemukan {results.total} hasil untuk &quot;{query}&quot;
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.smes.map((sme) => (
          <SMECard
            key={sme.id}
            id={sme.id}
            name={sme.name}
            location={sme.location}
            phone={sme.phone || ''}
            imageUrl={sme.featuredImage}
          />
        ))}
      </div>

      {results.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Sebelumnya
            </Link>
          )}
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
    </div>
  );
}