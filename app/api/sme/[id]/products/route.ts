import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/config';
import { prisma } from '@/lib/prisma';

type RequestContext = {
  params: { id: string }
};

export async function GET(request: Request, context: RequestContext) {
  try {
    const { id } = context.params;
    
    const products = await prisma.product.findMany({
      where: { smeId: id },
      include: {
        images: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memuat produk' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, context: RequestContext) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.sme) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = context.params;

  // Verify SME owner
  if (session.user.sme.id !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const data = await request.json();
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        isAvailable: data.isAvailable ?? true,
        smeId: id,
        images: {
          create: data.images?.map((image: { url: string; alt?: string }) => ({
            url: image.url,
            alt: image.alt,
            isFeatured: false,
            smeId: id
          })) ?? []
        }
      },
      include: {
        images: true
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat produk' },
      { status: 500 }
    );
  }
}