import { useState, useEffect, type FormEvent } from 'react';
import { type Lead, LeadStatus, LeadSource, type CreateLeadData, type UpdateLeadData } from '../../types';
import { X, User, Mail, Tag, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeadFormProps {
  lead?: Lead | null;
  onSubmit: (data: CreateLeadData | UpdateLeadData) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

const LeadForm = ({ lead, onSubmit, onClose, isLoading = false }: LeadFormProps) => {
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState<LeadStatus>(LeadStatus.NEW);
  const [source, setSource] = useState<LeadSource>(LeadSource.WEBSITE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!lead;

  useEffect(() => {
    if (lead) { setName(lead.name); setEmail(lead.email); setStatus(lead.status); setSource(lead.source); }
  }, [lead]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    else if (name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Please enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    await onSubmit({ name: name.trim(), email: email.trim(), status, source });
  };

  // Inline style guarantees paddingLeft regardless of Tailwind purge
  const iconPad = { paddingLeft: '2.75rem' };
  const fieldClass = 'w-full pr-4 py-2.5 bg-white dark:bg-zinc-800/60 border text-zinc-900 dark:text-zinc-100 rounded-xl text-sm placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/60';
  const borderOk  = 'border-zinc-200 dark:border-zinc-700/50';
  const borderErr = 'border-red-300 dark:border-red-500/70';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800/60"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-zinc-800/60">
            <div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                {isEdit ? 'Edit Lead' : 'Add New Lead'}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {isEdit ? 'Update the details below' : 'Fill in the details to create a new lead'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              id="close-lead-form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Name */}
            <div>
              <label htmlFor="lead-name" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-red-400 normal-case">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input
                  id="lead-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter lead name"
                  style={iconPad}
                  className={`${fieldClass} ${errors.name ? borderErr : borderOk}`}
                />
              </div>
              {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="lead-email" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-red-400 normal-case">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                </div>
                <input
                  id="lead-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter lead email"
                  style={iconPad}
                  className={`${fieldClass} ${errors.email ? borderErr : borderOk}`}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Status + Source */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="lead-status" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Tag className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <select
                    id="lead-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LeadStatus)}
                    style={iconPad}
                    className={`${fieldClass} ${borderOk} cursor-pointer appearance-none`}
                  >
                    {Object.values(LeadStatus).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="lead-source" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Source <span className="text-red-400 normal-case">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Globe className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <select
                    id="lead-source"
                    value={source}
                    onChange={(e) => setSource(e.target.value as LeadSource)}
                    style={iconPad}
                    className={`${fieldClass} ${borderOk} cursor-pointer appearance-none`}
                  >
                    {Object.values(LeadSource).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                id="cancel-lead-form"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                }}
                id="submit-lead-form"
              >
                {isLoading ? 'Saving…' : isEdit ? 'Update Lead' : 'Create Lead'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LeadForm;
