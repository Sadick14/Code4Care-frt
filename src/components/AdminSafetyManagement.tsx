import { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, Heart, Shield, PhoneCall, BarChart3, AlertTriangle, Siren, BadgeCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { SafetyIncidentService, SafetyAnalyticsResponse, SafetyTrendDataPoint, IncidentListItem } from '@/services/safetyIncidentService';
import { RealAnalyticsService } from '@/services/realAnalyticsService';
import { logger } from '@/utils/logger';

interface AdminSafetyManagementProps {
  selectedLanguage: string;
  accessToken?: string;
}

export function AdminSafetyManagement({ selectedLanguage, accessToken }: AdminSafetyManagementProps) {
  void selectedLanguage;
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in-review' | 'escalated' | 'resolved'>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [incidents, setIncidents] = useState<IncidentListItem[]>([]);
  const [safetyAnalytics, setSafetyAnalytics] = useState<SafetyAnalyticsResponse | null>(null);
  const [trendData, setTrendData] = useState<SafetyTrendDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load incidents and analytics on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Load from both admin incidents API and public analytics API in parallel
        const [incidentsResponse, trendsResponse, analyticsResponse] = await Promise.all([
          SafetyIncidentService.listIncidents({ page: 1, limit: 100 }, accessToken).catch(err => {
            logger.warn('Failed to load admin incidents', err);
            return { incidents: [], total: 0, page: 1, limit: 100 };
          }),
          SafetyIncidentService.getSafetyTrends({ period: 'week' }, accessToken).catch(err => {
            logger.warn('Failed to load safety trends', err);
            return [];
          }),
          RealAnalyticsService.getSafetyAnalytics({ period: 'week', by_region: true, by_age_group: true }, accessToken).catch(err => {
            logger.warn('Failed to load public safety analytics', err);
            return null;
          }),
        ]);

        setIncidents(incidentsResponse.incidents);
        setTrendData(trendsResponse);
        setSafetyAnalytics(analyticsResponse);
      } catch (err) {
        logger.error('Failed to load safety data', err);
        setError(err instanceof Error ? err.message : 'Failed to load safety data');
        // Set empty defaults on error
        setIncidents([]);
        setTrendData([]);
        setSafetyAnalytics(null);
      } finally {
        setIsLoading(false);
        setIsLoadingAnalytics(false);
      }
    };

    void loadData();
  }, [accessToken]);

  const filteredIncidents = incidents.filter(incident => {
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;
    return matchesStatus && matchesSeverity;
  });

  const stats = {
    total: safetyAnalytics?.incidents.total ?? incidents.length,
    open: incidents.filter(i => i.status === 'open').length,
    escalated: incidents.filter(i => i.status === 'escalated').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
    followUpNeeded: incidents.filter(i => i.follow_up_required && i.status !== 'resolved').length,
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'high': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'critical': return 'bg-red-50 text-red-600 border-red-200';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-50 text-red-600 border-red-200';
      case 'in-review': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'escalated': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'resolved': return 'bg-green-50 text-green-600 border-green-200';
      default: return '';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'self-harm': return 'Self-Harm';
      case 'suicidal': return 'Suicidal';
      case 'abuse': return 'Abuse';
      case 'panic': return 'Panic';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'self-harm':
        return <Heart className="w-4 h-4 text-red-600" />;
      case 'suicidal':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'abuse':
        return <Siren className="w-4 h-4 text-orange-600" />;
      case 'panic':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Safety & Crisis Management</h1>
        <p className="text-gray-500">Monitor and respond to user safety concerns and mental health crises</p>
      </div>

      {/* Alert */}
      {stats.open > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">{stats.open} open incident(s) requiring immediate attention</span>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: stats.total, icon: BarChart3, iconClass: 'text-slate-600' },
          { label: 'Open Cases', value: stats.open, icon: AlertTriangle, iconClass: 'text-red-600' },
          { label: 'Escalated', value: stats.escalated, icon: Siren, iconClass: 'text-purple-600' },
          { label: 'Follow-ups', value: stats.followUpNeeded, icon: BadgeCheck, iconClass: 'text-blue-600' },
        ].map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <Card className="p-4 bg-white border-[#E8ECFF]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-medium text-gray-600">{stat.label}</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</div>
                </div>
                <stat.icon className={`w-6 h-6 ${stat.iconClass}`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Trending Chart */}
      <Card className="p-6 bg-white border-[#E8ECFF]">
        <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Weekly Trend
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECFF" />
            <XAxis dataKey="day" stroke="#9CA3AF" style={{ fontSize: 12 }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E8ECFF' }} />
            <Bar dataKey="reports" fill="#3B82F6" name="Reports" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 rounded-lg bg-white border border-[#E8ECFF] text-gray-900 cursor-pointer hover:border-blue-300 transition-colors"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="escalated">Escalated</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value as any)}
          className="px-4 py-2 rounded-lg bg-white border border-[#E8ECFF] text-gray-900 cursor-pointer hover:border-blue-300 transition-colors"
        >
          <option value="all">All Severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <PhoneCall className="w-4 h-4" />
          Contact Crisis Line
        </Button>
      </div>

      {/* Incidents Table */}
      <Card className="border-[#E8ECFF] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <p>Loading incidents...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <p>Error: {error}</p>
            </div>
          ) : filteredIncidents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No incidents found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#E8ECFF] hover:bg-transparent">
                  <TableHead className="text-gray-600">User</TableHead>
                  <TableHead className="text-gray-600">Type</TableHead>
                  <TableHead className="text-gray-600">Severity</TableHead>
                  <TableHead className="text-gray-600">Status</TableHead>
                  <TableHead className="text-gray-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.slice(0, 8).map((incident) => (
                  <motion.tr
                    key={incident.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-[#E8ECFF] hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="text-gray-900 font-medium">{incident.user_name || 'Unknown'}</TableCell>
                    <TableCell className="text-gray-900 font-medium">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(incident.type)}
                        <span className="text-sm">{getTypeLabel(incident.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize ${getStatusColor(incident.status)}`}>
                        {incident.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Review
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
