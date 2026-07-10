import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Admin courses GET error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, active } = body;

    if (!id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const updated = await prisma.course.update({
      where: { id },
      data: { active },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Admin courses PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}
