import Image from "next/image";

const stats = [
  { label: "Нууцлаг хайрцаг", value: "1458633" },
  { label: "Нээгдсэн хайрцаг", value: "2,040,078" },
  { label: "Нийт шагнал", value: "24,870,674" },
];

export function BannerStats() {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary py-8 px-4 relative">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 flex flex-col items-center md:items-start">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-card-foreground">Эксклюзив урамшуулал авахын тулд манай Telegram сувагт нэгдээрэй!</h2>
          <div className="flex gap-10 mt-4">
            {stats.map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-card-foreground">{value}</div>
                <div className="text-xs text-card-foreground/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:block">
          <Image src="/banner-gift.png" alt="Banner" width={220} height={150} />
        </div>
      </div>
    </div>
  );
}