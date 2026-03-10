import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/v1/portfolio/[uid]/gallery — add gallery image
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
    }
    const gallery = await prisma.portfolioGallery.create({
      data: { portfolioUid: uid, imageUrl },
    });
    return NextResponse.json(gallery, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add gallery image' }, { status: 500 });
  }
}

// DELETE /api/v1/portfolio/[uid]/gallery?galleryId=xxx
export async function DELETE(
  req: NextRequest,
) {
  try {
    const galleryId = req.nextUrl.searchParams.get('galleryId');
    if (!galleryId) {
      return NextResponse.json({ error: 'galleryId is required' }, { status: 400 });
    }
    await prisma.portfolioGallery.delete({ where: { id: galleryId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}
