import Link from "next/link";
import { BoxCard } from "@/components/card";

type BoxesGridProps = {
  boxes: Box[];
};

export function BoxesGrid({ boxes }: BoxesGridProps) {
  return (
    <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {boxes.map((box) => (
        <Link href={`/boxes/${box.id}`} key={box.id}>
          <BoxCard box={box} />
        </Link>
      ))}
    </div>
  );
}
