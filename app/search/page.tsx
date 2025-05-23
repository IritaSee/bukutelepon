'use client';

import { Suspense } from 'react';
import SearchResults from './SearchResults';
import SearchBar from '../components/SearchBar';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={
          <div className="w-full h-14 bg-gray-100 animate-pulse rounded-full mb-8" />
        }>
          <ClientSearchSection />
        </Suspense>

        <Suspense fallback={
          <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        }>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}

function ClientSearchSection() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  return (
    <SearchBar defaultValue={query} className="mb-8" />
  );
}