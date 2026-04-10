import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';

export default function ThaiDateTimeInput({ label, value, onChange }) {
  const [localValue, setLocalValue] = useState('');

  // แปลงค่า ISO (UTC) ที่รับมาให้เป็นรูปแบบที่ datetime-local ใช้ได้
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        setLocalValue(`${year}-${month}-${day}T${hours}:${minutes}`);
      } else {
        setLocalValue('');
      }
    } else {
      setLocalValue('');
    }
  }, [value]);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setLocalValue(newVal);
    if (newVal) {
      const date = new Date(newVal);
      if (!isNaN(date.getTime())) {
        onChange(date.toISOString().slice(0, 16)); // เก็บเป็น UTC ISO string
      } else {
        onChange('');
      }
    } else {
      onChange('');
    }
  };

  // แสดงวันที่ในรูปแบบ พ.ศ. สำหรับข้อความช่วยเหลือ
  const getThaiDisplay = () => {
    if (!localValue) return 'ยังไม่ได้เลือก';
    const date = new Date(localValue);
    if (isNaN(date.getTime())) return 'วันที่ไม่ถูกต้อง';
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() + 543;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <input
        type="datetime-local"
        value={localValue}
        onChange={handleChange}
        className="w-full bg-slate-800/80 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <p className="text-xs text-slate-400">{getThaiDisplay()}</p>
    </div>
  );
}