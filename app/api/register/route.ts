import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, phone, password, sme } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !sme.name || !sme.description || !sme.address) {
      return NextResponse.json(
        { error: 'Data wajib tidak lengkap' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and SME in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          sme: {
            create: {
              name: sme.name,
              description: sme.description,
              address: sme.address,
              city: sme.city,
              district: sme.district,
              village: sme.village,
              postalCode: sme.postalCode,
              latitude: sme.latitude,
              longitude: sme.longitude,
              categories: sme.categories?.length > 0 ? {
                create: sme.categories.map((categoryId: string) => ({
                  category: {
                    connect: { id: categoryId }
                  }
                }))
              } : undefined,
              images: sme.images?.length > 0 ? {
                create: sme.images.map((image: { url: string; alt?: string }, index: number) => ({
                  url: image.url,
                  alt: image.alt,
                  isFeatured: index === 0
                }))
              } : undefined
            }
          }
        },
        include: {
          sme: true
        }
      });

      return { user, sme: user.sme };
    });

    return NextResponse.json({
      message: 'Registrasi berhasil',
      userId: result.user.id,
      smeId: result.sme?.id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mendaftar' },
      { status: 500 }
    );
  }
}