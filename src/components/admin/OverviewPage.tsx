import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users, MessageSquare, Clock, Heart, AlertTriangle,
  TrendingUp, TrendingDown, FileText, Zap, ShieldAlert,
} from 'lucide-react';
import { RealAnalyticsService } from '@/services/realAnalyticsService';
import { StaffAccessService, StaffSession, AdminDashboardStats } from '@/services/staffAccessService';
import { getNumber } from '@/utils/analyticsUtils';
import { logger } from '@/utils/logger';

type Period = 'today' | 'week' | 'month';

const PLATFORM_COLORS = ['#006d77', '#BE322D', '#F59E0B'];
const LANG_COLORS = ['#1d4ed8', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444'];

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-100 animate-pulse rounded ${className}`} />;
}

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  trend,
  loading,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}) {
  return (
    <Card className="p-4 border-[#E8ECFF] bg-white">
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-16" />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-1">
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <div className={`p-1.5 rounded-lg ${color}`}>
              <Icon className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {sub && (
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              {trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
              {sub}
            </p>
          )}
        </>
      )}
    </Card>
  );
}

interface OverviewPageProps {
  session: StaffSession;
}

export function OverviewPage({ session }: OverviewPageProps) {
  const [period, setPeriod] = useState<Period>('week');
  const [analytics, setAnalytics] = useState<any>(null);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([
      RealAnalyticsService.getAnalyticsSummary({ period }, session.accessToken)
        .then((d) => RealAnalyticsService.normalizeAnalyticsSummary(d))
        .catch((e) => { logger.error('analytics summary', e); return null; }),
      StaffAccessService.getDashboardStats(session.accessToken)
        .catch((e) => { logger.error('dashboard stats', e); return null; }),
    ]).then(([a, s]) => {
      if (!mounted) return;
      setAnalytics(a);
      setStats(s);
      setLoading(false);
    });

    return () => { mounted = false; };
  }, [period, session.accessToken]);

  const trends = useMemo(() => (analytics?.trends ?? []).slice(0, 14), [analytics]);

  const platformData = useMemo(() => {
    const d = analytics?.demographics?.platforms ?? analytics?.demographics?.platform_breakdown ?? {};
    return Object.entries(d).map(([k, v]) => ({ name: k.charAt(0).toUpperCase() + k.slice(1), value: Number(v) })).filter((x) => x.value > 0);
  }, [analytics]);

  const langData = useMemo(() => {
    const d = analytics?.demographics?.languagePreference ?? {};
    const names: Record<string, string> = { en: 'English', twi: 'Twi', ewe: 'Ewe', ga: 'Ga', ha: 'Hausa' };
    return Object.entries(d).map(([k, v]) => ({ name: names[k] ?? k, value: Number(v) })).filter((x) => x.value > 0);
  }, [analytics]);

  const totalUsers = getNumber(analytics?.summary ?? {}, 'total_active_users');
  const activeInPeriod = getNumber(analytics?.summary ?? {}, 'users_in_period');
  const totalMessages = stats?.total_messages ?? getNumber(analytics?.summary ?? {}, 'total_messages');
  const messagesInPeriod = stats?.messages_today ?? getNumber(analytics?.summary ?? {}, 'messages_in_period');
  const avgResponseMs = stats?.avg_response_time_ms ?? getNumber(analytics?.performance ?? {}, 'avgResponseTime');
  const satisfaction = getNumber(analytics?.summary ?? {}, 'average_satisfaction');
  const crisisTotal = getNumber(analytics?.safety ?? {}, 'crisis_interventions');
  const panicTotal = getNumber(analytics?.safety ?? {}, 'panic_exits_total');
  const openEscalations = stats?.escalations_today ?? 0;
  const pendingReports = stats?.pending_reports ?? 0;

  const periodLabel = period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month';

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
              <p className="text-sm text-gray-500 mt-0.5">Executive summary · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="flex gap-1 bg-white border border-[#E8ECFF] rounded-lg p-1">
              {(['today', 'week', 'month'] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    period === p ? 'bg-[#BE322D] text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p === 'today' ? 'Today' : p === 'week' ? 'Week' : 'Month'}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* KPI Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          <KpiCard label="Total Sessions" value={totalUsers.toLocaleString()} sub={`${activeInPeriod} active ${periodLabel.toLowerCase()}`} icon={Users} color="bg-blue-500" trend="up" loading={loading} />
          <KpiCard label="Total Messages" value={totalMessages.toLocaleString()} sub={`${messagesInPeriod} ${periodLabel.toLowerCase()}`} icon={MessageSquare} color="bg-violet-500" trend="up" loading={loading} />
          <KpiCard label="Avg Response" value={avgResponseMs > 0 ? `${avgResponseMs}ms` : '—'} sub="Bot response time" icon={Clock} color="bg-teal-500" loading={loading} />
          <KpiCard label="Satisfaction" value={satisfaction > 0 ? `${satisfaction.toFixed(1)}/5` : '—'} sub="Average rating" icon={Heart} color="bg-pink-500" loading={loading} />
          <KpiCard label="Crisis Events" value={crisisTotal} sub={`${panicTotal} panic button uses`} icon={ShieldAlert} color="bg-red-500" loading={loading} />
          <KpiCard label="Open Issues" value={openEscalations + pendingReports} sub={`${pendingReports} reports pending`} icon={AlertTriangle} color="bg-amber-500" loading={loading} />
        </motion.div>

        {/* Safety snapshot alert strip */}
        {!loading && (openEscalations > 0 || pendingReports > 0 || crisisTotal > 0) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2">
            {crisisTotal > 0 && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
                <AlertTriangle className="w-4 h-4" /> <span><strong>{crisisTotal}</strong> crisis events {periodLabel.toLowerCase()}</span>
              </div>
            )}
            {openEscalations > 0 && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-700">
                <Zap className="w-4 h-4" /> <span><strong>{openEscalations}</strong> open escalations today</span>
              </div>
            )}
            {pendingReports > 0 && (
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-sm text-orange-700">
                <FileText className="w-4 h-4" /> <span><strong>{pendingReports}</strong> reports awaiting review</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Activity Trend */}
          <Card className="lg:col-span-2 p-5 border-[#E8ECFF] bg-white">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Activity Trend</h3>
            {loading ? (
              <Skeleton className="h-56 w-full" />
            ) : trends.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-sm text-gray-400">No trend data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECFF" />
                  <XAxis dataKey="timestamp" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #E8ECFF' }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="value" stroke="#006d77" strokeWidth={2} dot={false} name="Activity" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Platform split */}
          <Card className="p-5 border-[#E8ECFF] bg-white">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Platform Split</h3>
            {loading ? (
              <Skeleton className="h-56 w-full" />
            ) : platformData.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-sm text-gray-400">No platform data</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={platformData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {platformData.map((_, i) => <Cell key={i} fill={PLATFORM_COLORS[i % PLATFORM_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* Language distribution */}
        <Card className="p-5 border-[#E8ECFF] bg-white">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">Language Distribution</h3>
          {loading ? (
            <Skeleton className="h-40 w-full" />
          ) : langData.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-sm text-gray-400">No language data</div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={langData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E8ECFF" horizontal={false} />
                <XAxis type="number" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" tick={{ fontSize: 12 }} width={60} />
                <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #E8ECFF' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Sessions">
                  {langData.map((_, i) => <Cell key={i} fill={LANG_COLORS[i % LANG_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Admin stats mini-row */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Conversations', value: stats.total_conversations, icon: MessageSquare },
              { label: 'Active Sessions Today', value: stats.active_sessions_today, icon: Users },
              { label: 'Safety Flags Today', value: stats.safety_flags_today, icon: ShieldAlert },
              { label: 'Positive Feedback', value: stats.feedback_positive, icon: Heart },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label} className="p-4 border-[#E8ECFF] bg-white flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-lg font-bold text-gray-900">{item.value?.toLocaleString() ?? '—'}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
