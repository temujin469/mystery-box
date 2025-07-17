"use client";
import Link from "next/link";
import { use, useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import SpinningReel, {
  SpiningItem,
} from "@/components/spiningReel/SpiningReel";
import { ItemCard } from "@/components/card";
import { ItemDetailSlide } from "@/components/ItemDetailSlide";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useBox } from "@/hooks/api";
import { useSpinningReelStore } from "@/stores/spinningReel.store";

export default function BoxPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [isOddsHidden, setIsOddsHidden] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isSlideOpen, setIsSlideOpen] = useState(false);

  const boxId = Number(use(params).id);
  const { data: box, isPending, error } = useBox(boxId);

  // Set boxId in store when component mounts or boxId changes
  useEffect(() => {
    useSpinningReelStore.getState().setBoxId(boxId);
  }, [boxId]);

  const boxItems = box?.items || [];

  const handleItemClick = (itemId: number) => {
    setSelectedItemId(itemId);
    setIsSlideOpen(true);
  };

  const handleCloseSlide = () => {
    setIsSlideOpen(false);
    setSelectedItemId(null);
  };

  // Transform box items to spinning items with proper type safety
  const spiningItems: SpiningItem[] = boxItems
    .filter((boxItem) => boxItem.item && boxItem.item.sell_value !== undefined) // Filter out items without item data or sell_value
    .map((boxItem) => ({
      id: boxItem.item!.id,
      name: boxItem.item!.name,
      image_url: boxItem.item!.image_url,
      sell_value: boxItem.item!.sell_value!, // We've filtered out undefined values above
      drop_rate: boxItem.drop_rate,
    }));

  if (isPending) {
    return <BoxPageSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center relative">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-500/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-md mx-auto px-6">
          <div className="p-8 bg-gray-800/40 backdrop-blur-sm border border-red-500/30 rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-4">
              Алдаа гарлаа
            </h1>
            <p className="text-gray-300 mb-6">
              Хайрцгийн мэдээлэл ачаалахад алдаа гарлаа.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              🏠 Нүүр хуудас руу буцах
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!box) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center relative">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-md mx-auto px-6">
          <div className="p-8 bg-gray-800/40 backdrop-blur-sm border border-gray-600/30 rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
              Хайрцаг олдсонгүй
            </h1>
            <p className="text-gray-300 mb-6">Хүссэн хайрцаг олдсонгүй.</p>
            <Link
              href="/boxes"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              📋 Хайрцгийн жагсаалт руу буцах
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
        `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header Section with Game-like UI */}
        <div className="container max-w-7xl mx-auto px-3 py-6">
          <div className="flex items-center gap-6">
            <Link
              href="/boxes"
              className="group relative px-6 py-3 bg-gradient-to-r from-slate-800/90 via-gray-800/90 to-slate-700/90 hover:from-slate-700/90 hover:via-gray-700/90 hover:to-slate-600/90 backdrop-blur-md border border-slate-600/60 hover:border-slate-500/80 rounded-md transition-all duration-200 text-gray-300 hover:text-white shadow-lg hover:shadow-slate-500/20 overflow-hidden"
            >
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30 transition-colors duration-200">
                  <ChevronLeft className="w-4 h-4 text-blue-400 transition-transform duration-200 group-hover:-translate-x-0.5" />
                </div>
                <span className="font-mono text-sm font-medium tracking-wide">
                  Буцах
                </span>
              </div>

              {/* Subtle shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/4 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            </Link>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {box.name}
            </h1>
          </div>
        </div>

        {/* Spinning Reel Section */}
        <div className="relative">
          <SpinningReel items={spiningItems} boxPrice={box.price} />
        </div>

        {/* Items Section */}
        <div className="container max-w-7xl mx-auto px-3 py-8">
          {/* Enhanced Separator */}
          <div className="mb-8">
            <EnhancedBoxSeparator />
          </div>

          {/* Controls Section */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-3 px-4 py-3 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-gray-300 font-medium">
                Магадлал харуулах
              </span>
              <Switch
                checked={!isOddsHidden}
                onCheckedChange={(checked) => setIsOddsHidden(!checked)}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500"
              />
            </div>
          </div>

          {/* Items Grid with Gaming Feel */}
          <div className="relative">
            {/* Grid Background - Hidden on Mobile */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-gray-900/50 via-transparent to-gray-900/50 rounded-2xl" />

            <div className="relative md:p-6 md:rounded-2xl md:border md:border-gray-700/30 md:bg-gray-800/20 md:backdrop-blur-sm">
              <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
                {boxItems.map((boxItem, index) => (
                  <div
                    key={`${boxItem.box_id}-${boxItem.item_id}`}
                    className="relative group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Item Card */}
                    <ItemCard
                      boxItem={boxItem}
                      isDropRateHidden={isOddsHidden}
                      onClick={handleItemClick}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Item Detail Slide */}
      <ItemDetailSlide
        isOpen={isSlideOpen}
        onClose={handleCloseSlide}
        itemId={selectedItemId}
      />
    </div>
  );
}

function EnhancedBoxSeparator({
  label = "бүтээгдэхүүнүүд",
}: {
  label?: string;
}) {
  return (
    <div className="w-full flex items-center py-6 px-0 relative">
      {/* Left side with multiple layers */}
      <div className="flex-1 relative">
        {/* Main line */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-blue-500/60 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/30 to-blue-400/30 blur-[2px]" />
        </div>
        {/* Secondary accent line */}
        <div className="absolute top-0.5 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-300/20 to-purple-400/40" />
      </div>

      {/* Gaming-style center piece */}
      <div className="flex items-center mx-6 relative">
        {/* Outer frame */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-md blur-sm" />

        {/* Main container - Made thinner */}
        <div className="relative px-4 py-2 ">
          {/* Inner border glow */}
          <div className="absolute" />

          {/* Corner brackets */}
          <div className="absolute top-0.5 left-0.5">
            <div className="w-2 h-[1px] bg-cyan-400/80" />
            <div className="w-[1px] h-2 bg-cyan-400/80" />
          </div>
          <div className="absolute top-0.5 right-0.5">
            <div className="w-2 h-[1px] bg-purple-400/80 ml-auto" />
            <div className="w-[1px] h-2 bg-purple-400/80 ml-auto" />
          </div>
          <div className="absolute bottom-0.5 left-0.5">
            <div className="w-[1px] h-2 bg-cyan-400/80" />
            <div className="w-2 h-[1px] bg-cyan-400/80" />
          </div>
          <div className="absolute bottom-0.5 right-0.5">
            <div className="w-[1px] h-2 bg-purple-400/80 ml-auto" />
            <div className="w-2 h-[1px] bg-purple-400/80 ml-auto" />
          </div>

          {/* Label */}
          <div className="relative">
            <span className="font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 uppercase tracking-widest text-xs">
              {label}
            </span>
          </div>
        </div>

        {/* Side connectors */}
        <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
          <div className="w-1.5 h-[1px] bg-gradient-to-r from-cyan-400/60 to-blue-500/60" />
        </div>
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-1.5 h-[1px] bg-gradient-to-l from-purple-400/60 to-blue-500/60" />
        </div>
      </div>

      {/* Right side with multiple layers */}
      <div className="flex-1 relative">
        {/* Main line */}
        <div className="h-[1px] bg-gradient-to-l from-transparent via-purple-400/40 to-pink-500/60 relative">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-300/30 to-pink-400/30 blur-[2px]" />
        </div>
        {/* Secondary accent line */}
        <div className="absolute top-0.5 left-0 right-0 h-[1px] bg-gradient-to-l from-transparent via-purple-300/20 to-blue-400/40" />
      </div>
    </div>
  );
}

// Enhanced Loading skeleton component with gaming aesthetics
function BoxPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-40 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-20 w-36 h-36 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10">
        {/* Header Skeleton */}
        <div className="container max-w-7xl mx-auto px-3 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-12 w-28 rounded-md" />
            <Skeleton className="h-10 w-48 rounded-lg" />
          </div>
        </div>

        {/* Spinning Reel Skeleton */}
        <div className="relative h-[400px] mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
            <Skeleton className="w-full h-full" />
          </div>
          {/* Overlay elements skeleton */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-4">
              <Skeleton className="w-32 h-10 rounded-md mx-auto" />
              <Skeleton className="w-24 h-6 rounded mx-auto" />
            </div>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto px-3 py-8">
          {/* Enhanced Separator Skeleton */}
          <div className="w-full flex items-center py-4 px-0 mb-8">
            <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-gray-600/40 to-gray-600/40" />
            <Skeleton className="h-12 w-48 mx-4 rounded-lg" />
            <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-gray-600/40 to-gray-600/40" />
          </div>

          {/* Controls Skeleton */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-3 px-4 py-3 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl">
              <div className="w-2 h-2 bg-gray-600 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-10 rounded-full" />
            </div>
          </div>

          {/* Items Grid Skeleton */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-transparent to-gray-900/50 rounded-2xl" />

            <div className="relative p-6 rounded-2xl border border-gray-700/30 bg-gray-800/20 backdrop-blur-sm">
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="relative group">
                    <div className="space-y-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                      <Skeleton className="aspect-square w-full rounded-lg" />
                      <Skeleton className="h-3 w-3/4 mx-auto" />
                      <Skeleton className="h-3 w-1/2 mx-auto" />
                      <Skeleton className="h-2 w-2/3 mx-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
