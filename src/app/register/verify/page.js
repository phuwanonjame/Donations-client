'use client';
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import VerifyPageContent from "./VerifyPageContent";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <VerifyPageContent />
    </Suspense>
  );
}
