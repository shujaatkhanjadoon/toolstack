"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "./mode-toggle";

// We'll define our categories here. Later, this can come from a central config file.
const mainNavCategories = [
  {
    title: "Text Tools",
    href: "/text-tools",
  },
  {
    title: "Converters",
    href: "/converters",
  },
  {
    title: "Calculators",
    href: "/calculators",
  },
  // We'll add more categories like "Time & Date", "Health", etc. later.
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  {/* Keep the existing div inside which now has max-w-6xl and padding */}
      <div className="mx-auto flex h-16 max-w-6xl items-center space-x-4 px-4 sm:px-6 lg:px-8 sm:justify-between sm:space-x-0">
        {/* Left: Logo */}
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            {/* Replace with your logo text or image */}
            <span className="inline-block font-bold text-xl">ToolStack</span>
          </Link>
        </div>

        {/* Center: Navigation Menu (hidden on mobile, visible on desktop) */}
        <nav className="hidden flex-1 md:flex justify-center gap-6">
          {mainNavCategories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="flex items-center text-lg font-medium text-muted-foreground transition-colors hover:text-foreground/80 sm:text-sm"
            >
              {category.title}
            </Link>
          ))}
        </nav>

        {/* Right: Search Bar and Theme Toggle */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Search Bar - Icon on mobile, full bar on desktop */}
          <div className="relative">
            {/* Search Icon for Mobile */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search tools</span>
            </Button>
            {/* Full Search Input for Desktop */}
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tools..."
                className="pl-8 w-[200px] lg:w-[300px] rounded-full bg-muted"
                // We will add search functionality later
              />
            </div>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}