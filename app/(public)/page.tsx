import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Cpu, Database, BarChart3, Layers, CheckCircle, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Client {
  client_name: string;
  image: string;
  id: string;
}

interface Portfolio {
  uid: string;
  title: string;
  description: string;
}

async function getClients(): Promise<Client[]> {
  try {
    const clients = await prisma.client.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: 'desc' },
    });
    return clients.map(c => ({
      client_name: c.name,
      image: c.imageUrl,
      id: c.id,
    }));
  } catch {
    return [];
  }
}

async function getPortfolios(): Promise<Portfolio[]> {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: 'desc' },
      select: { uid: true, title: true, description: true },
    });
    return portfolios;
  } catch {
    return [];
  }
}

const services = [
  {
    icon: Cpu,
    title: 'IoT & Precision Farming',
    description: 'Smart sensor networks and real-time monitoring systems for your plantation. Track yield, soil health, and machine performance from a single dashboard.',
    highlights: ['Sensor Integration', 'Real-time Alerts', 'GPS Tracking'],
  },
  {
    icon: Database,
    title: 'ERP for Agribusiness',
    description: 'End-to-end enterprise resource planning built specifically for palm oil mills and large-scale plantations — from field to factory.',
    highlights: ['Supply Chain', 'Inventory & Stock', 'Finance Module'],
  },
  {
    icon: BarChart3,
    title: 'Data Analytics & AI',
    description: 'Predictive analytics and machine learning models that forecast production, detect disease outbreaks, and optimize harvest schedules.',
    highlights: ['Yield Prediction', 'Disease Detection', 'Harvest Planning'],
  },
  {
    icon: Layers,
    title: 'Custom Software',
    description: 'Bespoke web and mobile applications tailored to your specific operational workflows — built rapidly and maintained long-term.',
    highlights: ['Web & Mobile Apps', 'API Integration', 'Legacy Migration'],
  },
];

const stats = [
  { value: '6+', label: 'Years of Experience' },
  { value: '100%', label: 'Great Service' },
  { value: '100%', label: 'Best Price' },
];

export default async function HomePage() {
  const [clients, portfolios] = await Promise.all([getClients(), getPortfolios()]);
  const featuredPortfolios = portfolios.slice(0, 3);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-background px-6 py-32 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute left-1/4 bottom-0 h-96 w-96 rounded-full bg-emerald-600/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full brand-border-subtle brand-bg-subtle px-4 py-1.5 text-xs font-semibold uppercase tracking-widest brand-text">
            <span className="h-1.5 w-1.5 rounded-full brand-bg animate-pulse" />
            Agritech Software House · Indonesia & Malaysia
          </div>

          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Powering the Future
            <br />
            of{' '}
            <span className="brand-text">
              Palm Oil & Agriculture
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            We build scalable, innovative software solutions that help palm oil estates, mills, and agribusinesses in Indonesia and Malaysia operate faster, smarter, and more profitably.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/portfolio"
              className="group flex items-center gap-2 rounded-xl brand-bg px-7 py-3.5 text-sm font-bold text-white brand-shadow transition-all hover-brand-bg"
            >
              View Our Work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-all hover:border-brand/40 hover:bg-secondary"
            >
              Talk to Us
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">
          {stats.map(({ value, label }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-5 backdrop-blur">
              <p className="text-3xl font-extrabold brand-text">{value}</p>
              <p className="mt-1 text-xs text-neutral-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest brand-text">What We Build</p>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Technology Solutions for<br />the Agribusiness Sector
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
              From plantation management systems to AI-powered analytics, we design and deliver software that addresses the unique challenges of agricultural operations.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {services.map(({ icon: Icon, title, description, highlights }) => (
              <div
                key={title}
                className="group rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl brand-bg-subtle brand-ring transition-all">
                  <Icon className="h-6 w-6 brand-text" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-foreground">{title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{description}</p>
                <ul className="space-y-2">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="h-3.5 w-3.5 brand-text" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR CLIENTS ===== */}
      {clients.length > 0 && (
        <section className="bg-background px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest brand-text">Trusted By</p>
              <h2 className="text-2xl font-bold text-foreground">Companies That Trust Doiscode</h2>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-10">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="group flex flex-col items-center gap-3 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client.image}
                    alt={client.client_name}
                    className="h-12 w-auto max-w-[120px] object-contain"
                  />
                  <span className="text-xs text-muted-foreground hover-brand-text">{client.client_name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FEATURED PORTFOLIO ===== */}
      {featuredPortfolios.length > 0 && (
        <section className="bg-muted/30 px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest brand-text">Case Studies</p>
                <h2 className="text-3xl font-bold text-foreground">Recent Work</h2>
              </div>
              <Link
                href="/portfolio"
                className="flex items-center gap-1.5 text-sm font-medium brand-text"
              >
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {featuredPortfolios.map((p, i) => (
                <Link
                  key={p.uid}
                  href={`/portfolio/${p.uid}`}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg"
                >
                  {/* Number */}
                  <span className="absolute right-6 top-6 text-5xl font-black text-foreground/5 transition-all group-hover:text-brand/10">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg brand-bg-subtle">
                    <BarChart3 className="h-5 w-5 brand-text" />
                  </div>
                  <h3 className="mb-3 text-base font-bold text-foreground transition-colors">{p.title}</h3>
                  <div className="text-sm leading-relaxed text-muted-foreground line-clamp-3" dangerouslySetInnerHTML={{ __html: p.description }} />
                  <div className="mt-5 flex items-center gap-1.5 text-xs font-medium brand-text">
                    View case study <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA BANNER ===== */}
      <section className="relative overflow-hidden bg-background px-6 py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Ready to modernize your<br />agricultural operations?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Let's talk about how Doiscode can build the right software for your palm oil estate, mill, or agribusiness.
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-xl brand-bg px-8 py-4 text-sm font-bold text-white brand-shadow transition-all hover-brand-bg"
          >
            Start a Project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
