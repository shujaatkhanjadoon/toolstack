"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "./mode-toggle";
import { mainCategories, getAllTools } from "@/data/categories";

export function Header() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const allTools = getAllTools();
  const filteredTools = searchQuery
    ? allTools.filter(tool =>
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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

  // Focus search input when popup opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // Close search on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    if (isSearchOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSearchOpen]);

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

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchResultClick = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
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
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={handleSearchClick}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search tools</span>
            </Button>

            <ModeToggle />
          </div>
        </div>

        {/* Mega Menu - SOLID BACKGROUND */}
        {/* Mega Menu - SOLID BACKGROUND */}
{activeCategory && (
  <div
    ref={megaMenuRef}
    className="absolute left-0 right-0 top-16 border-t bg-background shadow-xl"
    onMouseEnter={handleMegaMenuHover}
    onMouseLeave={handleMegaMenuLeave}
  >
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
      {mainCategories
        .filter(category => category.title === activeCategory)
        .map((category) => {
          const IconComponent = category.icon;
          const availableTools = category.tools.filter(tool => !tool.comingSoon);
          const comingSoonTools = category.tools.filter(tool => tool.comingSoon);
          
          return (
            <div key={category.title} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* MODERN FEATURE CARD - First Card Redesign */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-2xl p-6 text-white shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
                  {/* Animated Icon */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="relative bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Category Info */}
                  <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {category.title}
                  </h3>
                  <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{availableTools.length}</div>
                      <div className="text-xs text-blue-200">Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{comingSoonTools.length}</div>
                      <div className="text-xs text-blue-200">Coming Soon</div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <Link
                      href={category.href}
                      className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center group"
                    >
                      Explore All Tools
                      <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    {availableTools.length > 0 && (
                      <Link
                        href={availableTools[0].href}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center group shadow-lg hover:shadow-xl"
                      >
                        Try {availableTools[0].title}
                        <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>

                  {/* Animated Background Elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-4 translate-x-4"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-500/10 rounded-full translate-y-4 -translate-x-4"></div>
                </div>

                {/* View All Link */}
                <Link
                  href={category.href}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors mt-4 ml-2"
                >
                  View all {category.title}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </div>

              {/* Tools Grid - Updated Design */}
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tools.map((tool, index) => {
                  const ToolIcon = tool.icon;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className={`group relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-2xl bg-card ${
                        tool.comingSoon 
                          ? "opacity-60 cursor-not-allowed border-dashed" 
                          : "cursor-pointer hover:scale-[1.02] border-solid hover:border-blue-300 shadow-sm"
                      }`}
                      onClick={() => setActiveCategory(null)}
                    >
                      {/* Tool Icon */}
                      <div className={`p-3 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 ${
                        tool.comingSoon 
                          ? "bg-muted" 
                          : "bg-blue-50 group-hover:bg-blue-100"
                      }`}>
                        <ToolIcon className={`h-6 w-6 ${
                          tool.comingSoon ? "text-muted-foreground" : "text-blue-600"
                        }`} />
                      </div>

                      {/* Tool Info */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground group-hover:text-blue-600 transition-colors mb-2">
                            {tool.title}
                            {tool.comingSoon && (
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                Coming Soon
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                        {!tool.comingSoon && (
                          <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                            <ArrowRight className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                      </div>
                      
                      {/* Hover effect line */}
                      {!tool.comingSoon && (
                        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 w-0 group-hover:w-full rounded-full" />
                      )}

                      {/* Subtle background pattern */}
                      {!tool.comingSoon && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/20 group-hover:to-purple-50/20 transition-all duration-300 rounded-xl -z-10" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  </div>
)}
      </header>

      {/* Search Popup Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-background border rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-in slide-in-from-top-10 duration-300">
              {/* Search Header */}
              <div className="flex items-center gap-4 p-6 border-b">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search for tools... (try 'counter', 'converter', 'calculator')"
                  className="flex-1 border-0 text-lg h-12 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Search Results */}
              <div className="max-h-[60vh] overflow-y-auto p-4">
                {searchQuery && filteredTools.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                    <p className="text-muted-foreground">
                      No tools found for &quot;{searchQuery}&quot;. Try different keywords.
                    </p>
                  </div>
                ) : searchQuery ? (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground mb-4">
                      Found {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}
                    </h4>
                    {filteredTools.map((tool) => {
                      const ToolIcon = tool.icon;
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent hover:border-blue-200 transition-all duration-200 group"
                          onClick={handleSearchResultClick}
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${
                            tool.comingSoon ? 'bg-muted' : 'bg-blue-50 group-hover:bg-blue-100'
                          }`}>
                            <ToolIcon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-foreground group-hover:text-blue-600">
                              {tool.title}
                              {tool.comingSoon && (
                                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                  Coming Soon
                                </span>
                              )}
                            </h5>
                            <p className="text-sm text-muted-foreground">{tool.description}</p>
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full mt-1 inline-block">
                              {tool.category}
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Search Tools</h3>
                    <p className="text-muted-foreground mb-6">
                      Type to search through all available tools and utilities
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="p-3 bg-muted rounded-lg">Try &quot;counter&quot;</div>
                      <div className="p-3 bg-muted rounded-lg">Try &quot;converter&quot;</div>
                      <div className="p-3 bg-muted rounded-lg">Try &quot;calculator&quot;</div>
                      <div className="p-3 bg-muted rounded-lg">Try &quot;generator&quot;</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}