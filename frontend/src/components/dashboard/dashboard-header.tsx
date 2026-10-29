"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useAuth } from "@/context/auth-context";
import { ModeToggle } from "../ui/theme-toggle";

export function DashboardHeader() {
  const router = useRouter();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="text-lg font-semibold">
          Dashboard
        </Link>
        <nav className="flex items-center gap-2">
          {/* <Button variant="ghost" size="sm">
            <Link href="/">Home</Link>
          </Button> */}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
          <ModeToggle/>
        </nav>
      </div>
    </header>
  );
}