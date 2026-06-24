"use client";

import { useEffect, useState } from "react";
import DonatePageStructure from "@/components/donation/shared/DonatePageStructure";
import { defaultDonatePageSettings } from "@/components/donation/shared/donatePageConfig";
import { loadDonatePageSettings } from "@/components/donation/shared/donatePageStorage";

export default function DonateProfile() {
  const [settings, setSettings] = useState(defaultDonatePageSettings);

  useEffect(() => {
    setSettings(loadDonatePageSettings(defaultDonatePageSettings));
  }, []);

  return <DonatePageStructure settings={settings} />;
}
