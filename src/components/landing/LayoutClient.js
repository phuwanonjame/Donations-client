"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutClient({ children }) {
  const pathname = usePathname();

  // ⭐ รายการหน้าที่ต้องการซ่อน header/footer
  const hideLayoutRoutes = ["/register", "/login"];

  const shouldHideLayout = hideLayoutRoutes.includes(pathname);

  return (
    <>
      {!shouldHideLayout && <Header />}

      <main className="min-h-screen">
        {children}
      </main>

      {!shouldHideLayout && <Footer />}
    </>
  );
}
