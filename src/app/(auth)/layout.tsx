import { Footer, FooterMinimal, Header } from "@/components/layouts";
import { AuthGuard } from "@/components/guards/AuthGuard";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div>
        <Header />
        {children}
        <FooterMinimal/>
      </div>
    </AuthGuard>
  );
}

export default Layout;
