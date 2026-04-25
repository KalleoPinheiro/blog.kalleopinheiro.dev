// biome-ignore lint/suspicious/noExplicitAny: Prisma types require any due to exactOptionalPropertyTypes
export function normalizeData(data: Record<string, unknown>): any {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );
}
