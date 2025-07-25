import { PromoBanner } from "@/components/banner";
import { FaqSection, HowItWorks, MainSection } from "@/components/layouts/home";
import FreePlay from "@/components/layouts/home/FreePlay";
import { UserStatus } from "@/components/layouts/home/UserStatus";

export default function Home() {
  return (
    <main>
      {/* <BannerStats /> */}
      {/* <Banner/> */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <UserStatus />
        <PromoBanner />
        <MainSection />
        {/* <FreePlay/> */}
        <HowItWorks />
        {/* <StatsReview /> */}
        <FaqSection />
      </div>
    </main>
  );
}
