import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SMEWithImages = Awaited<ReturnType<typeof prisma.sME.findFirst>> & {
  images: { url: string }[];
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 27; // Items per page
  const offset = (page - 1) * limit;

  try {
    const [smes, total] = await Promise.all([
      prisma.sME.findMany({
        where: {
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
        },
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
      }),
      prisma.sME.count({
        where: {
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
        },
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
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}