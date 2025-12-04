"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutClient({ children }) {
  const pathname = usePathname();

  // ⭐ พาธที่ต้องซ่อน Layout แบบ match ตรง
  const exactHideRoutes = ["/register", "/login"];

  // ⭐ ถ้าตรงพอดีกับ /register หรือ /login → ซ่อน
  const isExactHide = exactHideRoutes.includes(pathname);

  // ⭐ ถ้าพาธขึ้นต้นด้วย /dashboard → ซ่อน
  const isDashboard = pathname.startsWith("/dashboard");

  const shouldHideLayout = isExactHide || isDashboard;

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
