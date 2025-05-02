import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
        },
      });

      // Create SME
      const newSme = await tx.sME.create({
        data: {
          userId: user.id,
          name: sme.name,
          description: sme.description,
          address: sme.address,
          city: sme.city,
          district: sme.district,
          village: sme.village,
          postalCode: sme.postalCode,
          categories: {
            create: sme.categories.map((categoryId: string) => ({
              categoryId,
            })),
          },
        },
      });

      return { user, sme: newSme };
    });

    return NextResponse.json({
      message: 'Registration successful',
      userId: result.user.id,
      smeId: result.sme.id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}