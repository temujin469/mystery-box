"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import boxes from "@/data/sampleBoxes.json"; // Import as array
import { BoxesGrid } from "./BoxesGrid";

export function MainSection() {
  return (
    <section className="mb-20">
      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="secondary" className="bg-secondary text-secondary-foreground">БҮХ ХАЙРЦАГ</Button>
        <Button variant="ghost" className="text-muted-foreground">ТЕХНОЛОГИ</Button>
        <Button variant="ghost" className="text-muted-foreground">ТОГЛООМ</Button>
        <Button variant="ghost" className="text-muted-foreground">ГУДАМЖНЫ ХУВЦАС</Button>
      </div>
      <BoxesGrid boxes={boxes} />
    </section>
  );
}