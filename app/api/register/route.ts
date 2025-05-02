import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, phone, password, sme } = await request.json();

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
      // Create user with nested SME creation
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
              // Only create category connections if categories are provided
              ...(sme.categories?.length > 0 ? {
                categories: {
                  create: sme.categories.map((categoryId: string) => ({
                    category: {
                      connect: { id: categoryId }
                    }
                  }))
                }
              } : {})
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
      message: 'Registration successful',
      userId: result.user.id,
      smeId: result.sme?.id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}