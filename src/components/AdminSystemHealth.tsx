import React, { useState, useEffect } from 'react';
import { FileText, Clock3, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { AuditLogService } from '@/services/auditLogService';
import { buildAdminExportFilename, downloadJsonFile } from '@/utils/adminExport';
import { logger } from '@/utils/logger';

interface AdminSystemHealthProps {
  selectedLanguage: string;
  accessToken?: string;
}

interface AuditLog {
  time: string;
  action: string;
  actor: string;
  status: 'success' | 'warning' | 'failure';
}

interface PerformanceData {
  time: string;
  response: number;
  errors: number;
  uptime: number;
}

export function AdminSystemHealth({ selectedLanguage, accessToken }: AdminSystemHealthProps) {
  void selectedLanguage;
  const [isLoadingAudit, setIsLoadingAudit] = useState(true);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Load audit logs
  useEffect(() => {
    let mounted = true;

    const loadAuditLogs = async () => {
      setIsLoadingAudit(true);
      try {
        const response = await AuditLogService.listAuditLogs({
          limit: 4,
          page: 1,
        }, accessToken);
        if (mounted) {
          // Transform audit logs to display format
          const transformed = response.logs.map((log) => ({
            time: new Date(log.timestamp).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            action: log.action,
            actor: log.actor_name,
            status: log.status as 'success' | 'warning' | 'failure',
          }));
          setAuditLogs(transformed);
        }
      } catch (error) {
        logger.error('Failed to load audit logs', error);
        setAuditLogs([]);
      } finally {
        if (mounted) {
          setIsLoadingAudit(false);
        }
      }
    };

    void loadAuditLogs();
    return () => { mounted = false; };
  }, []);

  const LogSkeleton = () => (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-[#E8ECFF] bg-gray-50 p-3">
      <div className="space-y-1 width-full">
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse shrink-0" />
    </div>
  );

  const handleExport = () => {
    downloadJsonFile(buildAdminExportFilename('system-audit'), {
      section: 'system-audit',
      generatedAt: new Date().toISOString(),
      auditLogs,
    });
  };

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">System Audit</h1>
          <p className="text-gray-500">Review system audit activity.</p>
        </div>
        <Button variant="outline" className="gap-2 border-[#F4D6D5] hover:bg-[#FFF1F1] text-[#BE322D]" onClick={handleExport}>
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
      {/* System Audit */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="p-6 bg-white border-[#E8ECFF]">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-green-600" />
            Audit Logs
          </h3>
          <p className="mb-3 text-xs text-gray-500">User and system events captured across the platform.</p>
          <div className="space-y-3">
            {isLoadingAudit
              ? Array.from({ length: 4 }).map((_, i) => <LogSkeleton key={i} />)
              : auditLogs.length > 0
                ? auditLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-4 rounded-lg border border-[#E8ECFF] bg-gray-50 p-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{log.action}</span>
                        <Badge className={log.status === 'success' ? 'bg-green-50 text-green-700 border-green-200' : log.status === 'warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'}>
                          {log.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">{log.actor}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                      <Clock3 className="w-3 h-3" />
                      {log.time}
                    </div>
                  </div>
                ))
                : (
                  <div className="text-center text-xs text-gray-500 py-4">No audit logs available</div>
                )}
          </div>
        </Card>
      </div>
    </div>
  );
}
