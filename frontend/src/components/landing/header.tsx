import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "../ui/theme-toggle"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold">
          AgentsDev
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm">
            <Link href="/signup">Signup</Link>
          </Button>
          <ModeToggle/>
        </nav>
      </div>
    </header>
  )
}
