'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix for default marker icon in Leaflet with Next.js
const icon = new L.Icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapProps {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
}

export default function Map({ latitude, longitude, name, address }: MapProps) {
  useEffect(() => {
    // Fix for Leaflet map container height in Safari
    const mapContainer = document.querySelector('.leaflet-container');
    if (mapContainer) {
      (mapContainer as HTMLElement).style.height = '400px';
    }
  }, []);

  const position: L.LatLngTuple = [latitude, longitude];

  return (
    <MapContainer
      center={position}
      zoom={16}
      scrollWheelZoom={false}
      style={{ height: '400px' }}
      className="w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={icon}>
        <Popup>
          <div className="font-semibold">{name}</div>
          <div className="text-sm">{address}</div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}