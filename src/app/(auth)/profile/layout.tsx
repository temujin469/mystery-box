import { ProfileTab, UserProfileHeader } from "@/components/profile";
import Image from "next/image";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
          <UserProfileHeader />
        <div className="flex-1">
          <ProfileTab />
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
