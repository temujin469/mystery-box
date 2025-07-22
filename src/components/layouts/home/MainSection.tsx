"use client";

import { Button } from "@/components/ui/button";
import { BoxesGrid } from "./BoxesGrid";
import { useState, useEffect } from "react";
import { useCategories } from "@/hooks/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Filter, Sparkles, ArrowRight } from "lucide-react";

export function MainSection() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Fetch categories from API with responsive limit
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useCategories({
      isActive: true,
      limit: isMobile ? 2 : 4, // 3 on mobile (+ featured = 4 total), 5 on desktop (+ featured = 6 total)
    });

  const categories = categoriesResponse?.data || [];

  const handleCategoryChange = (id: number | undefined) => {
    setSelectedCategoryId(id);
  };

  return (
    <section className="mb-20">
      {/* Category Filter Section */}
      <div className="relative mb-8">
        {/* Background with glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-card/50 to-background/90 backdrop-blur-sm rounded-2xl border border-border/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5 rounded-2xl" />
        
        {/* Border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-30" />

        <div className="relative p-4 sm:p-6">
          {/* Filter Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg">
              <Filter size={20} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Ангилал сонгох</h3>
            <Sparkles className="text-accent animate-pulse" size={20} />
          </div>

          {/* Category Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {/* Featured boxes button - Only one with icon */}
            <Button
              variant={selectedCategoryId === undefined ? "default" : "ghost"}
              size="lg"
              className={`
                relative overflow-hidden group h-16 p-4 justify-center sm:justify-start border-0
                ${selectedCategoryId === undefined
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40"
                  : "text-foreground hover:text-foreground bg-card/30 hover:bg-primary/10"
                }
              `}
              onClick={() => handleCategoryChange(undefined)}
            >
              <div className="flex items-center gap-2 sm:gap-3 w-full justify-center sm:justify-start">
                <div className={`p-1.5 sm:p-2 rounded-lg ${selectedCategoryId === undefined ? 'bg-white/20' : 'bg-primary/10'}`}>
                  <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-left flex-1 hidden sm:block">
                  <div className="font-semibold text-sm lg:text-base">Онцлох</div>
                </div>
                <div className="sm:hidden">
                  <div className="font-semibold text-xs">Онцлох</div>
                </div>
              </div>
              
              {/* Hover shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
            </Button>

            {/* Dynamic category buttons - No icons */}
            {categoriesLoading
              ? // Loading skeleton for category buttons
                Array.from({ length: isMobile ? 3 : 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 rounded-lg" />
                ))
              : categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategoryId === category.id ? "default" : "ghost"}
                    size="lg"
                    className={`
                      relative overflow-hidden group h-16 p-2 sm:p-4 justify-center border-0
                      ${selectedCategoryId === category.id
                        ? "bg-gradient-to-r from-accent to-primary text-primary-foreground shadow-lg shadow-accent/25 hover:shadow-accent/40"
                        : "text-foreground hover:text-foreground bg-primary/5 hover:bg-accent/10"
                      }
                    `}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    <div className="text-center w-full">
                      <div className="font-semibold text-xs sm:text-sm lg:text-base leading-tight">
                        {category.name}
                      </div>
                    </div>
                    
                    {/* Hover shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                  </Button>
                ))}

            {/* See More Button - In the same row */}
            <Button 
              variant="ghost" 
              className="group h-16 p-2 sm:p-4 justify-center bg-gradient-to-r from-muted/30 to-card/30 hover:from-primary/10 hover:to-accent/10 text-muted-foreground hover:text-foreground font-medium transition-all duration-300 border-2 border-dashed border-border hover:border-primary/30"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold">Бүгдийг үзэх</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Boxes Grid */}
      <div>
        <BoxesGrid
          categoryId={selectedCategoryId}
          isFeatured={!selectedCategoryId ? true : undefined}
        />
      </div>
    </section>
  );
}
