import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DropdownSelect({ label, value, options, onChange }) {
  return (
    <div className="space-y-2">
      {label && <Label className="text-slate-300">{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700">
          {options.map(opt => (
            <SelectItem key={opt.id} value={opt.id} className="text-white hover:bg-slate-700">
              {opt.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}