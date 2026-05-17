import { type Lead, UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate, getInitials } from '../../utils/helpers';
import Badge, { statusVariant, sourceVariant } from '../ui/Badge';
import { Pencil, Trash2, Eye, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
}

/* ─── Skeleton Row ────────────────────────────────────── */
const SkeletonRow = () => (
  <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div
          className="skeleton h-4 rounded"
          style={{ width: `${55 + Math.random() * 35}%` }}
        />
      </td>
    ))}
  </tr>
);

/* ─── Table Header ────────────────────────────────────── */
const TH = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <th
    className={`text-left px-5 py-3.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider ${className}`}
  >
    {children}
  </th>
);

const LeadTable = ({ leads, isLoading, onEdit, onDelete, onView }: LeadTableProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  /* ── Loading State ──────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800/60 bg-zinc-50/80 dark:bg-zinc-900/80">
              <TH>Name</TH>
              <TH className="hidden sm:table-cell">Email</TH>
              <TH>Status</TH>
              <TH className="hidden md:table-cell">Source</TH>
              <TH className="hidden lg:table-cell">Created</TH>
              <TH className="text-right!">Actions</TH>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* ── Empty State ────────────────────────────────────── */
  if (leads.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center py-24 px-6 bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800/60"
      >
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 flex items-center justify-center mb-5">
          <Inbox className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1.5">
          No leads found
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm leading-relaxed">
          Try adjusting your filters or search criteria, or create a new lead to get started.
        </p>
      </motion.div>
    );
  }

  /* ── Data Table ─────────────────────────────────────── */
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50">
      <table className="w-full" id="leads-table">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800/60 bg-zinc-50/80 dark:bg-zinc-900/80">
            <TH>Name</TH>
            <TH className="hidden sm:table-cell">Email</TH>
            <TH>Status</TH>
            <TH className="hidden md:table-cell">Source</TH>
            <TH className="hidden lg:table-cell">Created</TH>
            <TH className="text-right!">Actions</TH>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <motion.tr
              key={lead._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03, ease: 'easeOut' }}
              className="border-b border-zinc-100 dark:border-zinc-800/40 hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors duration-150 group"
            >
              {/* Name + Avatar */}
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-sm shadow-indigo-500/20">
                    {getInitials(lead.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {lead.name}
                    </p>
                    <p className="text-xs text-zinc-400 sm:hidden truncate">{lead.email}</p>
                  </div>
                </div>
              </td>

              {/* Email */}
              <td className="px-5 py-3.5 hidden sm:table-cell">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate max-w-[200px]">
                  {lead.email}
                </p>
              </td>

              {/* Status */}
              <td className="px-5 py-3.5">
                <Badge variant={statusVariant(lead.status)} dot>
                  {lead.status}
                </Badge>
              </td>

              {/* Source */}
              <td className="px-5 py-3.5 hidden md:table-cell">
                <Badge variant={sourceVariant(lead.source)}>{lead.source}</Badge>
              </td>

              {/* Created At */}
              <td className="px-5 py-3.5 hidden lg:table-cell">
                <p className="text-sm text-zinc-500 dark:text-zinc-500">
                  {formatDate(lead.createdAt)}
                </p>
              </td>

              {/* Actions */}
              <td className="px-5 py-3.5">
                <div className="flex items-center justify-end gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={() => onView(lead)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors duration-150"
                    title="View Lead"
                    id={`view-lead-${lead._id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors duration-150"
                    title="Edit Lead"
                    id={`edit-lead-${lead._id}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => onDelete(lead)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-150"
                      title="Delete Lead"
                      id={`delete-lead-${lead._id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
