const { existsSync } = require('node:fs');
const { join } = require('node:path');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { loadEnvFile } = require('node:process');

const envPath = join(process.cwd(), '.env');

if (existsSync(envPath)) {
  loadEnvFile(envPath);
}

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

const COURSES = [
  { courseId: 'digital-marketing', name: 'Digital Marketing', category: 'Sales & Marketing', duration: '3 months', color: '#39bba1' },
  { courseId: 'audio-production', name: 'Applied Audio Production', category: 'Media & Creative Arts', duration: '3 months', color: '#f04e3e' },
  { courseId: 'radio-podcast-production', name: 'Radio & Podcast Production', category: 'Media & Creative Arts', duration: '3 months', color: '#f04e3e' },
  { courseId: 'film-production-ai', name: 'Film Production & AI', category: 'Media & Creative Arts', duration: '3 months', color: '#f04e3e' },
  { courseId: 'documentary-production-ai', name: 'Documentary Production & AI', category: 'Media & Creative Arts', duration: '3 months', color: '#f04e3e' },
  { courseId: 'photography-photoshop-ai', name: 'Photoshop & Photography with AI', category: 'Media & Creative Arts', duration: '3 months', color: '#f04e3e' },
  { courseId: 'motion-graphics-ai', name: 'Motion & Still Graphics with AI', category: 'Media & Creative Arts', duration: '3 months', color: '#f04e3e' },
  { courseId: 'web-app-development-ai', name: 'Website Design, App Development & AI', category: 'Media & Creative Arts', duration: '3 months', color: '#f04e3e' },
  { courseId: 'animation-gaming-ai', name: 'Animation & Gaming with AI', category: 'Media & Creative Arts', duration: '9 months', color: '#f04e3e' },
  { courseId: 'music-video-production-ai', name: 'Music Video Production with AI', category: 'Media & Creative Arts', duration: '3 months', color: '#f04e3e' },
  { courseId: 'beauty-makeup', name: 'Beauty Makeup for Film with AI', category: 'Media & Creative Arts', duration: '3 months', color: '#f04e3e' },
  { courseId: 'fashion-design', name: 'Fashion Design with AI', category: 'Media & Creative Arts', duration: '9 months', color: '#f04e3e' },
  { courseId: 'ai-digital-literacy', name: 'Introduction to AI & Digital Literacy', category: 'Personal Development', duration: '3 months', color: '#89c242' },
  { courseId: 'phone-video-production', name: 'Phone Video Production', category: 'Media & Creative Arts', duration: '1 month', color: '#f04e3e' },
  { courseId: 'tv-radio-presentation', name: 'TV & Radio Presentation', category: 'Media & Creative Arts', duration: '1 month', color: '#f04e3e' },
  { courseId: 'public-speaking', name: 'Public Speaking', category: 'Personal Development', duration: '3 months', color: '#89c242' },
  { courseId: 'hospitality-management', name: 'Hospitality Management', category: 'Hospitality', duration: '3 months', color: '#fbca0d' },
  { courseId: 'acting', name: 'Acting & Performing Arts', category: 'Media & Creative Arts', duration: '3 months', color: '#f04e3e' },
  { courseId: 'tour-guide', name: 'Tour Guide', category: 'Hospitality', duration: '3 months', color: '#fbca0d' },
  { courseId: 'drone-piloting', name: 'Drone Piloting & Aerial Photography', category: 'Media & Creative Arts', duration: '3 months', color: '#f04e3e' },
  { courseId: 'urban-gardening', name: 'Climate Change & Urban Home Gardening', category: 'Personal Development', duration: '3 months', color: '#89c242' },
  { courseId: 'dj-vj', name: 'DJ, VJ & Artist Management with AI', category: 'Media & Creative Arts', duration: '3 months', color: '#f04e3e' },
  { courseId: 'event-management', name: 'Event Management with AI Integration', category: 'Hospitality', duration: '3 months', color: '#fbca0d' },
  { courseId: 'real-estate-management', name: 'Real Estate Management', category: 'Sales & Marketing', duration: '1 month', color: '#39bba1' },
  { courseId: 'tourism-management', name: 'Tourism Management', category: 'Hospitality', duration: '1 month', color: '#fbca0d' },
  { courseId: 'digital-currencies-forex-trading', name: 'Digital Currencies & Forex Trading', category: 'Sales & Marketing', duration: '1 month', color: '#39bba1' },
];

async function main() {
  console.log('🌱 Seeding SMARI database...');

  // Seed courses
  for (const course of COURSES) {
    await prisma.course.upsert({
      where: { courseId: course.courseId },
      update: course,
      create: { ...course, price: 'UGX 395,000' },
    });
  }
  console.log(`✅ Seeded ${COURSES.length} courses`);

  // Seed admin user
  // Using a simple hash for the default password "smari2026"
  // In production, use bcryptjs properly
  const bcrypt = require('bcryptjs');
  const hash = await bcrypt.hash('smari2026', 10);

  await prisma.adminUser.upsert({
    where: { email: 'admin@smari.ac.ug' },
    update: {},
    create: {
      email: 'admin@smari.ac.ug',
      passwordHash: hash,
      name: 'SMARI Admin',
      role: 'admin',
    },
  });
  console.log('✅ Seeded admin user (admin@smari.ac.ug / smari2026)');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
