import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/config';
import { prisma } from '@/lib/prisma';

// Fix: Change the handler parameters to match Next.js App Router expectations
export async function PUT(
  request: Request,
  { params }: { params: { id: string; productId: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.sme) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, productId } = params;

  // Verify SME owner
  if (session.user.sme.id !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const data = await request.json();
    const product = await prisma.product.update({
      where: {
        id: productId,
        smeId: id
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
      { error: 'Terjadi kesalahan saat mengupdate produk' },
      { status: 500 }
    );
  }
}

// Fix: Also update the DELETE method with the correct parameter format
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; productId: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.sme) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, productId } = params;

  // Verify SME owner
  if (session.user.sme.id !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await prisma.product.delete({
      where: {
        id: productId,
        smeId: id
      }
    });

    return NextResponse.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus produk' },
      { status: 500 }
    );
  }
}