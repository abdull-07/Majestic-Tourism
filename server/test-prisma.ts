import 'dotenv/config';
import { PrismaClient } from './src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const created = await prisma.testPing.create({
    data: { message: 'Prisma is working' },
  });
  console.log('Created:', created);

  const all = await prisma.testPing.findMany();
  console.log('All rows:', all);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });