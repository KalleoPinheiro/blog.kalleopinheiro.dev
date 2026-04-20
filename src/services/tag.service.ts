import prisma from "@/lib/db/client";
import { Tag } from "@/lib/types";
import { TagCreate, TagUpdate } from "@/lib/validation/schemas";
import { slugify } from "@/lib/utils/string";
import { NotFoundError, ConflictError } from "@/lib/utils/errors";

export async function createTag(data: TagCreate): Promise<Tag> {
  const slug = data.slug || slugify(data.name);

  const existing = await prisma.tag.findUnique({
    where: { slug },
  });

  if (existing) {
    throw new ConflictError(`Tag with slug "${slug}" already exists`);
  }

  const tag = await prisma.tag.create({
    data: {
      name: data.name,
      slug,
    },
  });

  return tag;
}

export async function updateTag(
  id: string,
  data: TagUpdate
): Promise<Tag> {
  const tag = await prisma.tag.findUnique({
    where: { id },
  });

  if (!tag) {
    throw new NotFoundError(`Tag with ID "${id}" not found`);
  }

  const updated = await prisma.tag.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
    },
  });

  return updated;
}

export async function getTag(id: string): Promise<Tag> {
  const tag = await prisma.tag.findUnique({
    where: { id },
    include: { articleTags: true },
  });

  if (!tag) {
    throw new NotFoundError(`Tag with ID "${id}" not found`);
  }

  return tag;
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: { articleTags: true },
  });

  if (!tag) {
    throw new NotFoundError(`Tag with slug "${slug}" not found`);
  }

  return tag;
}

export async function listTags(): Promise<Tag[]> {
  return prisma.tag.findMany({
    include: { articleTags: true },
    orderBy: { name: "asc" },
  });
}

export async function deleteTag(id: string): Promise<void> {
  const tag = await prisma.tag.findUnique({
    where: { id },
  });

  if (!tag) {
    throw new NotFoundError(`Tag with ID "${id}" not found`);
  }

  await prisma.tag.delete({
    where: { id },
  });
}

export async function getPopularTags(limit: number = 10): Promise<Tag[]> {
  const tags = await prisma.tag.findMany({
    include: {
      articleTags: true,
    },
    orderBy: { articleTags: { _count: "desc" } },
    take: limit,
  });

  return tags;
}
