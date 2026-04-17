import { useState, useMemo } from 'react';
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
  ComposedChart,
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
  TrendingUp,
  AlertTriangle,
  Clock,
  Heart,
  BarChart3,
  Download,
} from 'lucide-react';
import { AnalyticsService } from '@/services/analyticsService';

interface AdminDashboardProps {
  selectedLanguage: string;
}

const COLORS = ['#0048ff', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];

export function AdminDashboard({ selectedLanguage }: AdminDashboardProps) {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');

  const analyticsData = useMemo(
    () => AnalyticsService.generateAnalyticsSummary(period),
    [period]
  );

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
      sessions: 'Sessions',
      avgTime: 'Avg Engagement Time',
      satisfaction: 'Satisfaction',
      growth: 'User Growth',
      retention: 'Day-7 Retention',
      demographicsTitle: 'Demographics by Age',
      trendsTitle: 'Engagement Trends',
      funnelTitle: 'User Journey Funnel',
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

  // KPI Stats
  const latestTrend = analyticsData.trends?.[analyticsData.trends.length - 1];
  const kpis = [
    { label: lang.activeUsers, value: analyticsData.demographics.totalActiveUsers, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: lang.sessions, value: latestTrend?.sessions || 0, icon: BarChart3, color: 'from-purple-500 to-purple-600' },
    { label: lang.growth, value: analyticsData.demographics.newUsersToday, icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { label: lang.satisfaction, value: latestTrend?.satisfactionAverage.toFixed(1) || '0', icon: Heart, color: 'from-red-500 to-red-600' },
  ];

  // Engagement data
  const engagementByTopic = analyticsData.topics.map(t => ({
    name: t.topic,
    inquiries: t.inquiries,
    satisfaction: t.satisfactionScore,
  }));

  // Safety metrics
  const safetyMetrics = [
    { label: 'Panic Exits', value: analyticsData.safety.panicExitsTotal, icon: AlertTriangle, color: 'text-yellow-600' },
    { label: 'Crisis Interventions', value: analyticsData.safety.crisisInterventionsTriggered, icon: Heart, color: 'text-red-600' },
    { label: 'Self-Harm Mentions', value: analyticsData.safety.selfHarmMentionsDetected, icon: AlertTriangle, color: 'text-orange-600' },
    { label: 'Suicidal Ideation', value: analyticsData.safety.suicidalIdeationMentions, icon: AlertTriangle, color: 'text-red-700' },
  ];

  // Funnel data
  const funnelData = [
    { stage: 'Visitors', value: analyticsData.funnel.totalVisitors },
    { stage: 'Onboarded', value: analyticsData.funnel.completedOnboarding },
    { stage: 'First Chat', value: analyticsData.funnel.hadFirstChat },
    { stage: 'Story Module', value: analyticsData.funnel.completedStoryModule },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{lang.title}</h1>
              <p className="text-gray-500">{lang.subtitle}</p>
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
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
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 border border-[#E8ECFF]">
            <TabsTrigger value="overview">{lang.overview}</TabsTrigger>
            <TabsTrigger value="engagement">{lang.engagement}</TabsTrigger>
            <TabsTrigger value="safety">{lang.safety}</TabsTrigger>
            <TabsTrigger value="performance">{lang.performance}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Demographics */}
              <Card className="p-6 bg-white border-[#E8ECFF]">
                <h3 className="font-semibold text-gray-900 mb-4">{lang.demographicsTitle}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={Object.entries(analyticsData.demographics.ageRange).map(([k, v]) => ({ age: k, value: v }))}
                      dataKey="value"
                      nameKey="age"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {Object.entries(analyticsData.demographics.ageRange).map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              {/* Trends */}
              <Card className="p-6 bg-white border-[#E8ECFF]">
                <h3 className="font-semibold text-gray-900 mb-4">{lang.trendsTitle}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={analyticsData.trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8ECFF" />
                    <XAxis dataKey="timestamp" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                    <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E8ECFF' }} />
                    <Line type="monotone" dataKey="value" stroke="#0048ff" strokeWidth={2} name="Sessions" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Funnel */}
            <Card className="p-6 bg-white border-[#E8ECFF]">
              <h3 className="font-semibold text-gray-900 mb-4">{lang.funnelTitle}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECFF" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis dataKey="stage" type="category" stroke="#9CA3AF" width={100} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E8ECFF' }} />
                  <Bar dataKey="value" fill="#0048ff" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <Card className="p-6 bg-white border-[#E8ECFF]">
              <h3 className="font-semibold text-gray-900 mb-4">{lang.topicsTitle}</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={engagementByTopic}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECFF" />
                  <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E8ECFF' }} />
                  <Legend />
                  <Bar dataKey="inquiries" fill="#0048ff" name="Inquiries" />
                  <Bar dataKey="satisfaction" fill="#3b82f6" name="Satisfaction" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Content Performance Table */}
            <Card className="p-6 bg-white border-[#E8ECFF]">
              <h3 className="font-semibold text-gray-900 mb-4">{lang.contentTitle}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E8ECFF]">
                      <th className="text-left py-2 px-4 text-gray-600 font-semibold">{lang.moduleName}</th>
                      <th className="text-left py-2 px-4 text-gray-600 font-semibold">{lang.timesStarted}</th>
                      <th className="text-left py-2 px-4 text-gray-600 font-semibold">{lang.completed}</th>
                      <th className="text-left py-2 px-4 text-gray-600 font-semibold">{lang.completionRate}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.storyModules.map((module, idx) => (
                      <tr key={idx} className="border-b border-[#E8ECFF] hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{module.moduleName || 'Module'}</td>
                        <td className="py-3 px-4 text-gray-600">{module.timesStarted}</td>
                        <td className="py-3 px-4 text-gray-600">{module.timesCompleted}</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-blue-50 text-blue-600 border-blue-200">
                            {Math.round((module.timesCompleted / module.timesStarted) * 100)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

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

            {/* Safety Incidents Table */}
            <Card className="p-6 bg-white border-[#E8ECFF]">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Incidents</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E8ECFF]">
                      <th className="text-left py-2 px-4 text-gray-600 font-semibold">Type</th>
                      <th className="text-left py-2 px-4 text-gray-600 font-semibold">User</th>
                      <th className="text-left py-2 px-4 text-gray-600 font-semibold">Time</th>
                      <th className="text-left py-2 px-4 text-gray-600 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#E8ECFF] hover:bg-gray-50">
                      <td className="py-3 px-4"><Badge className="bg-red-50 text-red-600 border-red-200">Self-Harm</Badge></td>
                      <td className="py-3 px-4 text-gray-900">Ama O.</td>
                      <td className="py-3 px-4 text-gray-600">2 hours ago</td>
                      <td className="py-3 px-4"><Badge className="bg-purple-50 text-purple-600 border-purple-200">Escalated</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card className="p-6 bg-white border-[#E8ECFF]">
              <h3 className="font-semibold text-gray-900 mb-4">System Metrics</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Response Time</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.performance.avgResponseTime}ms</p>
                  <Badge className="mt-2 bg-green-50 text-green-600 border-green-200">Healthy</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">System Uptime</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.performance.systemUptime}%</p>
                  <Badge className="mt-2 bg-green-50 text-green-600 border-green-200">Online</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Success Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.performance.messageProcessingSuccess}%</p>
                  <Badge className="mt-2 bg-blue-50 text-blue-600 border-blue-200">Excellent</Badge>
                </div>
              </div>
            </Card>

            {/* Performance Chart */}
            <Card className="p-6 bg-white border-[#E8ECFF]">
              <h3 className="font-semibold text-gray-900 mb-4">Performance Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.trends}>
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
