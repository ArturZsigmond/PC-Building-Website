const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  const users = [];

  for (let i = 0; i < 10000; i++) {
    users.push({
      email: `user${i}_${faker.internet.email().toLowerCase()}`,
      password: faker.internet.password(12),
    });
  }

  const createdUsers = [];

  for (let i = 0; i < users.length; i += 1000) {
    const batch = users.slice(i, i + 1000);
    const result = await prisma.$transaction(
      batch.map(user => prisma.user.create({ data: user }))
    );
    createdUsers.push(...result);
    console.log(`✅ Seeded ${createdUsers.length} users so far`);
  }

  const builds = [];
  const cpuOptions = ['Intel', 'AMD'];
  const gpuOptions = ['RTX 5080', 'RTX 5090', 'GTX 690'];
  const caseOptions = ['Case 1', 'Case 2', 'Case 3', 'Case 4'];
  const ramOptions = ['16GB', '32GB'];

  for (let i = 0; i < 100000; i++) {
    const userId = createdUsers[Math.floor(Math.random() * createdUsers.length)].id;
    builds.push({
      cpu: faker.helpers.arrayElement(cpuOptions),
      gpu: faker.helpers.arrayElement(gpuOptions),
      ram: faker.helpers.arrayElement(ramOptions),
      case: faker.helpers.arrayElement(caseOptions),
      price: faker.number.int({ min: 1000, max: 5000 }),
      userId,
    });
  }

  for (let i = 0; i < builds.length; i += 1000) {
    const batch = builds.slice(i, i + 1000);
    await prisma.$transaction(
      batch.map(build => prisma.build.create({ data: build }))
    );
    console.log(`🖥️ Seeded ${i + batch.length} builds`);
  }

  console.log("🌱 Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
