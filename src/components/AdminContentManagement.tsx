import React, { useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Eye, TrendingUp, CheckCircle2, BarChart3, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { motion } from 'motion/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface ContentItem {
  id: string;
  title: string;
  type: 'module' | 'faq' | 'story';
  language: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  engagement: number;
  lastModified: string;
  author: string;
}

const mockContent: ContentItem[] = [
  { id: '1', title: 'Understanding Puberty', type: 'module', language: 'English', status: 'published', views: 4250, engagement: 87, lastModified: '2 weeks ago', author: 'Dr. Ama' },
  { id: '2', title: 'Menstrual Health Guide', type: 'module', language: 'English', status: 'published', views: 6120, engagement: 92, lastModified: '3 days ago', author: 'Dr. Kwame' },
  { id: '3', title: 'Consent & Boundaries', type: 'module', language: 'Twi', status: 'published', views: 3890, engagement: 85, lastModified: '1 week ago', author: 'Dr. Osei' },
  { id: '4', title: 'Pregnancy FAQ', type: 'faq', language: 'English', status: 'published', views: 2340, engagement: 76, lastModified: 'Yesterday', author: 'Dr. Akosua' },
  { id: '5', title: 'STI Prevention Tips', type: 'story', language: 'Ewe', status: 'draft', views: 450, engagement: 0, lastModified: '5 days ago', author: 'Dr. Yaw' },
  { id: '6', title: 'Healthy Relationships', type: 'module', language: 'Ga', status: 'published', views: 1750, engagement: 81, lastModified: '2 weeks ago', author: 'Dr. Adwoa' },
];

interface AdminContentManagementProps {
  selectedLanguage: string;
}

export function AdminContentManagement({ selectedLanguage }: AdminContentManagementProps) {
  void selectedLanguage;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'module' | 'faq' | 'story'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('published');

  const filteredContent = mockContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'module': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'faq': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'story': return 'bg-pink-50 text-pink-600 border-pink-200';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-50 text-green-600 border-green-200';
      case 'draft': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'archived': return 'bg-slate-50 text-slate-600 border-slate-200';
      default: return '';
    }
  };

  const stats = {
    total: mockContent.length,
    published: mockContent.filter(c => c.status === 'published').length,
    draft: mockContent.filter(c => c.status === 'draft').length,
    totalViews: mockContent.reduce((sum, c) => sum + c.views, 0),
  };

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Content Library</h1>
          <p className="text-gray-500">Manage stories, modules, FAQs, and educational content</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          New Content
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Content', value: stats.total, icon: BookOpen, iconClass: 'text-blue-600' },
          { label: 'Published', value: stats.published, icon: CheckCircle2, iconClass: 'text-green-600' },
          { label: 'Drafts', value: stats.draft, icon: FileText, iconClass: 'text-yellow-600' },
          { label: 'Total Views', value: `${(stats.totalViews / 1000).toFixed(1)}K`, icon: BarChart3, iconClass: 'text-purple-600' },
        ].map((stat, idx) => (
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search content by title..."
          className="flex-1 bg-gray-50 border-[#E8ECFF] text-gray-900 placeholder:text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-2 rounded-lg bg-white border border-[#E8ECFF] text-gray-900 cursor-pointer hover:border-blue-300 transition-colors"
        >
          <option value="all">All Types</option>
          <option value="module">Modules</option>
          <option value="faq">FAQs</option>
          <option value="story">Stories</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 rounded-lg bg-white border border-[#E8ECFF] text-gray-900 cursor-pointer hover:border-blue-300 transition-colors"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Content Table */}
      <Card className="border-[#E8ECFF] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#E8ECFF] hover:bg-transparent">
                <TableHead className="text-gray-600">Title</TableHead>
                <TableHead className="text-gray-600">Type</TableHead>
                <TableHead className="text-gray-600">Language</TableHead>
                <TableHead className="text-gray-600">Status</TableHead>
                <TableHead className="text-gray-600">Views</TableHead>
                <TableHead className="text-gray-600">Engagement</TableHead>
                <TableHead className="text-gray-600">Last Modified</TableHead>
                <TableHead className="text-gray-600">Author</TableHead>
                <TableHead className="text-gray-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-[#E8ECFF] hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="text-gray-900 font-medium max-w-xs truncate">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize ${getTypeColor(item.type)}`}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">{item.language}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize ${getStatusColor(item.status)}`}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-900 font-medium">{item.views.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.status === 'published' ? (
                        <>
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                              style={{ width: `${item.engagement}%` }}
                            />
                          </div>
                          <span className="text-sm text-green-600 font-medium">{item.engagement}%</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">{item.lastModified}</TableCell>
                  <TableCell className="text-gray-600 text-sm">{item.author}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:text-gray-700 hover:bg-gray-100">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Content Performance Insights */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-white border-[#E8ECFF]">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            Top Performing Content
          </h3>
          <div className="space-y-2">
            {mockContent.sort((a, b) => b.views - a.views).slice(0, 3).map((item, idx) => (
              <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b border-[#E8ECFF] last:border-0">
                <span className="text-gray-600">{idx + 1}. {item.title.substring(0, 25)}...</span>
                <span className="text-gray-900 font-semibold">{item.views.toLocaleString()} views</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 bg-white border-[#E8ECFF]">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            Content Status Overview
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Published</span>
              <div className="flex items-center gap-2 flex-1 ml-4">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-5/6 bg-green-500" />
                </div>
                <span className="text-gray-900 font-semibold text-sm w-8">{stats.published}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Draft</span>
              <div className="flex items-center gap-2 flex-1 ml-4">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-1/6 bg-yellow-500" />
                </div>
                <span className="text-gray-900 font-semibold text-sm w-8">{stats.draft}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
