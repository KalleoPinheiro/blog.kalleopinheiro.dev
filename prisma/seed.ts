import { faker } from "@faker-js/faker";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  const author = await prisma.author.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      bio: faker.lorem.paragraph(),
    },
  });

  await prisma.post.createMany({
    data: Array.from({ length: 5 }, () => ({
      title: faker.lorem.sentence(),
      slug: faker.helpers.slugify(faker.lorem.words(4)).toLowerCase(),
      content: faker.lorem.paragraphs(3),
      excerpt: faker.lorem.sentence(),
      authorId: author.id,
      status: "published",
      publishedAt: new Date(),
    })),
  });

  console.log(`Seeded database with author "${author.name}" and 5 posts`);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
