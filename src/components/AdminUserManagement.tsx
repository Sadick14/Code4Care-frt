import { useMemo, useState } from 'react';
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
} from '@/services/staffAccessService';

interface User {
  id: string;
  nickname: string;
  age: string;
  gender: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  lastActive: string;
  engagementCount: number;
  engagementIntensity: number;
}

const mockUsers: User[] = [
  { id: '1', nickname: 'SilentThinker', age: '16-18', gender: 'Female', joinDate: '2025-11-15', status: 'active', lastActive: '2 hours', engagementCount: 24, engagementIntensity: 92 },
  { id: '2', nickname: 'BraveHeart', age: '19-24', gender: 'Male', joinDate: '2025-10-22', status: 'active', lastActive: '5 mins', engagementCount: 67, engagementIntensity: 87 },
  { id: '3', nickname: 'DreamSeeker', age: '13-15', gender: 'Female', joinDate: '2025-09-10', status: 'active', lastActive: '1 day', engagementCount: 42, engagementIntensity: 78 },
  { id: '4', nickname: 'LoneWanderer', age: '16-18', gender: 'Male', joinDate: '2025-08-05', status: 'inactive', lastActive: '30 days', engagementCount: 8, engagementIntensity: 12 },
  { id: '5', nickname: 'EchoVoice', age: '19-24', gender: 'Non-binary', joinDate: '2025-12-01', status: 'suspended', lastActive: 'Never', engagementCount: 2, engagementIntensity: 5 },
  { id: '6', nickname: 'HopeSeeker', age: '15-18', gender: 'Female', joinDate: '2025-11-20', status: 'active', lastActive: '1 hour', engagementCount: 15, engagementIntensity: 75 },
];

interface AdminUserManagementProps {
  selectedLanguage: string;
}

const initialForm = {
  name: '',
  email: '',
  phone: '',
  role: 'consultant' as StaffRole,
  password: '',
};

export function AdminUserManagement({ selectedLanguage }: AdminUserManagementProps) {
  void selectedLanguage;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');

  const [staff, setStaff] = useState<StaffAccount[]>(() => StaffAccessService.getStaffAccounts());

  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialForm);

  const refreshData = () => {
    setStaff(StaffAccessService.getStaffAccounts());
  };

  const filteredUsers = useMemo(() => {
    let filtered = [...mockUsers];

    if (searchTerm) {
      filtered = filtered.filter((u) =>
        u.nickname.toLowerCase().includes(searchTerm.toLowerCase()) || u.age.includes(searchTerm)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((u) => u.status === filterStatus);
    }

    filtered.sort((a, b) => b.engagementIntensity - a.engagementIntensity);

    return filtered;
  }, [searchTerm, filterStatus]);

  const handleAddStaff = () => {
    setEditingStaffId(null);
    setFormData(initialForm);
    setStaffModalOpen(true);
  };

  const handleEditStaff = (member: StaffAccount) => {
    setEditingStaffId(member.id);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      password: '',
    });
    setStaffModalOpen(true);
  };

  const handleSaveStaff = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      return;
    }

    if (!editingStaffId && !formData.password.trim()) {
      return;
    }

    StaffAccessService.upsertStaffAccount({
      id: editingStaffId || undefined,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      password: formData.password.trim() || undefined,
    });

    setStaffModalOpen(false);
    setFormData(initialForm);
    refreshData();
  };

  const handleDeleteStaff = (staffId: string) => {
    StaffAccessService.deleteStaffAccount(staffId);
    refreshData();
  };

  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter((u) => u.status === 'active').length,
    inactive: mockUsers.filter((u) => u.status === 'inactive').length,
    suspended: mockUsers.filter((u) => u.status === 'suspended').length,
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
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-[#E8ECFF] hover:bg-gray-50 transition-colors">
                      <TableCell className="text-gray-900 font-medium">{user.nickname}</TableCell>
                      <TableCell className="text-gray-600 text-sm">{user.age}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getUserStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{user.engagementCount} visits</span>
                            <span className="text-xs text-gray-500">engagements</span>
                            <Badge className={user.engagementIntensity >= 80 ? 'bg-green-50 text-green-700 border-green-200 text-xs' : user.engagementIntensity >= 50 ? 'bg-blue-50 text-blue-700 border-blue-200 text-xs' : 'bg-yellow-50 text-yellow-700 border-yellow-200 text-xs'}>
                              {user.engagementIntensity >= 80 ? 'Very Active' : user.engagementIntensity >= 50 ? 'Active' : 'Moderate'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: `${user.engagementIntensity}%` }} />
                            </div>
                            <span className="text-xs text-gray-500">{user.engagementIntensity}% intensity</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1 border-gray-300" onClick={() => setStaffModalOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSaveStaff}>
                {editingStaffId ? 'Update' : 'Create'} Account
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
