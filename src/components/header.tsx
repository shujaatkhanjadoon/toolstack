"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "./mode-toggle";
import { mainCategories } from "@/data/categories";

export function Header() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setActiveCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryHover = (categoryTitle: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveCategory(categoryTitle);
  };

  const handleCategoryLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 200);
  };

  const handleMegaMenuHover = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMegaMenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 200);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
            <span className="inline-block font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ToolStack
            </span>
          </Link>

          {/* Categories Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.title}
                  className="relative"
                  onMouseEnter={() => handleCategoryHover(category.title)}
                  onMouseLeave={handleCategoryLeave}
                >
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-1 h-9 px-3 text-sm font-medium transition-all duration-200 ${
                      activeCategory === category.title
                        ? "text-blue-600 bg-blue-50 dark:bg-blue-950/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {category.title}
                    <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${
                      activeCategory === category.title ? "rotate-180" : ""
                    }`} />
                  </Button>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right: Search and Theme Toggle */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center gap-2 bg-background border rounded-full pl-3 pr-2 py-1 shadow-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tools..."
                  className="border-0 h-8 w-64 focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search tools</span>
              </Button>
            )}
          </div>

          <ModeToggle />
        </div>

        {/* Mega Menu */}
        {activeCategory && (
          <div
            ref={megaMenuRef}
            className="absolute left-0 right-0 top-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xl"
            onMouseEnter={handleMegaMenuHover}
            onMouseLeave={handleMegaMenuLeave}
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
              {mainCategories
                .filter(category => category.title === activeCategory)
                .map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div key={category.title} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Category Header */}
                      <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color.split(' ')[0]} ${category.color.split(' ')[1]}`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{category.title}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                        <Link
                          href={category.href}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                          View all {category.title}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </div>

                      {/* Tools Grid */}
                      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.tools.map((tool) => (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            className={`group relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                              tool.comingSoon 
                                ? "opacity-60 cursor-not-allowed" 
                                : "hover:border-blue-200 cursor-pointer"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium group-hover:text-blue-600 transition-colors">
                                  {tool.title}
                                  {tool.comingSoon && (
                                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                      Coming Soon
                                    </span>
                                  )}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                              </div>
                              <div className={`p-2 rounded-lg transition-colors ${
                                tool.comingSoon 
                                  ? "bg-gray-100" 
                                  : "bg-blue-50 group-hover:bg-blue-100"
                              }`}>
                                <ArrowRight className={`h-3 w-3 ${
                                  tool.comingSoon ? "text-gray-400" : "text-blue-600"
                                }`} />
                              </div>
                            </div>
                            
                            {/* Hover effect line */}
                            <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
                              tool.comingSoon ? "w-0" : "w-0 group-hover:w-full"
                            }`} />
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}