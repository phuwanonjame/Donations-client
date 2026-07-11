import PublicDonatePage from "@/components/donation/shared/PublicDonatePage";
import { defaultDonatePageSettings } from "@/components/donation/shared/donatePageConfig";
import { fetchPublicDonatePageSettings } from "@/actions/DonatePageapi/donatePageSettingsApi";
import { buildDonatePageSettingsPatch } from "@/components/donation/shared/donatePageMetadata";

function buildPublicDonatePageSettings(source) {
  return {
    ...source,
    display: {
      ...source.display,
      showProfileHeader: true,
      showDonationForm: true,
      showMusicPanel: false,
      showVideoHighlights: true,
      showDailyContent: true,
      showGallery: false,
      showSchedule: true,
      showProducts: false,
      showRecentDonations: false,
      showFooter: true,
    },
  };
}

function mergeDonatePageSettings(base, patch) {
  return {
    ...base,
    ...patch,
    design: {
      ...(base.design || {}),
      ...(patch.design || {}),
    },
    profile: {
      ...(base.profile || {}),
      ...(patch.profile || {}),
    },
    donation: {
      ...(base.donation || {}),
      ...(patch.donation || {}),
      channels: {
        ...(base.donation?.channels || {}),
        ...(patch.donation?.channels || {}),
        promptpay: {
          ...(base.donation?.channels?.promptpay || {}),
          ...(patch.donation?.channels?.promptpay || {}),
        },
        bank: {
          ...(base.donation?.channels?.bank || {}),
          ...(patch.donation?.channels?.bank || {}),
        },
      },
    },
  };
}

const defaultPublicDonatePageSettings =
  buildPublicDonatePageSettings(defaultDonatePageSettings);

export default async function DonateProfile({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const response = await fetchPublicDonatePageSettings(slug);
  const metadata = response?.metadata;
  const donationTargetUserId = response?.user?.id || null;

  const settings = metadata
    ? buildPublicDonatePageSettings(
        mergeDonatePageSettings(
          defaultDonatePageSettings,
          buildDonatePageSettingsPatch(metadata)
        )
      )
    : defaultPublicDonatePageSettings;

  return (
    <PublicDonatePage
      settings={settings}
      donationTargetUserId={donationTargetUserId}
      donationTargetUsername={slug || ""}
    />
  );
}
