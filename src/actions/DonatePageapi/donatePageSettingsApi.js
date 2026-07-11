const DONATE_PAGE_SETTINGS_API_BASE = "http://localhost:5000/api/donate-page-settings";

export const fetchDonatePageSettings = async (userId) => {
  if (!userId) {
    return null;
  }

  try {
    const res = await fetch(`${DONATE_PAGE_SETTINGS_API_BASE}/${encodeURIComponent(userId)}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error: ${res.status} ${errorText}`);
    }

    const payload = await res.json();
    return payload?.data || null;
  } catch (error) {
    console.error("Failed to fetch donate page settings:", error);
    return null;
  }
};

export const saveDonatePageSettings = async (userId, metadata) => {
  if (!userId) {
    return null;
  }

  try {
    const res = await fetch(`${DONATE_PAGE_SETTINGS_API_BASE}/${encodeURIComponent(userId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ metadata }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error: ${res.status} ${errorText}`);
    }

    const payload = await res.json();
    return payload?.data || null;
  } catch (error) {
    console.error("Failed to save donate page settings:", error);
    return null;
  }
};

export const deleteDonatePageSettings = async (userId) => {
  if (!userId) {
    return null;
  }

  try {
    const res = await fetch(`${DONATE_PAGE_SETTINGS_API_BASE}/${encodeURIComponent(userId)}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error: ${res.status} ${errorText}`);
    }

    const payload = await res.json();
    return payload?.data || null;
  } catch (error) {
    console.error("Failed to delete donate page settings:", error);
    return null;
  }
};

export const fetchPublicDonatePageSettings = async (username) => {
  if (!username) {
    return null;
  }

  try {
    const res = await fetch(
      `${DONATE_PAGE_SETTINGS_API_BASE}/public/${encodeURIComponent(username)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error: ${res.status} ${errorText}`);
    }

    const payload = await res.json();
    return payload?.data || null;
  } catch (error) {
    console.error("Failed to fetch public donate page settings:", error);
    return null;
  }
};
