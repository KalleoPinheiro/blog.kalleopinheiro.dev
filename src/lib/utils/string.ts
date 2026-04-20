// Generate URL-friendly slug from text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Format date to readable string
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format date and time to readable string
export function formatDateTime(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Relative time (e.g., "2 days ago")
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [name, secondsInInterval] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInInterval);
    if (interval >= 1) {
      return interval === 1 ? `1 ${name} ago` : `${interval} ${name}s ago`;
    }
  }

  return "just now";
}

// Calculate reading time in minutes from markdown content
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Truncate text and add ellipsis
export function truncate(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

// Extract plain text from markdown-like content
export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\n\n+/g, " ")
    .trim();
}

// Generate excerpt from content
export function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = stripMarkdown(content);
  return truncate(plainText, maxLength);
}

// Highlight search terms in text
export function highlightSearchTerm(text: string, term: string): string {
  const regex = new RegExp(`(${term})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}
