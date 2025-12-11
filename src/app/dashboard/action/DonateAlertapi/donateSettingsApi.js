const API_URL = "http://localhost:4000/api/donate-settings";

// GET settings
export const fetchDonateSettings = async () => {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    return data.settings || {}; // ป้องกัน null
  } catch (err) {
    console.error("Failed to fetch donate settings:", err);
    return null;
  }
};

// SAVE / UPDATE settings
export const saveDonateSettings = async (settings) => {
    console.log(settings);
    
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ settings }), // ห่อด้วย key settings
    });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to save donate settings:", err);
    return null;
  }
};
