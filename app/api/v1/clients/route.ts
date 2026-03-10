import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/v1/clients — Public endpoint (for website consumption)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get('all') === 'true';

    const clients = await prisma.client.findMany({
      where: showAll ? {} : { isVisible: true },
      orderBy: { createdAt: 'desc' },
    });
    const data = clients.map((c: any) => ({
      client_name: c.name,
      image: c.imageUrl,
      id: c.id,
      isVisible: c.isVisible,
    }));
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

// POST /api/v1/clients — Create client (CMS)
export async function POST(req: NextRequest) {
  try {
    const { name, imageUrl } = await req.json();
    if (!name || !imageUrl) {
      return NextResponse.json({ error: 'name and imageUrl are required' }, { status: 400 });
    }
    const client = await prisma.client.create({ data: { name, imageUrl } });
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}
