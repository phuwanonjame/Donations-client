import { donationDecorationPresets } from "@/components/donation/shared/donatePageConfig";

const MIN_DONATION_AMOUNT = 10;

function cloneDecorations(decorations = {}) {
  return Object.fromEntries(
    Object.entries(decorations).map(([key, value]) => [key, { ...value }])
  );
}

export function buildDonatePageMetadata(settings) {
  const profanityFilter =
    (settings.filters || []).find((item) => item.id === "profanity") || {};

  return {
    theme: settings.theme,
    design: {
      decorationPreset: settings.design?.decorationPreset || "original-default",
    },
    profile: {
      name: settings.profile?.name || "",
      handle: settings.profile?.handle || "",
      username: settings.profile?.username || "",
      bio: settings.profile?.bio || "",
      avatarUrl: settings.profile?.avatarUrl || "",
      bannerUrl: settings.profile?.bannerUrl || "",
    },
    socials: (settings.socials || []).map((item) => ({
      id: item.id,
      label: item.label,
      href: item.href || "",
      enabled: item.enabled ?? true,
    })),
    donation: {
      pageTitle: settings.donation?.pageTitle || "",
      minAmount: Math.max(MIN_DONATION_AMOUNT, Number(settings.donation?.minAmount || 0)),
      welcomeMessage: settings.donation?.welcomeMessage || "",
      buttonText: settings.donation?.buttonText || "",
      channels: {
        promptpay: {
          enabled: settings.donation?.channels?.promptpay?.enabled ?? false,
          type: settings.donation?.channels?.promptpay?.type || "phone",
          value: settings.donation?.channels?.promptpay?.value || "",
        },
        bank: {
          enabled: settings.donation?.channels?.bank?.enabled ?? false,
          bankName: settings.donation?.channels?.bank?.bankName || "",
          accountName: settings.donation?.channels?.bank?.accountName || "",
          accountNumber: settings.donation?.channels?.bank?.accountNumber || "",
        },
      },
    },
    filters: {
      profanityEnabled: profanityFilter.enabled ?? true,
      customProfanityWords: settings.customProfanityWords || [],
    },
    profileCategories: settings.profileCategories || [],
    videos: (settings.videos || []).map((item) => ({
      id: item.id,
      title: item.title || "",
      url: item.url || "",
      enabled: item.enabled ?? true,
    })),
    posts: (settings.posts || []).map((item) => ({
      id: item.id,
      text: item.text || "",
      image: item.image || "",
      enabled: item.enabled ?? true,
    })),
    gallery: (settings.gallery || []).map((item) => ({
      id: item.id,
      url: item.url || "",
      enabled: item.enabled ?? true,
    })),
    schedule: (settings.schedule || []).map((item) => ({
      id: item.id,
      day: item.day || "",
      time: item.time || "",
      title: item.title || "",
      enabled: item.enabled ?? true,
    })),
  };
}

export function buildDonatePageSettingsPatch(metadata) {
  const selectedPreset =
    donationDecorationPresets.find(
      (preset) => preset.id === metadata?.design?.decorationPreset
    ) || donationDecorationPresets[0];

  return {
    theme: metadata?.theme,
    design: {
      ...selectedPreset.settingsPatch,
      decorationPreset: selectedPreset.id,
      donationFormDecorations: cloneDecorations(selectedPreset.decorations),
      donationFormTheme: selectedPreset.formTheme,
      sectionTheme: selectedPreset.sectionTheme,
      sectionDecorations: cloneDecorations(selectedPreset.sectionDecorations),
    },
    profile: {
      name: metadata?.profile?.name,
      bio: metadata?.profile?.bio,
      avatarUrl: metadata?.profile?.avatarUrl,
      bannerUrl: metadata?.profile?.bannerUrl,
      backgroundUrl: metadata?.profile?.bannerUrl,
    },
    socials: metadata?.socials,
    donation: {
      pageTitle: metadata?.donation?.pageTitle,
      minAmount: Math.max(MIN_DONATION_AMOUNT, Number(metadata?.donation?.minAmount || 0)),
      welcomeMessage: metadata?.donation?.welcomeMessage,
      buttonText: metadata?.donation?.buttonText,
      channels: {
        promptpay: {
          ...(metadata?.donation?.channels?.promptpay || {}),
          expanded: false,
        },
        bank: {
          ...(metadata?.donation?.channels?.bank || {}),
          expanded: false,
        },
      },
    },
    filters: [
      {
        id: "profanity",
        name: "Block Profanity",
        description: "บล็อกคำหยาบและภาษาที่ไม่เหมาะสม",
        enabled: metadata?.filters?.profanityEnabled ?? true,
      },
    ],
    customProfanityWords: metadata?.filters?.customProfanityWords || [],
    profileCategories: metadata?.profileCategories,
    videos: metadata?.videos,
    posts: metadata?.posts,
    gallery: metadata?.gallery,
    schedule: metadata?.schedule,
  };
}
