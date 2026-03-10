import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/v1/portfolio — returns all portfolios WITHOUT galleries
export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' },
      select: { uid: true, title: true, description: true, createdAt: true },
    });
    return NextResponse.json(portfolios);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 });
  }
}

// POST /api/v1/portfolio — create a new portfolio
export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();
    if (!title || !description) {
      return NextResponse.json({ error: 'title and description are required' }, { status: 400 });
    }
    const portfolio = await prisma.portfolio.create({ data: { title, description } });
    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 });
  }
}
