'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
  zoom?: number;
  className?: string;
}

// Fix for Leaflet marker icons in Next.js
const fixLeafletMarker = () => {
  (L.Icon.Default as any).imagePath = '/';
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/marker-icon.png',
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
  });
};

export default function Map({
  latitude,
  longitude,
  name,
  address,
  zoom = 15,
  className = ''
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize Leaflet marker icons
    fixLeafletMarker();

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(`map-${latitude}-${longitude}`).setView([latitude, longitude], zoom);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      // Add marker
      markerRef.current = L.marker([latitude, longitude])
        .addTo(mapRef.current)
        .bindPopup(
          name && address 
            ? `<b>${name}</b><br>${address}`
            : `${latitude}, ${longitude}`
        )
        .openPopup();
    } else {
      // Update map view and marker position
      mapRef.current.setView([latitude, longitude], zoom);
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude])
          .bindPopup(
            name && address 
              ? `<b>${name}</b><br>${address}`
              : `${latitude}, ${longitude}`
          )
          .openPopup();
      }
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [latitude, longitude, name, address, zoom]);

  return (
    <div 
      id={`map-${latitude}-${longitude}`}
      className={`w-full h-[400px] rounded-lg ${className}`}
    />
  );
}