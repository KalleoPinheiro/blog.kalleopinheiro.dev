import Link from "next/link";
import { Button } from "@/components/ui/button";

const RESOURCES = [
  { label: "Posts", href: "/admin/posts" },
  { label: "Authors", href: "/admin/authors" },
  { label: "Pages", href: "/admin/pages" },
  { label: "Media", href: "/admin/media" },
  { label: "Comments", href: "/admin/comments" },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-sidebar border-r border-border p-6">
      <h2 className="font-bold text-lg mb-6">CMS</h2>
      <nav className="space-y-2">
        {RESOURCES.map((resource) => (
          <Button
            key={resource.href}
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link href={resource.href}>{resource.label}</Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
}
