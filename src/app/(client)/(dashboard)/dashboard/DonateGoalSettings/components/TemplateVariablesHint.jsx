// components/TemplateVariablesHint.jsx
import React from 'react';

export default function TemplateVariablesHint({ variables }) {
  if (!variables || variables.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {variables.map(v => (
        <span key={v} className="text-xs rounded-full border border-white/10 px-3 py-1 text-slate-400">
          {v}
        </span>
      ))}
    </div>
  );
}