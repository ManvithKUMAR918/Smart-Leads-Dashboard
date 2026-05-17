import { useState, useEffect, useCallback } from 'react';
import { leadsApi } from '../api/leads';
import { type Lead, type LeadFilters, type PaginationMeta, type CreateLeadData, type UpdateLeadData } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { downloadCSV, buildExportFilename } from '../utils/helpers';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import LeadFiltersBar from '../components/leads/LeadFiltersBar';
import LeadDetailModal from '../components/leads/LeadDetailModal';
import Pagination from '../components/ui/Pagination';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import toast from 'react-hot-toast';
import { Plus, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false,
  });
  const [filters, setFilters] = useState<LeadFilters>({ page: 1, limit: 10, sortBy: 'latest' });
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 300);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await leadsApi.getAll({ ...filters, search: debouncedSearch || undefined });
      setLeads(response.data?.leads || []);
      if (response.pagination) setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { setFilters((prev) => ({ ...prev, page: 1 })); }, [debouncedSearch]);

  const handleFilterChange = (partial: Partial<LeadFilters>) => setFilters((prev) => ({ ...prev, ...partial }));
  const handlePageChange = (page: number) => setFilters((prev) => ({ ...prev, page }));

  const handleCreate = async (data: CreateLeadData | UpdateLeadData) => {
    setIsSubmitting(true);
    try { await leadsApi.create(data as CreateLeadData); toast.success('Lead created successfully'); setShowForm(false); fetchLeads(); }
    catch { toast.error('Failed to create lead'); }
    finally { setIsSubmitting(false); }
  };

  const handleUpdate = async (data: CreateLeadData | UpdateLeadData) => {
    if (!editingLead) return;
    setIsSubmitting(true);
    try { await leadsApi.update(editingLead._id, data as UpdateLeadData); toast.success('Lead updated successfully'); setEditingLead(null); fetchLeads(); }
    catch { toast.error('Failed to update lead'); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deletingLead) return;
    setIsSubmitting(true);
    try { await leadsApi.delete(deletingLead._id); toast.success('Lead deleted successfully'); setDeletingLead(null); fetchLeads(); }
    catch { toast.error('Failed to delete lead'); }
    finally { setIsSubmitting(false); }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const blob = await leadsApi.exportCSV({ status: filters.status || undefined, source: filters.source || undefined, search: debouncedSearch || undefined, sortBy: filters.sortBy });
      downloadCSV(blob, buildExportFilename(filters));
      toast.success('CSV exported successfully');
    } catch { toast.error('Failed to export CSV'); }
    finally { setIsExporting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Leads</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 text-sm">Manage and track all your leads in one place</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            id="export-csv-btn"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-all duration-200 disabled:opacity-50 whitespace-nowrap"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{isExporting ? 'Exporting…' : 'Export CSV'}</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            id="add-lead-btn"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}
          >
            <Plus className="w-4 h-4 shrink-0" />
            Add Lead
          </button>
        </div>
      </div>

      <LeadFiltersBar filters={filters} onFilterChange={handleFilterChange} searchValue={searchValue} onSearchChange={setSearchValue} />
      <LeadTable leads={leads} isLoading={isLoading} onEdit={(lead) => setEditingLead(lead)} onDelete={(lead) => setDeletingLead(lead)} onView={(lead) => setViewingLead(lead)} />
      <Pagination pagination={pagination} onPageChange={handlePageChange} />

      {showForm && <LeadForm onSubmit={handleCreate} onClose={() => setShowForm(false)} isLoading={isSubmitting} />}
      {editingLead && <LeadForm lead={editingLead} onSubmit={handleUpdate} onClose={() => setEditingLead(null)} isLoading={isSubmitting} />}
      {viewingLead && <LeadDetailModal lead={viewingLead} onClose={() => setViewingLead(null)} />}
      {deletingLead && <ConfirmDialog title="Delete Lead" message={`Are you sure you want to delete "${deletingLead.name}"? This action cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeletingLead(null)} isLoading={isSubmitting} />}
    </motion.div>
  );
};

export default LeadsPage;
