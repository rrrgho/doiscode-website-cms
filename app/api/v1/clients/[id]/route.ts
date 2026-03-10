import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.client.delete({ where: { id } });
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
    return NextResponse.json(client);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}
