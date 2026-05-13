import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, FileText, Users, AlertTriangle, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle } from 'lucide-react';
import {
  StaffAccessService,
  StaffSession,
  AdminReportItem,
} from '@/services/staffAccessService';
import { logger } from '@/utils/logger';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-100 animate-pulse rounded ${className}`} />;
}

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateTime(iso?: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

const REPORT_STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  reviewed: 'bg-blue-100 text-blue-700 border-blue-200',
  resolved: 'bg-green-100 text-green-700 border-green-200',
  dismissed: 'bg-gray-100 text-gray-500 border-gray-200',
};

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor_type: string;
  actor_id?: string;
  actor_name?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  status: string;
  details?: Record<string, unknown>;
  ip_address?: string;
}

interface AuditLogResponse {
  logs: AuditLogEntry[];
  total: number;
  page: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

async function fetchAuditLogs(page: number, token?: string): Promise<AuditLogResponse | null> {
  if (!API_BASE_URL) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/admin/audit-logs?page=${page}&page_size=20`, {
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) return null;
    return await res.json() as AuditLogResponse;
  } catch (e) {
    logger.error('audit logs', e);
    return null;
  }
}

interface AdminAuditPageProps {
  session: StaffSession;
}

export function AdminAuditPage({ session }: AdminAuditPageProps) {
  const [reports, setReports] = useState<AdminReportItem[]>([]);
  const [reportsTotal, setReportsTotal] = useState(0);
  const [reportsPage, setReportsPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditPage, setAuditPage] = useState(1);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [auditLoading, setAuditLoading] = useState(true);

  const pageSize = 20;

  useEffect(() => {
    let mounted = true;
    setReportsLoading(true);

    StaffAccessService.listReports(
      { page: reportsPage, page_size: pageSize, status_filter: statusFilter ?? undefined },
      session.accessToken,
    )
      .then((r) => {
        if (!mounted) return;
        setReports(r.reports ?? []);
        setReportsTotal(r.total ?? 0);
        setReportsLoading(false);
      })
      .catch((e) => { logger.error('reports', e); if (mounted) setReportsLoading(false); });

    return () => { mounted = false; };
  }, [reportsPage, statusFilter, session.accessToken]);

  useEffect(() => {
    let mounted = true;
    setAuditLoading(true);

    fetchAuditLogs(auditPage, session.accessToken).then((r) => {
      if (!mounted) return;
      setAuditLogs(r?.logs ?? []);
      setAuditTotal(r?.total ?? 0);
      setAuditLoading(false);
    });

    return () => { mounted = false; };
  }, [auditPage, session.accessToken]);

  const totalReportPages = Math.ceil(reportsTotal / pageSize);
  const totalAuditPages = Math.ceil(auditTotal / pageSize);

  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;
  const reviewedCount = reports.filter((r) => r.status === 'reviewed').length;
  const dismissedCount = reports.filter((r) => r.status === 'dismissed').length;

  async function updateReportStatus(reportId: string, status: string, notes?: string) {
    try {
      await StaffAccessService.updateReport(reportId, { status, resolution_notes: notes }, session.accessToken);
      setReports((prev) => prev.map((r) => r.id === reportId ? { ...r, status, reviewed_at: new Date().toISOString() } : r));
    } catch (e) {
      logger.error('update report', e);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-gray-900">Admin & Audit</h1>
          <p className="text-sm text-gray-500 mt-0.5">Content reports, admin actions and system audit trail</p>
        </motion.div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Reports', value: reportsTotal, icon: FileText, bg: 'bg-blue-50', color: 'text-blue-600' },
            { label: 'Pending Review', value: pendingCount, icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
            { label: 'Resolved', value: resolvedCount, icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
            { label: 'Dismissed', value: dismissedCount, icon: XCircle, bg: 'bg-gray-50', color: 'text-gray-500' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="p-4 border-[#E8ECFF] bg-white">
                {reportsLoading ? (
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

        {/* Report moderation queue */}
        <Card className="border-[#E8ECFF] bg-white overflow-hidden">
          <div className="p-5 border-b border-[#E8ECFF] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-gray-900 text-sm">Content Reports</h3>
              {pendingCount > 0 && (
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{pendingCount} pending</span>
              )}
            </div>
            <div className="flex gap-2">
              {([
                { label: 'All', value: null },
                { label: 'Pending', value: 'pending' },
                { label: 'Reviewed', value: 'reviewed' },
                { label: 'Resolved', value: 'resolved' },
                { label: 'Dismissed', value: 'dismissed' },
              ] as { label: string; value: string | null }[]).map((opt) => (
                <button key={opt.label} onClick={() => { setStatusFilter(opt.value); setReportsPage(1); }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
                    statusFilter === opt.value ? 'bg-[#BE322D] text-white border-[#BE322D]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-[#E8ECFF]">
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Submitted</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Session</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Reason</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 max-w-xs">Message</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Reviewed</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-[#E8ECFF]">
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-3 w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : reports.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No reports found</td></tr>
                ) : reports.map((report) => (
                  <tr key={report.id} className="border-b border-[#E8ECFF] hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-xs text-gray-600">{formatDate(report.created_at)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">…{report.session_id?.slice(-8)}</td>
                    <td className="px-4 py-3 text-xs text-gray-700 max-w-[120px] truncate">{report.reason}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-xs">
                      <span className="line-clamp-2">{report.message_content?.slice(0, 80)}{report.message_content?.length > 80 ? '…' : ''}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs ${REPORT_STATUS_BADGE[report.status] ?? 'bg-gray-100 text-gray-600'}`}>{report.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatDate(report.reviewed_at)}</td>
                    <td className="px-4 py-3">
                      {report.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline"
                            className="h-6 text-xs px-2 text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => updateReportStatus(report.id, 'resolved')}>
                            Resolve
                          </Button>
                          <Button size="sm" variant="outline"
                            className="h-6 text-xs px-2 text-gray-500 border-gray-200 hover:bg-gray-50"
                            onClick={() => updateReportStatus(report.id, 'dismissed')}>
                            Dismiss
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalReportPages > 1 && (
            <div className="p-4 border-t border-[#E8ECFF] flex items-center justify-between">
              <span className="text-gray-500 text-xs">Showing {((reportsPage - 1) * pageSize) + 1}–{Math.min(reportsPage * pageSize, reportsTotal)} of {reportsTotal.toLocaleString()}</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => setReportsPage((p) => Math.max(1, p - 1))} disabled={reportsPage === 1} className="h-7 w-7 p-0">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-3 py-1 text-xs text-gray-600 font-medium">{reportsPage} / {totalReportPages}</span>
                <Button variant="outline" size="sm" onClick={() => setReportsPage((p) => Math.min(totalReportPages, p + 1))} disabled={reportsPage === totalReportPages} className="h-7 w-7 p-0">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Audit log */}
        <Card className="border-[#E8ECFF] bg-white overflow-hidden">
          <div className="p-5 border-b border-[#E8ECFF] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#BE322D]" />
            <h3 className="font-semibold text-gray-900 text-sm">System Audit Log</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-[#E8ECFF]">
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Timestamp</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Actor</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Action</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Resource</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">IP</th>
                </tr>
              </thead>
              <tbody>
                {auditLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-[#E8ECFF]">
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-3 w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : auditLogs.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">No audit logs found</td></tr>
                ) : auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-[#E8ECFF] hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{formatDateTime(log.timestamp)}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-gray-900">{log.actor_name ?? '—'}</p>
                      <p className="text-xs text-gray-400">{log.actor_type}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700 font-mono">{log.action}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-700">{log.resource_type}</p>
                      {log.resource_id && <p className="text-xs text-gray-400 font-mono">…{log.resource_id.slice(-8)}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${log.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono">{log.ip_address ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalAuditPages > 1 && (
            <div className="p-4 border-t border-[#E8ECFF] flex items-center justify-between">
              <span className="text-gray-500 text-xs">Page {auditPage} of {totalAuditPages} · {auditTotal.toLocaleString()} entries</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => setAuditPage((p) => Math.max(1, p - 1))} disabled={auditPage === 1} className="h-7 w-7 p-0">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-3 py-1 text-xs text-gray-600 font-medium">{auditPage} / {totalAuditPages}</span>
                <Button variant="outline" size="sm" onClick={() => setAuditPage((p) => Math.min(totalAuditPages, p + 1))} disabled={auditPage === totalAuditPages} className="h-7 w-7 p-0">
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
