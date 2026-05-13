import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, TrendingUp, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  StaffAccessService,
  StaffSession,
  AdminConversationListItem,
} from '@/services/staffAccessService';
import { RealAnalyticsService } from '@/services/realAnalyticsService';
import { getNumber } from '@/utils/analyticsUtils';
import { logger } from '@/utils/logger';

type Period = 'today' | 'week' | 'month';

const TOPIC_COLORS = ['#006d77', '#BE322D', '#F59E0B', '#8b5cf6', '#22c55e', '#ec4899', '#0ea5e9', '#f97316'];

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-100 animate-pulse rounded ${className}`} />;
}

function formatDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

interface ConversationsPageProps {
  session: StaffSession;
}

export function ConversationsPage({ session }: ConversationsPageProps) {
  const [period, setPeriod] = useState<Period>('week');
  const [analytics, setAnalytics] = useState<any>(null);
  const [convs, setConvs] = useState<AdminConversationListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [escalatedFilter, setEscalatedFilter] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [convLoading, setConvLoading] = useState(true);

  const pageSize = 20;

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    RealAnalyticsService.getAnalyticsSummary({ period }, session.accessToken)
      .then((d) => RealAnalyticsService.normalizeAnalyticsSummary(d))
      .catch((e) => { logger.error('analytics', e); return null; })
      .then((a) => { if (mounted) { setAnalytics(a); setLoading(false); } });

    return () => { mounted = false; };
  }, [period, session.accessToken]);

  useEffect(() => {
    let mounted = true;
    setConvLoading(true);

    StaffAccessService.listConversations(
      { page, page_size: pageSize, is_escalated: escalatedFilter ?? undefined },
      session.accessToken,
    )
      .then((r) => { if (mounted) { setConvs(r.conversations ?? []); setTotal(r.total ?? 0); setConvLoading(false); } })
      .catch((e) => { logger.error('conversations', e); if (mounted) setConvLoading(false); });

    return () => { mounted = false; };
  }, [page, escalatedFilter, session.accessToken]);

  const totalPages = Math.ceil(total / pageSize);

  const topicData = useMemo(() => {
    const topics = analytics?.engagement?.topics ?? analytics?.engagement?.topicEngagement ?? [];
    return (topics as any[])
      .map((t: any) => ({ name: String(t.topic ?? '').replace(/_/g, ' '), value: Number(t.inquiries ?? t.count ?? 0) }))
      .filter((t) => t.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 12);
  }, [analytics]);

  const totalMessages = getNumber(analytics?.summary ?? {}, 'total_messages');
  const avgMsgPerConv = getNumber(analytics?.summary ?? {}, 'average_messages_per_session');
  const avgResponseMs = getNumber(analytics?.performance ?? {}, 'avgResponseTime');
  const escalatedCount = convs.filter((c) => c.is_escalated).length;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Conversations & Chat</h1>
              <p className="text-sm text-gray-500 mt-0.5">Message volume, topic engagement and conversation log</p>
            </div>
            <div className="flex gap-1 bg-white border border-[#E8ECFF] rounded-lg p-1">
              {(['today', 'week', 'month'] as Period[]).map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${period === p ? 'bg-[#BE322D] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {p === 'today' ? 'Today' : p === 'week' ? 'Week' : 'Month'}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Conversations', value: total.toLocaleString(), icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Messages', value: totalMessages.toLocaleString(), icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Avg Messages / Conv', value: avgMsgPerConv > 0 ? avgMsgPerConv.toFixed(1) : '—', icon: MessageSquare, color: 'text-teal-600', bg: 'bg-teal-50' },
            { label: 'Avg Bot Response', value: avgResponseMs > 0 ? `${avgResponseMs}ms` : '—', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="p-4 border-[#E8ECFF] bg-white">
                {loading ? (
                  <div className="space-y-2"><Skeleton className="h-3 w-20" /><Skeleton className="h-7 w-14" /></div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${item.bg} flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                      <p className="text-xl font-bold text-gray-900">{item.value}</p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Topic Engagement */}
        <Card className="p-5 border-[#E8ECFF] bg-white">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">Topic Engagement (Top 12)</h3>
          {loading ? <Skeleton className="h-56 w-full" /> : topicData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-sm text-gray-400">No topic data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topicData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E8ECFF" horizontal={false} />
                <XAxis type="number" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={130} stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Inquiries">
                  {topicData.map((_, i) => <Cell key={i} fill={TOPIC_COLORS[i % TOPIC_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Conversation Table */}
        <Card className="border-[#E8ECFF] bg-white overflow-hidden">
          <div className="p-5 border-b border-[#E8ECFF] flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-semibold text-gray-900 text-sm">Conversation Log</h3>
            <div className="flex gap-2">
              {([
                { label: 'All', value: null },
                { label: 'Escalated', value: true },
                { label: 'Normal', value: false },
              ] as { label: string; value: boolean | null }[]).map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => { setEscalatedFilter(opt.value); setPage(1); }}
                  className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
                    escalatedFilter === opt.value
                      ? 'bg-[#BE322D] text-white border-[#BE322D]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-[#E8ECFF]">
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Session</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Started</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Last Active</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Messages</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Language</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {convLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-[#E8ECFF]">
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-3 w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : convs.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">No conversations found</td></tr>
                ) : (
                  convs.map((conv) => (
                    <tr key={conv.id} className="border-b border-[#E8ECFF] hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">…{conv.session_id.slice(-8)}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        <div>{formatDate(conv.created_at)}</div>
                        <div className="text-gray-400">{formatTime(conv.created_at)}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        <div>{formatDate(conv.last_active_at)}</div>
                        <div className="text-gray-400">{formatTime(conv.last_active_at)}</div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{conv.message_count}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs font-normal capitalize">{conv.language ?? 'en'}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {conv.is_escalated && (
                            <Badge className="text-xs bg-red-100 text-red-700 border-red-200 hover:bg-red-100">Escalated</Badge>
                          )}
                          {conv.has_safety_flags && (
                            <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
                              <AlertCircle className="w-3 h-3 mr-1" />Safety flag
                            </Badge>
                          )}
                          {!conv.is_escalated && !conv.has_safety_flags && (
                            <Badge variant="outline" className="text-xs text-gray-500">Normal</Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-[#E8ECFF] flex items-center justify-between text-sm">
              <span className="text-gray-500 text-xs">Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, total)} of {total.toLocaleString()}</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="h-7 w-7 p-0">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-3 py-1 text-xs text-gray-600 font-medium">{page} / {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="h-7 w-7 p-0">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
