import {
  ProfileNav,
  ProfileTab,
  UserProfileHeader,
} from "@/components/profile";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8">
        <UserProfileHeader />
        <div className="flex-1 lg:grid grid-cols-12 gap-5">
          <div className="lg:hidden">
            <ProfileTab />
          </div>
          <div className="col-span-3 hidden lg:block">
            <ProfileNav />
          </div>
          <div className="col-span-9">
            <div className="min-h-screen py-8 lg:pt-0">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
