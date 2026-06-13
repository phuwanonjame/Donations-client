"use client";
import React, { createContext, useContext, useState } from "react";

const translations = {
  en: {
    // Header
    nav: {
      features: "Features",
      pricing: "Pricing",
      support: "Support",
      login: "Log In",
      getStarted: "Get Started",
    },
    // Hero
    hero: {
      badge: "Trusted by 50,000+ Streamers Worldwide",
      headline1: "Maximize Your Income.",
      headline2: "Simplify Donations.",
      subheadline:
        "The all-in-one monetization platform designed for modern streamers. Accept donations globally, engage your audience with stunning alerts, and get paid faster than ever.",
      startTrial: "Start Free Trial",
      watchDemo: "Watch Demo",
      signUpWith: "Or sign up quickly with",
      donationAlert: {
        title: "New Donation!",
        user: "GamerPro2024",
        donated: "donated",
        message: "Keep up the amazing streams! 🔥",
      },
    },
    // Features
    features: {
      badge: "Powerful Features",
      title1: "Everything You Need to",
      title2: "Grow Your Stream",
      subtitle:
        "Built by streamers, for streamers. Every feature is designed to help you monetize smarter and engage your audience deeper.",
      learnMore: "Learn more",
      items: [
        {
          title: "Real-time Alerts & Widgets",
          description:
            "Captivate your audience with stunning, customizable donation alerts, goal trackers, and event notifications that pop on screen instantly.",
          alertTitle: "New Donation!",
          alertDesc: "StreamFan donated $10",
        },
        {
          title: "Secure Global Payouts",
          description:
            "Get paid your way with flexible payout options. We support PayPal, Stripe, direct bank transfers, and more in 150+ countries.",
        },
        {
          title: "In-Depth Analytics",
          description:
            "Understand your audience like never before. Track donation trends, viewer engagement, peak times, and revenue growth with powerful dashboards.",
        },
        {
          title: "Full Customization",
          description:
            "Make it yours. Design alerts, overlays, and widgets that match your brand with our intuitive drag-and-drop editor. No coding required.",
        },
      ],
    },
    // Pricing
    pricing: {
      badge: "Simple Pricing",
      title1: "Choose Your",
      title2: " Plan",
      subtitle:
        "Transparent pricing with no hidden fees. Start free and upgrade as you grow.",
      monthly: "Monthly",
      annual: "Annual",
      save: "Save 20%",
      perDonation: "per donation",
      startFree: "Start Free",
      choosePlan: "Choose Plan",
      mostPopular: "Most Popular",
      forever: "forever",
      month: "/month",
      year: "/year",
      plans: [
        {
          name: "Basic",
          description: "Perfect for beginners just getting started",
          price: "Free",
          features: [
            "Up to 20 on-screen donation alerts per month",
            "Basic widget customization",
            "Ads displayed on payment page",
            "Cannot customize cover/background/color",
          ],
        },
        {
          name: "Pro",
          description: "A little more power to take you further",
          features: [
            "50 on-screen donations per month",
            "Advanced widget customization",
            "No ads on the payment page",
            "Can customize cover image / background / colors",
          ],
        },
        {
          name: "Premium",
          description: "For professional creators and organizations",
          features: [
            "120 on-screen donations per month",
            "Full widget customization",
            "No ads on the payment page",
            "Customize cover image / background / colors",
          ],
        },
        {
  name: 'Ultra',
  description: 'For advanced users who need the highest-level features',
  features: [
    'Unlimited on-screen donations',
    'Full widget customization',
    'No ads on any page',
    'Customize theme / CSS / advanced code',
  ],
}
      ],
      trust: "Trusted payment processing",
      badges: [
        "SSL Secured",
        "256-bit Encryption",
        "PCI Compliant",
        "GDPR Ready",
      ],
    },
    // Footer
    footer: {
      cta: {
        title: "Ready to Supercharge Your Stream?",
        subtitle:
          "Join thousands of streamers already using StreamFlow to grow their income.",
        button: "Get Started for Free",
      },
      brand:
        "The modern monetization platform built for streamers who want to focus on content, not payments.",
      links: {
        Product: ["Features", "Pricing", "Integrations", "API", "Changelog"],
        Company: ["About", "Blog", "Careers", "Press Kit", "Partners"],
        Resources: [
          "Documentation",
          "Help Center",
          "Community",
          "Status",
          "Contact",
        ],
        Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
      },
      copyright: "© 2024 StreamFlow. All rights reserved.",
    },
  },
  th: {
    // Header
    nav: {
      features: "ฟีเจอร์",
      pricing: "ราคา",
      support: "ช่วยเหลือ",
      login: "เข้าสู่ระบบ",
      getStarted: "เริ่มต้นใช้งาน",
    },
    // Hero
    hero: {
      badge: "ได้รับความไว้วางใจจากสตรีมเมอร์กว่า 50,000 คนทั่วโลก",
      headline1: "เพิ่มรายได้ของคุณ",
      headline2: "รับบริจาคง่ายขึ้น",
      subheadline:
        "แพลตฟอร์มสร้างรายได้ครบวงจรที่ออกแบบมาสำหรับสตรีมเมอร์ยุคใหม่ รับบริจาคจากทั่วโลก ดึงดูดผู้ชมด้วยการแจ้งเตือนที่สวยงาม และรับเงินได้เร็วกว่าที่เคย",
      startTrial: "เริ่มทดลองฟรี",
      watchDemo: "ดูตัวอย่าง",
      signUpWith: "หรือสมัครด่วนผ่าน",
      donationAlert: {
        title: "บริจาคใหม่!",
        user: "GamerPro2024",
        donated: "บริจาค",
        message: "สตรีมดีมากครับ สู้ๆ! 🔥",
      },
    },
    // Features
    features: {
      badge: "ฟีเจอร์ทรงพลัง",
      title1: "ทุกสิ่งที่คุณต้องการเพื่อ",
      title2: "พัฒนาสตรีมของคุณ",
      subtitle:
        "สร้างโดยสตรีมเมอร์ เพื่อสตรีมเมอร์ ทุกฟีเจอร์ออกแบบมาเพื่อช่วยคุณสร้างรายได้อย่างชาญฉลาดและดึงดูดผู้ชมได้ดีขึ้น",
      learnMore: "เรียนรู้เพิ่มเติม",
      items: [
        {
          title: "แจ้งเตือนและวิดเจ็ตแบบเรียลไทม์",
          description:
            "ดึงดูดผู้ชมด้วยการแจ้งเตือนบริจาคที่สวยงาม ปรับแต่งได้ ตัวติดตามเป้าหมาย และการแจ้งเตือนกิจกรรมที่แสดงบนหน้าจอทันที",
          alertTitle: "บริจาคใหม่!",
          alertDesc: "StreamFan บริจาค $10",
        },
        {
          title: "จ่ายเงินทั่วโลกอย่างปลอดภัย",
          description:
            "รับเงินในแบบที่คุณต้องการ รองรับ PayPal, Stripe, โอนเข้าบัญชีธนาคารโดยตรง และอื่นๆ ในกว่า 150 ประเทศ",
        },
        {
          title: "วิเคราะห์เชิงลึก",
          description:
            "เข้าใจผู้ชมอย่างที่ไม่เคยมาก่อน ติดตามแนวโน้มการบริจาค การมีส่วนร่วมของผู้ชม ช่วงเวลาพีค และการเติบโตของรายได้ด้วยแดชบอร์ดที่ทรงพลัง",
        },
        {
          title: "ปรับแต่งได้เต็มที่",
          description:
            "ทำให้เป็นของคุณ ออกแบบการแจ้งเตือน โอเวอร์เลย์ และวิดเจ็ตที่ตรงกับแบรนด์ของคุณด้วยเครื่องมือลากวางที่ใช้ง่าย ไม่ต้องเขียนโค้ด",
        },
      ],
    },
    // Pricing
    pricing: {
      badge: "ราคาเรียบง่าย",
      title1: "เลือก",
      title2: "แพ็คเกจของคุณ",
      subtitle:
        "ราคาโปร่งใส ไม่มีค่าใช้จ่ายแอบแฝง เริ่มต้นฟรีและอัพเกรดตามการเติบโต",
      monthly: "รายเดือน",
      annual: "รายปี",
      save: "ประหยัด 20%",
      perDonation: "ต่อการบริจาค",
      startFree: "เริ่มต้นฟรี",
      choosePlan: "เลือกแพ็คเกจ",
      mostPopular: "ยอดนิยม",
      forever: "ตลอดไป",
      month: "/เดือน",
      year: "/ปี",
      plans: [
        {
          name: "Basic",
          description: "เหมาะที่สุดสำหรับผู้เริ่มต้น",
          features: [
            "โดเนทขึ้นจอ 20 ครั้ง/เดือน",
            "ปรับแต่งวิดเจ็ตเบื้องต้น",
            "มีโฆษณาในหน้ารับเงิน",
            "ไม่สามารถเปลี่ยนรูปปก/พื้นหลัง/สี ได้",
          ],
        },
        {
          name: "Pro",
          description: "เพิ่มเติมเล็กน้อย ไปได้ไกลขึ้น",
          features: [
            "โดเนทขึ้นจอ 50 ครั้ง/เดือน",
            "ปรับแต่งวิดเจ็ตขั้นสูง",
            "ไม่มีโฆษณาในหน้ารับเงิน",
            "เปลี่ยนรูปปก/พื้นหลัง/สี ได้",
          ],
        },
        {
          name: "Premium",
          description: "พิเศษสำหรับระดับโปร",
          features: [
            "โดเนทขึ้นจอ 120 ครั้ง/เดือน",
            "ปรับแต่งวิดเจ็ต ได้ทั้งหมด",
            "ไม่มีโฆษณาในหน้ารับเงิน",
            "เปลี่ยน รูปปก/พื้นหลัง/สี ได้",
          ],
        },
        {
          name: "Ultra",
          description: "สำหรับผู้ใช้ระดับโปร ต้องการฟีเจอร์สูงสุด",
          features: [
            "โดเนทขึ้นจอไม่จำกัด",
            "ปรับแต่งวิดเจ็ตแบบเต็มรูปแบบ",
            "ไม่มีโฆษณาทุกหน้า",
            "เปลี่ยน รูปปก/พื้นหลัง/สี ได้",
          ],
        },
      ],
      trust: "การประมวลผลการชำระเงินที่เชื่อถือได้",
      badges: [
        "SSL ปลอดภัย",
        "เข้ารหัส 256-bit",
        "เป็นไปตาม PCI",
        "พร้อม GDPR",
      ],
    },
    // Footer
    footer: {
      cta: {
        title: "พร้อมยกระดับสตรีมของคุณหรือยัง?",
        subtitle:
          "เข้าร่วมกับสตรีมเมอร์หลายพันคนที่ใช้ StreamFlow เพื่อเพิ่มรายได้",
        button: "เริ่มต้นใช้งานฟรี",
      },
      brand:
        "แพลตฟอร์มสร้างรายได้ยุคใหม่ที่สร้างมาสำหรับสตรีมเมอร์ที่ต้องการโฟกัสที่คอนเทนต์ ไม่ใช่การชำระเงิน",
      links: {
        ผลิตภัณฑ์: [
          "ฟีเจอร์",
          "ราคา",
          "การผสานรวม",
          "API",
          "บันทึกการเปลี่ยนแปลง",
        ],
        บริษัท: ["เกี่ยวกับ", "บล็อก", "ร่วมงาน", "Press Kit", "พันธมิตร"],
        แหล่งข้อมูล: ["เอกสาร", "ศูนย์ช่วยเหลือ", "ชุมชน", "สถานะ", "ติดต่อ"],
        กฎหมาย: [
          "นโยบายความเป็นส่วนตัว",
          "ข้อกำหนดการให้บริการ",
          "นโยบายคุกกี้",
          "GDPR",
        ],
      },
      copyright: "© 2024 StreamFlow. สงวนลิขสิทธิ์",
    },
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "en";
    const storedLanguage = window.localStorage.getItem("streamflow-language");
    return storedLanguage === "en" || storedLanguage === "th" ? storedLanguage : "en";
  });

  const t = translations[language];

  const changeLanguage = (nextLanguage) => {
    if (nextLanguage !== "en" && nextLanguage !== "th") return;
    setLanguage(nextLanguage);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("streamflow-language", nextLanguage);
    }
  };

  const toggleLanguage = () => {
    changeLanguage(language === "en" ? "th" : "en");
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: changeLanguage, toggleLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
