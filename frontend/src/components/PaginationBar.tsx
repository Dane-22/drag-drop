import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 15, 25, 50]
}) => {
  if (totalRecords === 0) return null;

  const validTotalPages = Math.max(1, totalPages);
  const validCurrentPage = Math.min(Math.max(1, currentPage), validTotalPages);

  const startRecord = (validCurrentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(validCurrentPage * itemsPerPage, totalRecords);

  // Generate page numbers to render
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, validCurrentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > validTotalPages) {
      end = validTotalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="bg-white border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs select-none rounded-b-2xl">
      {/* Record Counter Summary */}
      <div className="text-slate-500 font-semibold flex items-center gap-2">
        <span>
          Showing <strong className="text-slate-900 font-bold">{startRecord}</strong> to{' '}
          <strong className="text-slate-900 font-bold">{endRecord}</strong> of{' '}
          <strong className="text-slate-900 font-bold">{totalRecords}</strong> records
        </span>

        {/* Per-Page Selector */}
        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 ml-3 border-l border-slate-200 pl-3">
            <span className="text-slate-400 font-medium">Rows:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brandOrange-500 cursor-pointer"
            >
              {itemsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={validCurrentPage === 1}
          title="First Page"
          className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronsLeft className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>

        {/* Prev Page */}
        <button
          onClick={() => onPageChange(validCurrentPage - 1)}
          disabled={validCurrentPage === 1}
          title="Previous Page"
          className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>

        {/* Numeric Page Buttons */}
        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`min-w-[32px] h-8 px-2.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
              num === validCurrentPage
                ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-500/30 font-black'
                : 'bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold'
            }`}
          >
            {num}
          </button>
        ))}

        {/* Next Page */}
        <button
          onClick={() => onPageChange(validCurrentPage + 1)}
          disabled={validCurrentPage === validTotalPages}
          title="Next Page"
          className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(validTotalPages)}
          disabled={validCurrentPage === validTotalPages}
          title="Last Page"
          className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronsRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
