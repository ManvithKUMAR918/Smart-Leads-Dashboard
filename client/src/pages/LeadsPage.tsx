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
import { HiOutlinePlus, HiOutlineDownload } from 'react-icons/hi';

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false,
  });
  const [filters, setFilters] = useState<LeadFilters>({
    page: 1, limit: 10, sortBy: 'latest',
  });
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 300);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await leadsApi.getAll({
        ...filters,
        search: debouncedSearch || undefined,
      });
      setLeads(response.data?.leads || []);
      if (response.pagination) setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch]);

  const handleFilterChange = (partial: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleCreate = async (data: CreateLeadData | UpdateLeadData) => {
    setIsSubmitting(true);
    try {
      await leadsApi.create(data as CreateLeadData);
      toast.success('Lead created successfully');
      setShowForm(false);
      fetchLeads();
    } catch {
      toast.error('Failed to create lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: CreateLeadData | UpdateLeadData) => {
    if (!editingLead) return;
    setIsSubmitting(true);
    try {
      await leadsApi.update(editingLead._id, data as UpdateLeadData);
      toast.success('Lead updated successfully');
      setEditingLead(null);
      fetchLeads();
    } catch {
      toast.error('Failed to update lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingLead) return;
    setIsSubmitting(true);
    try {
      await leadsApi.delete(deletingLead._id);
      toast.success('Lead deleted successfully');
      setDeletingLead(null);
      fetchLeads();
    } catch {
      toast.error('Failed to delete lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const blob = await leadsApi.exportCSV({
        status: filters.status || undefined,
        source: filters.source || undefined,
        search: debouncedSearch || undefined,
        sortBy: filters.sortBy,
      });
      downloadCSV(blob, buildExportFilename(filters));
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Leads</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-0.5 text-sm">
            Manage and track all your leads in one place
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} disabled={isExporting} id="export-csv-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 text-sm font-medium text-surface-700 dark:text-surface-300 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors disabled:opacity-50">
            <HiOutlineDownload className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button onClick={() => setShowForm(true)} id="add-lead-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-lg shadow-primary-600/25">
            <HiOutlinePlus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <LeadFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      {/* Table */}
      <LeadTable
        leads={leads}
        isLoading={isLoading}
        onEdit={(lead) => setEditingLead(lead)}
        onDelete={(lead) => setDeletingLead(lead)}
        onView={(lead) => setViewingLead(lead)}
      />

      {/* Pagination */}
      <Pagination pagination={pagination} onPageChange={handlePageChange} />

      {/* Create Modal */}
      {showForm && (
        <LeadForm onSubmit={handleCreate} onClose={() => setShowForm(false)} isLoading={isSubmitting} />
      )}

      {/* Edit Modal */}
      {editingLead && (
        <LeadForm lead={editingLead} onSubmit={handleUpdate} onClose={() => setEditingLead(null)} isLoading={isSubmitting} />
      )}

      {/* Detail Modal */}
      {viewingLead && (
        <LeadDetailModal lead={viewingLead} onClose={() => setViewingLead(null)} />
      )}

      {/* Delete Confirmation */}
      {deletingLead && (
        <ConfirmDialog
          title="Delete Lead"
          message={`Are you sure you want to delete "${deletingLead.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingLead(null)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default LeadsPage;
