import React, { useState, useMemo } from 'react';
import { Search, FileDown, Trash2, Eye, Plus, Check, X, Edit2, Users, UserCheck, UserMinus, UserX, Clock3, ClipboardList, Activity, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface User {
  id: string;
  nickname: string;
  age: string;
  gender: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  lastActive: string;
  sessionCount: number;
  activityScore: number;
}

interface StaffMember {
  id: string;
  name: string;
  role: 'supervisor' | 'counselor' | 'coordinator' | 'admin';
  status: 'active' | 'inactive';
  availability: 'available' | 'busy' | 'offline';
  email: string;
  phone: string;
  joinDate: string;
  trained: boolean;
  currentLoad: number;
}

interface SupportRequest {
  id: string;
  userId: string;
  userNickname: string;
  userAge: string;
  requestedAt: string;
  status: 'waiting' | 'assigned' | 'active' | 'resolved';
  assignedStaffId?: string;
  assignedStaffName?: string;
  duration?: number;
}

const mockUsers: User[] = [
  { id: '1', nickname: 'SilentThinker', age: '16-18', gender: 'Female', joinDate: '2025-11-15', status: 'active', lastActive: '2 hours', sessionCount: 24, activityScore: 92 },
  { id: '2', nickname: 'BraveHeart', age: '19-24', gender: 'Male', joinDate: '2025-10-22', status: 'active', lastActive: '5 mins', sessionCount: 67, activityScore: 87 },
  { id: '3', nickname: 'DreamSeeker', age: '13-15', gender: 'Female', joinDate: '2025-09-10', status: 'active', lastActive: '1 day', sessionCount: 42, activityScore: 78 },
  { id: '4', nickname: 'LoneWanderer', age: '16-18', gender: 'Male', joinDate: '2025-08-05', status: 'inactive', lastActive: '30 days', sessionCount: 8, activityScore: 12 },
  { id: '5', nickname: 'EchoVoice', age: '19-24', gender: 'Non-binary', joinDate: '2025-12-01', status: 'suspended', lastActive: 'Never', sessionCount: 2, activityScore: 5 },
  { id: '6', nickname: 'HopeSeeker', age: '15-18', gender: 'Female', joinDate: '2025-11-20', status: 'active', lastActive: '1 hour', sessionCount: 15, activityScore: 75 },
];

const mockStaff: StaffMember[] = [
  { id: 'staff-1', name: 'Sarah Johnson', role: 'counselor', status: 'active', availability: 'available', email: 'sarah@room1221.org', phone: '+233 24 123 4567', joinDate: '2025-01-15', trained: true, currentLoad: 2 },
  { id: 'staff-2', name: 'David Mensah', role: 'supervisor', status: 'active', availability: 'busy', email: 'david@room1221.org', phone: '+233 55 234 5678', joinDate: '2024-12-01', trained: true, currentLoad: 1 },
  { id: 'staff-3', name: 'Ama Asante', role: 'counselor', status: 'active', availability: 'available', email: 'ama@room1221.org', phone: '+233 20 345 6789', joinDate: '2025-02-10', trained: true, currentLoad: 0 },
  { id: 'staff-4', name: 'Kwasi Okonkwo', role: 'coordinator', status: 'inactive', availability: 'offline', email: 'kwasi@room1221.org', phone: '+233 54 456 7890', joinDate: '2024-11-05', trained: true, currentLoad: 0 },
];

const mockSupportRequests: SupportRequest[] = [
  { id: 'req-1', userId: '1', userNickname: 'SilentThinker', userAge: '16-18', requestedAt: '2 mins ago', status: 'active', assignedStaffId: 'staff-1', assignedStaffName: 'Sarah Johnson', duration: 2 },
  { id: 'req-2', userId: '2', userNickname: 'BraveHeart', userAge: '19-24', requestedAt: '15 mins ago', status: 'assigned', assignedStaffId: 'staff-2', assignedStaffName: 'David Mensah' },
  { id: 'req-3', userId: '6', userNickname: 'HopeSeeker', userAge: '15-18', requestedAt: '5 mins ago', status: 'waiting', duration: 5 },
];

interface AdminUserManagementProps {
  selectedLanguage: string;
}

export function AdminUserManagement({ selectedLanguage }: AdminUserManagementProps) {
  void selectedLanguage;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [sortBy, setSortBy] = useState<'nickname' | 'joinDate' | 'activity'>('activity');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>(mockSupportRequests);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'counselor' as const,
  });

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.age.includes(searchTerm)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(u => u.status === filterStatus);
    }

    // Sort
    if (sortBy === 'joinDate') {
      filtered.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
    } else if (sortBy === 'activity') {
      filtered.sort((a, b) => b.activityScore - a.activityScore);
    } else {
      filtered.sort((a, b) => a.nickname.localeCompare(b.nickname));
    }

    return filtered;
  }, [searchTerm, filterStatus, sortBy, users]);

  const handleAssignStaffToRequest = (requestId: string, staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    setSupportRequests(supportRequests.map(req =>
      req.id === requestId
        ? { ...req, status: 'assigned', assignedStaffId: staffId, assignedStaffName: staffMember?.name }
        : req
    ));
    // Update staff current load
    setStaff(staff.map(s =>
      s.id === staffId ? { ...s, currentLoad: s.currentLoad + 1 } : s
    ));
  };

  const handleAcceptRequest = (requestId: string) => {
    setSupportRequests(supportRequests.map(req =>
      req.id === requestId ? { ...req, status: 'active' } : req
    ));
  };

  const handleResolveRequest = (requestId: string) => {
    const request = supportRequests.find(r => r.id === requestId);
    setSupportRequests(supportRequests.filter(req => req.id !== requestId));
    // Update staff current load
    if (request?.assignedStaffId) {
      setStaff(staff.map(s =>
        s.id === request.assignedStaffId ? { ...s, currentLoad: Math.max(0, s.currentLoad - 1) } : s
      ));
    }
  };

  const handleAddStaff = () => {
    setEditingStaffId(null);
    setFormData({ name: '', email: '', phone: '', role: 'counselor' });
    setStaffModalOpen(true);
  };

  const handleEditStaff = (member: StaffMember) => {
    setEditingStaffId(member.id);
    setFormData({ name: member.name, email: member.email, phone: member.phone, role: member.role });
    setStaffModalOpen(true);
  };

  const handleSaveStaff = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all fields');
      return;
    }

    if (editingStaffId) {
      // Edit existing staff
      setStaff(staff.map(s =>
        s.id === editingStaffId
          ? { ...s, name: formData.name, email: formData.email, phone: formData.phone, role: formData.role }
          : s
      ));
    } else {
      // Add new staff
      const newStaff: StaffMember = {
        id: `staff-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        trained: false,
        currentLoad: 0,
      };
      setStaff([...staff, newStaff]);
    }

    setStaffModalOpen(false);
    setFormData({ name: '', email: '', phone: '', role: 'counselor' });
  };

  const handleDeleteStaff = (staffId: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setStaff(staff.filter(s => s.id !== staffId));
      // Cancel any pending requests assigned to this staff
      setSupportRequests(supportRequests.filter(req => req.assignedStaffId !== staffId));
    }
  };

  const handleToggleStaffStatus = (staffId: string) => {
    setStaff(staff.map(s =>
      s.id === staffId
        ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
        : s
    ));
  };

  const handleToggleTraining = (staffId: string) => {
    setStaff(staff.map(s =>
      s.id === staffId
        ? { ...s, trained: !s.trained }
        : s
    ));
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    staffActive: staff.filter(s => s.status === 'active').length,
    staffTotal: staff.length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-700 border-green-500/50';
      case 'inactive': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50';
      case 'suspended': return 'bg-red-500/20 text-red-700 border-red-500/50';
      default: return 'bg-slate-500/20 text-slate-700';
    }
  };

  const userStats = [
    { label: 'Total Users', value: stats.total, icon: Users, iconClass: 'text-blue-600' },
    { label: 'Active', value: stats.active, icon: UserCheck, iconClass: 'text-green-600' },
    { label: 'Inactive', value: stats.inactive, icon: UserMinus, iconClass: 'text-yellow-600' },
    { label: 'Suspended', value: stats.suspended, icon: UserX, iconClass: 'text-red-600' },
  ];

  const supportStats = [
    { label: 'Waiting', value: supportRequests.filter(r => r.status === 'waiting').length, icon: Clock3, iconClass: 'text-yellow-600' },
    { label: 'Assigned', value: supportRequests.filter(r => r.status === 'assigned').length, icon: ClipboardList, iconClass: 'text-blue-600' },
    { label: 'Active', value: supportRequests.filter(r => r.status === 'active').length, icon: Activity, iconClass: 'text-green-600' },
    { label: 'Resolved', value: supportRequests.filter(r => r.status === 'resolved').length, icon: Check, iconClass: 'text-slate-600' },
  ];

  const staffStats = [
    { label: 'Total Staff', value: stats.staffTotal, icon: Briefcase, iconClass: 'text-blue-600' },
    { label: 'Active', value: stats.staffActive, icon: UserCheck, iconClass: 'text-green-600' },
    { label: 'Inactive', value: staff.filter(s => s.status === 'inactive').length, icon: UserMinus, iconClass: 'text-slate-600' },
  ];

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">User, Staff & Support Management</h1>
        <p className="text-gray-500">Manage users, staff members, and support requests in real-time</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 border border-[#E8ECFF]">
          <TabsTrigger value="users">Users ({stats.total})</TabsTrigger>
          <TabsTrigger value="support">Support Requests ({supportRequests.length})</TabsTrigger>
          <TabsTrigger value="staff">Staff ({stats.staffTotal})</TabsTrigger>
        </TabsList>

        {/* USERS TAB */}
        <TabsContent value="users" className="space-y-6">
          {/* Users Stats */}
          <div className="grid grid-cols-4 gap-4">
            {userStats.map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <Card className="p-4 bg-white border-[#E8ECFF]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    </div>
                    <stat.icon className={`w-6 h-6 ${stat.iconClass}`} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by nickname or age..."
                className="pl-9 bg-gray-50 border-[#E8ECFF] text-gray-900 placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-white border border-[#E8ECFF] text-gray-900 cursor-pointer hover:border-blue-300 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-white border border-[#E8ECFF] text-gray-900 cursor-pointer hover:border-blue-300 transition-colors"
            >
              <option value="activity">Sort by Activity</option>
              <option value="nickname">Sort by Nickname</option>
              <option value="joinDate">Sort by Join Date</option>
            </select>

            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <FileDown className="w-4 h-4" />
              Export
            </Button>
          </div>

          {/* Users Table */}
          <Card className="border-[#E8ECFF] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#E8ECFF] hover:bg-transparent">
                    <TableHead className="text-gray-600">Nickname</TableHead>
                    <TableHead className="text-gray-600">Age</TableHead>
                    <TableHead className="text-gray-600">Gender</TableHead>
                    <TableHead className="text-gray-600">Status</TableHead>
                    <TableHead className="text-gray-600">Sessions</TableHead>
                    <TableHead className="text-gray-600">Activity</TableHead>
                    <TableHead className="text-gray-600">Last Active</TableHead>
                    <TableHead className="text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-[#E8ECFF] hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="text-gray-900 font-medium">
                          <div>
                            <p className="font-semibold">{user.nickname}</p>
                            <p className="text-xs text-gray-500">Joined {user.joinDate}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">{user.age}</TableCell>
                        <TableCell className="text-gray-600 text-sm">{user.gender}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-900 font-medium">{user.sessionCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                                style={{ width: `${user.activityScore}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{user.activityScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">{user.lastActive}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>

        </TabsContent>

        {/* SUPPORT REQUESTS TAB */}
        <TabsContent value="support" className="space-y-6">
          {/* Support Stats */}
          <div className="grid grid-cols-4 gap-4">
            {supportStats.map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <Card className="p-4 bg-white border-[#E8ECFF]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    </div>
                    <stat.icon className={`w-6 h-6 ${stat.iconClass}`} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Support Requests Table */}
          <Card className="border-[#E8ECFF] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#E8ECFF] hover:bg-transparent">
                    <TableHead className="text-gray-600">User</TableHead>
                    <TableHead className="text-gray-600">Age</TableHead>
                    <TableHead className="text-gray-600">Requested At</TableHead>
                    <TableHead className="text-gray-600">Duration</TableHead>
                    <TableHead className="text-gray-600">Status</TableHead>
                    <TableHead className="text-gray-600">Assigned Staff</TableHead>
                    <TableHead className="text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supportRequests.map((request) => {
                    const staffMember = staff.find(s => s.id === request.assignedStaffId);
                    return (
                      <motion.tr
                        key={request.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-[#E8ECFF] hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="text-gray-900 font-medium">
                          <div>
                            <p className="font-semibold">{request.userNickname}</p>
                            <p className="text-xs text-gray-500">ID: {request.userId}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">{request.userAge}</TableCell>
                        <TableCell className="text-gray-600 text-sm">{request.requestedAt}</TableCell>
                        <TableCell className="text-gray-600 text-sm">{request.duration ? `${request.duration} min` : '-'}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              request.status === 'waiting'
                                ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                                : request.status === 'assigned'
                                ? 'bg-blue-50 text-blue-600 border-blue-200'
                                : request.status === 'active'
                                ? 'bg-green-50 text-green-600 border-green-200'
                                : 'bg-gray-50 text-gray-600 border-gray-200'
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {staffMember ? (
                            <div className="space-y-1">
                              <Badge className="bg-green-50 text-green-600 border-green-200 block w-fit text-xs">
                                {staffMember.name}
                              </Badge>
                              <p className="text-xs text-gray-500">{staffMember.role}</p>
                            </div>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                              Unassigned
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {request.status === 'waiting' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => {
                                  const availableStaff = staff.filter(s => s.status === 'active');
                                  if (availableStaff.length > 0) {
                                    handleAssignStaffToRequest(request.id, availableStaff[0].id);
                                  }
                                }}
                              >
                                Assign
                              </Button>
                            )}
                            {request.status === 'assigned' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleAcceptRequest(request.id)}
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Connect
                              </Button>
                            )}
                            {(request.status === 'active' || request.status === 'assigned') && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                                onClick={() => handleResolveRequest(request.id)}
                              >
                                <X className="w-3 h-3 mr-1" />
                                Resolve
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* STAFF MANAGEMENT TAB */}
        <TabsContent value="staff" className="space-y-6">
          {/* Staff Stats */}
          <div className="grid grid-cols-3 gap-4">
            {staffStats.map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <Card className="p-4 bg-white border-[#E8ECFF]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    </div>
                    <stat.icon className={`w-6 h-6 ${stat.iconClass}`} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Add Staff Button */}
          <div className="flex justify-end">
            <Button onClick={handleAddStaff} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add Staff Member
            </Button>
          </div>

          {/* Staff Table */}
          <Card className="border-[#E8ECFF] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#E8ECFF] hover:bg-transparent">
                    <TableHead className="text-gray-600">Name</TableHead>
                    <TableHead className="text-gray-600">Role</TableHead>
                    <TableHead className="text-gray-600">Email</TableHead>
                    <TableHead className="text-gray-600">Phone</TableHead>
                    <TableHead className="text-gray-600">Status</TableHead>
                    <TableHead className="text-gray-600">Availability</TableHead>
                    <TableHead className="text-gray-600">Trained</TableHead>
                    <TableHead className="text-gray-600">Active Requests</TableHead>
                    <TableHead className="text-gray-600">Joined</TableHead>
                    <TableHead className="text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((member) => {
                    const activeRequests = supportRequests.filter(r => r.assignedStaffId === member.id && r.status !== 'resolved');
                    return (
                      <motion.tr
                        key={member.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-[#E8ECFF] hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="text-gray-900 font-medium">{member.name}</TableCell>
                        <TableCell className="text-gray-600 capitalize">{member.role}</TableCell>
                        <TableCell className="text-gray-600 text-sm">{member.email}</TableCell>
                        <TableCell className="text-gray-600 text-sm">{member.phone}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStaffStatus(member.id)}
                            className="h-auto py-1"
                          >
                            <Badge
                              className={
                                member.status === 'active'
                                  ? 'bg-green-50 text-green-600 border-green-200 cursor-pointer hover:bg-green-100'
                                  : 'bg-gray-50 text-gray-600 border-gray-200 cursor-pointer hover:bg-gray-100'
                              }
                            >
                              {member.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              member.availability === 'available'
                                ? 'bg-green-50 text-green-600 border-green-200'
                                : member.availability === 'busy'
                                ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                                : 'bg-gray-50 text-gray-600 border-gray-200'
                            }
                          >
                            {member.availability === 'available' ? 'Available' : member.availability === 'busy' ? 'Busy' : 'Offline'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleTraining(member.id)}
                            className="h-auto py-1"
                          >
                            {member.trained ? (
                              <div className="flex items-center gap-1 cursor-pointer">
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-600">Yes</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 cursor-pointer">
                                <X className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm text-yellow-600">Pending</span>
                              </div>
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="text-gray-900 font-medium">{activeRequests.length}</TableCell>
                        <TableCell className="text-gray-600 text-sm">{member.joinDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => handleEditStaff(member)}
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteStaff(member.id)}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Staff Management Modal */}
      {staffModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setStaffModalOpen(false)}
        >
          <Card className="bg-white p-6 max-w-md w-full mx-4 border-[#E8ECFF]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingStaffId ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  className="bg-gray-50 border-[#E8ECFF] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@room1221.org"
                  className="bg-gray-50 border-[#E8ECFF] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+233 XX XXX XXXX"
                  className="bg-gray-50 border-[#E8ECFF] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-[#E8ECFF] text-gray-900"
                >
                  <option value="counselor">Counselor</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="coordinator">Coordinator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                className="flex-1 border-gray-300"
                onClick={() => setStaffModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveStaff}
              >
                {editingStaffId ? 'Update' : 'Add'} Staff
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
