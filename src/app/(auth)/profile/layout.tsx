import { ProfileTab, UserProfileCard } from "@/components/profile";
import Image from "next/image";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <div className="h-[260px] bg-primary/10 bg-[url('/img/skulls.png')]">
        {/* <Image src=""/> */}
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-15">
          <div className="mt-[-130px]">
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
