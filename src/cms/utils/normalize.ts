// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeData(data: Record<string, unknown>): any {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
}
