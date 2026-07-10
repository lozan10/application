import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Total counts by status
    const [total, pending, accepted, rejected, underReview] = await Promise.all([
      prisma.application.count(),
      prisma.application.count({ where: { status: 'PENDING' } }),
      prisma.application.count({ where: { status: 'ACCEPTED' } }),
      prisma.application.count({ where: { status: 'REJECTED' } }),
      prisma.application.count({ where: { status: 'UNDER_REVIEW' } }),
    ]);

    // Recent 10 applications
    const recentApplications = await prisma.application.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        refNo: true,
        fullName: true,
        createdAt: true,
        status: true,
        course: {
          select: { name: true, category: true },
        },
      },
    });

    // Applications grouped by category
    const allApps = await prisma.application.findMany({
      select: {
        course: {
          select: { category: true },
        },
      },
    });

    const categoryMap = {};
    allApps.forEach((app) => {
      const cat = app.course.category;
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const byCategory = Object.entries(categoryMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      totalApplications: total,
      pending,
      accepted,
      rejected,
      underReview,
      recentApplications,
      byCategory,
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
