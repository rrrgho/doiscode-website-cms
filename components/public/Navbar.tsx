"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PublicThemeToggle } from './PublicThemeToggle';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center z-50" onClick={() => setIsMobileMenuOpen(false)}>
            <Image
              src="/images/logo.png"
              alt="Doiscode Technology"
              width={250}
              height={100}
              className="h-15 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: Theme toggle + CTA (Desktop) */}
          <div className="hidden items-center gap-3 md:flex">
            <PublicThemeToggle />
            <Link
              href="/contact"
              className="rounded-lg brand-bg px-5 py-2 text-sm font-semibold text-white shadow-lg brand-shadow transition-all hover-brand-bg"
            >
              Get in Touch
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden z-50">
            <PublicThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground focus:outline-none flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
              aria-label="Toggle Menu"
            >
              <span className={`block w-6 h-0.5 bg-current transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-current transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block w-6 h-0.5 bg-current transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)} // close when clicking background
      >
        <div
          className={`absolute inset-y-0 right-0 w-64 bg-background shadow-xl transition-transform duration-300 ease-in-out transform flex flex-col pt-24 px-6 gap-6 border-l border-border ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside menu
        >
          <nav className="flex flex-col gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
            <hr className="border-border" />
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg brand-bg px-5 py-3 text-center text-sm font-semibold text-white shadow-lg brand-shadow transition-all hover-brand-bg"
            >
              Get in Touch
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
