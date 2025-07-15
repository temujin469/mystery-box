import { ProfileTab, UserProfileCard } from "@/components/profile";
import Image from "next/image";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <div className="h-[260px] bg-primary/10 bg-[url('/img/skulls.png')] hidden md:block">
        {/* <Image src=""/> */}
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row pt-10 md:pt-0 gap-15">
          <div className="md:mt-[-130px]">
            <UserProfileCard />
          </div>
          <div className="flex-1">
            <div className="md:mt-[-25px]">
              <ProfileTab />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
