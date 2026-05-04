import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Check,
  X,
  Users,
  UserCheck,
  UserMinus,
  UserX,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'motion/react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  StaffAccessService,
  StaffAccount,
  StaffRole,
  StaffSession,
} from '@/services/staffAccessService';
import { UserManagementService, UserListItem } from '@/services/userManagementService';
import { logger } from '@/utils/logger';

interface AdminUserManagementProps {
  selectedLanguage: string;
  session: StaffSession;
}

const initialForm = {
  name: '',
  email: '',
  phone: '',
  role: 'consultant' as StaffRole,
  password: '',
};

export function AdminUserManagement({ selectedLanguage, session }: AdminUserManagementProps) {
  void selectedLanguage;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [staff, setStaff] = useState<StaffAccount[]>(() => StaffAccessService.getStaffAccounts());
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialForm);
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadStaff = async () => {
    try {
      setStaff(await StaffAccessService.listStaff(session.accessToken));
    } catch (error) {
      logger.error('Failed to load staff', error);
    }
  };

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await UserManagementService.listUsers(
        {
          page: 1,
          limit: 100,
          status: filterStatus !== 'all' ? (filterStatus as any) : undefined,
        },
        session.accessToken
      );
      setUsers(response.users);
    } catch (error) {
      logger.error('Failed to load users', error);
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    void loadStaff();
    void loadUsers();
  }, [session.accessToken]);

  useEffect(() => {
    void loadUsers();
  }, [filterStatus]);

  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter((u) =>
        u.nickname.toLowerCase().includes(searchTerm.toLowerCase()) || u.age_range.includes(searchTerm)
      );
    }

    filtered.sort((a, b) => b.engagement_score - a.engagement_score);

    return filtered;
  }, [users, searchTerm]);

  const handleAddStaff = () => {
    setEditingStaffId(null);
    setFormData(initialForm);
    setSaveError('');
    setStaffModalOpen(true);
  };

  const handleEditStaff = (member: StaffAccount) => {
    setEditingStaffId(member.id);
    setSaveError('');
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      password: '',
    });
    setStaffModalOpen(true);
  };

  const handleSaveStaff = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      return;
    }

    if (!editingStaffId && !formData.password.trim()) {
      return;
    }

    setIsSaving(true);
    setSaveError('');

    try {
      if (editingStaffId) {
        await StaffAccessService.updateStaffAccount(editingStaffId, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          isActive: true,
        }, session.accessToken);

        StaffAccessService.upsertStaffAccount({
          id: editingStaffId,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          role: formData.role,
          password: formData.password.trim() || undefined,
        });
      } else {
        await StaffAccessService.createStaffAccount(
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            role: formData.role,
            password: formData.password.trim(),
          },
          session.accessToken,
        );
      }

      setStaffModalOpen(false);
      setFormData(initialForm);
      void loadStaff();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save staff account.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    await StaffAccessService.deleteStaffAccount(staffId, session.accessToken);
    await loadStaff();
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
    staffActive: staff.filter((s) => s.status === 'active').length,
    staffTotal: staff.length,
  };

  const userStats = [
    { label: 'Total Users', value: stats.total, icon: Users, iconClass: 'text-blue-600' },
    { label: 'Active', value: stats.active, icon: UserCheck, iconClass: 'text-green-600' },
    { label: 'Inactive', value: stats.inactive, icon: UserMinus, iconClass: 'text-yellow-600' },
    { label: 'Suspended', value: stats.suspended, icon: UserX, iconClass: 'text-red-600' },
  ];

  const staffStats = [
    { label: 'Total Staff', value: stats.staffTotal, icon: Briefcase, iconClass: 'text-blue-600' },
    { label: 'Active', value: stats.staffActive, icon: UserCheck, iconClass: 'text-green-600' },
    { label: 'Inactive', value: staff.filter((s) => s.status === 'inactive').length, icon: UserMinus, iconClass: 'text-slate-600' },
  ];

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'suspended':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">User & Staff Management</h1>
        <p className="text-gray-500">Monitor user accounts and manage staff access.</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 border border-[#E8ECFF]">
          <TabsTrigger value="users">Users ({stats.total})</TabsTrigger>
          <TabsTrigger value="staff">Staff Access ({stats.staffTotal})</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
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

          <Card className="border-[#E8ECFF] bg-white overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-3 p-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by nickname..."
                  className="pl-9 bg-gray-50 border-[#E8ECFF] text-gray-900 placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive' | 'suspended')}
                className="px-4 py-2 rounded-lg bg-white border border-[#E8ECFF] text-gray-900"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#E8ECFF] hover:bg-transparent">
                    <TableHead className="text-gray-600">Nickname</TableHead>
                    <TableHead className="text-gray-600">Age</TableHead>
                    <TableHead className="text-gray-600">Status</TableHead>
                    <TableHead className="text-gray-600">Engagement</TableHead>
                    <TableHead className="text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingUsers ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-[#E8ECFF] hover:bg-gray-50 transition-colors">
                        <TableCell className="text-gray-900 font-medium">{user.nickname}</TableCell>
                        <TableCell className="text-gray-600 text-sm">{user.age_range}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getUserStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">{user.total_messages} messages</span>
                              <Badge className={user.engagement_score >= 80 ? 'bg-green-50 text-green-700 border-green-200 text-xs' : user.engagement_score >= 50 ? 'bg-blue-50 text-blue-700 border-blue-200 text-xs' : 'bg-yellow-50 text-yellow-700 border-yellow-200 text-xs'}>
                                {user.engagement_score >= 80 ? 'Very Active' : user.engagement_score >= 50 ? 'Active' : 'Moderate'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: `${user.engagement_score}%` }} />
                              </div>
                              <span className="text-xs text-gray-500">{user.engagement_score}%</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
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

          <div className="flex justify-between items-center">
            <Badge className="bg-blue-50 text-blue-600 border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Admin can provision dashboard access credentials here.
            </Badge>
            <Button onClick={handleAddStaff} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add Staff Member
            </Button>
          </div>

          <Card className="border-[#E8ECFF] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#E8ECFF] hover:bg-transparent">
                    <TableHead className="text-gray-600">Name</TableHead>
                    <TableHead className="text-gray-600">Role</TableHead>
                    <TableHead className="text-gray-600">Email</TableHead>
                    <TableHead className="text-gray-600">Status</TableHead>
                    <TableHead className="text-gray-600">Trained</TableHead>
                    <TableHead className="text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((member) => (
                      <TableRow key={member.id} className="border-[#E8ECFF] hover:bg-gray-50 transition-colors">
                        <TableCell className="text-gray-900 font-medium">{member.name}</TableCell>
                        <TableCell className="text-gray-600 capitalize text-sm">{member.role}</TableCell>
                        <TableCell className="text-gray-600 text-sm">{member.email}</TableCell>
                        <TableCell>
                          <Badge className={member.status === 'active' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}>
                            {member.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {member.trained ? (
                            <Badge className="bg-green-50 text-green-600 border-green-200"><Check className="w-3 h-3 mr-1" />Yes</Badge>
                          ) : (
                            <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200"><X className="w-3 h-3 mr-1" />Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEditStaff(member)}>
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteStaff(member.id)}>
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {staffModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setStaffModalOpen(false)}
        >
          <Card className="bg-white p-6 max-w-md w-full mx-4 border-[#E8ECFF]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{editingStaffId ? 'Edit Staff Member' : 'Add Staff Member'}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full name" className="bg-gray-50 border-[#E8ECFF] text-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@room1221.org" className="bg-gray-50 border-[#E8ECFF] text-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+233 XX XXX XXXX" className="bg-gray-50 border-[#E8ECFF] text-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as StaffRole })} className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-[#E8ECFF] text-gray-900">
                  <option value="consultant">Consultant</option>
                  <option value="admin">Admin</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="coordinator">Coordinator</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingStaffId ? 'Reset Password (optional)' : 'Password'}
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingStaffId ? 'Leave blank to keep current password' : 'Set account password'}
                  className="bg-gray-50 border-[#E8ECFF] text-gray-900"
                />
              </div>

              {saveError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {saveError}
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1 border-gray-300" onClick={() => setStaffModalOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSaveStaff} disabled={isSaving}>
                {isSaving ? 'Saving...' : editingStaffId ? 'Update' : 'Create'} Account
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
