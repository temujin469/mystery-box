import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsReview() {
  return (
    <section className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Image src="/logo.svg" alt="JemLit" width={32} height={32} /> 
          <span className="font-semibold text-lg">JemLit</span>
        </div>
        <div className="text-3xl font-bold mb-3">1458633</div>
        <p className="text-card-foreground/80 mb-4">
          Хэрэглэгчид манай нууцлаг хайрцгийг нээж, үнэ цэнэтэй зүйлсийг гэртээ хүргүүлж байна. Та дараагийн азтан байж болно! Бүртгүүлээд шууд үнэ цэнэтэй бэлгүүдийг задлаарай.
        </p>
        <Button className="bg-primary hover:bg-primary/90 w-full">НУУЦЛАГ ХАЙРЦАГ ХУДАЛДАЖ АВАХ</Button>
      </div>
      <div className="md:col-span-2 flex flex-col gap-4">
        <Card className="bg-card border-none">
          <CardHeader>
            <CardTitle>Маш сонирхолтой, хямдхан</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0" />
            <div>
              <div className="flex items-center gap-1 text-yellow-400 text-lg mb-1">
                ★★★★★
              </div>
              <div className="font-semibold">"Үнэхээр санал болгож байна!"</div>
              <div className="text-xs text-muted-foreground mt-1">- МИХАЙ О.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}