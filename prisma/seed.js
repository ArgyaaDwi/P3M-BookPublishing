const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin2@gmail.com';
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('ℹ️ Admin with this email already exists, skipping seed.');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin 2 P3M',
      email: email,
      password: hashedPassword,
      role: 'ADMIN',
      major_id: null,
      nidn: null,
      address: 'Jl. Kampus PENS',
      phone_number: '08123456789',
      profile_pic: null,
    },
  });

  console.log('✅ Admin created:', admin);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
