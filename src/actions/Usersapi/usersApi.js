const USERS_API_BASE = "http://localhost:5000/api/users";
const RESERVED_USERNAMES = new Set([
  "about",
  "account",
  "api",
  "categories",
  "dashboard",
  "developerzone",
  "donate",
  "explore",
  "faviconico",
  "landing",
  "login",
  "page",
  "plans",
  "register",
  "streamers",
  "test",
  "verify",
  "widgets",
  "withdraw",
]);

export const fetchUsers = async () => {
  try {
    const res = await fetch(USERS_API_BASE, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error: ${res.status} ${errorText}`);
    }

    const payload = await res.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
};

export const updateUsername = async (userId, username) => {
  if (!userId || !username) {
    return {
      ok: false,
      errorCode: "invalid-input",
      message: "Missing userId or username",
      data: null,
    };
  }

  try {
    const res = await fetch(`${USERS_API_BASE}/${encodeURIComponent(userId)}/username`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: String(username).trim().toLowerCase(),
      }),
    });

    if (!res.ok) {
      if (res.status === 404) {
        return {
          ok: false,
          errorCode: "route-not-found",
          message: "Username update route not found",
          data: null,
        };
      }

      const errorText = await res.text();
      return {
        ok: false,
        errorCode: `http-${res.status}`,
        message: errorText || `HTTP ${res.status}`,
        data: null,
      };
    }

    const payload = await res.json();
    return {
      ok: true,
      errorCode: null,
      message: "",
      data: payload?.data || null,
    };
  } catch (error) {
    console.error("Failed to update username:", error);
    return {
      ok: false,
      errorCode: "network-error",
      message: error?.message || "Network error",
      data: null,
    };
  }
};

export const checkUsernameAvailability = async (username, excludeUserId) => {
  const normalizedUsername = String(username || "").trim().toLowerCase();

  if (!normalizedUsername) {
    return {
      available: false,
      username: "",
      source: "invalid",
    };
  }

  if (RESERVED_USERNAMES.has(normalizedUsername)) {
    return {
      available: false,
      username: normalizedUsername,
      source: "reserved",
    };
  }

  try {
    const params = new URLSearchParams({
      username: normalizedUsername,
    });

    if (excludeUserId) {
      params.set("excludeUserId", excludeUserId);
    }

    const res = await fetch(`${USERS_API_BASE}/check-username?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("username-check-route-not-found");
      }

      const errorText = await res.text();
      throw new Error(`Error: ${res.status} ${errorText}`);
    }

    const payload = await res.json();

    return {
      available: Boolean(payload?.data?.available),
      username: payload?.data?.username || normalizedUsername,
      source: "api",
    };
  } catch (error) {
    if (error?.message !== "username-check-route-not-found") {
      console.error("Failed to check username availability:", error);
    }

    const users = await fetchUsers();
    const duplicateUser = users.find((user) => {
      if (!user?.username) {
        return false;
      }

      if (excludeUserId && user.id === excludeUserId) {
        return false;
      }

      return String(user.username).trim().toLowerCase() === normalizedUsername;
    });

    return {
      available: !duplicateUser,
      username: normalizedUsername,
      source: duplicateUser ? "fallback-users" : "fallback-users-no-match",
    };
  }
};
