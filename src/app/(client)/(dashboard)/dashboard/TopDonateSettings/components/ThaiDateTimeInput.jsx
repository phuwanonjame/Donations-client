import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toThaiDate, fromThaiDate } from '../utils/top-donate';

export default function ThaiDateTimeInput({ label, value, onChange }) {
  const thaiValue = value ? toThaiDate(value) : '';

  const handleChange = (e) => {
    const newThaiValue = e.target.value;
    const converted = fromThaiDate(newThaiValue);
    if (converted) onChange(converted);
  };

  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <Input
        type="text"
        placeholder="DD/MM/YYYY HH:MM"
        value={thaiValue}
        onChange={handleChange}
        className="bg-slate-800/80 border-slate-700 text-white font-mono"
      />
      <p className="text-xs text-slate-400">รูปแบบ: 31/12/2568 23:59</p>
    </div>
  );
}
