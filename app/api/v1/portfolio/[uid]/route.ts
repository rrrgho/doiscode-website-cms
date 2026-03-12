import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { unlink } from 'fs/promises';
import { join } from 'path';

// GET /api/v1/portfolio/[uid] — returns portfolio with galleries
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get('all') === 'true';

    const portfolio = await prisma.portfolio.findUnique({
      where: { uid },
      include: {
        galleries: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!portfolio || (!showAll && !portfolio.isVisible)) {
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
    const { title, description, isVisible, bannerUrl } = await req.json();
    const portfolio = await prisma.portfolio.update({
      where: { uid },
      data: { title, description, isVisible, bannerUrl },
    });
    revalidatePath('/', 'layout');
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
    // First find the portfolio to get the bannerUrl
    const portfolio = await prisma.portfolio.findUnique({ where: { uid } });
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    await prisma.portfolio.delete({ where: { uid } });

    // Try to delete the banner file
    if (portfolio.bannerUrl) {
      try {
        const filename = portfolio.bannerUrl.split('/').pop();
        if (filename) {
          const filepath = join(process.cwd(), 'public', 'uploads', filename);
          await unlink(filepath);
        }
      } catch (err) {
        console.error('Failed to delete portfolio banner file:', err);
      }
    }
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 });
  }
}
