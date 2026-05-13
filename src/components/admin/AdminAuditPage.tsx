import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';
import { ExportButton } from './ExportButton';
import type { ExportData } from './ExportButton';
import {
  StaffAccessService,
  StaffSession,
} from '@/services/staffAccessService';
import { logger } from '@/utils/logger';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-100 animate-pulse rounded ${className}`} />;
}

function formatDateTime(iso?: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

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
    const res = await fetch(`${API_BASE_URL}/admin/audit-logs?page=${page}&limit=20`, {
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

function logsToExportData(logs: AuditLogEntry[], title = 'System Audit Log'): ExportData {
  return {
    title,
    filename: 'audit-logs',
    headers: ['Timestamp', 'Actor', 'Actor Type', 'Action', 'Resource Type', 'Resource ID', 'Status', 'IP Address', 'Details'],
    rows: logs.map((l) => [
      formatDateTime(l.timestamp),
      l.actor_name ?? '',
      l.actor_type,
      l.action,
      l.resource_type,
      l.resource_id ?? '',
      l.status,
      l.ip_address ?? '',
      l.details && Object.keys(l.details).length ? JSON.stringify(l.details) : '',
    ]),
  };
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
      <span className="w-32 flex-shrink-0 text-xs font-medium text-gray-500">{label}</span>
      <span className="text-xs text-gray-800 break-all">{value ?? '—'}</span>
    </div>
  );
}

function AuditDetailModal({ log, onClose }: { log: AuditLogEntry; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.15 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#BE322D]" />
              <span className="font-semibold text-gray-900 text-sm">Audit Log Detail</span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="overflow-y-auto p-5 space-y-1">
            <DetailRow label="ID" value={<span className="font-mono text-gray-500">{log.id}</span>} />
            <DetailRow label="Timestamp" value={formatDateTime(log.timestamp)} />
            <DetailRow label="Actor" value={log.actor_name ?? '—'} />
            <DetailRow label="Actor Type" value={log.actor_type} />
            <DetailRow label="Actor ID" value={log.actor_id ? <span className="font-mono text-gray-500">…{log.actor_id.slice(-12)}</span> : '—'} />
            <DetailRow label="Action" value={<span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">{log.action}</span>} />
            <DetailRow label="Resource Type" value={log.resource_type} />
            <DetailRow label="Resource ID" value={log.resource_id ? <span className="font-mono text-gray-500">{log.resource_id}</span> : '—'} />
            <DetailRow label="Status" value={<span className={`font-semibold ${log.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{log.status}</span>} />
            <DetailRow label="IP Address" value={log.ip_address ?? '—'} />
            {log.details && Object.keys(log.details).length > 0 && (
              <div className="py-2">
                <p className="text-xs font-medium text-gray-500 mb-2">Details</p>
                <pre className="bg-gray-50 rounded-lg p-3 text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="px-5 py-3 border-t border-gray-100 flex justify-end">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">Close</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

interface AdminAuditPageProps {
  session: StaffSession;
}

export function AdminAuditPage({ session }: AdminAuditPageProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditPage, setAuditPage] = useState(1);
  const [auditLoading, setAuditLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const pageSize = 20;

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

  const totalAuditPages = Math.ceil(auditTotal / pageSize);

  async function fetchAllForExport(): Promise<ExportData> {
    const all: AuditLogEntry[] = [];
    for (let p = 1; p <= totalAuditPages; p++) {
      const d = await fetchAuditLogs(p, session.accessToken);
      if (d?.logs) all.push(...d.logs);
    }
    return logsToExportData(all);
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-gray-900">Admin System Audit</h1>
          <p className="text-sm text-gray-500 mt-0.5">Full System Audit Trail</p>
        </motion.div>

        <Card className="border-[#E8ECFF] bg-white overflow-hidden">
          <div className="p-5 border-b border-[#E8ECFF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#BE322D]" />
              <h3 className="font-semibold text-gray-900 text-sm">System Audit Log</h3>
              {auditTotal > 0 && <span className="text-xs text-gray-400">{auditTotal.toLocaleString()} entries</span>}
            </div>
            <ExportButton
              data={logsToExportData(auditLogs)}
              onFetchAll={fetchAllForExport}
            />
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
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {auditLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-[#E8ECFF]">
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-3 w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : auditLogs.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No audit logs found</td></tr>
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
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="flex items-center gap-1 text-xs text-[#BE322D] hover:text-[#a02825] font-medium transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
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

      {selectedLog && <AuditDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  );
}
