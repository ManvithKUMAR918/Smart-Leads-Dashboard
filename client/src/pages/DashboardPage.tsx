import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { leadsApi } from '../api/leads';
import { type Lead, type PaginationMeta } from '../types';
import { Users, UserPlus, CheckCircle2, XCircle } from 'lucide-react';
import Badge, { statusVariant } from '../components/ui/Badge';
import { getInitials, formatDate } from '../utils/helpers';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface StatCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  iconColor: string;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, new: 0, qualified: 0, lost: 0 });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [allRes, recentRes] = await Promise.all([
          leadsApi.getAll({ page: 1, limit: 100, sortBy: 'latest' }),
          leadsApi.getAll({ page: 1, limit: 5, sortBy: 'latest' }),
        ]);
        const leads = allRes.data?.leads || [];
        const pagination = allRes.pagination as PaginationMeta | undefined;
        setStats({
          total: pagination?.total || leads.length,
          new: leads.filter((l) => l.status === 'New').length,
          qualified: leads.filter((l) => l.status === 'Qualified').length,
          lost: leads.filter((l) => l.status === 'Lost').length,
        });
        setRecentLeads(recentRes.data?.leads || []);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const statCards: StatCard[] = [
    { label: 'Total Leads', value: stats.total, icon: <Users className="w-5 h-5" />, gradient: 'from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/15 dark:to-violet-500/15', iconColor: 'text-indigo-500' },
    { label: 'New Leads', value: stats.new, icon: <UserPlus className="w-5 h-5" />, gradient: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-500/15 dark:to-cyan-500/15', iconColor: 'text-blue-500' },
    { label: 'Qualified', value: stats.qualified, icon: <CheckCircle2 className="w-5 h-5" />, gradient: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/15 dark:to-teal-500/15', iconColor: 'text-emerald-500' },
    { label: 'Lost', value: stats.lost, icon: <XCircle className="w-5 h-5" />, gradient: 'from-red-500/10 to-rose-500/10 dark:from-red-500/15 dark:to-rose-500/15', iconColor: 'text-red-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
          Here's what's happening with your leads today.
        </p>
      </div>

      {/* ── Stats Grid ───────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
          Overview
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08, ease: 'easeOut' }}
              className={`bg-gradient-to-br ${card.gradient} rounded-2xl border border-zinc-200/60 dark:border-zinc-800/40 p-6 hover:border-zinc-300 dark:hover:border-zinc-700/60 transition-all duration-300 group shadow-sm`}
            >
              {isLoading ? (
                <div className="space-y-3">
                  <div className="skeleton w-10 h-10 rounded-xl" />
                  <div className="skeleton h-7 w-14 rounded" />
                  <div className="skeleton h-4 w-20 rounded" />
                </div>
              ) : (
                <>
                  <div className={`w-10 h-10 rounded-xl bg-white/70 dark:bg-zinc-900/70 ${card.iconColor} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
                    {card.icon}
                  </div>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">{card.value}</p>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wide">{card.label}</p>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Recent Leads ─────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
          Recent Activity
        </p>
        <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800/60 overflow-hidden shadow-sm">
          {/* Card Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800/60">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Recent Leads</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Last 5 added to your pipeline</p>
            </div>
            <Link
              to="/leads"
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
            >
              View all →
            </Link>
          </div>

          {/* Card Body */}
          <div className="flex flex-col">
            {isLoading ? (
              <div className="space-y-1 p-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-3 py-3">
                    <div className="skeleton w-9 h-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-28 rounded" />
                      <div className="skeleton h-3 w-40 rounded" />
                    </div>
                    <div className="hidden sm:block skeleton h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentLeads.length === 0 ? (
              <div className="text-center py-12 px-6">
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No leads yet</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Create your first lead to get started.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/40">
                {recentLeads.map((lead, i) => (
                  <motion.div
                    key={lead._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-sm shadow-indigo-500/20">
                      {getInitials(lead.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{lead.name}</p>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{lead.email}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                      <Badge variant={statusVariant(lead.status)} dot>{lead.status}</Badge>
                      <span className="text-xs text-zinc-400 tabular-nums">{formatDate(lead.createdAt)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
