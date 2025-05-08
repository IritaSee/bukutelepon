import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL tidak valid' }, { status: 400 });
    }

    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
    });

    const finalUrl = res.url;

    const match = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match && match.length >= 3) {
      return NextResponse.json({
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2]),
        original: finalUrl,
      });
    } else {
      return NextResponse.json({ error: 'Koordinat tidak ditemukan' }, { status: 400 });
    }
  } catch (err) {
    console.error('Resolve error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan saat resolve link' }, { status: 500 });
  }
}
