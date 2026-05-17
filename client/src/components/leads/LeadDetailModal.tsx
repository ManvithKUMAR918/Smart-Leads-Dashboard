import { type Lead } from '../../types';
import { getStatusColor, getSourceColor, formatDateTime, getInitials } from '../../utils/helpers';
import { HiOutlineX, HiOutlineMail, HiOutlineUser, HiOutlineCalendar, HiOutlineGlobe, HiOutlineTag } from 'react-icons/hi';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
}

const LeadDetailModal = ({ lead, onClose }: LeadDetailModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700/50 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700/50">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">Lead Details</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" id="close-lead-detail">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-primary-500/25">
              {getInitials(lead.name)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-surface-900 dark:text-white">{lead.name}</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400">{lead.email}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-4">
            <DetailRow icon={<HiOutlineMail className="w-4 h-4" />} label="Email" value={lead.email} />
            <DetailRow icon={<HiOutlineTag className="w-4 h-4" />} label="Status" value={
              <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusColor(lead.status)}`}>{lead.status}</span>
            } />
            <DetailRow icon={<HiOutlineGlobe className="w-4 h-4" />} label="Source" value={
              <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${getSourceColor(lead.source)}`}>{lead.source}</span>
            } />
            <DetailRow icon={<HiOutlineUser className="w-4 h-4" />} label="Created By" value={lead.createdBy?.name || 'N/A'} />
            <DetailRow icon={<HiOutlineCalendar className="w-4 h-4" />} label="Created At" value={formatDateTime(lead.createdAt)} />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="flex items-center gap-3 py-2 border-b border-surface-100 dark:border-surface-800 last:border-0">
    <div className="text-surface-400">{icon}</div>
    <div className="flex-1">
      <p className="text-xs text-surface-400 dark:text-surface-500 mb-0.5">{label}</p>
      <div className="text-sm font-medium text-surface-800 dark:text-surface-200">{value}</div>
    </div>
  </div>
);

export default LeadDetailModal;
