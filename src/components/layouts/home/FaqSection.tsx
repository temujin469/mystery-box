"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { HelpCircle, Sparkles, Shield, Gift, Zap } from "lucide-react";

const faqItems = [
  {
    id: "item-1",
    question: "хэрхэн ажилладаг вэ?",
    answer: "Хэрэглэгчид нууцлаг хайрцаг худалдаж аваад, нээгээд, баталгаатай шагналуудыг гэртээ хүргүүлдэг. Бүх бараа жинхэнэ бөгөөд дэлхий даяар хүргэлттэй.",
    icon: <HelpCircle size={20} />,
    color: "from-blue-400 to-cyan-500",
    glowColor: "shadow-[0_0_20px_rgba(59,130,246,0.3)]"
  },
  {
    id: "item-2", 
    question: "Ямар шагналууд хожих боломжтой вэ?",
    answer: "Та электроник, ухаалаг төхөөрөмж, тансаг бараа болон бусад олон төрлийн үнэ цэнэтэй зүйлс хожих боломжтой.",
    icon: <Gift size={20} />,
    color: "from-purple-400 to-pink-500",
    glowColor: "shadow-[0_0_20px_rgba(168,85,247,0.3)]"
  },
  {
    id: "item-3",
    question: "Танай бүх брэндийн бүтээгдэхүүнүүд жинхэнэ үү?",
    answer: "Тийм ээ, бүх бараа жинхэнэ бөгөөд баталгаатай ирдэг.",
    icon: <Shield size={20} />,
    color: "from-green-400 to-emerald-500", 
    glowColor: "shadow-[0_0_20px_rgba(34,197,94,0.3)]"
  }
];

export function FaqSection() {
  return (
    <section className="mb-20 relative">
      {/* Distributed Floating Bubble Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Small accent dots */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-pulse" />
        <div className="absolute top-40 right-20 w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-pink-400 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Large floating bubbles distributed throughout */}
        <div className="absolute top-5 left-10 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-cyan-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-8 right-16 w-12 h-12 bg-gradient-to-br from-purple-400/25 to-pink-500/15 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute top-32 left-1/4 w-10 h-10 bg-gradient-to-br from-pink-400/30 to-rose-500/20 rounded-full blur-md animate-pulse" style={{ animationDelay: '2s', animationDuration: '2.5s' }} />
        <div className="absolute top-48 right-8 w-8 h-8 bg-gradient-to-br from-green-400/25 to-emerald-500/15 rounded-full blur-sm animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
        <div className="absolute top-64 left-12 w-14 h-14 bg-gradient-to-br from-cyan-400/20 to-blue-500/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }} />
        <div className="absolute top-80 right-24 w-6 h-6 bg-gradient-to-br from-yellow-400/30 to-orange-500/20 rounded-full blur-sm animate-pulse" style={{ animationDelay: '3s', animationDuration: '3s' }} />
        <div className="absolute top-96 left-1/3 w-12 h-12 bg-gradient-to-br from-violet-400/25 to-purple-500/15 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2.5s', animationDuration: '3.8s' }} />
        <div className="absolute bottom-32 right-12 w-10 h-10 bg-gradient-to-br from-teal-400/20 to-cyan-500/12 rounded-full blur-md animate-pulse" style={{ animationDelay: '4s', animationDuration: '3.2s' }} />
        <div className="absolute bottom-48 left-1/2 w-8 h-8 bg-gradient-to-br from-rose-400/28 to-pink-500/18 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1.8s', animationDuration: '4.2s' }} />
        <div className="absolute bottom-64 right-1/4 w-16 h-16 bg-gradient-to-br from-indigo-400/18 to-blue-500/8 rounded-full blur-xl animate-pulse" style={{ animationDelay: '3.5s', animationDuration: '2.8s' }} />
      </div>

      {/* Section Header */}
      <div className="text-center mb-8 md:mb-12 relative z-10">

        <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-3 md:mb-4 flex items-center justify-center gap-2 md:gap-3">
          <Sparkles className="text-yellow-400" size={18} />
          Асуулт Хариулт
          <Zap className="text-blue-400" size={18} />
        </h2>
        <p className="text-sm md:text-lg text-gray-400 max-w-2xl mx-auto px-4">
          Хамгийн их асуудаг асуултууд болон тэдгээрийн хариултууд
        </p>
      </div>

      {/* FAQ Container */}
      <div className="relative z-10">
        <div className="relative">
          <Accordion type="single" collapsible className="space-y-2 md:space-y-3">
            {faqItems.map((item, index) => (
              <div key={item.id} className="group">
                <AccordionItem 
                  value={item.id} 
                  className="relative border border-gray-700/30 bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-gray-800/60 hover:border-gray-600/40 transition-all duration-300 data-[state=open]:bg-gray-800/70 data-[state=open]:border-gray-600/50"
                >
                  {/* Subtle background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 data-[state=open]:opacity-8 transition-opacity duration-300`} />
                  
                  <AccordionTrigger className="px-5 py-4 text-left hover:no-underline group/trigger [&[data-state=open]>div>div:first-child]:scale-105 [&[data-state=open]>div>div>h3]:text-white [&>svg]:hidden cursor-pointer">
                    <div className="flex items-center gap-3 w-full">
                      {/* Modern Icon */}
                      <div className={`p-2.5 rounded-xl bg-gradient-to-r ${item.color} text-white flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105 shadow-lg`}>
                        <div className="w-4 h-4">
                          {item.icon}
                        </div>
                      </div>
                      
                      {/* Question */}
                      <div className="flex-1">
                        <h3 className="text-sm md:text-base font-semibold text-gray-200 group-hover/trigger:text-white transition-colors duration-300">
                          {item.question}
                        </h3>
                      </div>

                      {/* Custom Modern Toggle Button */}
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-700/50 border border-gray-600/30 group-hover:bg-gray-600/50 group-hover:border-gray-500/40 transition-all duration-200 group-data-[state=open]:bg-gray-600/70 group-data-[state=open]:border-gray-500/50">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <div className="w-2 h-0.5 bg-gray-300 transition-all duration-200 group-data-[state=open]:rotate-0" />
                          <div className="w-0.5 h-2 bg-gray-300 absolute transition-all duration-200 group-data-[state=open]:rotate-90 group-data-[state=open]:opacity-0" />
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-5 pb-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-1 data-[state=open]:slide-down-1">
                    <div className="pt-1">
                      <div className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/30">
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}