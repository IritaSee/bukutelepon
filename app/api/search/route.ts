import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type SMEWithImages = Awaited<ReturnType<typeof prisma.sME.findFirst>> & {
  images: { url: string }[];
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = 27;
    const offset = (page - 1) * limit;

    const searchCondition = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        {
          products: {
            some: {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
              ],
            },
          },
        },
        {
          categories: {
            some: {
              category: {
                name: { contains: query, mode: 'insensitive' },
              },
            },
          },
        },
      ],
    };

    const [smes, total] = await Promise.all([
      prisma.sME.findMany({
        where: searchCondition,
        include: {
          images: {
            where: {
              isFeatured: true,
            },
            take: 1,
          },
        },
        skip: offset,
        take: limit,
        orderBy: {
          name: 'asc'
        },
      }),
      prisma.sME.count({
        where: searchCondition,
      }),
    ]);

    return NextResponse.json({
      smes: smes.map((sme: SMEWithImages) => ({
        ...sme,
        location: `${sme.address}, ${sme.village}, ${sme.district}, ${sme.city}`,
        featuredImage: sme.images[0]?.url || '/placeholder.jpg',
      })),
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mencari. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}