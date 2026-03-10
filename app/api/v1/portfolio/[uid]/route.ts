import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/v1/portfolio/[uid] — returns portfolio with galleries
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    const portfolio = await prisma.portfolio.findUnique({
      where: { uid },
      include: {
        galleries: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!portfolio) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(portfolio);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}

// PUT /api/v1/portfolio/[uid] — update portfolio
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    const { title, description } = await req.json();
    const portfolio = await prisma.portfolio.update({
      where: { uid },
      data: { title, description },
    });
    return NextResponse.json(portfolio);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 });
  }
}

// DELETE /api/v1/portfolio/[uid]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    await prisma.portfolio.delete({ where: { uid } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 });
  }
}
