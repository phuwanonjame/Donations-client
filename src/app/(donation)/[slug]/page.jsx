"use client";

import DonatePageStructure from "@/components/donation/shared/DonatePageStructure";
import { defaultDonatePageSettings } from "@/components/donation/shared/donatePageConfig";

export default function DonateProfile() {
  return <DonatePageStructure settings={defaultDonatePageSettings} />;
}
