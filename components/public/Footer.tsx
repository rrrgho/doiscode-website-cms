import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Linkedin, Twitter, Github } from 'lucide-react';

interface FooterProps {
  settings: {
    footerText: string;
    address: string;
    phone: string;
    email: string;
  } | null;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="border-t border-border bg-background text-muted-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="mb-5 inline-block">
              <Image
                src="/images/main-logo.png"
                alt="Doiscode Technology"
                width={250}
                height={100}
                className="h-30 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
              Empowering Palm Oil & Agriculture industries across Indonesia and Malaysia with future-ready technology solutions.
            </p>
            <div className="mt-6 flex gap-4">
              {[
                { icon: Linkedin, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Github, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors brand-border-subtle hover-brand-text">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Company</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/portfolio', label: 'Portfolio' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-emerald-400">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Contact</h4>
            <ul className="space-y-3 text-sm">
              {settings?.address && (
                <li className="flex gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 brand-text" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.phone && (
                <li className="flex gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 brand-text" />
                  <span>{settings.phone}</span>
                </li>
              )}
              {settings?.email && (
                <li className="flex gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 brand-text" />
                  <span>{settings.email}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          {settings?.footerText || '© 2025 Doiscode Technology. All rights reserved.'}
        </div>
      </div>
    </footer>
  );
}
