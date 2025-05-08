'use client';

import { useState } from 'react';

export default function LocationPickerWithGoogleLink({
  onLocationExtracted,
}: {
  onLocationExtracted?: (lat: number, lng: number, embedUrl: string) => void;
}) {
  const [shareLink, setShareLink] = useState('');
  const [error, setError] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const extractLatLngFromURL = (url: string): { lat: number; lng: number } | null => {
    try {
      const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match && match.length >= 3) {
        return {
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2]),
        };
      }
    } catch {}
    return null;
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value.trim();
    setShareLink(inputUrl);
    setError('');
    setEmbedUrl('');
    setLoading(true);
  
    try {
      const res = await fetch('/api/resolve-map-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setError(data.error || 'Link tidak valid');
        return;
      }
  
      const { lat, lng } = data;
      const embed = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
      setEmbedUrl(embed);
      onLocationExtracted?.(lat, lng, embed);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Gagal mengambil data dari server');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tempelkan Link Google Maps dari Tombol “Bagikan”
      </label>
      <input
        type="url"
        placeholder="https://maps.app.goo.gl/..."
        value={shareLink}
        onChange={handleChange}
        disabled={loading}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      {embedUrl && (
        <div className="aspect-video rounded overflow-hidden border border-gray-300">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
