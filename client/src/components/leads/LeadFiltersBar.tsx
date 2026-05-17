import { LeadStatus, LeadSource, type LeadFilters } from '../../types';
import { Search, ArrowUpDown, Tag, Globe } from 'lucide-react';

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
    <div className="flex flex-col gap-3" id="lead-filters-bar">

      {/* ── Row 1: Search (full width) ───────────────────── */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-zinc-400" />
        </div>
        <input
          id="lead-search"
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          style={{ paddingLeft: '2.25rem' }}
          className="w-full pr-4 py-2.5 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60"
        />
      </div>

      {/* ── Row 2: Status · Source · Sort ────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">

        {/* Status */}
        <div className="relative flex items-center flex-1 min-w-[130px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Tag className="w-4 h-4 text-zinc-400" />
          </div>
          <select
            id="filter-status"
            value={filters.status || ''}
            onChange={(e) =>
              onFilterChange({ status: (e.target.value as LeadStatus) || undefined, page: 1 })
            }
            style={{ paddingLeft: '2.25rem' }}
            className="w-full py-2.5 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 cursor-pointer appearance-none"
          >
            <option value="">All Status</option>
            {Object.values(LeadStatus).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Source */}
        <div className="relative flex items-center flex-1 min-w-[130px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Globe className="w-4 h-4 text-zinc-400" />
          </div>
          <select
            id="filter-source"
            value={filters.source || ''}
            onChange={(e) =>
              onFilterChange({ source: (e.target.value as LeadSource) || undefined, page: 1 })
            }
            style={{ paddingLeft: '2.25rem' }}
            className="w-full py-2.5 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 cursor-pointer appearance-none"
          >
            <option value="">All Sources</option>
            {Object.values(LeadSource).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <button
          id="sort-toggle"
          onClick={() =>
            onFilterChange({ sortBy: filters.sortBy === 'oldest' ? 'latest' : 'oldest' })
          }
          className="flex items-center gap-2 px-3.5 py-2.5 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer"
          title={filters.sortBy === 'oldest' ? 'Sort by Latest' : 'Sort by Oldest'}
        >
          <ArrowUpDown className="w-4 h-4" />
          {filters.sortBy === 'oldest' ? 'Oldest' : 'Latest'}
        </button>
      </div>
    </div>
  );
};

export default LeadFiltersBar;
