
import { Footer, Header } from "@/components/layouts";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
      <Footer/>
    </div>
  );
}

export default Layout;
