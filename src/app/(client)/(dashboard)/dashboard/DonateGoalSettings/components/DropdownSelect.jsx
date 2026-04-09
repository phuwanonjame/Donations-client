// components/DropdownSelect.jsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DropdownSelect({ label, value, options, onChange }) {
  // รองรับทั้ง string[] และ { id, name }[]
  const normalizedOptions = React.useMemo(() => {
    if (!options || options.length === 0) return [];
    if (typeof options[0] === 'string') {
      return options.map(opt => ({ value: opt, label: opt }));
    }
    return options.map(opt => ({
      value: opt.id,
      label: opt.name,
    }));
  }, [options]);

  return (
    <div className="space-y-2">
      {label && <Label className="text-slate-300">{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
          <SelectValue placeholder="เลือก..." />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-60">
          {normalizedOptions.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}