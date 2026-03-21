const API_URL = "http://localhost:4000/api/donate-settings";

// GET settings
export const fetchDonateSettings = async () => {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // token cookie ส่งไปให้เอง
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch donate settings:", err);
    return null;
  }
};

// SAVE settings
export const saveDonateSettings = async (settings) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",  // token cookie ส่งไปให้เอง
      body: JSON.stringify(settings), // ส่ง settings ตรงๆ
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);

    return await res.json();
  } catch (err) {
    console.error("Failed to save donate settings:", err);
    return null;
  }
};
