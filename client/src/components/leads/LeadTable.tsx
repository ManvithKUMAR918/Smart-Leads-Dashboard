import { type Lead, UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { getStatusColor, getSourceColor, formatDate, getInitials } from '../../utils/helpers';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
}

const SkeletonRow = () => (
  <tr className="border-b border-surface-100 dark:border-surface-800">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div className="skeleton h-4 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
      </td>
    ))}
  </tr>
);

const LeadTable = ({ leads, isLoading, onEdit, onDelete, onView }: LeadTableProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-surface-200 dark:border-surface-700/50 bg-white dark:bg-surface-900">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-200 dark:border-surface-700/50 bg-surface-50 dark:bg-surface-800/50">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden sm:table-cell">Email</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden md:table-cell">Source</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden lg:table-cell">Created</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
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

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700/50">
        <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
          <HiOutlineEye className="w-8 h-8 text-surface-400" />
        </div>
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">No leads found</h3>
        <p className="text-sm text-surface-500 dark:text-surface-400 text-center max-w-sm">
          Try adjusting your filters or search criteria, or create a new lead to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-surface-200 dark:border-surface-700/50 bg-white dark:bg-surface-900">
      <table className="w-full" id="leads-table">
        <thead>
          <tr className="border-b border-surface-200 dark:border-surface-700/50 bg-surface-50 dark:bg-surface-800/50">
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Name</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden sm:table-cell">Email</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden md:table-cell">Source</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden lg:table-cell">Created</th>
            <th className="text-right px-5 py-3.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr
              key={lead._id}
              className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Name + Avatar */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                    {getInitials(lead.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">{lead.name}</p>
                    <p className="text-xs text-surface-400 sm:hidden truncate">{lead.email}</p>
                  </div>
                </div>
              </td>

              {/* Email */}
              <td className="px-5 py-4 hidden sm:table-cell">
                <p className="text-sm text-surface-600 dark:text-surface-300 truncate max-w-[200px]">{lead.email}</p>
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
              </td>

              {/* Source */}
              <td className="px-5 py-4 hidden md:table-cell">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${getSourceColor(lead.source)}`}>
                  {lead.source}
                </span>
              </td>

              {/* Created At */}
              <td className="px-5 py-4 hidden lg:table-cell">
                <p className="text-sm text-surface-500 dark:text-surface-400">{formatDate(lead.createdAt)}</p>
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onView(lead)}
                    className="p-2 rounded-lg text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    title="View Lead"
                    id={`view-lead-${lead._id}`}
                  >
                    <HiOutlineEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-2 rounded-lg text-surface-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                    title="Edit Lead"
                    id={`edit-lead-${lead._id}`}
                  >
                    <HiOutlinePencil className="w-4 h-4" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => onDelete(lead)}
                      className="p-2 rounded-lg text-surface-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete Lead"
                      id={`delete-lead-${lead._id}`}
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
