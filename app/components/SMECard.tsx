import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface SMECardProps {
  id: string;
  name: string;
  location: string;
  phone: string;
  imageUrl: string;
}

export default function SMECard({ id, name, location, phone, imageUrl }: SMECardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/sme/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden">
        <div className="relative w-full h-48 bg-gray-100">
          <Image
            src={imageError ? '/placeholder.jpg' : imageUrl}
            alt={name}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            priority={false}
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 truncate">{name}</h3>
          <div className="flex items-start gap-2 text-gray-600 mb-2">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm line-clamp-2">{location}</p>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <p className="text-sm">{phone || 'Tidak ada nomor telepon :('}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}