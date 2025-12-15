// src/utils/animationUtils.js 

/**
 * Mapping function เพื่อแปลงชื่อ Animation จาก DisplayTab เป็น Framer Motion Variants
 * @param {string} inAnimationName - ชื่อ Animation สำหรับขาเข้า (e.g., 'zoomIn')
 * @param {string} outAnimationName - ชื่อ Animation สำหรับขาออก (e.g., 'fadeOutUp')
 * @param {number} inDuration - ระยะเวลาขาเข้า
 * @param {number} outDuration - ระยะเวลาขาออก
 * @returns {object} Framer Motion Variants { initial, animate, exit }
 */
export const getMotionVariants = (inAnimationName, outAnimationName, inDuration, outDuration) => {
    
    // Transition สำหรับขาเข้า
    const inTransition = { type: "tween", duration: inDuration };
    // Transition สำหรับขาออก (สำหรับ exit prop)
    const outTransition = { type: "tween", duration: outDuration };

    // ------------------ IN (Initial -> Animate) ------------------
    let inVariants = {
        initial: { opacity: 0 },
        // เนื่องจาก AlertPreview.jsx เรียกใช้ animate={animationStep} และ step=display
        // เราจึงต้องเพิ่ม variant ชื่อ 'display' ให้เหมือนกับ 'animate'
        animate: { opacity: 1, transition: inTransition },
        display: { opacity: 1, transition: { duration: 0 } }, // สถานะแสดงผลคงที่
    };

    switch (inAnimationName) {
        // Fade In
        case "fadeIn":
            inVariants.initial = { opacity: 0 };
            inVariants.animate = { opacity: 1, transition: inTransition };
            break;
        case "fadeInDown":
            inVariants.initial = { opacity: 0, y: -50 };
            inVariants.animate = { opacity: 1, y: 0, transition: inTransition };
            break;
        case "fadeInUp":
            inVariants.initial = { opacity: 0, y: 50 };
            inVariants.animate = { opacity: 1, y: 0, transition: inTransition };
            break;
            
        // Slide In
        case "slideInLeft":
            inVariants.initial = { opacity: 0, x: -500 };
            inVariants.animate = { opacity: 1, x: 0, transition: inTransition };
            break;
        case "slideInRight":
            inVariants.initial = { opacity: 0, x: 500 };
            inVariants.animate = { opacity: 1, x: 0, transition: inTransition };
            break;
            
        // Effect In
        case "zoomIn":
            inVariants.initial = { opacity: 0, scale: 0.5 };
            inVariants.animate = { opacity: 1, scale: 1, transition: inTransition };
            break;
        case "bounceIn": // ใช้ spring เพื่อให้ดูเด้ง
            inVariants.initial = { opacity: 0, scale: 0.8 };
            inVariants.animate = { 
                opacity: 1, 
                scale: 1, 
                transition: { type: "spring", stiffness: 120, damping: 10, duration: inDuration } 
            };
            break;
        case "rollIn":
            inVariants.initial = { opacity: 0, x: -100, rotate: -180 };
            inVariants.animate = { opacity: 1, x: 0, rotate: 0, transition: inTransition };
            break;
        default:
             // ใช้ค่าเริ่มต้นที่กำหนดไว้แล้ว
             break;
    }
    
    // ------------------ OUT (Exit) ------------------
    // AnimatePresence จะรัน variant ชื่อ 'exit' เมื่อคอมโพเนนต์ถูก Unmount
    let exitVariant = {};
    switch (outAnimationName) { 
        case "fadeOut":
            exitVariant = { opacity: 0, transition: outTransition };
            break;
        case "fadeOutUp":
            exitVariant = { opacity: 0, y: -50, transition: outTransition };
            break;
        case "fadeOutDown":
            exitVariant = { opacity: 0, y: 50, transition: outTransition };
            break;
        case "bounceOut": 
            // อาจจะเพิ่ม transition type เป็น spring เพื่อให้ bounce
            exitVariant = { opacity: 0, scale: 0.5, transition: outTransition }; 
            break;
        case "zoomOut":
            exitVariant = { opacity: 0, scale: 0.5, transition: outTransition };
            break;
        default:
            exitVariant = { opacity: 0, transition: outTransition };
            break;
    }

    // รวม In, Display และ Exit Variants
    return {
        initial: inVariants.initial,
        animate: inVariants.animate, // ใช้สำหรับสถานะ 'in'
        display: inVariants.display, // ใช้สำหรับสถานะ 'display'
        exit: exitVariant,          // ใช้สำหรับสถานะ 'out' (โดย AnimatePresence)
    };
};