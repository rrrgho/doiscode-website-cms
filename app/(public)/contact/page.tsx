'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';

interface Settings {
  address: string;
  phone: string;
  email: string;
  primaryColor: string;
}

async function fetchSettings(): Promise<Settings> {
  const res = await fetch('/api/v1/settings');
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export default function ContactPage() {
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: fetchSettings });

  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function handleChange(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    // Simulate form submission (in production, hook up to email API like Resend/SendGrid)
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
  }

  const contactItems = [
    { icon: MapPin, label: 'Address', value: settings?.address || 'Jakarta, Indonesia' },
    { icon: Phone, label: 'Phone', value: settings?.phone || '+62 812 3456 7890' },
    { icon: Mail, label: 'Email', value: settings?.email || 'hello@doiscode.com' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background px-6 py-24 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest brand-text">Let&apos;s Talk</p>
          <h1 className="mb-4 text-4xl font-extrabold text-foreground md:text-5xl">Contact Us</h1>
          <p className="text-muted-foreground">
            Have a project in mind? We&apos;d love to hear about your challenges and figure out how we can help.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-5xl grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <div>
            <h2 className="mb-6 text-xl font-bold text-foreground">Get in Touch</h2>
            <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
              Whether you&apos;re a palm oil estate looking to digitize your operations, a mill wanting a custom production tracking system, or an agribusiness exploring software options — we&apos;re the right team to call.
            </p>
            <div className="space-y-5">
              {contactItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg brand-bg-subtle">
                    <Icon className="h-5 w-5 brand-text" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-8">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="mb-4 h-14 w-14 text-emerald-400" />
                <h3 className="mb-2 text-xl font-bold text-foreground">Message Sent!</h3>
                <p className="text-sm text-muted-foreground">
                  Thank you for reaching out. We&apos;ll get back to you within 1 business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-lg font-bold text-foreground">Send a Message</h2>

                {[
                  { key: 'name', label: 'Full Name', placeholder: 'Your name', type: 'text' },
                  { key: 'email', label: 'Email Address', placeholder: 'your@email.com', type: 'email' },
                  { key: 'company', label: 'Company / Organization', placeholder: 'Your Company', type: 'text' },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {label}
                    </label>
                    <input
                      type={type}
                      required
                      value={form[key as keyof typeof form]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand/40 focus:outline-none focus:ring-1 focus:ring-brand/20 transition-colors"
                    />
                  </div>
                ))}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    How can we help?
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Tell us about your project, challenge, or question..."
                    className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand/40 focus:outline-none focus:ring-1 focus:ring-brand/20 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl brand-bg py-3.5 text-sm font-bold text-white brand-shadow transition-all hover-brand-bg disabled:opacity-60"
                >
                  {sending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="h-4 w-4" /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
