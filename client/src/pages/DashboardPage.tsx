import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { leadsApi } from '../api/leads';
import { type Lead, type PaginationMeta } from '../types';
import { HiOutlineUsers, HiOutlineUserAdd, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';

interface StatCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, new: 0, qualified: 0, lost: 0 });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Fetch all to get stats — using first page with high limit for stats
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
    { label: 'Total Leads', value: stats.total, icon: <HiOutlineUsers className="w-6 h-6" />, color: 'text-primary-600 dark:text-primary-400', bgColor: 'bg-primary-100 dark:bg-primary-900/30' },
    { label: 'New Leads', value: stats.new, icon: <HiOutlineUserAdd className="w-6 h-6" />, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Qualified', value: stats.qualified, icon: <HiOutlineCheckCircle className="w-6 h-6" />, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: 'Lost', value: stats.lost, icon: <HiOutlineXCircle className="w-6 h-6" />, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Here's what's happening with your leads today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-5 hover:shadow-lg hover:shadow-surface-200/50 dark:hover:shadow-surface-900/50 transition-all duration-300">
            {isLoading ? (
              <div className="space-y-3">
                <div className="skeleton w-10 h-10 rounded-xl" />
                <div className="skeleton h-8 w-16 rounded" />
                <div className="skeleton h-4 w-24 rounded" />
              </div>
            ) : (
              <>
                <div className={`w-10 h-10 rounded-xl ${card.bgColor} ${card.color} flex items-center justify-center mb-3`}>
                  {card.icon}
                </div>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{card.value}</p>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">{card.label}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700/50">
        <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700/50">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">Recent Leads</h2>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="skeleton w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-32 rounded" />
                    <div className="skeleton h-3 w-48 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentLeads.length === 0 ? (
            <p className="text-sm text-surface-500 dark:text-surface-400 text-center py-8">No leads yet. Create your first lead to get started.</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div key={lead._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {lead.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">{lead.name}</p>
                    <p className="text-xs text-surface-400 truncate">{lead.email}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    lead.status === 'New' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    lead.status === 'Qualified' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    lead.status === 'Contacted' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>{lead.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
