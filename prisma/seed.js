// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { faker } = require('@faker-js/faker');

const CPUS = ["Intel", "AMD"];
const RAMS = ["16GB", "32GB"];
const GPUS = ["RTX 5080", "RTX 5090", "GTX 690"];
const CASES = ["case1.jpg", "case2.jpg", "case3.jpg", "case4.jpg"];
const prices = {
  Intel: 565, AMD: 550,
  "16GB": 200, "32GB": 375,
  "RTX 5090": 2100, "RTX 5080": 1595, "GTX 690": 999,
  "case1.jpg": 200, "case2.jpg": 235, "case3.jpg": 185, "case4.jpg": 230,
};

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: { email: "test@example.com", password: "test1234", role: "user" },
  });

  const builds = Array.from({ length: 100000 }).map(() => {
    const cpu = faker.helpers.arrayElement(CPUS);
    const ram = faker.helpers.arrayElement(RAMS);
    const gpu = faker.helpers.arrayElement(GPUS);
    const pcCase = faker.helpers.arrayElement(CASES);
    return {
      cpu,
      ram,
      gpu,
      case: pcCase,
      price: prices[cpu] + prices[ram] + prices[gpu] + prices[pcCase],
      userId: user.id,
    };
  });

  console.log("📦 Seeding 100k builds...");
  for (let i = 0; i < builds.length; i += 1000) {
    await prisma.build.createMany({ data: builds.slice(i, i + 1000) });
  }
  console.log("✅ Seed complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
