import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Images, BarChart3 } from 'lucide-react';
import { notFound } from 'next/navigation';

interface Gallery {
  id: string;
  imageUrl: string;
}

interface PortfolioDetail {
  uid: string;
  title: string;
  description: string;
  bannerUrl: string | null;
  createdAt: string;
  galleries: Gallery[];
}

async function getPortfolio(uid: string): Promise<PortfolioDetail | null> {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { uid },
      include: { galleries: true },
    });
    if (!portfolio || !portfolio.isVisible) return null;
    return {
      ...portfolio,
      createdAt: portfolio.createdAt.toISOString()
    };
  } catch {
    return null;
  }
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params;
  const portfolio = await getPortfolio(uid);

  if (!portfolio) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background px-6 py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/8 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <Link
            href="/portfolio"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:brand-text transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <BarChart3 className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest brand-text">Case Study</span>
          </div>

          {portfolio.bannerUrl && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-border shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={portfolio.bannerUrl} alt={`${portfolio.title} banner`} className="w-full h-auto object-cover max-h-[500px]" />
            </div>
          )}

          <h1 className="mb-6 text-4xl font-extrabold text-foreground md:text-5xl leading-tight">
            {portfolio.title}
          </h1>

          <div 
            className="text-lg text-muted-foreground w-full max-w-4xl rich-text rounded-2xl "
            dangerouslySetInnerHTML={{ __html: portfolio.description }}
          />
        </div>
      </section>

      {/* Gallery */}
      {portfolio.galleries.length > 0 && (
        <section className="bg-muted/30 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex items-center gap-3">
              <Images className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-foreground">Project Gallery</h2>
              <span className="ml-auto text-sm text-muted-foreground">{portfolio.galleries.length} images</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {portfolio.galleries.map((g, idx) => (
                <div
                  key={g.id}
                  className={`overflow-hidden rounded-2xl border border-border bg-card ${idx === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.imageUrl}
                    alt={`${portfolio.title} gallery ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                    style={{ minHeight: idx === 0 ? '400px' : '200px', maxHeight: idx === 0 ? '500px' : '240px' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-background px-6 py-20 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest brand-text">Interested?</p>
        <h2 className="mb-4 text-2xl font-bold text-foreground">Build something like this for your business</h2>
        <p className="mb-8 text-muted-foreground text-sm">Talk to us and we&apos;ll figure out the right solution together.</p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-xl brand-bg px-8 py-3.5 text-sm font-bold text-white brand-shadow transition-all hover-brand-bg"
        >
          Start a Conversation
        </Link>
      </section>
    </>
  );
}
