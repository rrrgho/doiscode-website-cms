import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@doiscode.com' },
    update: {},
    create: {
      email: 'admin@doiscode.com',
      passwordHash: hash,
    },
  });

  // Seed default website settings
  await prisma.websiteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      primaryColor: '#2563eb',
      footerText: '© 2025 Doiscode Technology. All rights reserved.',
      address: 'Jakarta, Indonesia',
      phone: '+62 812 3456 7890',
      email: 'hello@doiscode.com',
    },
  });

  console.log('✅ Seed complete: admin@doiscode.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
