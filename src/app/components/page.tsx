import { ButtonShowcase } from "@/components/showcase/ButtonShowcase"
import CardShowcase from "@/components/showcase/CardShowcase"

export default function ComponentsPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-12">
        <h1 className="mb-8 text-4xl font-bold">Components</h1>
        <ButtonShowcase />
        <hr className="my-8" />
        <CardShowcase />
      </div>
    </main>
  )
}
