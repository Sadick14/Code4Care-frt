import React, { useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Eye, TrendingUp, CheckCircle2, BarChart3 } from 'lucide-react';
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
      case 'module': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'faq': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'story': return 'bg-pink-500/20 text-pink-400 border-pink-500/50';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'archived': return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
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
          { label: 'Total Content', value: stats.total, icon: '📚', color: 'from-blue-600 to-blue-700' },
          { label: 'Published', value: stats.published, icon: '✅', color: 'from-green-600 to-green-700' },
          { label: 'Drafts', value: stats.draft, icon: '📝', color: 'from-yellow-600 to-yellow-700' },
          { label: 'Total Views', value: `${(stats.totalViews / 1000).toFixed(1)}K`, icon: '👁️', color: 'from-purple-600 to-purple-700' },
        ].map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <Card className={`p-4 bg-gradient-to-br ${stat.color} text-white border-0`}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-sm font-medium text-white/80">{stat.label}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search content by title..."
          className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="module">Modules</option>
          <option value="faq">FAQs</option>
          <option value="story">Stories</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Content Table */}
      <Card className="border-slate-700 bg-slate-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-300">Title</TableHead>
                <TableHead className="text-slate-300">Type</TableHead>
                <TableHead className="text-slate-300">Language</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Views</TableHead>
                <TableHead className="text-slate-300">Engagement</TableHead>
                <TableHead className="text-slate-300">Last Modified</TableHead>
                <TableHead className="text-slate-300">Author</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-slate-700 hover:bg-slate-700/30 transition-colors"
                >
                  <TableCell className="text-white font-medium max-w-xs truncate">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize ${getTypeColor(item.type)}`}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">{item.language}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize ${getStatusColor(item.status)}`}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white font-medium">{item.views.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.status === 'published' ? (
                        <>
                          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                              style={{ width: `${item.engagement}%` }}
                            />
                          </div>
                          <span className="text-sm text-green-400 font-medium">{item.engagement}%</span>
                        </>
                      ) : (
                        <span className="text-sm text-slate-500">N/A</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">{item.lastModified}</TableCell>
                  <TableCell className="text-slate-400 text-sm">{item.author}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-300 hover:bg-slate-600">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20">
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
        <Card className="p-4 bg-slate-800/50 border-slate-700">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            Top Performing Content
          </h3>
          <div className="space-y-2">
            {mockContent.sort((a, b) => b.views - a.views).slice(0, 3).map((item, idx) => (
              <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b border-slate-700 last:border-0">
                <span className="text-slate-300">{idx + 1}. {item.title.substring(0, 25)}...</span>
                <span className="text-white font-semibold">{item.views.toLocaleString()} views</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 bg-slate-800/50 border-slate-700">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            Content Status Overview
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Published</span>
              <div className="flex items-center gap-2 flex-1 ml-4">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-5/6 bg-green-500" />
                </div>
                <span className="text-white font-semibold text-sm w-8">{stats.published}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Draft</span>
              <div className="flex items-center gap-2 flex-1 ml-4">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/6 bg-yellow-500" />
                </div>
                <span className="text-white font-semibold text-sm w-8">{stats.draft}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
