import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function FaqSection() {
  return (
    <section className="" >
      <Accordion type="single" collapsible className="">
        <AccordionItem value="item-1" className="bg-card rounded-md px-10 mb-2 border-b-0">
          <AccordionTrigger>Jemlit хэрхэн ажилладаг вэ?</AccordionTrigger>
          <AccordionContent>
            Хэрэглэгчид нууцлаг хайрцаг худалдаж аваад, нээгээд, баталгаатай шагналуудыг гэртээ хүргүүлдэг. Бүх бараа жинхэнэ бөгөөд дэлхий даяар хүргэлттэй.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="bg-card rounded-md px-10 mb-2 border-b-0">
          <AccordionTrigger>Ямар шагналууд хожих боломжтой вэ?</AccordionTrigger>
          <AccordionContent>
            Та электроник, ухаалаг төхөөрөмж, тансаг бараа болон бусад олон төрлийн үнэ цэнэтэй зүйлс хожих боломжтой.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className="bg-card rounded-md px-10 mb-2 border-b-0">
          <AccordionTrigger>Танай бүх брэндийн бүтээгдэхүүнүүд жинхэнэ үү?</AccordionTrigger>
          <AccordionContent>
            Тийм ээ, бүх бараа жинхэнэ бөгөөд баталгаатай ирдэг.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}