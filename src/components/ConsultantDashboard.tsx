import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Clock3, LogOut, UserCheck, CheckCircle2, PhoneCall } from 'lucide-react';

import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  StaffAccessService,
  StaffSession,
  SupportRequest,
} from '@/services/staffAccessService';

interface SupportCounselorDashboardProps {
  session: StaffSession;
  onLogout: () => void;
}

export function SupportCounselorDashboard({ session, onLogout }: SupportCounselorDashboardProps) {
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>(() => StaffAccessService.getSupportRequests());

  const waitingRequests = useMemo(
    () => supportRequests.filter((request) => request.status === 'waiting'),
    [supportRequests]
  );

  const myAssignedRequests = useMemo(
    () => supportRequests.filter((request) => request.assignedStaffId === session.staffId && request.status === 'assigned'),
    [supportRequests, session.staffId]
  );

  const myActiveRequests = useMemo(
    () => supportRequests.filter((request) => request.assignedStaffId === session.staffId && request.status === 'active'),
    [supportRequests, session.staffId]
  );

  const refreshRequests = () => {
    setSupportRequests(StaffAccessService.getSupportRequests());
  };

  const claimRequest = (requestId: string) => {
    const next = supportRequests.map((request) => {
      if (request.id !== requestId) {
        return request;
      }

      return {
        ...request,
        status: 'assigned' as const,
        assignedStaffId: session.staffId,
        assignedStaffName: session.name,
      };
    });

    StaffAccessService.saveSupportRequests(next);
    refreshRequests();
  };

  const connectRequest = (requestId: string) => {
    const next = supportRequests.map((request) => {
      if (request.id !== requestId) {
        return request;
      }

      return {
        ...request,
        status: 'active' as const,
      };
    });

    StaffAccessService.saveSupportRequests(next);
    refreshRequests();
  };

  const resolveRequest = (requestId: string) => {
    const next = supportRequests.map((request) => {
      if (request.id !== requestId) {
        return request;
      }

      return {
        ...request,
        status: 'resolved' as const,
      };
    });

    StaffAccessService.saveSupportRequests(next);
    refreshRequests();
  };

  const consultantStats = [
    { label: 'Waiting Queue', value: waitingRequests.length, icon: Clock3, iconClass: 'text-yellow-600' },
    { label: 'My Assigned', value: myAssignedRequests.length, icon: UserCheck, iconClass: 'text-blue-600' },
    { label: 'My Active', value: myActiveRequests.length, icon: Activity, iconClass: 'text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Consultant Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome, {session.name}. Manage support queue and active conversations.</p>
          </div>
          <Button variant="outline" className="gap-2 border-red-200 text-red-600 hover:bg-red-50" onClick={onLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {consultantStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                <Card className="p-4 border-[#E8ECFF]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <Icon className={`w-6 h-6 ${stat.iconClass}`} />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card className="border-[#E8ECFF] bg-white overflow-hidden">
            <div className="p-4 border-b border-[#E8ECFF] flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Waiting Queue</h2>
              <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200">{waitingRequests.length}</Badge>
            </div>
            <div className="divide-y divide-[#E8ECFF]">
              {waitingRequests.length === 0 && (
                <div className="p-6 text-sm text-gray-500">No pending requests right now.</div>
              )}
              {waitingRequests.map((request) => (
                <div key={request.id} className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{request.userNickname}</p>
                    <p className="text-sm text-gray-500">Age {request.userAge} • Requested {request.requestedAt}</p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => claimRequest(request.id)}>
                    Claim
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-[#E8ECFF] bg-white overflow-hidden">
            <div className="p-4 border-b border-[#E8ECFF] flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">My Assigned Cases</h2>
              <Badge className="bg-blue-50 text-blue-600 border-blue-200">{myAssignedRequests.length + myActiveRequests.length}</Badge>
            </div>
            <div className="divide-y divide-[#E8ECFF]">
              {myAssignedRequests.length === 0 && myActiveRequests.length === 0 && (
                <div className="p-6 text-sm text-gray-500">No assigned cases yet.</div>
              )}

              {myAssignedRequests.map((request) => (
                <div key={request.id} className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{request.userNickname}</p>
                    <p className="text-sm text-gray-500">Assigned • {request.requestedAt}</p>
                  </div>
                  <Button size="sm" variant="outline" className="gap-2 border-green-200 text-green-700 hover:bg-green-50" onClick={() => connectRequest(request.id)}>
                    <PhoneCall className="w-4 h-4" />
                    Connect
                  </Button>
                </div>
              ))}

              {myActiveRequests.map((request) => (
                <div key={request.id} className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{request.userNickname}</p>
                    <p className="text-sm text-gray-500">Active • Duration {request.duration ?? 0} min</p>
                  </div>
                  <Button size="sm" variant="outline" className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50" onClick={() => resolveRequest(request.id)}>
                    <CheckCircle2 className="w-4 h-4" />
                    Resolve
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
