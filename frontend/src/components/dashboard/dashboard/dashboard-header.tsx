"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModeToggle } from "@/components/ui/theme-toggle";

export function DashboardHeader() {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);

    if (paths.length === 1 && paths[0] === "dashboard") {
      return [{ label: "Dashboard", href: "/dashboard", isLast: true }];
    }

    const breadcrumbs = [
      { label: "Dashboard", href: "/dashboard", isLast: false },
    ];

    if (paths[1] === "chat") {
      breadcrumbs.push({
        label: "Chat",
        href: "/dashboard/chat",
        isLast: paths.length === 2,
      });
    } else if (paths[1] === "agents") {
      breadcrumbs.push({
        label: "Agents",
        href: "/dashboard/agents",
        isLast: paths.length === 2,
      });
    } else if (paths[1] === "settings") {
      breadcrumbs.push({
        label: "Settings",
        href: "/dashboard/settings",
        isLast: paths.length === 2,
      });
    } else if (paths[1] === "billing") {
      breadcrumbs.push({
        label: "Billing",
        href: "/dashboard/billing",
        isLast: paths.length === 2,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.href}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {breadcrumb.isLast ? (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={breadcrumb.href} />}>
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  );
}
