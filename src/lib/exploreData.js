import { fetchPublicDonatePageSettings } from "@/actions/DonatePageapi/donatePageSettingsApi";
import { fetchUsers } from "@/actions/Usersapi/usersApi";

const WIDGET_ONLINE_API_BASE = "http://localhost:8080/widget/online";

export const profileCategoryOptions = [
  {
    id: "valorant",
    name: "VALORANT",
    image:
      "https://cdn.aona.co.th/u/nicenathapong/files/5be1c4094156fbe74d7049d417818b6c245291b569cd0dc5cfe80dd9e24d1336.png",
  },
  {
    id: "rov",
    name: "RoV",
    image:
      "https://play-lh.googleusercontent.com/2RrzGOcirTAU4vPzLiZ3Us4k-E-RtPVBbWB-RkU5FAT9gVrTlUJL0nYVN6VlpSbGq_uHHaLsvwvtxm1Mjirxpg",
  },
  {
    id: "minecraft",
    name: "Minecraft",
    image: "https://i.imgur.com/nKsYRdJ.png",
  },
  { id: "music", name: "Music & Singing" },
  { id: "vtuber", name: "VTuber" },
  { id: "irl", name: "IRL" },
];

const streamerAccentGradients = [
  "from-pink-500 via-rose-400 to-orange-300",
  "from-cyan-500 via-sky-400 to-blue-300",
  "from-emerald-500 via-teal-400 to-cyan-300",
  "from-violet-500 via-fuchsia-400 to-pink-300",
  "from-amber-500 via-yellow-400 to-orange-300",
  "from-indigo-500 via-sky-400 to-cyan-300",
];

const fallbackTagMap = {
  valorant: ["Competitive", "FPS", "Ranked"],
  rov: ["MOBA", "Teamplay", "Highlight"],
  minecraft: ["Sandbox", "Community", "Creative"],
  music: ["Cover", "Requests", "Late Night"],
  vtuber: ["VTuber", "Just Chatting", "Cozy"],
  irl: ["Lifestyle", "Talk", "Daily Life"],
};

export const mapCategoryIdToName = (categoryId) =>
  profileCategoryOptions.find((item) => item.id === categoryId)?.name || categoryId;

export const mapCategoryNameToId = (categoryName) =>
  profileCategoryOptions.find((item) => item.name === categoryName)?.id || null;

const toViewerCount = (index) => `${(index + 1) * 1.7}K`;
const toSupportAmount = (index) => `฿${(index + 4) * 12}K`;

const fetchWidgetOnlineStatus = async (userId) => {
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
};

export const fetchExploreStreamers = async () => {
  const users = await fetchUsers();
  const publicUsers = users.filter((user) => user?.username);

  const settingsList = await Promise.all(
    publicUsers.map(async (user, index) => {
      const [setting, widgetStatus] = await Promise.all([
        fetchPublicDonatePageSettings(user.username),
        fetchWidgetOnlineStatus(user.id),
      ]);
      const selectedCategories = Array.isArray(setting?.metadata?.profileCategories)
        ? setting.metadata.profileCategories
        : [];
      const primaryCategoryId = selectedCategories[0] || null;
      const resolvedUsername = user.username || "";

      return {
        id: user.id,
        slug: resolvedUsername,
        name:
          setting?.metadata?.profile?.name ||
          resolvedUsername,
        handle: resolvedUsername,
        bio:
          setting?.metadata?.profile?.bio ||
          "พร้อมเปิดรับการสนับสนุนและต้อนรับผู้ชมใหม่ผ่านหน้าโดเนทของตัวเอง",
        avatarUrl: setting?.metadata?.profile?.avatarUrl || "",
        bannerUrl: setting?.metadata?.profile?.bannerUrl || "",
        profileCategories: selectedCategories,
        category: mapCategoryIdToName(primaryCategoryId || "ทั่วไป"),
        categoryId: primaryCategoryId,
        tags:
          selectedCategories.length > 0
            ? selectedCategories.flatMap(
                (item) => fallbackTagMap[item] || [mapCategoryIdToName(item)]
              )
            : ["Creator", "Support", "Community"],
        viewers: toViewerCount(index),
        support: toSupportAmount(index),
        accent: streamerAccentGradients[index % streamerAccentGradients.length],
        verified: Boolean(user.isVerified),
        isWidgetOnline: widgetStatus.online,
        widgetConnections: widgetStatus.connections,
      };
    })
  );

  return settingsList;
};

export const buildCategorySummaries = (streamers) =>
  profileCategoryOptions.map((category) => {
    const members = streamers.filter((streamer) =>
      streamer.profileCategories.includes(category.id)
    );

    return {
      ...category,
      memberCount: members.length,
      members,
    };
  });
