import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/config';

const prisma = new PrismaClient();

type Params = {
  id: string;
  productId: string;
};

export async function PUT(
  request: Request,
  { params }: { params: Params }
) {
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
    const product = await prisma.product.update({
      where: {
        id: params.productId,
        smeId: params.id
      },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        isAvailable: data.isAvailable,
        images: {
          deleteMany: {},
          create: data.images?.map((image: { url: string; alt?: string }) => ({
            url: image.url,
            alt: image.alt,
            isFeatured: false,
          })) ?? []
        }
      },
      include: {
        images: true
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Params }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.sme) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify SME owner
  if (session.user.sme.id !== params.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await prisma.product.delete({
      where: {
        id: params.productId,
        smeId: params.id
      }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}