import React, { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';

export default function ThaiDateTimeInput({ label, value, onChange }) {
  const [localValue, setLocalValue] = useState('');

  useEffect(() => {
    if (!value) {
      setLocalValue('');
      return;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      setLocalValue('');
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    setLocalValue(`${year}-${month}-${day}T${hours}:${minutes}`);
  }, [value]);

  const handleChange = (event) => {
    const nextValue = event.target.value;
    setLocalValue(nextValue);

    if (!nextValue) {
      onChange('');
      return;
    }

    const date = new Date(nextValue);
    if (Number.isNaN(date.getTime())) {
      onChange('');
      return;
    }

    onChange(date.toISOString().slice(0, 16));
  };

  const getThaiDisplay = () => {
    if (!localValue) return 'ยังไม่ได้เลือก';

    const date = new Date(localValue);
    if (Number.isNaN(date.getTime())) return 'วันที่ไม่ถูกต้อง';

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() + 543;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <input
        type="datetime-local"
        value={localValue}
        onChange={handleChange}
        className="w-full rounded-md border border-slate-700 bg-slate-800/80 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <p className="text-xs text-slate-400">{getThaiDisplay()}</p>
    </div>
  );
}
