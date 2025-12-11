"use client";
// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

// 🌟 ฟังก์ชันช่วยดึง Token จาก document.cookie
const getCookieToken = () => {
    // 1. อ่าน document.cookie ทั้งหมด
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        // 2. ค้นหาคุกกี้ชื่อ 'token'
        if (cookie.startsWith('token=')) {
            // 3. คืนค่า token
            return cookie.substring('token='.length);
        }
    }
    return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 

  // Function to fetch the user data
  const fetchUser = async () => {
    const token = getCookieToken(); // 🌟 ดึง Token ก่อนส่ง Request
    
    // ถ้าไม่มี token ให้หยุดและถือว่าไม่ได้ล็อกอิน
    if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
    }

    try {
      // 🌟 แก้ไข: ส่ง Token ผ่าน Authorization Header
      const response = await fetch('http://localhost:4000/api/auth/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 🌟 แนบ JWT ในรูปแบบ Bearer Token
            'Authorization': `Bearer ${token}`, 
        },
        // ไม่ต้องใช้ credentials: 'include' ถ้าส่งผ่าน Header
      }); 
      
      if (response.ok) {
        const userData = await response.json();
        console.log(userData);
        
        // Back-end มักจะส่ง Object user กลับมาตรงๆ 
        setUser(userData); 

      } else {
        // 401 Unauthorized หรือ Token หมดอายุ
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    refetchUser: fetchUser, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};