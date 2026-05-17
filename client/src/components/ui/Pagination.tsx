import { type PaginationMeta } from '../../types';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { page, totalPages, total, limit, hasNextPage, hasPrevPage } = pagination;
  if (totalPages <= 1) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      const s = Math.max(2, page - 1);
      const e = Math.min(totalPages - 1, page + 1);
      for (let i = s; i <= e; i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2" id="pagination-controls">
      <p className="text-sm text-surface-500 dark:text-surface-400">
        Showing <span className="font-semibold text-surface-700 dark:text-surface-300">{startItem}-{endItem}</span> of{' '}
        <span className="font-semibold text-surface-700 dark:text-surface-300">{total}</span> leads
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={!hasPrevPage}
          className="p-2 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors" id="prev-page">
          <HiOutlineChevronLeft className="w-4 h-4" />
        </button>
        {getPageNumbers().map((p, i) =>
          typeof p === 'string' ? (
            <span key={`e-${i}`} className="px-1 text-surface-400 text-sm">{p}</span>
          ) : (
            <button key={p} onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${p === page ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25' : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'}`}
              id={`page-${p}`}>{p}</button>
          )
        )}
        <button onClick={() => onPageChange(page + 1)} disabled={!hasNextPage}
          className="p-2 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors" id="next-page">
          <HiOutlineChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
