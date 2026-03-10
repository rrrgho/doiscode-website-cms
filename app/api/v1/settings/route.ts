import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/v1/settings
export async function GET() {
  try {
    let settings = await prisma.websiteSetting.findUnique({ where: { id: 1 } });
    if (!settings) {
      settings = await prisma.websiteSetting.create({
        data: { id: 1 },
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT /api/v1/settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const settings = await prisma.websiteSetting.upsert({
      where: { id: 1 },
      update: {
        primaryColor: body.primaryColor,
        footerText: body.footerText,
        address: body.address,
        phone: body.phone,
        email: body.email,
      },
      create: {
        id: 1,
        primaryColor: body.primaryColor || '#2563eb',
        footerText: body.footerText || '',
        address: body.address || '',
        phone: body.phone || '',
        email: body.email || '',
      },
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
