"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-start gap-2 px-6 py-10">
      <div className="w-full max-w-4xl rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
        <p className="text-lg font-medium">Welcome to your dashboard</p>
        <p className="text-muted-foreground">This is dashboard for {user.name} {user.email}</p>
     
      </div>
    </div>
  );
}