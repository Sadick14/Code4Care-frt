import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Zap, UserCheck, PhoneCall, ArrowRight } from 'lucide-react';
import { RealAnalyticsService, SafetyAnalyticsResponse } from '@/services/realAnalyticsService';
import { getNumber } from '@/utils/analyticsUtils';
import { StaffSession } from '@/services/staffAccessService';
import { logger } from '@/utils/logger';

type Period = 'today' | 'week' | 'month';

const CRISIS_COLORS: Record<string, string> = {
  self_harm: '#ef4444',
  suicidal_ideation: '#dc2626',
  abuse: '#f97316',
  severe_distress: '#f59e0b',
};
const CRISIS_LABELS: Record<string, string> = {
  self_harm: 'Self-Harm',
  suicidal_ideation: 'Suicidal Ideation',
  abuse: 'Abuse',
  severe_distress: 'Severe Distress',
};

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-100 animate-pulse rounded ${className}`} />;
}

function FunnelStep({ label, value, sub, icon: Icon, color, arrow = true }: {
  label: string; value: number; sub?: string; icon: React.ElementType; color: string; arrow?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 rounded-xl p-4 ${color} flex items-center gap-3`}>
        <Icon className="w-5 h-5 text-white flex-shrink-0" />
        <div>
          <p className="text-white text-xs font-medium">{label}</p>
          <p className="text-white text-xl font-bold">{value.toLocaleString()}</p>
          {sub && <p className="text-white/70 text-xs">{sub}</p>}
        </div>
      </div>
      {arrow && <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
    </div>
  );
}

interface SafetyCrisisPageProps {
  session: StaffSession;
}

