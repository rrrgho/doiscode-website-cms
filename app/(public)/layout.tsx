import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getSettings() {
  try {
    const settings = await prisma.websiteSetting.findUnique({ where: { id: 1 } });
    return settings;
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
