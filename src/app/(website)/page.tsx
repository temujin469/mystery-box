import { PromoBanner } from "@/components/banner";
import { Footer, Header } from "@/components/layouts/common";
import {
  Banner,
  BannerStats,
  FaqSection,
  HowItWorks,
  MainSection,
  StatsReview,
} from "@/components/layouts/home";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* <BannerStats /> */}
      {/* <Banner/> */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <PromoBanner />
        <MainSection />
        <HowItWorks />
        {/* <StatsReview /> */}
        <FaqSection />
      </div>
    </main>
  );
}
