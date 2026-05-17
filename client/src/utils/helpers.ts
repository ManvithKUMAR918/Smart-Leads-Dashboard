import { type Lead, type LeadFilters } from '../types';

export const downloadCSV = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'New':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'Contacted':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'Qualified':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'Lost':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
  }
};

export const getSourceColor = (source: string): string => {
  switch (source) {
    case 'Website':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'Instagram':
      return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
    case 'Referral':
      return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const buildExportFilename = (filters: LeadFilters): string => {
  const parts = ['leads'];
  if (filters.status) parts.push(filters.status.toLowerCase());
  if (filters.source) parts.push(filters.source.toLowerCase());
  parts.push(new Date().toISOString().split('T')[0]);
  return parts.join('-') + '.csv';
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  return /^\S+@\S+\.\S+$/.test(email);
};

// Get summary stats from leads
export const getLeadStats = (leads: Lead[]) => {
  return {
    total: leads.length,
    new: leads.filter((l) => l.status === 'New').length,
    contacted: leads.filter((l) => l.status === 'Contacted').length,
    qualified: leads.filter((l) => l.status === 'Qualified').length,
    lost: leads.filter((l) => l.status === 'Lost').length,
  };
};
