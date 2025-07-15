"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Package, Star, Zap, Sparkles, Grid, List, SlidersHorizontal } from "lucide-react";
import { useBoxes, useCategories } from "@/hooks/api";
import { BoxCard } from "@/components/card/BoxCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BoxQuery, BoxOrderByField } from "@/types/box";
import { OrderDirection } from "@/types/api";

export default function BoxesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [sortBy, setSortBy] = useState<BoxOrderByField>(BoxOrderByField.CREATED_AT);
  const [sortOrder, setSortOrder] = useState<OrderDirection>(OrderDirection.DESC);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories for filter
  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories({
    isActive: true,
    limit: 50,
  });

  // Build query for boxes
  const boxQuery: BoxQuery = useMemo(() => {
    const query: BoxQuery = {
      orderBy: sortBy,
      orderDirection: sortOrder,
      limit: 20,
      page: 1,
    };

    if (searchQuery.trim()) {
      query.name = searchQuery.trim();
    }
    if (selectedCategoryId) {
      query.categoryId = selectedCategoryId;
    }
    if (priceRange.min) {
      query.minPrice = priceRange.min;
    }
    if (priceRange.max) {
      query.maxPrice = priceRange.max;
    }

    return query;
  }, [searchQuery, selectedCategoryId, priceRange, sortBy, sortOrder]);

  // Fetch boxes with current filters
  const { data: boxesResponse, isLoading: boxesLoading, error } = useBoxes(boxQuery);

  const categories = categoriesResponse?.data || [];
  const boxes = boxesResponse?.data || [];
  const totalBoxes = boxesResponse?.meta?.total || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4 flex items-center justify-center gap-3">
            <Package className="text-blue-400" size={32} />
            Мистери Хайрцгууд
            <Sparkles className="text-yellow-400" size={32} />
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Өөрийн дуртай категороос сонгоод азаа туршаарай!
          </p>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            {/* Top Row - Search and View Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Хайрцаг хайх..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-white/40"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-white/10 border-white/20 text-gray-300 hover:bg-white/20 hover:text-white"
                >
                  <SlidersHorizontal size={16} className="mr-2" />
                  Шүүлтүүр
                </Button>

                <div className="flex bg-white/10 rounded-xl border border-white/20 overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`p-3 ${viewMode === "grid" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"}`}
                  >
                    <Grid size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`p-3 ${viewMode === "list" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"}`}
                  >
                    <List size={20} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-white/20 pt-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Ангилал</label>
                    <Select value={selectedCategoryId?.toString() || ""} onValueChange={(value: string) => setSelectedCategoryId(value ? parseInt(value) : undefined)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Бүх ангилал" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Бүх ангилал</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Хамгийн бага үнэ</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={priceRange.min || ""}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value ? parseInt(e.target.value) : undefined }))}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Хамгийн их үнэ</label>
                    <Input
                      type="number"
                      placeholder="∞"
                      value={priceRange.max || ""}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value ? parseInt(e.target.value) : undefined }))}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Эрэмбэлэх</label>
                    <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value: string) => {
                      const [field, order] = value.split('-');
                      setSortBy(field as BoxOrderByField);
                      setSortOrder(order as OrderDirection);
                    }}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={`${BoxOrderByField.CREATED_AT}-${OrderDirection.DESC}`}>Шинэ → Хуучин</SelectItem>
                        <SelectItem value={`${BoxOrderByField.CREATED_AT}-${OrderDirection.ASC}`}>Хуучин → Шинэ</SelectItem>
                        <SelectItem value={`${BoxOrderByField.PRICE}-${OrderDirection.ASC}`}>Үнэ: Бага → Их</SelectItem>
                        <SelectItem value={`${BoxOrderByField.PRICE}-${OrderDirection.DESC}`}>Үнэ: Их → Бага</SelectItem>
                        <SelectItem value={`${BoxOrderByField.NAME}-${OrderDirection.ASC}`}>Нэр: А → Я</SelectItem>
                        <SelectItem value={`${BoxOrderByField.NAME}-${OrderDirection.DESC}`}>Нэр: Я → А</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategoryId(undefined);
                      setPriceRange({});
                      setSortBy(BoxOrderByField.CREATED_AT);
                      setSortOrder(OrderDirection.DESC);
                    }}
                    className="bg-white/10 border-white/20 text-gray-300 hover:bg-white/20 hover:text-white"
                  >
                    Шүүлтүүр цэвэрлэх
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-400">
            {boxesLoading ? "Хайж байна..." : `${totalBoxes} хайрцаг олдлоо`}
          </p>
        </motion.div>

        {/* Boxes Grid/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {boxesLoading ? (
            // Loading skeleton
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }>
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-80 w-full rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="text-center py-16">
              <Package className="mx-auto text-gray-600 mb-4" size={64} />
              <h3 className="text-xl font-bold text-gray-400 mb-2">
                Алдаа гарлаа
              </h3>
              <p className="text-gray-500">
                Дахин оролдоно уу
              </p>
            </div>
          ) : boxes.length === 0 ? (
            // Empty state
            <div className="text-center py-16">
              <Package className="mx-auto text-gray-600 mb-4" size={64} />
              <h3 className="text-xl font-bold text-gray-400 mb-2">
                Хайрцаг олдсонгүй
              </h3>
              <p className="text-gray-500">
                Өөр хайлтын нөхцөл ашиглаж үзээрэй
              </p>
            </div>
          ) : (
            // Boxes display
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }>
              {boxes.map((box, index) => (
                <motion.div
                  key={box.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={viewMode === "list" ? "max-w-none" : ""}
                >
                  <BoxCard 
                    box={box} 
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Load More / Pagination (if needed) */}
        {boxes.length > 0 && boxes.length < totalBoxes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
            >
              Цааш үзэх ({totalBoxes - boxes.length} үлдсэн)
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
