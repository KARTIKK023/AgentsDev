import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-bold">Welcome to AgentsDev</h1>
          <p className="text-muted-foreground">Simple landing page</p>
        </div>
        <div className="flex gap-4">
          <Button>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="outline">
            <Link href="/signup">Signup</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
