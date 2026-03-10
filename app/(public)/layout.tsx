import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';

async function getSettings() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const brandColor = settings?.primaryColor || '#10b981';

  return (
    <>
      {/* Inject the CMS primary color as a CSS variable */}
      <style>{`:root { --brand: ${brandColor}; }`}</style>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <main className="pt-[73px]">{children}</main>
        <Footer settings={settings} />
      </div>
    </>
  );
}
