import { LeadStatus, LeadSource, type LeadFilters } from '../../types';
import { HiOutlineSearch, HiOutlineSortDescending, HiOutlineSortAscending } from 'react-icons/hi';

interface LeadFiltersBarProps {
  filters: LeadFilters;
  onFilterChange: (filters: Partial<LeadFilters>) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const LeadFiltersBar = ({
  filters,
  onFilterChange,
  searchValue,
  onSearchChange,
}: LeadFiltersBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          id="lead-search"
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 text-sm bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
      </div>

      {/* Status Filter */}
      <select
        id="filter-status"
        value={filters.status || ''}
        onChange={(e) =>
          onFilterChange({ status: (e.target.value as LeadStatus) || undefined, page: 1 })
        }
        className="px-4 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 text-sm bg-white dark:bg-surface-800 text-surface-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-w-[140px]"
      >
        <option value="">All Status</option>
        {Object.values(LeadStatus).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Source Filter */}
      <select
        id="filter-source"
        value={filters.source || ''}
        onChange={(e) =>
          onFilterChange({ source: (e.target.value as LeadSource) || undefined, page: 1 })
        }
        className="px-4 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 text-sm bg-white dark:bg-surface-800 text-surface-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-w-[140px]"
      >
        <option value="">All Sources</option>
        {Object.values(LeadSource).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Sort Toggle */}
      <button
        id="sort-toggle"
        onClick={() =>
          onFilterChange({
            sortBy: filters.sortBy === 'oldest' ? 'latest' : 'oldest',
          })
        }
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 text-sm font-medium text-surface-700 dark:text-surface-300 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors whitespace-nowrap"
        title={filters.sortBy === 'oldest' ? 'Sort by Latest' : 'Sort by Oldest'}
      >
        {filters.sortBy === 'oldest' ? (
          <HiOutlineSortAscending className="w-4 h-4" />
        ) : (
          <HiOutlineSortDescending className="w-4 h-4" />
        )}
        {filters.sortBy === 'oldest' ? 'Oldest' : 'Latest'}
      </button>
    </div>
  );
};

export default LeadFiltersBar;
