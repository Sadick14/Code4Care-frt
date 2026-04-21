import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  Download,
  FileText,
  Users,
  ShieldAlert,
  Activity,
  TrendingUp,
  MessageSquare,
  TriangleAlert,
  HeartPulse,
} from 'lucide-react';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { AnalyticsService } from '@/services/analyticsService';

interface AdminReportsProps {
  selectedLanguage: string;
}

type ReportType = 'activity' | 'demographics' | 'safety';
type PeriodType = 'today' | 'week' | 'month';

const CHART_COLORS = ['#0048ff', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];

function downloadFile(fileName: string, data: string, mimeType: string) {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function toCsv(rows: Record<string, string | number>[]): string {
  if (!rows.length) {
    return 'key,value\n';
  }

  const headers = Object.keys(rows[0]);
  const escapeCell = (value: string | number) => {
    const text = String(value);
    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };

  const lines = [headers.join(',')];
  rows.forEach((row) => {
    lines.push(headers.map((header) => escapeCell(row[header] ?? '')).join(','));
  });

  return lines.join('\n');
}

export function AdminReports({ selectedLanguage }: AdminReportsProps) {
  void selectedLanguage;
  const [period, setPeriod] = useState<PeriodType>('week');
  const [reportType, setReportType] = useState<ReportType>('activity');

  const analyticsData = useMemo(
    () => AnalyticsService.generateAnalyticsSummary(period),
    [period]
  );

  const reportCards = [
    {
      id: 'activity' as const,
      title: 'Activity Report',
      description: 'Sessions, messages, growth, and engagement quality.',
      icon: Activity,
    },
    {
      id: 'demographics' as const,
      title: 'Demographics Report',
      description: 'Age, gender, and language distribution snapshots.',
      icon: Users,
    },
    {
      id: 'safety' as const,
      title: 'Safety Report',
      description: 'Risk alerts, panic exits, and interventions overview.',
      icon: ShieldAlert,
    },
  ];

  const kpis = useMemo(() => {
    if (reportType === 'activity') {
      const totalSessions = analyticsData.trends.reduce((sum, item) => sum + item.sessions, 0);
      const totalMessages = analyticsData.trends.reduce((sum, item) => sum + item.totalMessages, 0);
      const avgSatisfaction = analyticsData.trends.length
        ? (
            analyticsData.trends.reduce((sum, item) => sum + item.satisfactionAverage, 0) /
            analyticsData.trends.length
          ).toFixed(1)
        : '0.0';

      return [
        { label: 'Total Sessions', value: totalSessions, icon: Activity, color: 'text-blue-600' },
        { label: 'Total Messages', value: totalMessages, icon: MessageSquare, color: 'text-purple-600' },
        { label: 'New Users Today', value: analyticsData.demographics.newUsersToday, icon: TrendingUp, color: 'text-green-600' },
        { label: 'Avg Satisfaction', value: `${avgSatisfaction}/5`, icon: HeartPulse, color: 'text-pink-600' },
      ];
    }

    if (reportType === 'demographics') {
      return [
        { label: 'Active Users', value: analyticsData.demographics.totalActiveUsers, icon: Users, color: 'text-blue-600' },
        { label: 'Returning Users', value: analyticsData.demographics.returningUsers, icon: TrendingUp, color: 'text-green-600' },
        { label: 'Top Age Segment', value: '15-19', icon: BarChart3, color: 'text-indigo-600' },
        { label: 'Top Language', value: 'English', icon: FileText, color: 'text-cyan-600' },
      ];
    }

    return [
      { label: 'Panic Exits', value: analyticsData.safety.panicExitsTotal, icon: TriangleAlert, color: 'text-yellow-600' },
      { label: 'Crisis Interventions', value: analyticsData.safety.crisisInterventionsTriggered, icon: ShieldAlert, color: 'text-red-600' },
      { label: 'Escalated Risks', value: analyticsData.safety.risksEscalatedToHuman, icon: TriangleAlert, color: 'text-orange-600' },
      { label: 'Users Followed Up', value: analyticsData.safety.concernedUsersFollowedUp, icon: HeartPulse, color: 'text-blue-600' },
    ];
  }, [analyticsData, reportType]);

  const tableRows = useMemo(() => {
    if (reportType === 'activity') {
      return analyticsData.trends.map((item) => ({
        Date: item.date,
        Sessions: item.sessions,
        Users: item.uniqueUsers,
        Messages: item.totalMessages,
        Satisfaction: item.satisfactionAverage,
      }));
    }

    if (reportType === 'demographics') {
      return Object.entries(analyticsData.demographics.ageRange).map(([ageRange, total]) => ({
        Segment: ageRange,
        Users: total,
        Percentage: `${Math.round((total / analyticsData.demographics.totalActiveUsers) * 100)}%`,
      }));
    }

    return [
      { Metric: 'Panic Exits', Value: analyticsData.safety.panicExitsTotal },
      { Metric: 'Crisis Interventions', Value: analyticsData.safety.crisisInterventionsTriggered },
      { Metric: 'Self-Harm Mentions', Value: analyticsData.safety.selfHarmMentionsDetected },
      { Metric: 'Suicidal Mentions', Value: analyticsData.safety.suicidalIdeationMentions },
      { Metric: 'Abuse Mentions', Value: analyticsData.safety.abuseMentionsDetected },
      { Metric: 'Risks Escalated', Value: analyticsData.safety.risksEscalatedToHuman },
    ];
  }, [analyticsData, reportType]);

  const handleExportJson = () => {
    const payload = {
      generatedAt: analyticsData.generatedAt,
      period,
      reportType,
      rows: tableRows,
      summary: analyticsData,
    };

    downloadFile(
      `room1221-${reportType}-report-${period}.json`,
      JSON.stringify(payload, null, 2),
      'application/json;charset=utf-8'
    );
  };

  const handleExportCsv = () => {
    downloadFile(
      `room1221-${reportType}-report-${period}.csv`,
      toCsv(tableRows),
      'text/csv;charset=utf-8'
    );
  };

  const demographicsChartData = Object.entries(analyticsData.demographics.ageRange).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">Generate, preview, and export operational and safety reports.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportCsv}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleExportJson}>
            <FileText className="w-4 h-4" />
            Export JSON
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        {(['today', 'week', 'month'] as const).map((value) => (
          <Button
            key={value}
            variant={period === value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod(value)}
            className={period === value ? 'bg-blue-600 text-white' : 'border-[#E8ECFF]'}
          >
            {value === 'today' ? 'Today' : value === 'week' ? 'This Week' : 'This Month'}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {reportCards.map((card, idx) => {
          const Icon = card.icon;
          const isActive = reportType === card.id;
          return (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => setReportType(card.id)}
              className={`rounded-xl border p-5 text-left transition-all ${
                isActive
                  ? 'border-blue-300 bg-blue-50 shadow-sm'
                  : 'border-[#E8ECFF] bg-white hover:border-blue-200 hover:shadow-sm'
              }`}
            >
              <Icon className={`w-6 h-6 mb-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <p className="font-semibold text-gray-900">{card.title}</p>
              <p className="text-sm text-gray-500 mt-1">{card.description}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
              <Card className="p-4 bg-white border-[#E8ECFF]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{kpi.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                  </div>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-[#E8ECFF]">
          <h3 className="font-semibold text-gray-900 mb-4">Trend Preview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analyticsData.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECFF" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E8ECFF' }} />
              <Legend />
              <Line type="monotone" dataKey="sessions" stroke="#0048ff" strokeWidth={2} name="Sessions" />
              <Line type="monotone" dataKey="totalMessages" stroke="#3b82f6" strokeWidth={2} name="Messages" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-white border-[#E8ECFF]">
          <h3 className="font-semibold text-gray-900 mb-4">Distribution Preview</h3>
          {reportType === 'demographics' ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={demographicsChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>
                  {demographicsChartData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E8ECFF' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={tableRows.slice(0, 7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8ECFF" />
                <XAxis dataKey={reportType === 'activity' ? 'Date' : 'Metric'} stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E8ECFF' }} />
                <Bar dataKey={reportType === 'activity' ? 'Sessions' : 'Value'} fill="#0048ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card className="p-6 bg-white border-[#E8ECFF]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Report Data Preview</h3>
          <Badge className="bg-blue-50 text-blue-600 border-blue-200">{reportType.toUpperCase()}</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8ECFF]">
                {Object.keys(tableRows[0] || { Metric: '', Value: '' }).map((header) => (
                  <th key={header} className="text-left py-2 px-3 text-gray-600 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, idx) => (
                <tr key={idx} className="border-b border-[#E8ECFF] last:border-0 hover:bg-gray-50">
                  {Object.values(row).map((value, valueIdx) => (
                    <td key={valueIdx} className="py-2 px-3 text-gray-700">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 bg-white border-[#E8ECFF]">
        <h3 className="font-semibold text-gray-900 mb-4">Recommended Insights</h3>
        <div className="grid grid-cols-2 gap-4">
          {analyticsData.adminInsights.slice(0, 4).map((insight) => (
            <div key={insight.id} className="rounded-xl border border-[#E8ECFF] bg-[#f8fbff] p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="font-semibold text-gray-900 text-sm">{insight.title}</p>
                <Badge className="bg-white text-blue-600 border-blue-200">{insight.priority}</Badge>
              </div>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
