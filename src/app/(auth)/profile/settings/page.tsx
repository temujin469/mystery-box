import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfileSettings() {
  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <h1 className="text-2xl font-bold mb-8">Тохиргоо</h1>

      <div className="flex flex-col xl:flex-row gap-10">
        {/* Email change */}
        <section className="mb-10 flex-1">
          <h2 className="text-lg font-semibold mb-4">Имэйл хаяг солих</h2>
          <form className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Шинэ имэйл хаяг"
              className="text-lg placeholder:text-muted-foreground"
            />
            <Button className="w-fit bg-primary text-primary-foreground font-semibold">
              Имэйл шинэчлэх
            </Button>
          </form>
        </section>

        {/* Password change */}
        <section className="mb-10 flex-1">
          <h2 className="text-lg font-semibold mb-4">Нууц үг солих</h2>
          <form className="flex flex-col gap-4">
            <Input
              type="password"
              placeholder="Одоогийн нууц үг"
              className="text-lg placeholder:text-muted-foreground"
            />
            <Input
              type="password"
              placeholder="Шинэ нууц үг"
              className="text-lg placeholder:text-muted-foreground"
            />
            <Input
              type="password"
              placeholder="Шинэ нууц үг давтах"
              className="text-lg placeholder:text-muted-foreground"
            />
            <Button className="w-fit bg-primary text-primary-foreground font-semibold">
              Нууц үг шинэчлэх
            </Button>
          </form>
        </section>
      </div>

      {/* Sessions */}
      <section className="">
        <h2 className="text-lg font-semibold mb-4">Сессүүд</h2>
        <div className="bg-secondary p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Windows 10 • Chrome</div>
                <div className="text-sm text-muted-foreground">
                  Улаанбаатар, Монгол • 2025-06-20 21:35
                </div>
                <div className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs mt-1">
                  Энэ төхөөрөмж
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="px-4 border-white text-white border"
              >
                Гарах
              </Button>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <div className="font-medium">iPhone • Safari</div>
                <div className="text-sm text-muted-foreground">
                  Улаанбаатар, Монгол • 2025-06-16 09:12
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="px-4 border-white text-white border"
              >
                Гарах
              </Button>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          Бүх төхөөрөмжүүд дээрх идэвхтэй сессүүд энд харагдана.
        </div>
      </section>
    </div>
  );
}
