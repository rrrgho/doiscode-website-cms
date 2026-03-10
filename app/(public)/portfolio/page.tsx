import Link from 'next/link';
import { BarChart3, ChevronRight, Briefcase } from 'lucide-react';

interface Portfolio {
  uid: string;
  title: string;
  description: string;
  createdAt: string;
}

async function getPortfolios(): Promise<Portfolio[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/portfolio`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export const metadata = {
  title: 'Portfolio — Doiscode Technology',
  description: 'Explore our software projects built for Palm Oil and Agriculture industries across Indonesia and Malaysia.',
};

export default async function PortfolioPage() {
  const portfolios = await getPortfolios();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background px-6 py-24 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest brand-text">Our work</p>
          <h1 className="mb-4 text-4xl font-extrabold text-foreground md:text-5xl">Portfolio</h1>
          <p className="text-muted-foreground">
            A showcase of software solutions we have built for plantations, mills, and agribusinesses across the region.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          {portfolios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Briefcase className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No portfolio items yet — check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((p, i) => (
                <Link
                  key={p.uid}
                  href={`/portfolio/${p.uid}`}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-brand/20 hover:shadow-lg"
                >
                  <span className="absolute right-6 top-6 text-6xl font-black text-foreground/5 transition-all group-hover:text-brand/10">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl brand-bg-subtle brand-ring">
                    <BarChart3 className="h-5 w-5 brand-text" />
                  </div>
                  <h2 className="mb-3 text-lg font-bold text-foreground transition-colors group-hover:brand-text">
                    {p.title}
                  </h2>
                  <div 
                    className="mb-6 text-sm leading-relaxed text-muted-foreground line-clamp-3 rich-text"
                    dangerouslySetInnerHTML={{ __html: p.description }}
                  />
                  <div className="flex items-center gap-1.5 text-xs font-semibold brand-text">
                    View case study <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
