import React, { useState } from 'react';
import { AlertCircle, TrendingUp, Heart, Shield, PhoneCall, CheckCircle2, Clock, BarChart3, AlertTriangle, Siren, BadgeCheck, Activity } from 'lucide-react';
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface IncidentReport {
  id: string;
  type: 'self-harm' | 'suicidal' | 'abuse' | 'panic';
  userId: string;
  userName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-review' | 'resolved' | 'escalated';
  reportedAt: string;
  followUp: boolean;
  notes: string;
}

const mockIncidents: IncidentReport[] = [
  { id: '1', type: 'panic', userId: 'U123', userName: 'Ama Osei', severity: 'high', status: 'in-review', reportedAt: '2 hours ago', followUp: true, notes: 'Panic attack during chat session' },
  { id: '2', type: 'self-harm', userId: 'U456', userName: 'Kwame M.', severity: 'critical', status: 'escalated', reportedAt: '1 day ago', followUp: true, notes: 'User mentioned self-harm thoughts' },
  { id: '3', type: 'abuse', userId: 'U789', userName: 'Akosua B.', severity: 'high', status: 'open', reportedAt: '3 days ago', followUp: false, notes: 'User reported experiencing abuse at home' },
  { id: '4', type: 'suicidal', userId: 'U321', userName: 'Yaw A.', severity: 'critical', status: 'escalated', reportedAt: '5 days ago', followUp: true, notes: 'Suicidal ideation mentioned' },
  { id: '5', type: 'panic', userId: 'U654', userName: 'Adwoa P.', severity: 'medium', status: 'resolved', reportedAt: '1 week ago', followUp: false, notes: 'Panic attack - user calmed down after support' },
];

const trendData = [
  { day: 'Mon', reports: 3, escalations: 1 },
  { day: 'Tue', reports: 5, escalations: 2 },
  { day: 'Wed', reports: 2, escalations: 0 },
  { day: 'Thu', reports: 6, escalations: 2 },
  { day: 'Fri', reports: 4, escalations: 1 },
  { day: 'Sat', reports: 3, escalations: 1 },
  { day: 'Sun', reports: 2, escalations: 0 },
];

interface AdminSafetyManagementProps {
  selectedLanguage: string;
}

export function AdminSafetyManagement({ selectedLanguage }: AdminSafetyManagementProps) {
  void selectedLanguage;
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in-review' | 'escalated' | 'resolved'>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');

  const filteredIncidents = mockIncidents.filter(incident => {
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;
    return matchesStatus && matchesSeverity;
  });

  const stats = {
    total: mockIncidents.length,
    open: mockIncidents.filter(i => i.status === 'open').length,
    escalated: mockIncidents.filter(i => i.status === 'escalated').length,
    resolved: mockIncidents.filter(i => i.status === 'resolved').length,
    followUpNeeded: mockIncidents.filter(i => i.followUp && i.status !== 'resolved').length,
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
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Total Reports', value: stats.total, icon: BarChart3, iconClass: 'text-slate-600' },
          { label: 'Open Cases', value: stats.open, icon: AlertTriangle, iconClass: 'text-red-600' },
          { label: 'In Review', value: mockIncidents.filter(i => i.status === 'in-review').length, icon: Clock, iconClass: 'text-yellow-600' },
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

      {/* Trends */}
      <Card className="p-6 bg-white border-[#E8ECFF]">
        <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Weekly Safety Reports Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECFF" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #E8ECFF', borderRadius: '8px' }}
              labelStyle={{ color: '#111827' }}
            />
            <Legend />
            <Bar dataKey="reports" fill="#3B82F6" name="Safety Reports" />
            <Bar dataKey="escalations" fill="#EF4444" name="Escalations" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 rounded-lg bg-white border border-[#E8ECFF] text-gray-900 cursor-pointer hover:border-blue-300 transition-colors"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-review">In Review</option>
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
          <Table>
            <TableHeader>
              <TableRow className="border-[#E8ECFF] hover:bg-transparent">
                <TableHead className="text-gray-600">Type</TableHead>
                <TableHead className="text-gray-600">User</TableHead>
                <TableHead className="text-gray-600">Severity</TableHead>
                <TableHead className="text-gray-600">Status</TableHead>
                <TableHead className="text-gray-600">Reported</TableHead>
                <TableHead className="text-gray-600">Follow-Up</TableHead>
                <TableHead className="text-gray-600">Notes</TableHead>
                <TableHead className="text-gray-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => (
                <motion.tr
                  key={incident.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-[#E8ECFF] hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="text-gray-900 font-medium">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(incident.type)}
                      <span>{getTypeLabel(incident.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{incident.userName}</TableCell>
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
                  <TableCell className="text-gray-600 text-sm">{incident.reportedAt}</TableCell>
                  <TableCell>
                    {incident.followUp ? (
                      <Badge className="bg-blue-50 text-blue-600 border-blue-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Needed
                      </Badge>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm max-w-xs truncate">{incident.notes}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                        <AlertCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50">
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
