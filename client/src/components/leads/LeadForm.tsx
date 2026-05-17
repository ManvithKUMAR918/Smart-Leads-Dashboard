import { useState, useEffect, type FormEvent } from 'react';
import { type Lead, LeadStatus, LeadSource, type CreateLeadData, type UpdateLeadData } from '../../types';
import { HiOutlineX } from 'react-icons/hi';

interface LeadFormProps {
  lead?: Lead | null;
  onSubmit: (data: CreateLeadData | UpdateLeadData) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

const LeadForm = ({ lead, onSubmit, onClose, isLoading = false }: LeadFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<LeadStatus>(LeadStatus.NEW);
  const [source, setSource] = useState<LeadSource>(LeadSource.WEBSITE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = !!lead;

  useEffect(() => {
    if (lead) {
      setName(lead.name);
      setEmail(lead.email);
      setStatus(lead.status);
      setSource(lead.source);
    }
  }, [lead]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      status,
      source,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700/50 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700/50">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">
            {isEdit ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            id="close-lead-form"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Field */}
          <div>
            <label htmlFor="lead-name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter lead name"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                errors.name ? 'border-red-300 dark:border-red-700' : 'border-surface-300 dark:border-surface-600'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="lead-email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter lead email"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                errors.email ? 'border-red-300 dark:border-red-700' : 'border-surface-300 dark:border-surface-600'
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Status & Source Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lead-status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Status
              </label>
              <select
                id="lead-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 text-sm bg-white dark:bg-surface-800 text-surface-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {Object.values(LeadStatus).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="lead-source" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Source <span className="text-red-500">*</span>
              </label>
              <select
                id="lead-source"
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 text-sm bg-white dark:bg-surface-800 text-surface-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {Object.values(LeadSource).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
              id="cancel-lead-form"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/25"
              id="submit-lead-form"
            >
              {isLoading ? 'Saving...' : isEdit ? 'Update Lead' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
