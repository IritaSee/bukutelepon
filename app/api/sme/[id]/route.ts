import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/config';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type RequestContext = {
  params: { id: string }
};

export async function GET(request: Request, context: RequestContext) {
  const { id } = context.params;

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
      categories: sme.categories.map((cat) => cat.category),
    });
  } catch (error) {
    console.error('Error fetching SME:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memuat data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RequestContext) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.sme) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = context.params;

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
        categories: {
          deleteMany: {},
          create: data.categories.map((categoryId: string) => ({
            category: {
              connect: { id: categoryId }
            }
          }))
        },
        images: {
          deleteMany: {},
          create: data.images.map((image: { url: string; alt?: string }, index: number) => ({
            url: image.url,
            alt: image.alt,
            isFeatured: index === 0
          }))
        }
      },
      include: {
        images: true,
        categories: {
          include: {
            category: true
          }
        }
      }
    });

    return NextResponse.json(updatedSME);
  } catch (error) {
    console.error('Error updating SME:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate data' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RequestContext) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.sme) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = context.params;

  // Verify owner
  if (session.user.sme.id !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await prisma.sME.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'UMKM berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting SME:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus data' },
      { status: 500 }
    );
  }
}