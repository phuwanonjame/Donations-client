import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toThaiDate, fromThaiDate } from '../utils/donate-leaderboard';

export default function ThaiDateTimeInput({ label, value, onChange }) {
  const [thaiValue, setThaiValue] = useState('');

  useEffect(() => {
    if (value) {
      setThaiValue(toThaiDate(value));
    } else {
      setThaiValue('');
    }
  }, [value]);

  const handleChange = (e) => {
    const newThaiValue = e.target.value;
    setThaiValue(newThaiValue);
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