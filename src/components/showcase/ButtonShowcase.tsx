"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ButtonShowcase() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-2xl font-bold">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="xs" variant="outline">
            Extra Small
          </Button>
          <Button size="sm" variant="outline">
            Small
          </Button>
          <Button size="default" variant="outline">
            Default
          </Button>
          <Button size="lg" variant="outline">
            Large
          </Button>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Icon Buttons</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="icon-xs" variant="outline" aria-label="Add">
            <Plus className="h-3 w-3" />
          </Button>
          <Button size="icon-sm" variant="outline" aria-label="Add">
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" aria-label="Add">
            <Plus className="h-5 w-5" />
          </Button>
          <Button size="icon-lg" variant="outline" aria-label="Add">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">With Icons and Text</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">
            <Plus className="h-4 w-4" />
            Create
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Disabled States</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default" disabled>Disabled Primary</Button>
          <Button variant="outline" disabled>Disabled Outline</Button>
          <Button variant="destructive" disabled>Disabled Danger</Button>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Loading States</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default" disabled>
            Creating...
          </Button>
          <Button variant="secondary" disabled>
            Saving...
          </Button>
        </div>
      </section>
    </div>
  )
}
