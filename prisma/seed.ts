import { faker } from "@faker-js/faker";
import {
  CreateAuthorSchema,
  CreateCommentSchema,
  CreateMediaSchema,
  CreatePageSchema,
  CreatePostSchema,
} from "@/cms/schemas";
import { prisma } from "@/lib/db";

faker.seed(42);
faker.setLocale("pt_BR");

const isDev = process.env.NODE_ENV !== "production";

async function seed() {
  console.log("🌱 Starting seed...");

  if (isDev) {
    console.log("🗑️ Cleaning database...");
    await prisma.comment.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.page.deleteMany({});
    await prisma.author.deleteMany({});
    await prisma.media.deleteMany({});
  }

  // 1. Seed Media (8 items for avatars and posts)
  console.log("📸 Seeding media...");
  const mediaIds: string[] = [];
  for (let i = 0; i < 8; i++) {
    const mediaPayload = {
      filename: `avatar-${i + 1}.jpg`,
      url: `https://api.dicebear.com/9.x/avataaars/svg?seed=${i}`,
      mimeType: "image/jpeg",
      size: faker.number.int({ min: 50000, max: 500000 }),
    };

    const validated = CreateMediaSchema.safeParse(mediaPayload);
    if (!validated.success) {
      console.error("❌ Media validation failed:", validated.error);
      process.exit(1);
    }

    const media = await prisma.media.create({
      data: validated.data,
    });
    mediaIds.push(media.id);
  }

  // 2. Seed Authors (3 items with avatars)
  console.log("👥 Seeding authors...");
  const authorIds: string[] = [];
  const authorNames = ["Alice Silva", "Bruno Costa", "Carla Oliveira"];
  const authorEmails = [
    "alice@example.com",
    "bruno@example.com",
    "carla@example.com",
  ];

  for (let i = 0; i < 3; i++) {
    const authorPayload = {
      name: authorNames[i],
      email: authorEmails[i],
      bio: faker.lorem.sentences(2),
      avatarId: mediaIds[i],
    };

    const validated = CreateAuthorSchema.safeParse(authorPayload);
    if (!validated.success) {
      console.error("❌ Author validation failed:", validated.error);
      process.exit(1);
    }

    const author = await prisma.author.create({
      data: validated.data,
    });
    authorIds.push(author.id);
  }

  // 3. Seed Posts (12 items, mix of draft and published)
  console.log("📝 Seeding posts...");
  const postIds: string[] = [];
  for (let i = 0; i < 12; i++) {
    const title = faker.lorem.sentence();
    const slug = title
      .toLowerCase()
      .replace(/[^\w-]/g, "-")
      .slice(0, 200);
    const isPublished = i % 3 !== 0;

    const postPayload = {
      title,
      slug: `${slug}-${i}`,
      content: faker.lorem.paragraphs(4),
      excerpt: faker.lorem.sentence(20),
      authorId: authorIds[i % 3],
      status: isPublished ? "published" : "draft",
      publishedAt: isPublished ? faker.date.past() : null,
      tags: [faker.word.noun(), faker.word.noun()],
    };

    const validated = CreatePostSchema.safeParse(postPayload);
    if (!validated.success) {
      console.error("❌ Post validation failed:", validated.error);
      process.exit(1);
    }

    const post = await prisma.post.create({
      data: validated.data,
    });
    postIds.push(post.id);
  }

  // 4. Seed Pages (4 items)
  console.log("📄 Seeding pages...");
  const pageStubs = ["about", "contact", "privacy", "terms"];
  for (const stub of pageStubs) {
    const pagePayload = {
      title: stub.charAt(0).toUpperCase() + stub.slice(1),
      slug: stub,
      content: faker.lorem.paragraphs(3),
      status: "published",
    };

    const validated = CreatePageSchema.safeParse(pagePayload);
    if (!validated.success) {
      console.error("❌ Page validation failed:", validated.error);
      process.exit(1);
    }

    await prisma.page.create({
      data: validated.data,
    });
  }

  // 5. Seed Comments (24 items, spread across posts)
  console.log("💬 Seeding comments...");
  for (let i = 0; i < 24; i++) {
    const commentPayload = {
      postId: postIds[i % postIds.length],
      author: faker.person.fullName(),
      email: faker.internet.email(),
      content: faker.lorem.sentences(3),
      status: faker.helpers.arrayElement(["pending", "approved", "rejected"]),
    };

    const validated = CreateCommentSchema.safeParse(commentPayload);
    if (!validated.success) {
      console.error("❌ Comment validation failed:", validated.error);
      process.exit(1);
    }

    await prisma.comment.create({
      data: validated.data,
    });
  }

  console.log("✅ Seed completed successfully!");
  console.log(`
  📊 Seeded data:
  - 8 media items
  - 3 authors
  - 12 posts
  - 4 pages
  - 24 comments
  `);
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
