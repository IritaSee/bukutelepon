export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

interface CategoryWithRelation {
  category: {
    id: string;
    name: string;
    description: string | null;
  };
}

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: Request,
  props: Props
): Promise<Response> {
  const params = await props.params;
  const { id } = params;

  try {
    const sme = await prisma.sME.findUnique({
      where: { id },
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
        { error: 'UMKM tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...sme,
      location: `${sme.address}, ${sme.village}, ${sme.district}, ${sme.city}`,
      categories: sme.categories.map((cat: CategoryWithRelation) => cat.category),
    });
  } catch (error) {
    console.error('Error fetching SME:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  props: Props
): Promise<Response> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.sme) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = await props.params;
  const { id } = params;

  // Verify owner
  if (session.user.sme.id !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const data = await request.json();

    const updatedSME = await prisma.sME.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        facebook: data.facebook,
        instagram: data.instagram,
        twitter: data.twitter,
        tiktok: data.tiktok,
        website: data.website,
        blog: data.blog,
        address: data.address,
        city: data.city,
        district: data.district,
        village: data.village,
        postalCode: data.postalCode,
        latitude: data.latitude,
        longitude: data.longitude,
        // Handle images
        images: {
          deleteMany: {},
          create: data.images.map((image: { url: string; alt?: string }) => ({
            url: image.url,
            alt: image.alt,
            isFeatured: false
          }))
        },
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

    return NextResponse.json(updatedSME);
  } catch (error) {
    console.error('Error updating SME:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: Props
): Promise<Response> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.sme) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = await props.params;
  const { id } = params;

  // Verify owner
  if (session.user.sme.id !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await prisma.sME.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'SME deleted successfully' });
  } catch (error) {
    console.error('Error deleting SME:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}