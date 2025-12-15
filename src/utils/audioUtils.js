import { SOUND_SOURCES } from './audioSources';

/**
 * Plays the specified alert sound using the HTML Audio API.
 * * @param {string} soundKey - The key of the sound to play (e.g., "chime", "fanfare").
 * @param {number} volume - The playback volume (0 to 100, which will be converted to 0.0 to 1.0).
 */
export function playAlertSound(soundKey, volume) {
  const soundPath = SOUND_SOURCES[soundKey];
  
  // 1. ตรวจสอบว่ามี Sound Key นี้อยู่หรือไม่
  if (!soundPath) {
    console.error(`Sound source not found for key: ${soundKey}`);
    return;
  }

  try {
    // 2. สร้าง Audio object ใหม่
    // **NOTE:** เพื่อหลีกเลี่ยงการติดค้างของเสียงเก่า, ควรสร้าง instance ใหม่ทุกครั้ง
    const audio = new Audio(soundPath);
    
    // 3. ตั้งค่าระดับเสียง (Volume must be between 0.0 and 1.0)
    const playbackVolume = volume / 100;
    
    // Clamp volume to ensure it's within [0.0, 1.0]
    audio.volume = Math.min(1.0, Math.max(0.0, playbackVolume));

    // 4. เล่นเสียง
    audio.play()
      .catch(error => {
        // จัดการข้อผิดพลาด (เช่น Autoplay blocked by browser)
        console.warn(`Could not play sound (${soundKey}):`, error.message);
      });
      
  } catch (error) {
    console.error("Error creating or playing audio:", error);
  }
}