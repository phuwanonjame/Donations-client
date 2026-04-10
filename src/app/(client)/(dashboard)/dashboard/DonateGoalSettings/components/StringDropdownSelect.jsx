// components/StringDropdownSelect.jsx
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StringDropdownSelect({ label, value, options, onChange }) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700">
          {options.map(opt => (
            <SelectItem key={opt} value={opt} className="text-white hover:bg-slate-700">
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}