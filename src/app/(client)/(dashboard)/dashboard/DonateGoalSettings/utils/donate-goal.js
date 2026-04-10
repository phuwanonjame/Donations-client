/**
 * แปลงวันที่จาก ค.ศ. เป็น พ.ศ. สำหรับแสดงผล
 * @param {string} dateString - YYYY-MM-DDTHH:mm
 * @returns {string} - วันที่ในรูปแบบ DD/MM/YYYY HH:MM
 */
export const toThaiDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear() + 543;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * แปลงวันที่จาก พ.ศ. เป็น ค.ศ. สำหรับเก็บในระบบ
 * @param {string} thaiDateString - DD/MM/YYYY HH:MM
 * @returns {string} - YYYY-MM-DDTHH:mm
 */
export const fromThaiDate = (thaiDateString) => {
  if (!thaiDateString) return '';
  const parts = thaiDateString.trim().split(' ');
  const datePart = parts[0];
  const timePart = parts[1] || '00:00';
  const [day, month, thaiYear] = datePart.split('/');
  if (!day || !month || !thaiYear) return '';
  const year = parseInt(thaiYear) - 543;
  const paddedMonth = month.toString().padStart(2, '0');
  const paddedDay = day.toString().padStart(2, '0');
  return `${year}-${paddedMonth}-${paddedDay}T${timePart}`;
};

/**
 * แก้ไขข้อความ template ด้วยค่าต่างๆ
 * @param {string} tpl - เทมเพลตข้อความ
 * @param {Object} data - ข้อมูลที่ใช้แทนที่
 * @returns {string}
 */
export const resolveText = (tpl, data) => {
  if (!tpl) return '';
  
  return tpl
    .replace(/{{amount}}/g, data.amount?.toString() || '0')
    .replace(/{{goal}}/g, data.goal?.toString() || '0')
    .replace(/{{percentage}}/g, data.percentage?.toFixed(1) || '0')
    .replace(/{{days}}/g, data.days?.toString() || '0');
};

/**
 * คำนวณเปอร์เซ็นต์ความสำเร็จ
 * @param {number} current - ยอดปัจจุบัน
 * @param {number} goal - เป้าหมาย
 * @returns {number}
 */
export const calculatePercentage = (current, goal) => {
  if (!goal || goal <= 0) return 0;
  return Math.min((current / goal) * 100, 100);
};

/**
 * แปลง settings เป็น metadata สำหรับ API
 * @param {Object} s - settings object
 * @returns {Object}
 */
export const toMetadata = (s) => ({
  type: 'GOAL',
  metadata: {
    type: s.type,
    goal: {
      name: s.goalName,
      amount: s.goalAmount,
      showAmount: s.showGoalAmount,
      fontFamily: s.goalFontFamily,
      fontWeight: s.goalFontWeight,
      fontSize: parseInt(s.goalFontSize),
      color: s.goalColor,
      strokeWidth: parseFloat(s.goalStrokeWidth),
      strokeColor: s.goalStrokeColor,
    },
    progress: {
      text: s.progressText,
      color: s.progressColor,
      fontFamily: s.progressFontFamily,
      shine: s.progressShine,
      largeTopFontSize: parseInt(s.largeTopFontSize),
      largeBottomFontSize: parseInt(s.largeBottomFontSize),
      largeTopRightText: s.largeTopRightText,
      largeBottomLeftText: s.largeBottomLeftText,
      largeBottomRightText: s.largeBottomRightText,
    },
    description: {
      leftText: s.descriptionLeftText,
      rightText: s.descriptionRightText,
      fontFamily: s.descriptionFontFamily,
      fontWeight: s.descriptionFontWeight,
      fontSize: parseInt(s.descriptionFontSize),
      color: s.descriptionColor,
      strokeWidth: parseFloat(s.descriptionStrokeWidth),
      strokeColor: s.descriptionStrokeColor,
    },
    isUseStartAt: s.isUseStartAt,
    startAt: new Date(s.startAt).getTime(),
    isUseEndAt: s.isUseEndAt,
    endAt: new Date(s.endAt).getTime(),
  },
});

/**
 * รีเซ็ตวันที่เริ่มต้นและสิ้นสุดเป็น 30 วัน
 * @returns {Object}
 */
export const getResetDates = () => {
  const now = new Date();
  const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return {
    startAt: now.toISOString().slice(0, 16),
    endAt: end.toISOString().slice(0, 16),
  };
};

/**
 * คำนวณจำนวนวันที่เหลือ
 * @param {string} endDate - วันที่สิ้นสุด
 * @param {boolean} isUseEndAt - ใช้การสิ้นสุดหรือไม่
 * @returns {number}
 */
export const calculateDaysRemaining = (endDate, isUseEndAt) => {
  if (!isUseEndAt) return 0;
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};