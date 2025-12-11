// src/app/services/authService/authService.js

const API_URL = "http://localhost:4000/api/auth"; // backend ของคุณ

// ============================
// LOGIN
// ============================
export async function loginService(email, password) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      credentials: 'include', // เพิ่ม: เพื่อให้ส่ง Cookie ไป/รับ Cookie กลับ
    });

    const data = await res.json();

    return {
      success: res.ok,
      data
    };
  } catch (error) {
    console.error("Login API Error:", error);
    return {
      success: false,
      data: { message: "Cannot connect to server" }
    };
  }
}

// ============================
// REGISTER (ปรับปรุงรูปแบบการคืนค่า)
// ============================
export const registerService = async (payload) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    
    const data = await response.json(); 

    return { 
      success: response.ok, 
      data 
    };

  } catch (error) {
    console.error("Register API Error:", error);
    return {
      success: false,
      data: { message: error.message || "Cannot connect to server" }
    };
  }
};

// ============================
// VERIFY OTP
// ============================
export const verifyOtpService = async ({ email, otp }) => {
  try {
    const response = await fetch(`${API_URL}/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
      credentials: 'include',
    });

    const data = await response.json();

    return {
      success: response.ok,
      data
    };

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return {
      success: false,
      data: { message: "Cannot connect to server" }
    };
  }
};

// ============================
// REQUEST OTP
// ============================
export const requestOtpService = async ({ email }) => {
  try {
    const res = await fetch(`${API_URL}/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: 'include',
    });

    const data = await res.json();

    return { success: res.ok, data }; 
  } catch (err) {
    return { success: false, data: { message: err.message } };
  }
};

// ============================
// CHECK VERIFIED
// ============================
export const checkVerifiedService = async (email) => {
  try {
    const res = await fetch(`${API_URL}/check-verified?email=${email}`, {
      credentials: 'include'
    });
    return await res.json();
  } catch (err) {
    console.error("Check verified failed:", err);
    return { success: false, data: { isVerified: false } };
  }
};

// ============================
// GET CURRENT USER (รองรับ Cookie)
// ============================
export const getCurrentUser = async () => { 
  const res = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: 'include', 
  });

  if (!res.ok) {
    if (res.status === 401) {
      // 401 Unauthorized คือ Token หมดอายุหรือไม่ถูกต้อง
      return null; 
    }
    // สำหรับ Error อื่นๆ
    throw new Error(`Failed to fetch user data: ${res.statusText}`);
  }
  
  return res.json(); 
};
