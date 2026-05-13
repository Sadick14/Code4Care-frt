import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportData {
  headers: string[];
  rows: string[][];
  filename: string;
  title: string;
}

function buildCSV(headers: string[], rows: string[][]): string {
  const escape = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadPDF(title: string, headers: string[], rows: string[][], filename: string) {
  const doc = new jsPDF({ orientation: headers.length > 5 ? 'landscape' : 'portrait' });
  doc.setFontSize(14);
  doc.text(title, 14, 14);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Exported ${new Date().toLocaleString('en-GB')} · ${rows.length} rows`, 14, 21);

  autoTable(doc, {
    startY: 26,
    head: [headers],
    body: rows,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [190, 50, 45], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  doc.save(filename);
}

export function exportCSV(data: ExportData) {
  downloadCSV(buildCSV(data.headers, data.rows), `${data.filename}-${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportPDF(data: ExportData) {
  downloadPDF(data.title, data.headers, data.rows, `${data.filename}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

interface ExportButtonProps {
  data: ExportData;
  onFetchAll?: () => Promise<ExportData>;
  disabled?: boolean;
}

export function ExportButton({ data, onFetchAll, disabled }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  async function handleAll(format: 'csv' | 'pdf') {
    if (!onFetchAll) return;
    setOpen(false);
    setExporting(true);
    try {
      const allData = await onFetchAll();
      if (format === 'csv') exportCSV(allData);
      else exportPDF(allData);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled || exporting || data.rows.length === 0}
        className="h-8 gap-1.5 text-xs border-[#E8ECFF]"
      >
        <Download className="w-3.5 h-3.5" />
        {exporting ? 'Exporting…' : 'Export'}
      </Button>

      {open && (
        <div className="absolute right-0 top-9 z-20 bg-white border border-[#E8ECFF] rounded-xl shadow-lg w-44 py-1 text-xs">
          <p className="px-3 py-1.5 text-gray-400 font-medium uppercase tracking-wide text-[10px]">
            {onFetchAll ? 'Current page' : 'Export as'}
          </p>
          <button
            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700"
            onClick={() => { exportCSV(data); setOpen(false); }}
          >
            CSV — {data.rows.length} rows
          </button>
          <button
            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700"
            onClick={() => { exportPDF(data); setOpen(false); }}
          >
            PDF — {data.rows.length} rows
          </button>
          {onFetchAll && (
            <>
              <div className="border-t border-gray-100 my-1" />
              <p className="px-3 py-1.5 text-gray-400 font-medium uppercase tracking-wide text-[10px]">All pages</p>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700" onClick={() => handleAll('csv')}>
                CSV — all entries
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700" onClick={() => handleAll('pdf')}>
                PDF — all entries
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
