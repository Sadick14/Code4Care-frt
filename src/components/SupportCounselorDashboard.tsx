import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { BadgeCheck, Clock3, LogOut, MessageSquare, PhoneCall, UserRound, AlertTriangle } from 'lucide-react';

import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface SupportCounselorDashboardProps {
  counselorName: string;
  onLogout: () => void;
}

interface CounselorTicket {
  id: string;
  user: string;
  ageRange: string;
  topic: string;
  status: 'waiting' | 'active' | 'escalated' | 'resolved';
  queuedFor: string;
}

const mockTickets: CounselorTicket[] = [
  { id: 'SUP-103', user: 'SilentThinker', ageRange: '16-18', topic: 'Panic episode', status: 'waiting', queuedFor: '2m' },
  { id: 'SUP-104', user: 'HopeSeeker', ageRange: '15-18', topic: 'Relationship pressure', status: 'active', queuedFor: '11m' },
  { id: 'SUP-105', user: 'BraveHeart', ageRange: '19-24', topic: 'Contraception confusion', status: 'resolved', queuedFor: '18m' },
  { id: 'SUP-106', user: 'DreamSeeker', ageRange: '13-15', topic: 'Abuse concern', status: 'escalated', queuedFor: '5m' },
];

export function SupportCounselorDashboard({ counselorName, onLogout }: SupportCounselorDashboardProps) {
  const [tickets, setTickets] = useState<CounselorTicket[]>(mockTickets);

  const stats = useMemo(() => ({
    waiting: tickets.filter((ticket) => ticket.status === 'waiting').length,
    active: tickets.filter((ticket) => ticket.status === 'active').length,
    escalated: tickets.filter((ticket) => ticket.status === 'escalated').length,
    resolved: tickets.filter((ticket) => ticket.status === 'resolved').length,
  }), [tickets]);

  const updateStatus = (id: string, status: CounselorTicket['status']) => {
    setTickets((prev) => prev.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket)));
  };

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Counselor Dashboard</h1>
          <p className="text-gray-500">Welcome, {counselorName}. Manage support sessions and escalate high-risk cases.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={onLogout}>
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Waiting', value: stats.waiting, icon: Clock3, iconClass: 'text-yellow-600' },
          { label: 'Active Sessions', value: stats.active, icon: MessageSquare, iconClass: 'text-blue-600' },
          { label: 'Escalated', value: stats.escalated, icon: AlertTriangle, iconClass: 'text-red-600' },
          { label: 'Resolved Today', value: stats.resolved, icon: BadgeCheck, iconClass: 'text-green-600' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-4 bg-white border-[#E8ECFF]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <Icon className={`w-6 h-6 ${stat.iconClass}`} />
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="border-[#E8ECFF] bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8ECFF]">
          <h2 className="font-semibold text-gray-900">Support Queue</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8ECFF]">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Ticket</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">User</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Age</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Topic</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Queue Time</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <motion.tr
                  key={ticket.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-[#E8ECFF] last:border-0 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-gray-900 font-semibold">{ticket.id}</td>
                  <td className="py-3 px-4 text-gray-700">
                    <div className="flex items-center gap-2">
                      <UserRound className="w-4 h-4 text-gray-400" />
                      {ticket.user}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{ticket.ageRange}</td>
                  <td className="py-3 px-4 text-gray-600">{ticket.topic}</td>
                  <td className="py-3 px-4 text-gray-600">{ticket.queuedFor}</td>
                  <td className="py-3 px-4">
                    <Badge
                      className={
                        ticket.status === 'waiting'
                          ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                          : ticket.status === 'active'
                          ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : ticket.status === 'escalated'
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : 'bg-green-50 text-green-600 border-green-200'
                      }
                    >
                      {ticket.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {ticket.status === 'waiting' && (
                        <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => updateStatus(ticket.id, 'active')}>
                          Start
                        </Button>
                      )}
                      {ticket.status === 'active' && (
                        <>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => updateStatus(ticket.id, 'escalated')}>
                            Escalate
                          </Button>
                          <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => updateStatus(ticket.id, 'resolved')}>
                            Resolve
                          </Button>
                        </>
                      )}
                      {(ticket.status === 'escalated' || ticket.status === 'resolved') && (
                        <Button size="sm" variant="ghost" className="text-gray-600 hover:text-gray-700 hover:bg-gray-100" onClick={() => updateStatus(ticket.id, 'active')}>
                          Reopen
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5 border-[#E8ECFF] bg-white">
          <h3 className="font-semibold text-gray-900 mb-2">Escalation Protocol</h3>
          <p className="text-sm text-gray-600">Escalate immediately if user mentions imminent self-harm, abuse in progress, or severe panic episodes.</p>
        </Card>
        <Card className="p-5 border-[#E8ECFF] bg-white">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-blue-600" />
            Emergency Contacts
          </h3>
          <p className="text-sm text-gray-600">DOVVSU: 055-1000-900, Mental Health: 050-911-4396, Emergency: 191 / 112</p>
        </Card>
      </div>
    </div>
  );
}
