import React, { useState } from 'react';
import { AlertCircle, TrendingUp, Heart, Shield, PhoneCall, CheckCircle2, Clock } from 'lucide-react';
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
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'in-review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'escalated': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return '';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'self-harm': return '🩹 Self-Harm';
      case 'suicidal': return '⚠️ Suicidal';
      case 'abuse': return '🚨 Abuse';
      case 'panic': return '😰 Panic';
      default: return type;
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
          className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300"
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
          { label: 'Total Reports', value: stats.total, color: 'from-slate-600 to-slate-700', icon: '📊' },
          { label: 'Open Cases', value: stats.open, color: 'from-red-600 to-red-700', icon: '🔴' },
          { label: 'In Review', value: mockIncidents.filter(i => i.status === 'in-review').length, color: 'from-yellow-600 to-yellow-700', icon: '🟡' },
          { label: 'Escalated', value: stats.escalated, color: 'from-purple-600 to-purple-700', icon: '🟣' },
          { label: 'Follow-ups', value: stats.followUpNeeded, color: 'from-blue-600 to-blue-700', icon: '📞' },
        ].map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <Card className={`p-4 bg-gradient-to-br ${stat.color} text-white border-0`}>
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-xs font-medium text-white/80">{stat.label}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Trends */}
      <Card className="p-6 bg-slate-800/50 border-slate-700">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Weekly Safety Reports Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
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
          className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white cursor-pointer"
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
          className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white cursor-pointer"
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
      <Card className="border-slate-700 bg-slate-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-300">Type</TableHead>
                <TableHead className="text-slate-300">User</TableHead>
                <TableHead className="text-slate-300">Severity</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Reported</TableHead>
                <TableHead className="text-slate-300">Follow-Up</TableHead>
                <TableHead className="text-slate-300">Notes</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => (
                <motion.tr
                  key={incident.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-slate-700 hover:bg-slate-700/30 transition-colors"
                >
                  <TableCell className="text-white font-medium">{getTypeLabel(incident.type)}</TableCell>
                  <TableCell className="text-slate-300">{incident.userName}</TableCell>
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
                  <TableCell className="text-slate-400 text-sm">{incident.reportedAt}</TableCell>
                  <TableCell>
                    {incident.followUp ? (
                      <Badge className="bg-blue-500/30 text-blue-300 border-blue-500/50">
                        <Clock className="w-3 h-3 mr-1" />
                        Needed
                      </Badge>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm max-w-xs truncate">{incident.notes}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20">
                        <AlertCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-500/20">
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
