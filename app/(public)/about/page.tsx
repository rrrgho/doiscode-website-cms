import Link from 'next/link';
import { ArrowRight, Target, Zap, Globe, Users,ShieldCheck, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'About Us — Doiscode Technology',
  description: 'Learn about Doiscode Technology — a software house focused on empowering Palm Oil and Agriculture industries across Indonesia and Malaysia with modern software.',
};

const values = [
  { icon: Target, title: 'Domain-First Thinking', desc: 'We deeply understand agribusiness operations before writing a single line of code.' },
  { icon: Zap, title: 'Rapid Delivery', desc: 'We ship production-ready software in weeks, not years — without sacrificing quality.' },
  { icon: Globe, title: 'Regional Expertise', desc: 'We understand the regulatory, cultural, and operational landscape of Indonesia & Malaysia.' },
  { icon: ShieldCheck, title: 'Clean & Maintainable Code', desc: 'Built to last. Our codebases are structured, documented, and easy to extend over time.' },
  { icon: TrendingUp, title: 'Scalable Architecture', desc: 'From a single estate to a multi-national operation — our systems grow with you.' },
  { icon: Users, title: 'Long-Term Partnership', desc: 'We don\'t disappear after launch. We stay involved as your technology partner.' },
];

const team = [
  {
    name: 'Igho',
    role: 'Founder & Lead Engineer',
    bio: 'Software Engineer with 6+ years experience building scalable, innovative and user-focused applications. Expert in Next.js, React.js, Node.js, Laravel, and Django.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background px-6 py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-emerald-500/8 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl grid gap-12 md:grid-cols-2 items-center">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest brand-text">Who We Are</p>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
              Making Agribusiness Faster with Technology
            </h1>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              Doiscode Technology is an Indonesian software house laser-focused on one mission: helping Palm Oil estates, mills, and large-scale agriculture enterprises embrace modern technology without the headache.
            </p>
            <p className="mb-8 text-muted-foreground leading-relaxed text-sm">
              We are not a typical IT vendor. We have deep domain knowledge of how plantations operate — from field data collection to palm fresh fruit bunch (FFB) weighing, from mill production tracking to regulatory reporting. That knowledge is what makes our software actually work for the people using it.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl brand-bg px-6 py-3 text-sm font-bold text-white brand-shadow hover-brand-bg transition-all"
            >
              Work with us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative rounded-2xl border border-border bg-card p-10">
              <Image
                src="/images/main-logo.png"
                alt="Doiscode Technology"
                width={220}
                height={80}
                className="mx-auto object-contain"
              />
              <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                {[
                  { v: '6+', l: 'Years' },
                  { v: '30+', l: 'Projects' },
                  { v: '2', l: 'Countries' },
                  { v: '100%', l: 'Satisfaction' },
                ].map(({ v, l }) => (
                  <div key={l} className="rounded-xl bg-background border border-border p-4">
                    <p className="text-2xl font-extrabold brand-text">{v}</p>
                    <p className="text-xs text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest brand-text">How We Work</p>
            <h2 className="text-3xl font-bold text-foreground">Our Core Values</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-7 transition-all hover:border-brand/20 hover:shadow-lg">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl brand-bg-subtle brand-ring">
                  <Icon className="h-5 w-5 brand-text" />
                </div>
                <h3 className="mb-2 font-bold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-background px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest brand-text">The People</p>
            <h2 className="text-3xl font-bold text-foreground">Meet the Team</h2>
          </div>
          <div className="flex justify-center gap-6 flex-wrap">
            {team.map((member) => (
              <div key={member.name} className="rounded-2xl border border-border bg-card p-8 max-w-sm text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full brand-bg-subtle brand-ring text-2xl font-bold brand-text">
                  {member.name[0]}
                </div>
                <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                <p className="mb-4 text-xs font-semibold brand-text">{member.role}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
