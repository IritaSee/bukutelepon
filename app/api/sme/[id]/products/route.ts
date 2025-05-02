import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/config';

const prisma = new PrismaClient();

type Props = {
  params: {
    id: string;
  };
};

// Create a new product
export async function POST(request: Request, { params }: Props) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.sme) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify SME owner
  if (session.user.sme.id !== params.id) {
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
        smeId: params.id,
        images: {
          create: data.images?.map((image: { url: string; alt?: string }) => ({
            url: image.url,
            alt: image.alt,
            isFeatured: false,
            smeId: params.id
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
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Get all products for an SME
export async function GET(request: Request, { params }: Props) {
  try {
    const products = await prisma.product.findMany({
      where: {
        smeId: params.id
      },
      include: {
        images: true
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}