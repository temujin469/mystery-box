// Utility function to get colors based on rarity (1-5 scale)
export function getRarityColors(rarity: number) {
  switch (rarity) {
    case 1: // Legendary/Mythic - Highest rarity
      return {
        bg: "bg-purple-500",
        border: "border-purple-500",
        text: "text-purple-400",
        gradient: "from-purple-400 via-purple-500 to-indigo-600",
      };
    case 2: // Epic/Rare
      return {
        bg: "bg-pink-500",
        border: "border-pink-500",
        text: "text-pink-400",
        gradient: "from-pink-400 via-pink-500 to-rose-600",
      };
    case 3: // Uncommon
      return {
        bg: "bg-cyan-500",
        border: "border-cyan-500",
        text: "text-cyan-400",
        gradient: "from-cyan-400 via-cyan-500 to-blue-600",
      };
    case 4: // Common
      return {
        bg: "bg-emerald-500",
        border: "border-emerald-500",
        text: "text-emerald-400",
        gradient: "from-emerald-400 via-emerald-500 to-green-600",
      };
    case 5: // Trash/Lowest rarity
    default:
      return {
        bg: "bg-slate-500",
        border: "border-slate-500",
        text: "text-slate-400",
        gradient: "from-slate-400 via-slate-500 to-gray-600",
      };
  }
}

// Helper function to get rarity name
export function getRarityName(rarity: number): string {
  switch (rarity) {
    case 1:
      return "Домогт";
    case 2:
      return "Эпик";
    case 3:
      return "Ховор";
    case 4:
      return "Энгийн";
    case 5:
    default:
      return "Нийтлэг";
  }
}
