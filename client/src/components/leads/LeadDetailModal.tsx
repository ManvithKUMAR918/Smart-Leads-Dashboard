import { type Lead } from '../../types';
import { formatDateTime, getInitials } from '../../utils/helpers';
import Badge, { statusVariant, sourceVariant } from '../ui/Badge';
import { X, Mail, User, Calendar, Globe, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
}

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800/40 last:border-0">
    <div className="text-zinc-400 dark:text-zinc-500">{icon}</div>
    <div className="flex-1">
      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mb-0.5 uppercase tracking-wider font-medium">{label}</p>
      <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{value}</div>
    </div>
  </div>
);

const LeadDetailModal = ({ lead, onClose }: LeadDetailModalProps) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.2 }} className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800/60">
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-zinc-800/60">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Lead Details</h2>
            <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors" id="close-lead-detail"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-500/25">
                {getInitials(lead.name)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{lead.name}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{lead.email}</p>
              </div>
            </div>
            <div className="space-y-1">
              <DetailRow icon={<Mail className="w-4 h-4" />} label="Email" value={lead.email} />
              <DetailRow icon={<Tag className="w-4 h-4" />} label="Status" value={<Badge variant={statusVariant(lead.status)} dot>{lead.status}</Badge>} />
              <DetailRow icon={<Globe className="w-4 h-4" />} label="Source" value={<Badge variant={sourceVariant(lead.source)}>{lead.source}</Badge>} />
              <DetailRow icon={<User className="w-4 h-4" />} label="Created By" value={lead.createdBy?.name || 'N/A'} />
              <DetailRow icon={<Calendar className="w-4 h-4" />} label="Created At" value={formatDateTime(lead.createdAt)} />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LeadDetailModal;
