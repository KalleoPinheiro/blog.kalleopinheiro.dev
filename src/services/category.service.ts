import prisma from "@/lib/db/client";
import { Category } from "@/lib/types";
import {
  CategoryCreate,
  CategoryUpdate,
} from "@/lib/validation/schemas";
import { slugify } from "@/lib/utils/string";
import { NotFoundError, ConflictError } from "@/lib/utils/errors";

export async function createCategory(
  data: CategoryCreate
): Promise<Category> {
  const slug = data.slug || slugify(data.name);

  const existing = await prisma.category.findUnique({
    where: { slug },
  });

  if (existing) {
    throw new ConflictError(`Category with slug "${slug}" already exists`);
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
    },
  });

  return category;
}

export async function updateCategory(
  id: string,
  data: CategoryUpdate
): Promise<Category> {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new NotFoundError(`Category with ID "${id}" not found`);
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
    },
  });

  return updated;
}

export async function getCategory(id: string): Promise<Category> {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { articles: true },
  });

  if (!category) {
    throw new NotFoundError(`Category with ID "${id}" not found`);
  }

  return category;
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { articles: true },
  });

  if (!category) {
    throw new NotFoundError(`Category with slug "${slug}" not found`);
  }

  return category;
}

export async function listCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    include: { articles: true },
    orderBy: { name: "asc" },
  });
}

export async function deleteCategory(id: string): Promise<void> {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new NotFoundError(`Category with ID "${id}" not found`);
  }

  await prisma.category.delete({
    where: { id },
  });
}
