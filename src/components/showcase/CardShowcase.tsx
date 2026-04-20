"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function CardShowcase() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Card Component</h2>
        <p className="text-muted-foreground mb-8">
          A flexible card component for displaying content with header, content, and footer sections.
        </p>
      </div>

      {/* Login Card Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Login Form</h3>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              <Button variant="link">Sign Up</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Simple Card Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Simple Card</h3>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>
              Deploy your new project in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Project Name
                </label>
                <Input
                  id="name"
                  placeholder="My awesome project"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Deploy</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Card with Stats */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Stats Card</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Total Users", value: "2,543" },
            { label: "Active Sessions", value: "1,234" },
            { label: "Conversion Rate", value: "42.3%" },
          ].map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
