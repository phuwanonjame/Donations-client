import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toThaiDate, fromThaiDate } from '../utils/donate-leaderboard';

export default function ThaiDateTimeInput({ label, value, onChange }) {
  const handleChange = (event) => {
    const converted = fromThaiDate(event.target.value);
    if (converted) onChange(converted);
  };

  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <Input
        key={value || 'empty'}
        type="text"
        placeholder="DD/MM/YYYY HH:MM"
        defaultValue={toThaiDate(value)}
        onChange={handleChange}
        className="bg-slate-800/80 border-slate-700 text-white font-mono"
      />
      <p className="text-xs text-slate-400">รูปแบบ: 31/12/2568 23:59</p>
    </div>
  );
}
