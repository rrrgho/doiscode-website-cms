import Link from 'next/link';
import Image from 'next/image';
import { PublicThemeToggle } from './PublicThemeToggle';

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Doiscode Technology"
            width={250}
            height={100}
            className="h-15 w-auto object-contain"
            priority
          />
        </Link>

        {/* Nav Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {[
            { href: '/', label: 'Home' },
            { href: '/portfolio', label: 'Portfolio' },
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: Theme toggle + CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <PublicThemeToggle />
          <Link
            href="/contact"
            className="rounded-lg brand-bg px-5 py-2 text-sm font-semibold text-white shadow-lg brand-shadow transition-all hover-brand-bg"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </header>
  );
}
