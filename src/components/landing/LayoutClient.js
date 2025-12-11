"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutClient({ children }) {
  const pathname = usePathname();

  // ⭐ ซ่อนเมื่อตรงพอดี
  const exactHideRoutes = ["/login", "/verify"];

  const isExactHide = exactHideRoutes.includes(pathname);

  // ⭐ ซ่อนทุกหน้าใต้ /register เช่น
  // /register
  // /register/verify
  // /register/otp
  const isRegister = pathname.startsWith("/register");

  // ⭐ ซ่อนทุกหน้าใน dashboard
  const isDashboard = pathname.startsWith("/dashboard");

  const shouldHideLayout = isExactHide || isRegister || isDashboard;

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
