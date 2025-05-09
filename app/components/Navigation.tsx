'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useTransition } from 'react';

export default function Navigation() {
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();
  const loading = status === 'loading';

  const handleSignOut = () => {
    startTransition(() => {
      signOut({ callbackUrl: '/' });
    });
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link 
          href="/"
          className="text-xl font-bold text-red-600 hover:text-red-800 transition-colors"
        >
          LokaPedia Bali
        </Link>

        <div className="flex gap-4 items-center">
          {loading ? (
            <div className="animate-pulse w-20 h-8 bg-gray-200 rounded-full" />
          ) : session?.user ? (
            <>
              {session.user.sme && (
                <Link
                  href={`/sme/${session.user.sme.id}`}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  UMKM Saya
                </Link>
              )}
              <button
                onClick={handleSignOut}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                {isPending ? 'Keluar...' : 'Keluar'}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Daftar UMKM
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}