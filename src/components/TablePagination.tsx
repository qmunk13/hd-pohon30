import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalItems,
  pageSize = 12,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems <= pageSize) {
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/40 border-t border-slate-800/80 text-xs text-slate-400">
        <div>
          Menampilkan <span className="font-bold text-white">1 - {totalItems}</span> dari{' '}
          <span className="font-bold text-white">{totalItems}</span> data
        </div>
        <div className="text-[11px] text-slate-500 font-mono">Halaman 1 dari 1 (12 item / hal)</div>
      </div>
    );
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-950/60 border-t border-slate-800/80 text-xs text-slate-400">
      <div>
        Menampilkan <span className="font-bold text-white">{startItem} - {endItem}</span> dari{' '}
        <span className="font-bold text-white">{totalItems}</span> data
        <span className="text-slate-600 ml-2 font-mono">(12 item / hal)</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
          title="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span key={'ellipsis-' + idx} className="px-2 text-slate-600 font-mono">
                ...
              </span>
            );
          }
          const pageNum = p as number;
          const isCurrent = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center ${
                isCurrent
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
          title="Halaman Selanjutnya"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
