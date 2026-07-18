import PublicDonatePage from "@/components/donation/shared/PublicDonatePage";
import { defaultDonatePageSettings } from "@/components/donation/shared/donatePageConfig";
import { fetchPublicDonatePageSettings } from "@/actions/DonatePageapi/donatePageSettingsApi";
import { buildDonatePageSettingsPatch } from "@/components/donation/shared/donatePageMetadata";
import Link from "next/link";

const STREAMFLOW_DOMAIN = "streamflow";
const WIDGET_ONLINE_API_BASE = "http://localhost:8080/widget/online";

async function fetchWidgetOnlineStatus(userId) {
  if (!userId) {
    return {
      online: false,
      connections: 0,
    };
  }

  try {
    const res = await fetch(`${WIDGET_ONLINE_API_BASE}/${encodeURIComponent(userId)}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        online: false,
        connections: 0,
      };
    }

    const payload = await res.json();

    return {
      online: Boolean(payload?.online),
      connections: Number(payload?.connections) || 0,
    };
  } catch {
    return {
      online: false,
      connections: 0,
    };
  }
}

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

function resolveDonationTargetUserId(response, fallbackSettings) {
  return (
    response?.user?.id ||
    response?.userId ||
    response?.ownerId ||
    fallbackSettings?.profile?.userId ||
    fallbackSettings?.profile?.id ||
    null
  );
}

function resolveDonationTargetUsername(response, slug, fallbackSettings) {
  return (
    response?.user?.username ||
    response?.username ||
    fallbackSettings?.profile?.username ||
    slug ||
    ""
  );
}

const defaultPublicDonatePageSettings =
  buildPublicDonatePageSettings(defaultDonatePageSettings);

export default async function DonateProfile({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const response = await fetchPublicDonatePageSettings(slug);
  const user = response?.user || null;
  const metadata = response?.metadata;
  const mergedSettingsFromMetadata = metadata
    ? mergeDonatePageSettings(
        defaultDonatePageSettings,
        buildDonatePageSettingsPatch(metadata)
      )
    : defaultDonatePageSettings;
  const donationTargetUserId = resolveDonationTargetUserId(
    response,
    mergedSettingsFromMetadata
  );
  const donationTargetUsername = resolveDonationTargetUsername(
    response,
    slug,
    mergedSettingsFromMetadata
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_26%),linear-gradient(180deg,#06101b_0%,#08131f_100%)] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-10">
            <div className="mx-auto mb-6 flex h-18 w-18 items-center justify-center rounded-full border border-rose-300/20 bg-rose-400/10 text-rose-200">
              <span className="text-2xl font-bold">!</span>
            </div>

            <h1 className="font-['Chakra_Petch'] text-3xl font-bold sm:text-4xl">
              ไม่พบหน้าโดเนทชื่อ <span className="text-cyan-300">&quot;{slug}&quot;</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              ลองตรวจสอบการสะกดอีกครั้ง หรือเลือกสตรีมเมอร์จากหน้าค้นหาด้านล่าง
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/explore/streamers"
                className="inline-flex h-12 items-center justify-center rounded-full bg-cyan-400 px-6 text-sm font-semibold text-[#07131f] transition hover:bg-cyan-300"
              >
                ค้นหาสตรีมเมอร์
              </Link>
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                กลับหน้าแรก
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const settings = metadata
    ? buildPublicDonatePageSettings(mergedSettingsFromMetadata)
    : defaultPublicDonatePageSettings;
  const widgetOnlineStatus = await fetchWidgetOnlineStatus(donationTargetUserId);

  const normalizedSettings = {
    ...settings,
    profile: {
      ...(settings.profile || {}),
      username: donationTargetUsername,
      handle: donationTargetUsername
        ? `${STREAMFLOW_DOMAIN}/${donationTargetUsername}`
        : `${STREAMFLOW_DOMAIN}/`,
      isOnline: widgetOnlineStatus.online,
      widgetConnections: widgetOnlineStatus.connections,
    },
  };

  return (
    <PublicDonatePage
      settings={normalizedSettings}
      donationTargetUserId={donationTargetUserId}
      donationTargetUsername={donationTargetUsername}
    />
  );
}
