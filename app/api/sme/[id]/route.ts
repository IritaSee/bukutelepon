import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sme = await prisma.sME.findUnique({
      where: {
        id: params.id,
      },
      include: {
        images: true,
        products: {
          include: {
            images: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!sme) {
      return NextResponse.json(
        { error: 'SME tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...sme,
      location: `${sme.address}, ${sme.village}, ${sme.district}, ${sme.city}`,
      categories: sme.categories.map(cat => cat.category),
    });
  } catch (error) {
    console.error('Error fetching SME:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}