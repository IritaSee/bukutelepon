'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

interface SearchBarProps {
  defaultValue?: string;
  className?: string;
}

export default function SearchBar({ defaultValue = '', className = '' }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const q = searchParams.get('q') || defaultValue;
    setQuery(q);
  }, [searchParams, defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full flex gap-2 ${className}`}>
      <div className="relative flex-grow">
        <input 
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari UMKM, produk, atau layanan..."
          className="w-full px-6 py-4 text-lg rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
          disabled={isPending}
        />
      </div>
      <button
        type="submit"
        disabled={isPending || !query.trim()}
        className="px-8 py-4 text-lg font-medium text-white bg-red-500 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:hover:bg-red-500"
      >
        {isPending ? 'Mencari...' : 'Cari'}
      </button>
    </form>
  );
}