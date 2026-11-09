"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import getCurrentUser from "@/features/getCurrentUser";
import { setUserData } from "../../redux/userSlice";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userData = useSelector(
    (state: { user: { userData: { name?: string; email?: string } | null } }) => 
      state.user.userData
  );

  useEffect(() => {
    // Skip fetch if Redux already has the data (optional, depends on your caching strategy)
    if (userData) {
      setIsLoading(false);
      return;
    }

    const getUser = async () => {
      try {
        const data = await getCurrentUser();
        if (data) {
          dispatch(setUserData(data));
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to load user data. Please try logging in again.");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    getUser();
  }, [dispatch, router, userData]);

  if (isLoading) {
    return (
      <div className="flex animate-pulse flex-col gap-4 p-8">
        <div className="h-6 w-48 rounded bg-muted"></div>
        <div className="h-4 w-64 rounded bg-muted"></div>
      </div>
    );
  }

  if (error || !userData) {
    return null; // Prevent rendering sensitive UI entirely
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="rounded-lg border bg-card py-6 px-8 text-card-foreground shadow-sm">
        <p className="text-lg font-medium">Welcome to your dashboard</p>
        <p className="text-muted-foreground">
          This is dashboard for {userData.name} and his/her email is {userData.email}
        </p>
      </div>
    </div>
  );
}