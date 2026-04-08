// src/app/dashboard/DonateAlertSettings/components/utils/fontUtils.js

// ======================================================
// ⭐ ฟังก์ชันแปลง Font Weight ให้เป็นตัวเลข CSS
// ======================================================
export const getFontWeight = (weight) => {
  switch (weight) {
    case "normal": return "400";
    case "medium": return "500";
    case "bold": return "700";
    case "extrabold": return "800";
    default: return "400";
  }
};

// ======================================================
// ⭐ รายการ Font ทั้งหมด (ไทย + อังกฤษ)
// ======================================================
export const thaiGoogleFonts = [

  // -----------------------------
  // ⭐ Thai Google Fonts (Standard)
  // -----------------------------
  { id: "kanit", name: "Kanit", cssFamily: "'Kanit', sans-serif" },
  { id: "prompt", name: "Prompt", cssFamily: "'Prompt', sans-serif" },
  { id: "sarabun", name: "Sarabun", cssFamily: "'Sarabun', sans-serif" },
  { id: "noto", name: "Noto Sans Thai", cssFamily: "'Noto Sans Thai', sans-serif" },
  { id: "ibmplex", name: "IBM Plex Sans Thai", cssFamily: "'IBM Plex Sans Thai', sans-serif" },

  // -----------------------------
  // ⭐ Thai Popular Fonts
  // -----------------------------
  { id: "chakra", name: "Chakra Petch", cssFamily: "'Chakra Petch', sans-serif" },
  { id: "baijamjuree", name: "Bai Jamjuree", cssFamily: "'Bai Jamjuree', sans-serif" },
  { id: "mali", name: "Mali (ลายมือ)", cssFamily: "'Mali', cursive" },
  { id: "mitr", name: "Mitr", cssFamily: "'Mitr', sans-serif" },
  { id: "trirong", name: "Trirong", cssFamily: "'Trirong', serif" },
  { id: "srisakdi", name: "Srisakdi", cssFamily: "'Srisakdi', cursive" },
  { id: "kodchasan", name: "Kodchasan", cssFamily: "'Kodchasan', sans-serif" },
  { id: "charmonman", name: "Charmonman", cssFamily: "'Charmonman', cursive" },
  { id: "fahkwang", name: "Fahkwang", cssFamily: "'Fahkwang', sans-serif" },
  { id: "pattaya", name: "Pattaya", cssFamily: "'Pattaya', sans-serif" },
  { id: "pridi", name: "Pridi", cssFamily: "'Pridi', serif" },
  { id: "sriracha", name: "Sriracha", cssFamily: "'Sriracha', cursive" },
  { id: "thasadith", name: "Thasadith", cssFamily: "'Thasadith', sans-serif" },
  { id: "athiti", name: "Athiti", cssFamily: "'Athiti', sans-serif" },
  { id: "chonburi", name: "Chonburi", cssFamily: "'Chonburi', serif" },
  { id: "krub", name: "Krub", cssFamily: "'Krub', sans-serif" },
  { id: "taviraj", name: "Taviraj", cssFamily: "'Taviraj', serif" },

  // -----------------------------
  // ⭐ English Fonts (UI/Modern)
  // -----------------------------
  { id: "inter", name: "Inter", cssFamily: "'Inter', sans-serif" },
  { id: "roboto", name: "Roboto", cssFamily: "'Roboto', sans-serif" },
  { id: "robotoSlab", name: "Roboto Slab", cssFamily: "'Roboto Slab', serif" },
  { id: "poppins", name: "Poppins", cssFamily: "'Poppins', sans-serif" },
  { id: "montserrat", name: "Montserrat", cssFamily: "'Montserrat', sans-serif" },
  { id: "oswald", name: "Oswald", cssFamily: "'Oswald', sans-serif" },
  { id: "lato", name: "Lato", cssFamily: "'Lato', sans-serif" },
  { id: "openSans", name: "Open Sans", cssFamily: "'Open Sans', sans-serif" },
  { id: "rubik", name: "Rubik", cssFamily: "'Rubik', sans-serif" },
  { id: "fredoka", name: "Fredoka", cssFamily: "'Fredoka', sans-serif" },
  { id: "dela", name: "Dela Gothic One", cssFamily: "'Dela Gothic One', sans-serif" },

  // -----------------------------
  // ⭐ MEME / Game / Fun Fonts
  // -----------------------------
  { id: "impact", name: "Impact (MEME)", cssFamily: "Impact, sans-serif" },
  { id: "bebas", name: "Bebas Neue", cssFamily: "'Bebas Neue', sans-serif" },
  { id: "bangers", name: "Bangers (Comic)", cssFamily: "'Bangers', cursive" },
  { id: "pressstart", name: "Press Start 2P (8-bit)", cssFamily: "'Press Start 2P', cursive" },

  // -----------------------------
  // ⭐ Handwriting / Script
  // -----------------------------
  { id: "dancing", name: "Dancing Script", cssFamily: "'Dancing Script', cursive" },
  { id: "pacifico", name: "Pacifico", cssFamily: "'Pacifico', cursive" },
  { id: "amatic", name: "Amatic SC", cssFamily: "'Amatic SC', cursive" },
  { id: "handlee", name: "Handlee", cssFamily: "'Handlee', cursive" },

  // -----------------------------
  // ⭐ System-style
  // -----------------------------
  { id: "monospace", name: "Monospace", cssFamily: "monospace" },
  { id: "cursive", name: "Cursive (ลายมือ)", cssFamily: "cursive" }
];

// ======================================================
// ⭐ Font Weight List
// ======================================================
export const fontWeights = ["normal", "medium", "bold", "extrabold"];

// ======================================================
// ⭐ ฟังก์ชันหา CSS Font Family จาก ID
// ======================================================
export const getFontFamilyCss = (fontId) => {
  const found = thaiGoogleFonts.find(f => f.id === fontId);
  return found ? found.cssFamily : "sans-serif";
};

// ======================================================
// ⭐ ฟังก์ชัน Preview User Name
// ======================================================
export const getDisplayName = (prefixText) => {
  return prefixText && prefixText.includes("{{user}}")
    ? prefixText.replace("{{user}}", "โทนี่")
    : "โทนี่";
};

// ======================================================
// ⭐ ฟังก์ชัน Preview Amount
// ======================================================
export const getAmountText = (settings) => {
  if (settings.amountText) {
    return settings.amountText.replace("{{amount}}", "500");
  }
  return `500${settings.amountSuffix || "฿"}`;
};
