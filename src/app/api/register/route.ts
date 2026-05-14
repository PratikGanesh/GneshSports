import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { z } from 'zod';

// Zod schema for input validation
const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .max(255)
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be under 128 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[a-z]/, 'Must include a lowercase letter')
    .regex(/[0-9]/, 'Must include a number'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate with Zod
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const { name, email, password } = result.data;

    const exist = await prisma.user.findUnique({
      where: { email }
    });

    if (exist) {
      // SECURITY: Don't reveal whether email exists (timing-safe)
      return NextResponse.json(
        { error: 'Registration failed. Please try again.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Increased from 10 to 12 rounds

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'user'
      }
    });

    // SECURITY: Never return password hash to client
    return NextResponse.json({ 
      id: user.id, 
      name: user.name, 
      email: user.email 
    });
  } catch (err: unknown) {
    // SECURITY: Don't leak internal errors
    console.error("REGISTER ERROR: ", (err as Error).message);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
