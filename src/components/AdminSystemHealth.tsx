import React, { useState, useMemo } from 'react';
import { Activity, Server, Zap, AlertTriangle, CheckCircle2, TrendingUp, Database } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';

const performanceData = [
  { time: '12:00', response: 145, errors: 2, uptime: 99.9 },
  { time: '12:30', response: 162, errors: 1, uptime: 99.9 },
  { time: '1:00', response: 138, errors: 0, uptime: 99.95 },
  { time: '1:30', response: 175, errors: 3, uptime: 99.8 },
  { time: '2:00', response: 152, errors: 1, uptime: 99.9 },
  { time: '2:30', response: 168, errors: 2, uptime: 99.85 },
  { time: '3:00', response: 140, errors: 0, uptime: 99.95 },
  { time: '3:30', response: 158, errors: 1, uptime: 99.9 },
];

const memoryData = [
  { time: '12:00', memory: 65, cpu: 42, database: 55 },
  { time: '12:30', memory: 68, cpu: 45, database: 58 },
  { time: '1:00', memory: 62, cpu: 40, database: 52 },
  { time: '1:30', memory: 72, cpu: 48, database: 62 },
  { time: '2:00', memory: 66, cpu: 43, database: 56 },
  { time: '2:30', memory: 70, cpu: 46, database: 60 },
  { time: '3:00', memory: 64, cpu: 41, database: 54 },
  { time: '3:30', memory: 68, cpu: 44, database: 58 },
];

interface SystemMetric {
  name: string;
  value: string | number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: number;
  icon: React.ReactNode;
}

interface AdminSystemHealthProps {
  selectedLanguage: string;
}

export function AdminSystemHealth({ selectedLanguage }: AdminSystemHealthProps) {
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h'>('1h');

  const metrics: SystemMetric[] = [
    {
      name: 'API Response Time',
      value: 156,
      unit: 'ms',
      status: 'healthy',
      trend: -2.5,
      icon: <Zap className="w-5 h-5 text-blue-400" />,
    },
    {
      name: 'System Uptime',
      value: 99.92,
      unit: '%',
      status: 'healthy',
      trend: 0,
      icon: <Activity className="w-5 h-5 text-green-400" />,
    },
    {
      name: 'Error Rate',
      value: 0.8,
      unit: '/minute',
      status: 'warning',
      trend: 12,
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    },
    {
      name: 'Active Sessions',
      value: 847,
      unit: 'users',
      status: 'healthy',
      trend: 8.3,
      icon: <Server className="w-5 h-5 text-purple-400" />,
    },
    {
      name: 'Memory Usage',
      value: 68,
      unit: '%',
      status: 'healthy',
      trend: -1.2,
      icon: <Database className="w-5 h-5 text-orange-400" />,
    },
    {
      name: 'Database Queries',
      value: 2145,
      unit: '/min',
      status: 'healthy',
      trend: 3.5,
      icon: <Server className="w-5 h-5 text-cyan-400" />,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-50 text-green-600 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200"><AlertTriangle className="w-3 h-3 mr-1" /> Warning</Badge>;
      case 'critical':
        return <Badge className="bg-red-50 text-red-600 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" /> Critical</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
        <p className="text-gray-500">Monitor technical performance, infrastructure health, and user activity metrics</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {(['1h', '6h', '24h'] as const).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            onClick={() => setTimeRange(range)}
            className={timeRange === range ? 'bg-blue-600 hover:bg-blue-700' : 'border-[#E8ECFF] hover:bg-gray-50'}
          >
            Last {range === '1h' ? '1 Hour' : range === '6h' ? '6 Hours' : '24 Hours'}
          </Button>
        ))}
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
            <Card className="p-4 bg-white border-[#E8ECFF] hover:border-blue-200 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>{metric.icon}</div>
                {getStatusBadge(metric.status)}
              </div>
              <h3 className="text-sm text-gray-600 mb-1">{metric.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                <span className="text-gray-500 text-sm">{metric.unit}</span>
              </div>
              <div className={`text-xs mt-2 flex items-center gap-1 ${metric.trend < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend !== 0 && (
                  <>
                    <TrendingUp className={`w-3 h-3 ${metric.trend < 0 ? 'rotate-180' : ''}`} />
                    {Math.abs(metric.trend)}% from 1h ago
                  </>
                )}
                {metric.trend === 0 && <span>Stable</span>}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Response Time & Errors */}
        <Card className="p-6 bg-white border-[#E8ECFF]">
          <h3 className="text-gray-900 font-semibold mb-4">Response Time & Error Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECFF" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis yAxisId="left" stroke="#9CA3AF" />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #E8ECFF', borderRadius: '8px' }}
                labelStyle={{ color: '#111827' }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="response" stroke="#3B82F6" name="Response (ms)" strokeWidth={2} />
              <Bar yAxisId="right" dataKey="errors" fill="#EF4444" name="Errors" opacity={0.6} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* Uptime */}
        <Card className="p-6 bg-white border-[#E8ECFF]">
          <h3 className="text-gray-900 font-semibold mb-4">System Uptime</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECFF" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[99.7, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #E8ECFF', borderRadius: '8px' }}
                labelStyle={{ color: '#111827' }}
              />
              <Area type="monotone" dataKey="uptime" stroke="#10B981" fill="#10B98120" name="Uptime %" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Resource Usage */}
      <Card className="p-6 bg-white border-[#E8ECFF]">
        <h3 className="text-gray-900 font-semibold mb-4">Resource Utilization</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={memoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECFF" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #E8ECFF', borderRadius: '8px' }}
              labelStyle={{ color: '#111827' }}
            />
            <Legend />
            <Line type="monotone" dataKey="memory" stroke="#F59E0B" name="Memory %" strokeWidth={2} />
            <Line type="monotone" dataKey="cpu" stroke="#06B6D4" name="CPU %" strokeWidth={2} />
            <Line type="monotone" dataKey="database" stroke="#8B5CF6" name="Database %" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Service Status */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-white border-[#E8ECFF]">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            Service Status
          </h3>
          <div className="space-y-2">
            {[
              { name: 'Chat API', status: 'healthy' },
              { name: 'Database Server', status: 'healthy' },
              { name: 'Cache Layer', status: 'warning' },
              { name: 'Email Service', status: 'healthy' },
            ].map((service, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-[#E8ECFF] last:border-0">
                <span className="text-gray-600">{service.name}</span>
                {getStatusBadge(service.status)}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 bg-white border-[#E8ECFF]">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-600" />
            Recent Events
          </h3>
          <div className="space-y-2 text-sm">
            {[
              { time: '3:42 PM', event: 'Database backup completed' },
              { time: '3:15 PM', event: 'Cache cleared and rebuilt' },
              { time: '2:50 PM', event: 'Load balancer reconfigured' },
              { time: '1:30 PM', event: 'SSL certificate renewed' },
            ].map((log, idx) => (
              <div key={idx} className="flex items-start justify-between py-2 border-b border-[#E8ECFF] last:border-0">
                <span className="text-gray-600">{log.event}</span>
                <span className="text-gray-400 text-xs">{log.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