export function SafetyCrisisPage({ session }: SafetyCrisisPageProps) {
  const [period, setPeriod] = useState<Period>('week');
  const [safety, setSafety] = useState<SafetyAnalyticsResponse | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([
      RealAnalyticsService.getSafetyAnalytics({ period }, session.accessToken)
        .catch((e) => { logger.error('safety analytics', e); return null; }),
      RealAnalyticsService.getAnalyticsSummary({ period }, session.accessToken)
        .then((d) => RealAnalyticsService.normalizeAnalyticsSummary(d))
        .catch((e) => { logger.error('analytics', e); return null; }),
    ]).then(([s, a]) => {
      if (!mounted) return;
      setSafety(s);
      setAnalytics(a);
      setLoading(false);
    });

    return () => { mounted = false; };
  }, [period, session.accessToken]);

  const crisisTotal = safety?.incidents?.total ?? getNumber(analytics?.safety ?? {}, 'crisis_interventions');
  const panicTotal = getNumber(analytics?.safety ?? {}, 'panic_exits_total');
  const interventions = getNumber(analytics?.safety ?? {}, 'crisis_interventions');
  const escalatedHuman = getNumber(analytics?.safety ?? {}, 'risks_escalated_to_human');
  const followedUp = getNumber(analytics?.safety ?? {}, 'concerned_users_followed_up');
  const selfHarm = getNumber(analytics?.safety ?? {}, 'self_harm_mentions');
  const suicidal = getNumber(analytics?.safety ?? {}, 'suicidal_ideation_mentions');
  const abuse = getNumber(analytics?.safety ?? {}, 'abuse_mentions');

  const crisisTypeData = useMemo(() => {
    const sev = safety?.severity_distribution ?? {};
    const data = [
      { name: 'Self-Harm', value: Number(sev['self_harm'] ?? selfHarm), key: 'self_harm' },
      { name: 'Suicidal Ideation', value: Number(sev['suicidal_ideation'] ?? suicidal), key: 'suicidal_ideation' },
      { name: 'Abuse', value: Number(sev['abuse'] ?? abuse), key: 'abuse' },
      { name: 'Severe Distress', value: Number(sev['severe_distress'] ?? 0), key: 'severe_distress' },
    ].filter((x) => x.value > 0);
    return data;
  }, [safety, selfHarm, suicidal, abuse]);

  const periodLabel = period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month';
  const hasCrisis = crisisTotal > 0 || panicTotal > 0;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Safety & Crisis</h1>
              <p className="text-sm text-gray-500 mt-0.5">Crisis detection, panic events and escalation tracking</p>
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

        {/* Alert banner */}
        {!loading && hasCrisis && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700 font-medium">
              {crisisTotal} crisis event{crisisTotal !== 1 ? 's' : ''} and {panicTotal} panic activation{panicTotal !== 1 ? 's' : ''} recorded {periodLabel.toLowerCase()}. Review below for details.
            </p>
          </motion.div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: 'Crisis Events', value: crisisTotal, icon: AlertTriangle, bg: 'bg-red-100', color: 'text-red-600', border: 'border-red-200' },
            { label: 'Interventions Triggered', value: interventions, icon: Shield, bg: 'bg-orange-100', color: 'text-orange-600', border: 'border-orange-200' },
            { label: 'Escalated to Human', value: escalatedHuman, icon: UserCheck, bg: 'bg-amber-100', color: 'text-amber-600', border: 'border-amber-200' },
            { label: 'Panic Button Uses', value: panicTotal, icon: Zap, bg: 'bg-yellow-100', color: 'text-yellow-700', border: 'border-yellow-200' },
            { label: 'Users Followed Up', value: followedUp, icon: PhoneCall, bg: 'bg-green-100', color: 'text-green-600', border: 'border-green-200' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className={`p-4 border ${item.border} bg-white`}>
                {loading ? (
                  <div className="space-y-2"><Skeleton className="h-3 w-20" /><Skeleton className="h-7 w-12" /></div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${item.bg} flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{item.value.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Crisis type donut */}
          <Card className="p-5 border-[#E8ECFF] bg-white">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Crisis Type Breakdown</h3>
            {loading ? <Skeleton className="h-56 w-full" /> : crisisTypeData.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-sm text-gray-400">No crisis data</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={crisisTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {crisisTypeData.map((item) => (
                      <Cell key={item.key} fill={CRISIS_COLORS[item.key] ?? '#9ca3af'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Intervention funnel */}
          <Card className="p-5 border-[#E8ECFF] bg-white">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Intervention Funnel</h3>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : (
              <div className="space-y-2">
                <FunnelStep label="Crisis Detected" value={crisisTotal} sub="All crisis events" icon={AlertTriangle} color="bg-red-500" />
                <FunnelStep label="Intervention Triggered" value={interventions} sub="Automated response sent" icon={Shield} color="bg-orange-500" />
                <FunnelStep label="Escalated to Human" value={escalatedHuman} sub="Consultant assigned" icon={UserCheck} color="bg-amber-500" />
                <FunnelStep label="Users Followed Up" value={followedUp} sub="Follow-up completed" icon={PhoneCall} color="bg-green-600" arrow={false} />
              </div>
            )}
          </Card>
        </div>

        {/* Crisis type bar chart */}
        {crisisTypeData.length > 0 && (
          <Card className="p-5 border-[#E8ECFF] bg-white">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Crisis Volume by Type</h3>
            {loading ? <Skeleton className="h-48 w-full" /> : (
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={crisisTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECFF" />
                  <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Events">
                    {crisisTypeData.map((item) => (
                      <Cell key={item.key} fill={CRISIS_COLORS[item.key] ?? '#9ca3af'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        )}

        {/* Safety metric detail cards */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Self-Harm Mentions', value: selfHarm, color: 'bg-red-50 border-red-200 text-red-700' },
              { label: 'Suicidal Ideation', value: suicidal, color: 'bg-red-50 border-red-200 text-red-700' },
              { label: 'Abuse Mentions', value: abuse, color: 'bg-orange-50 border-orange-200 text-orange-700' },
              { label: 'Panic Exits', value: panicTotal, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl border p-4 ${item.color}`}>
                <p className="text-xs font-medium">{item.label}</p>
                <p className="text-2xl font-bold mt-1">{item.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
