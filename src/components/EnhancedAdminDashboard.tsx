import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import {
  Card,
} from './ui/card';
import {
  Badge,
} from './ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';
import {
  Button,
} from './ui/button';
import {
  Users,
  AlertTriangle,
  Heart,
  BarChart3,
  Download,
} from 'lucide-react';
import { RealAnalyticsService } from '@/services/realAnalyticsService';
import { getNumber, getNested } from '@/utils/analyticsUtils';
import { StaffAccessService, StaffSession } from '@/services/staffAccessService';
import { HealthService } from '@/services';
import { logger } from '@/utils/logger';

interface AdminDashboardProps {
  selectedLanguage: string;
  session: StaffSession;
}

const AGE_COLORS = ['#0f766e', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'];
const GENDER_COLORS = ['#7c3aed', '#f97316', '#e11d48', '#2563eb', '#16a34a', '#ca8a04'];

export function AdminDashboard({ selectedLanguage, session }: AdminDashboardProps) {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');
  const [analyticsData, setAnalyticsData] = useState<any | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const loadAnalytics = async () => {
      setIsLoadingAnalytics(true);
      try {
        const summary = await RealAnalyticsService.getAnalyticsSummary({ period }, session.accessToken).catch((error) => {
          logger.error('Failed to load analytics summary', error);
          return null;
        });

        if (mounted) {
          setAnalyticsData(summary ? RealAnalyticsService.normalizeAnalyticsSummary(summary) : null);
        }
      } catch (error) {
        logger.error('Failed to load analytics', error);
        setAnalyticsData(null);
      } finally {
        if (mounted) {
          setIsLoadingAnalytics(false);
        }
      }
    };

    void loadAnalytics();

    return () => {
      mounted = false;
    };
  }, [period, session.accessToken]);

  useEffect(() => {
    const loadRemoteStats = async () => {
      try {
        await StaffAccessService.getDashboardStats(session.accessToken);
      } catch (error) {
        logger.error('Failed to load dashboard stats', error);
      }
    };

    void loadRemoteStats();

    return () => {
      // cleanup if needed
    };
  }, [session.accessToken]);

  // Load system health status
  useEffect(() => {
    let mounted = true;

    const loadHealthStatus = async () => {
      try {
        const [health, ready, version] = await Promise.all([
          HealthService.checkHealth(),
          HealthService.checkReady(),
          HealthService.getVersion(),
        ]);

        if (mounted) {
          setHealthStatus({ health, ready, version });
        }
      } catch (error) {
        logger.error('Failed to load health status', error);
        setHealthStatus(null);
      }
    };

    void loadHealthStatus();

    // Refresh health status every 30 seconds
    const interval = setInterval(loadHealthStatus, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const content = {
    en: {
      title: 'Analytics Dashboard',
      subtitle: 'Real-time insights and metrics',
      exportBtn: 'Export',
      overview: 'Overview',
      engagement: 'Engagement',
      safety: 'Safety',
      performance: 'Performance',
      metrics: 'Key Metrics',
      activeUsers: 'Active Users',
      engagements: 'Engagements',
      avgTime: 'Avg Engagement Time',
      satisfaction: 'Satisfaction',
      growth: 'User Growth',
      retention: 'Day-7 Retention',
      demographicsTitle: 'Demographics by Age',
      demographicsRegionTitle: 'Demographics by Region',
      demographicsGenderTitle: 'Demographics by Gender',
      topicsTitle: 'Topic Engagement',
      contentTitle: 'Story Module Performance',
      moduleName: 'Module',
      timesStarted: 'Started',
      completed: 'Completed',
      completionRate: 'Completion %',
      panicExitsLabel: 'Panic Exits',
      crisisInterventions: 'Crisis Interventions',
      selfHarmMentions: 'Self-Harm Mentions',
      suicidalMentions: 'Suicidal Ideation',
      userFollowUp: 'Users Followed Up',
    },
  };

  const lang = content[selectedLanguage as keyof typeof content] || content.en;

  const performanceTrendData = useMemo(() => analyticsData?.trends ?? [], [analyticsData?.trends]);

  const averageSatisfaction = useMemo(() => {
    const topics = analyticsData?.engagement?.topics ?? analyticsData?.engagement?.topicEngagement ?? [];

    if (topics.length === 0) {
      return 0;
    }

    const total = topics.reduce((sum: number, topic: any) => sum + Number(topic.satisfaction_score ?? topic.satisfactionScore ?? 0), 0);
    return Number((total / topics.length).toFixed(1));
  }, [analyticsData?.engagement?.topics, analyticsData?.engagement?.topicEngagement]);

  // KPI Stats - with fallback to empty values while loading
  const kpis = [
    { label: lang.activeUsers, value: getNumber(analyticsData?.summary, 'total_active_users', 'totalActiveUsers', 'active_users'), icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: lang.engagements, value: getNumber(analyticsData?.summary, 'conversations_in_period', 'conversationsInPeriod', 'conversations'), icon: BarChart3, color: 'from-purple-500 to-purple-600' },
    { label: lang.satisfaction, value: averageSatisfaction || 0, icon: Heart, color: 'from-red-500 to-red-600' },
  ];

  // Safety metrics
  const safetyMetrics = [
    { label: 'Panic Exits', value: getNumber(analyticsData?.safety, 'panic_exits_total', 'panicExitsTotal', 'panic_exits'), icon: AlertTriangle, color: 'text-yellow-600' },
    { label: 'Crisis Interventions', value: getNumber(analyticsData?.safety, 'crisis_interventions', 'crisisInterventions', 'crisis_interventions_count'), icon: Heart, color: 'text-red-600' },
    { label: 'Self-Harm Mentions', value: getNumber(analyticsData?.safety, 'self_harm_mentions', 'selfHarmMentions', 'self_harm_mentions_count'), icon: AlertTriangle, color: 'text-orange-600' },
    { label: 'Suicidal Ideation', value: getNumber(analyticsData?.safety, 'suicidal_ideation_mentions', 'suicidalIdeationMentions', 'suicidal_ideation_count'), icon: AlertTriangle, color: 'text-red-700' },
  ];

  if (isLoadingAnalytics) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 w-96 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-5 w-64 bg-gray-100 rounded animate-pulse mb-6" />
            <div className="flex gap-2">
              <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* KPI Skeleton */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-[#E8ECFF] rounded-lg p-4">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Tabs Skeleton */}
          <div className="bg-white border border-[#E8ECFF] rounded-lg p-6">
            <div className="flex gap-4 mb-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-48 w-full bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Skeleton component helper
  const KPISkeleton = () => (
    <div className="bg-white border border-[#E8ECFF] rounded-lg p-4">
      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3" />
      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
    </div>
  );

  const ChartSkeleton = () => (
    <div className="h-64 w-full bg-gray-100 rounded animate-pulse" />
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{lang.title}</h1>
              <p className="text-gray-500">{lang.subtitle}</p>
              {healthStatus && (
                <div className="flex items-center gap-3 mt-2">
                  <Badge
                    className={`${
                      healthStatus.health?.status === 'ok'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${
                      healthStatus.health?.status === 'ok' ? 'bg-green-500' : 'bg-red-500'
                    } inline-block mr-1.5`}></span>
                    System {healthStatus.health?.status === 'ok' ? 'Healthy' : 'Down'}
                  </Badge>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                    API v{healthStatus.version?.version || '1.0.0'}
                  </Badge>
                  {healthStatus.ready && (
                    <Badge className={`${
                      healthStatus.ready.database === 'connected'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}>
                      DB: {healthStatus.ready.database || 'unknown'}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              {lang.exportBtn}
            </Button>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            {(['today', 'week', 'month'] as const).map((p) => (
              <Button
                key={p}
                variant={period === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod(p)}
                className={period === p ? 'bg-blue-600 text-white' : ''}
              >
                {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-4 mb-8">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                {isLoadingAnalytics && !analyticsData ? (
                  <KPISkeleton />
                ) : (
                  <Card className="p-4 bg-white border-[#E8ECFF]">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{kpi.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                      </div>
                      <div className={`bg-gradient-to-br ${kpi.color} p-2 rounded-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </Card>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 border border-[#E8ECFF]">
            <TabsTrigger value="overview">{lang.overview}</TabsTrigger>
            <TabsTrigger value="safety">{lang.safety}</TabsTrigger>
            <TabsTrigger value="performance">{lang.performance}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Demographics - Age & Region */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-white border-[#E8ECFF]">
                  <h3 className="font-semibold text-gray-900 mb-4">{lang.demographicsTitle}</h3>
                  {isLoadingAnalytics ? (
                    <ChartSkeleton />
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={getNested(analyticsData, 'demographics', 'ageRange') ? Object.entries(getNested(analyticsData, 'demographics', 'ageRange') as Record<string, number>).map(([k, v]) => ({ age: k, value: v })) : []}
                          dataKey="value"
                          nameKey="age"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                        >
                          {(() => {
                                const ageRange = getNested(
                                  analyticsData,
                                  'demographics',
                                  'ageRange'
                                ) as Record<string, number> | undefined;

                                if (!ageRange || typeof ageRange !== 'object') {
                                  return null;
                                }

                                return Object.entries(ageRange).map((_, idx) => (
                                  <Cell
                                    key={idx}
                                    fill={AGE_COLORS[idx % AGE_COLORS.length]}
                                  />
                                ));
                              })()}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Card>

                <Card className="p-6 bg-white border-[#E8ECFF]">
                  <h3 className="font-semibold text-gray-900 mb-4">{lang.demographicsRegionTitle}</h3>
                  {isLoadingAnalytics ? (
                    <ChartSkeleton />
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={getNested(analyticsData, 'demographics', 'regions') ? Object.entries(getNested(analyticsData, 'demographics', 'regions') as Record<string, number>).map(([region, value]) => ({ region, value })) : []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8ECFF" />
                        <XAxis dataKey="region" stroke="#9CA3AF" style={{ fontSize: 11 }} angle={-45} textAnchor="end" height={70} />
                        <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#06B6D4" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Card>

                <Card className="p-6 bg-white border-[#E8ECFF]">
                  <h3 className="font-semibold text-gray-900 mb-4">{lang.demographicsGenderTitle}</h3>
                  {isLoadingAnalytics ? (
                    <ChartSkeleton />
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={getNested(analyticsData, 'demographics', 'gender') ? Object.entries(getNested(analyticsData, 'demographics', 'gender') as Record<string, number>).map(([gender, value]) => ({ gender, value })) : []}
                          dataKey="value"
                          nameKey="gender"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                        >
                          {(() => {
                            const gender = getNested(
                              analyticsData,
                              'demographics',
                              'gender'
                            ) as Record<string, number> | undefined;

                            if (!gender || typeof gender !== 'object') {
                              return null;
                            }

                            return Object.entries(gender).map((_, idx) => (
                              <Cell
                                key={idx}
                                fill={GENDER_COLORS[idx % GENDER_COLORS.length]}
                              />
                            ));
                          })()}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Card>
              </div>

            </div>
          </TabsContent>

          {/* Engagement removed to simplify dashboard. */}

          {/* Safety Tab */}
          <TabsContent value="safety" className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {safetyMetrics.map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="p-4 bg-white border-[#E8ECFF]">
                      <Icon className={`w-6 h-6 ${metric.color} mb-2`} />
                      <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card className="p-6 bg-white border-[#E8ECFF]">
              <h3 className="font-semibold text-gray-900 mb-4">System Metrics</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Response Time</p>
                  <p className="text-3xl font-bold text-gray-900">{getNumber(analyticsData?.performance, 'avgResponseTime', 'avg_response_time_ms', 'response_time_ms')}ms</p>
                  <Badge className="mt-2 bg-green-50 text-green-600 border-green-200">Healthy</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">System Uptime</p>
                  <p className="text-3xl font-bold text-gray-900">{getNumber(analyticsData?.performance, 'systemUptime', 'system_uptime_percent', 'uptime_percent')}%</p>
                  <Badge className="mt-2 bg-green-50 text-green-600 border-green-200">Online</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Success Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{getNumber(analyticsData?.performance, 'messageProcessingSuccess', 'message_processing_success_percent', 'success_rate')}%</p>
                  <Badge className="mt-2 bg-blue-50 text-blue-600 border-blue-200">Excellent</Badge>
                </div>
              </div>
            </Card>

            {/* Performance Chart */}
            <Card className="p-6 bg-white border-[#E8ECFF]">
              <h3 className="font-semibold text-gray-900 mb-4">Performance Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECFF" />
                  <XAxis dataKey="timestamp" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E8ECFF' }} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#0048ff" strokeWidth={2} name="Response Time (ms)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
