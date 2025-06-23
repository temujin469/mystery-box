import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function Shippment() {
  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📬</span>
          <h1 className="text-2xl font-bold">Хүргэлтийн хаяг</h1>
        </div>
        <Link href="/profile/shipping/new" className="text-base underline font-medium flex items-center gap-2 hover:text-primary">
          <span className="text-xl">＋</span>
          Шинэ хаяг нэмэх
        </Link>
      </div>

      {/* Form */}
      <form className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Name */}
        <div>
          <label className="block mb-2 font-semibold text-base" htmlFor="name">Нэр</label>
          <Input
            id="name"
            placeholder="Хүлээн авагчийн нэр"
            className="bg-secondary text-lg placeholder:text-muted-foreground border-0"
          />
        </div>
        {/* Address */}
        <div>
          <label className="block mb-2 font-semibold text-base" htmlFor="address">Хаяг</label>
          <Input
            id="address"
            placeholder="Гудамж, байрны дугаар"
            className="bg-secondary text-lg placeholder:text-muted-foreground border-0"
          />
        </div>
        {/* City */}
        <div>
          <label className="block mb-2 font-semibold text-base" htmlFor="city">Хот/Сум</label>
          <Input
            id="city"
            placeholder="Хот эсвэл сум"
            className="bg-secondary text-lg placeholder:text-muted-foreground border-0"
          />
        </div>
        {/* State */}
        <div>
          <label className="block mb-2 font-semibold text-base" htmlFor="state">Аймаг/Дүүрэг</label>
          <Input
            id="state"
            placeholder="Аймаг эсвэл дүүрэг"
            className="bg-secondary text-lg placeholder:text-muted-foreground border-0"
          />
        </div>
        {/* Country */}
        <div>
          <label className="block mb-2 font-semibold text-base" htmlFor="country">Улс</label>
          <Input
            id="country"
            placeholder="Улс"
            className="bg-secondary text-lg placeholder:text-muted-foreground border-0"
          />
        </div>
        {/* Postcode */}
        <div>
          <label className="block mb-2 font-semibold text-base" htmlFor="postcode">Шуудангийн код</label>
          <Input
            id="postcode"
            placeholder="Шуудангийн код эсвэл zip"
            className="bg-secondary text-lg placeholder:text-muted-foreground border-0"
          />
        </div>
        {/* Phone */}
        <div>
          <label className="block mb-2 font-semibold text-base" htmlFor="phone">Утас</label>
          <Input
            id="phone"
            placeholder="Утасны дугаар"
            className="bg-secondary text-lg placeholder:text-muted-foreground border-0"
          />
        </div>
        {/* Buttons */}
        <div className="flex gap-4 items-end md:col-span-1">
          <Button type="submit" size="lg" className=" text-lg font-semibold bg-white text-black px-12">Нэмэх</Button>
          <Button type="button" size="lg" variant="outline" className=" text-lg font-semibold border-white text-white px-12">Цуцлах</Button>
        </div>
      </form>
      <hr className="border-muted mt-10"/>
    </div>
  )
}