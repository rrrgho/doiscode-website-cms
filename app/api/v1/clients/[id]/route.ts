import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // First find the client to get the image URL
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Delete from database
    await prisma.client.delete({ where: { id } });

    // Try to delete the file
    if (client.imageUrl) {
      try {
        const filename = client.imageUrl.split('/').pop();
        if (filename) {
          const filepath = join(process.cwd(), 'public', 'uploads', filename);
          await unlink(filepath);
        }
      } catch (err) {
        console.error('Failed to delete client image file:', err);
        // We don't fail the API request if file deletion fails, as the DB record is already gone
      }
    }

    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isVisible } = await req.json();
    const client = await prisma.client.update({
      where: { id },
      data: { isVisible },
    });
    revalidatePath('/');
    return NextResponse.json(client);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}
