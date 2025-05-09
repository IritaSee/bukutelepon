import { NextRequest, NextResponse } from 'next/server';

interface MapCoordinates {
  lat: number;
  lng: number;
  original: string;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL tidak valid' },
        { status: 400 }
      );
    }

    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Gagal mengakses URL peta' },
        { status: 400 }
      );
    }

    const finalUrl = res.url;
    const match = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

    if (!match || match.length < 3) {
      return NextResponse.json(
        { error: 'Koordinat tidak ditemukan dalam URL' },
        { status: 400 }
      );
    }

    const coordinates: MapCoordinates = {
      lat: parseFloat(match[1]),
      lng: parseFloat(match[2]),
      original: finalUrl,
    };

    return NextResponse.json(coordinates);
  } catch (error) {
    console.error('Resolve map link error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses link peta' },
      { status: 500 }
    );
  }
}
