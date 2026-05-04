'use client';
// components/export-button.tsx
import { Download } from 'lucide-react';

interface Props {
  onClick: () => void;
  label?: string;
}

export default function ExportButton({ onClick, label = 'Exportar CSV' }: Props) {
  return (
    <button onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-zinc-800 text-zinc-500 hover:text-amber-500 hover:border-amber-600/50 transition-colors">
      <Download size={12} strokeWidth={1.5} />
      {label}
    </button>
  );
}
