import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Zod schema for profile update
const profileUpdateSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  phone: z.string().max(20).trim().optional().nullable(),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[a-z]/, 'Must include a lowercase letter')
    .regex(/[0-9]/, 'Must include a number')
    .optional(),
});

// GET user profile
export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, phone: true, role: true, image: true }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

// PUT update profile
export async function PUT(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  
  // Validate with Zod
  const result = profileUpdateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }
  
  const { name, phone, newPassword } = result.data;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const updateData: { name?: string; phone?: string | null; password?: string } = {};
  if (name !== undefined) updateData.name = name;
  if (phone !== undefined) updateData.phone = phone;
  
  if (newPassword) {
    updateData.password = await bcrypt.hash(newPassword, 12);
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: updateData
  });

  return NextResponse.json({ message: 'Profile updated successfully' });
}
