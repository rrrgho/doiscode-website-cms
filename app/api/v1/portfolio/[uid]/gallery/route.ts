import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { unlink } from 'fs/promises';
import { join } from 'path';

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
    revalidatePath(`/portfolio/${uid}`);
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

    // First find the gallery to get the image URL
    const gallery = await prisma.portfolioGallery.findUnique({ where: { id: galleryId } });
    if (!gallery) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
    }

    // Delete from database
    await prisma.portfolioGallery.delete({ where: { id: galleryId } });

    // Try to delete the file
    if (gallery.imageUrl) {
      try {
        const filename = gallery.imageUrl.split('/').pop();
        if (filename) {
          const filepath = join(process.cwd(), 'public', 'uploads', filename);
          await unlink(filepath);
        }
      } catch (err) {
        console.error('Failed to delete gallery image file:', err);
      }
    }

    revalidatePath(`/portfolio`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}
