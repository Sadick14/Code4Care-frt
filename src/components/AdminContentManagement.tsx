import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Eye, TrendingUp, CheckCircle2, BarChart3, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { motion } from 'motion/react';
import { safeStorage } from '@/utils/safeStorage';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

type ContentType = 'module' | 'faq' | 'article' | 'myth-buster' | 'story-mode' | 'quiz' | 'image' | 'other';
type ContentStatus = 'published' | 'draft' | 'archived';

interface ContentDetails {
  moduleObjective?: string;
  faqQuestion?: string;
  faqAnswer?: string;
  articleBody?: string;
  readTimeMinutes?: string;
  coverImageUrl?: string;
  mythStatement?: string;
  factStatement?: string;
  evidenceSource?: string;
  storyScenario?: string;
  storyChoices?: string;
  storyOutcome?: string;
  quizQuestion?: string;
  quizOptions?: string;
  quizAnswer?: string;
  quizExplanation?: string;
  passingScore?: string;
  imageUrl?: string;
  imageAltText?: string;
  imageCaption?: string;
  generationPrompt?: string;
}

interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  language: string;
  status: ContentStatus;
  views: number;
  engagement: number;
  lastModified: string;
  author: string;
  summary: string;
  details: ContentDetails;
}

const CONTENT_STORAGE_KEY = 'room1221_admin_content_items';

const mockContent: ContentItem[] = [
  { id: '1', title: 'Understanding Puberty', type: 'module', language: 'English', status: 'published', views: 4250, engagement: 87, lastModified: '2 weeks ago', author: 'Dr. Ama', summary: 'Foundational guide on adolescent body changes and emotional health.', details: { moduleObjective: 'Understand normal puberty changes and when to seek help.' } },
  { id: '2', title: 'Menstrual Health Guide', type: 'article', language: 'English', status: 'published', views: 6120, engagement: 92, lastModified: '3 days ago', author: 'Dr. Kwame', summary: 'Practical menstrual care guidance and symptom awareness.', details: { articleBody: 'Core menstrual hygiene guidance, warning signs, and support resources.', readTimeMinutes: '6' } },
  { id: '3', title: 'Consent & Boundaries', type: 'module', language: 'Twi', status: 'published', views: 3890, engagement: 85, lastModified: '1 week ago', author: 'Dr. Osei', summary: 'Consent, rights, and boundary setting for healthy relationships.', details: { moduleObjective: 'Teach consent and boundary communication.' } },
  { id: '4', title: 'Pregnancy FAQ', type: 'faq', language: 'English', status: 'published', views: 2340, engagement: 76, lastModified: 'Yesterday', author: 'Dr. Akosua', summary: 'Frequently asked pregnancy questions answered by health professionals.', details: { faqQuestion: 'What are early signs of pregnancy?', faqAnswer: 'Missed period, fatigue, and nausea are common early signs.' } },
  { id: '5', title: 'STI Prevention Tips', type: 'story-mode', language: 'Ewe', status: 'draft', views: 450, engagement: 0, lastModified: '5 days ago', author: 'Dr. Yaw', summary: 'Interactive scenario-based STI prevention story.', details: { storyScenario: 'A friend is unsure about STI testing after unprotected sex.', storyChoices: 'Ignore it|Get tested together|Self-medicate', storyOutcome: 'Get tested together and seek clinic guidance.' } },
  { id: '6', title: 'Healthy Relationships', type: 'myth-buster', language: 'Ga', status: 'published', views: 1750, engagement: 81, lastModified: '2 weeks ago', author: 'Dr. Adwoa', summary: 'Relationship red flags and communication skills for youth.', details: { mythStatement: 'Jealousy means true love.', factStatement: 'Controlling behavior is a warning sign, not proof of love.' } },
];

function normalizeType(type: string): ContentType {
  if (type === 'story') return 'story-mode';
  if (type === 'module' || type === 'faq' || type === 'article' || type === 'myth-buster' || type === 'story-mode' || type === 'quiz' || type === 'image' || type === 'other') {
    return type;
  }
  return 'other';
}

function normalizeContentItem(raw: any): ContentItem {
  return {
    id: String(raw.id),
    title: String(raw.title || ''),
    type: normalizeType(String(raw.type || 'other')),
    language: String(raw.language || 'English'),
    status: (raw.status === 'published' || raw.status === 'draft' || raw.status === 'archived') ? raw.status : 'draft',
    views: typeof raw.views === 'number' ? raw.views : 0,
    engagement: typeof raw.engagement === 'number' ? raw.engagement : 0,
    lastModified: String(raw.lastModified || 'Just now'),
    author: String(raw.author || ''),
    summary: String(raw.summary || ''),
    details: raw.details && typeof raw.details === 'object' ? raw.details : {},
  };
}

interface AdminContentManagementProps {
  selectedLanguage: string;
}

export function AdminContentManagement({ selectedLanguage }: AdminContentManagementProps) {
  void selectedLanguage;
  const [contentItems, setContentItems] = useState<ContentItem[]>(() => {
    const stored = safeStorage.getItem(CONTENT_STORAGE_KEY);
    if (!stored) return mockContent;

    try {
      const parsed = JSON.parse(stored) as any[];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return mockContent;
      }

      return parsed.map((item) => normalizeContentItem(item));
    } catch {
      return mockContent;
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | ContentType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | ContentStatus>('published');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<ContentItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'module' as ContentType,
    language: 'English',
    status: 'draft' as ContentStatus,
    author: '',
    summary: '',
    details: {} as ContentDetails,
  });

  useEffect(() => {
    safeStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(contentItems));
  }, [contentItems]);

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'module': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'faq': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'article': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'myth-buster': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'story-mode': return 'bg-pink-50 text-pink-600 border-pink-200';
      case 'quiz': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'image': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'other': return 'bg-slate-50 text-slate-700 border-slate-200';
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

  const stats = useMemo(() => {
    return {
      total: contentItems.length,
      published: contentItems.filter((item) => item.status === 'published').length,
      draft: contentItems.filter((item) => item.status === 'draft').length,
      totalViews: contentItems.reduce((sum, item) => sum + item.views, 0),
    };
  }, [contentItems]);

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'module',
      language: 'English',
      status: 'draft',
      author: '',
      summary: '',
      details: {},
    });
  };

  const openCreateModal = () => {
    setEditingContentId(null);
    resetForm();
    setIsEditorOpen(true);
  };

  const openEditModal = (item: ContentItem) => {
    setEditingContentId(item.id);
    setFormData({
      title: item.title,
      type: item.type,
      language: item.language,
      status: item.status,
      author: item.author,
      summary: item.summary,
      details: item.details || {},
    });
    setIsEditorOpen(true);
  };

  const setDetailField = (key: keyof ContentDetails, value: string) => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [key]: value,
      },
    }));
  };

  const hasRequiredTypeFields = () => {
    const d = formData.details;
    if (formData.type === 'module') return Boolean((d.moduleObjective || '').trim());
    if (formData.type === 'faq') return Boolean((d.faqQuestion || '').trim() && (d.faqAnswer || '').trim());
    if (formData.type === 'article') return Boolean((d.articleBody || '').trim());
    if (formData.type === 'myth-buster') return Boolean((d.mythStatement || '').trim() && (d.factStatement || '').trim());
    if (formData.type === 'story-mode') return Boolean((d.storyScenario || '').trim() && (d.storyChoices || '').trim());
    if (formData.type === 'quiz') return Boolean((d.quizQuestion || '').trim() && (d.quizOptions || '').trim() && (d.quizAnswer || '').trim());
    if (formData.type === 'image') return Boolean((d.imageUrl || '').trim());
    if (formData.type === 'other') return Boolean((d.generationPrompt || '').trim());
    return true;
  };

  const openPreviewModal = (item: ContentItem) => {
    setPreviewContent(item);
    setIsPreviewOpen(true);
  };

  const saveContentItem = () => {
    if (!formData.title.trim() || !formData.author.trim() || !formData.summary.trim() || !hasRequiredTypeFields()) {
      return;
    }

    if (editingContentId) {
      setContentItems((prev) =>
        prev.map((item) =>
          item.id === editingContentId
            ? {
                ...item,
                title: formData.title.trim(),
                type: formData.type,
                language: formData.language,
                status: formData.status,
                author: formData.author.trim(),
                summary: formData.summary.trim(),
                details: formData.details,
                lastModified: 'Just now',
              }
            : item
        )
      );
    } else {
      const nowId = Date.now().toString();
      setContentItems((prev) => [
        {
          id: nowId,
          title: formData.title.trim(),
          type: formData.type,
          language: formData.language,
          status: formData.status,
          author: formData.author.trim(),
          summary: formData.summary.trim(),
          details: formData.details,
          views: 0,
          engagement: 0,
          lastModified: 'Just now',
        },
        ...prev,
      ]);
    }

    setIsEditorOpen(false);
    setEditingContentId(null);
    resetForm();
  };

  const deleteContentItem = (itemId: string) => {
    setContentItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateStatus = (itemId: string, status: ContentStatus) => {
    setContentItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status, lastModified: 'Just now' } : item))
    );
  };

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Content Library</h1>
          <p className="text-gray-500">Manage stories, modules, FAQs, and educational content</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={openCreateModal}>
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
          <option value="article">Articles</option>
          <option value="myth-buster">Myth Busters</option>
          <option value="story-mode">Story Mode</option>
          <option value="quiz">Quizzes</option>
          <option value="image">Images</option>
          <option value="other">Other</option>
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
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => openPreviewModal(item)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                        onClick={() => openEditModal(item)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteContentItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                      {item.status !== 'published' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => updateStatus(item.id, 'published')}
                        >
                          Publish
                        </Button>
                      )}

                      {item.status === 'published' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                          onClick={() => updateStatus(item.id, 'draft')}
                        >
                          Unpublish
                        </Button>
                      )}

                      {item.status !== 'archived' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-slate-600 hover:text-slate-700 hover:bg-slate-100"
                          onClick={() => updateStatus(item.id, 'archived')}
                        >
                          Archive
                        </Button>
                      )}
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
            {[...contentItems].sort((a, b) => b.views - a.views).slice(0, 3).map((item, idx) => (
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

      {isEditorOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsEditorOpen(false)}
        >
          <Card className="w-full max-w-2xl border-[#E8ECFF] bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              {editingContentId ? 'Edit Content Item' : 'Create Content Item'}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-gray-50 border-[#E8ECFF]"
                  placeholder="Content title"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ContentType, details: {} })}
                  className="w-full rounded-lg border border-[#E8ECFF] bg-gray-50 px-3 py-2 text-gray-900"
                >
                  <option value="module">Module</option>
                  <option value="faq">FAQ</option>
                  <option value="article">Article</option>
                  <option value="myth-buster">Myth Buster</option>
                  <option value="story-mode">Story Mode</option>
                  <option value="quiz">Quiz</option>
                  <option value="image">Image</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full rounded-lg border border-[#E8ECFF] bg-gray-50 px-3 py-2 text-gray-900"
                >
                  <option value="English">English</option>
                  <option value="Twi">Twi</option>
                  <option value="Ewe">Ewe</option>
                  <option value="Ga">Ga</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
                  className="w-full rounded-lg border border-[#E8ECFF] bg-gray-50 px-3 py-2 text-gray-900"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Author</label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="bg-gray-50 border-[#E8ECFF]"
                  placeholder="Author name"
                />
              </div>

              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Summary</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="min-h-28 w-full rounded-lg border border-[#E8ECFF] bg-gray-50 px-3 py-2 text-gray-900"
                  placeholder="Short summary of this content"
                />
              </div>

              {formData.type === 'module' && (
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Learning Objective</label>
                  <textarea
                    value={formData.details.moduleObjective || ''}
                    onChange={(e) => setDetailField('moduleObjective', e.target.value)}
                    className="min-h-24 w-full rounded-lg border border-[#E8ECFF] bg-gray-50 px-3 py-2 text-gray-900"
                    placeholder="What should users learn from this module?"
                  />
                </div>
              )}

              {formData.type === 'faq' && (
                <>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">FAQ Question</label>
                    <Input
                      value={formData.details.faqQuestion || ''}
                      onChange={(e) => setDetailField('faqQuestion', e.target.value)}
                      className="bg-gray-50 border-[#E8ECFF]"
                      placeholder="Question"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">FAQ Answer</label>
                    <textarea
                      value={formData.details.faqAnswer || ''}
                      onChange={(e) => setDetailField('faqAnswer', e.target.value)}
                      className="min-h-24 w-full rounded-lg border border-[#E8ECFF] bg-gray-50 px-3 py-2 text-gray-900"
                      placeholder="Answer"
                    />
                  </div>
                </>
              )}

              {formData.type === 'article' && (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Read Time (minutes)</label>
                    <Input
                      value={formData.details.readTimeMinutes || ''}
                      onChange={(e) => setDetailField('readTimeMinutes', e.target.value)}
                      className="bg-gray-50 border-[#E8ECFF]"
                      placeholder="e.g. 5"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Cover Image URL</label>
                    <Input
                      value={formData.details.coverImageUrl || ''}
                      onChange={(e) => setDetailField('coverImageUrl', e.target.value)}
                      className="bg-gray-50 border-[#E8ECFF]"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Article Body</label>
                    <textarea
                      value={formData.details.articleBody || ''}
                      onChange={(e) => setDetailField('articleBody', e.target.value)}
                      className="min-h-32 w-full rounded-lg border border-[#E8ECFF] bg-gray-50 px-3 py-2 text-gray-900"
                      placeholder="Main article content"
                    />
                  </div>
                </>
              )}

              {formData.type === 'myth-buster' && (
                <>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Myth Statement</label>
                    <Input
                      value={formData.details.mythStatement || ''}
                      onChange={(e) => setDetailField('mythStatement', e.target.value)}
                      className="bg-gray-50 border-[#E8ECFF]"
                      placeholder="Myth"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Fact/Correction</label>
                    <textarea
                      value={formData.details.factStatement || ''}
                      onChange={(e) => setDetailField('factStatement', e.target.value)}
                      className="min-h-24 w-full rounded-lg border border-[#E8ECFF] bg-gray-50 px-3 py-2 text-gray-900"
                      placeholder="Evidence-based correction"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Evidence Source (optional)</label>
                    <Input
                      value={formData.details.evidenceSource || ''}
                      onChange={(e) => setDetailField('evidenceSource', e.target.value)}
                      className="bg-gray-50 border-[#E8ECFF]"
                      placeholder="Source or citation"
                    />
                  </div>
                </>
              )}

              {formData.type === 'story-mode' && (
                <>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Story Scenario</label>
                    <textarea
                      value={formData.details.storyScenario || ''}
                      onChange={(e) => setDetailField('storyScenario', e.target.value)}
                      className="min-h-24 w-full rounded-lg border border-[#E8ECFF] bg-gray-50 px-3 py-2 text-gray-900"
                      placeholder="Narrative scenario"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Choices (separate with |)</label>
                    <Input
                      value={formData.details.storyChoices || ''}
                      onChange={(e) => setDetailField('storyChoices', e.target.value)}
                      className="bg-gray-50 border-[#E8ECFF]"
                      placeholder="Choice A|Choice B|Choice C"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Recommended Outcome</label>
                    <textarea
                      value={formData.details.storyOutcome || ''}
                      onChange={(e) => setDetailField('storyOutcome', e.target.value)}
                      className="min-h-20 w-full rounded-lg border border-[#E8ECFF] bg-gray-50 px-3 py-2 text-gray-900"
                      placeholder="Expected safe outcome"
                    />
                  </div>
                </>
              )}

              {formData.type === 'quiz' && (
                <>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Quiz Question</label>
                    <Input
                      value={formData.details.quizQuestion || ''}
                      onChange={(e) => setDetailField('quizQuestion', e.target.value)}
                      className="bg-gray-50 border-[#E8ECFF]"
                      placeholder="Question"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Options (separate with |)</label>
                    <Input
                      value={formData.details.quizOptions || ''}
                      onChange={(e) => setDetailField('quizOptions', e.target.value)}
                      className="bg-gray-50 border-[#E8ECFF]"
                      placeholder="Option A|Option B|Option C"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Correct Answer</label>
                    <Input
                      value={formData.details.quizAnswer || ''}
                      onChange={(e) => setDetailField('quizAnswer', e.target.value)}
                      className="bg-gray-50 border-[#E8ECFF]"
                      placeholder="Correct answer"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Passing Score (%)</label>
                    <Input
                      value={formData.details.passingScore || ''}
                      onChange={(e) => setDetailField('passingScore', e.target.value)}
                      className="bg-gray-50 border-[#E8ECFF]"
                      placeholder="e.g. 70"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Explanation (optional)</label>
                    <textarea
                      value={formData.details.quizExplanation || ''}
                      onChange={(e) => setDetailField('quizExplanation', e.target.value)}
                      className="min-h-20 w-full rounded-lg border border-[#E8ECFF] bg-gray-50 px-3 py-2 text-gray-900"
                      placeholder="Explain why the answer is correct"
                    />
                  </div>
                </>
              )}

              {formData.type === 'image' && (
                <>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Image URL</label>
                    <Input
                      value={formData.details.imageUrl || ''}
                      onChange={(e) => setDetailField('imageUrl', e.target.value)}
                      className="bg-gray-50 border-[#E8ECFF]"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Alt Text</label>
                    <Input
                      value={formData.details.imageAltText || ''}
                      onChange={(e) => setDetailField('imageAltText', e.target.value)}
                      className="bg-gray-50 border-[#E8ECFF]"
                      placeholder="Accessibility description"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Caption</label>
                    <Input
                      value={formData.details.imageCaption || ''}
                      onChange={(e) => setDetailField('imageCaption', e.target.value)}
                      className="bg-gray-50 border-[#E8ECFF]"
                      placeholder="Short caption"
                    />
                  </div>
                </>
              )}

              {formData.type === 'other' && (
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Generation Prompt</label>
                  <textarea
                    value={formData.details.generationPrompt || ''}
                    onChange={(e) => setDetailField('generationPrompt', e.target.value)}
                    className="min-h-24 w-full rounded-lg border border-[#E8ECFF] bg-gray-50 px-3 py-2 text-gray-900"
                    placeholder="Describe what should be generated"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={saveContentItem}>
                {editingContentId ? 'Save Changes' : 'Create Item'}
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {isPreviewOpen && previewContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <Card className="w-full max-w-xl border-[#E8ECFF] bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{previewContent.title}</h3>
              <Badge variant="outline" className={getStatusColor(previewContent.status)}>
                {previewContent.status}
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-semibold text-gray-800">Type:</span> {previewContent.type}</p>
              <p><span className="font-semibold text-gray-800">Language:</span> {previewContent.language}</p>
              <p><span className="font-semibold text-gray-800">Author:</span> {previewContent.author}</p>
              <p><span className="font-semibold text-gray-800">Views:</span> {previewContent.views.toLocaleString()}</p>
              <p><span className="font-semibold text-gray-800">Engagement:</span> {previewContent.engagement}%</p>
              <p><span className="font-semibold text-gray-800">Last Modified:</span> {previewContent.lastModified}</p>
            </div>

            <div className="mt-4 rounded-xl border border-[#E8ECFF] bg-[#F8FBFF] p-4">
              <p className="text-sm font-semibold text-gray-800">Summary</p>
              <p className="mt-2 text-sm text-gray-600">{previewContent.summary}</p>
            </div>

            <div className="mt-4 rounded-xl border border-[#E8ECFF] bg-white p-4">
              <p className="text-sm font-semibold text-gray-800">Type-Specific Fields</p>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                {Object.entries(previewContent.details || {}).length === 0 ? (
                  <p>No type-specific fields saved.</p>
                ) : (
                  Object.entries(previewContent.details || {}).map(([key, value]) => (
                    <p key={key}><span className="font-medium text-gray-800">{key}:</span> {String(value)}</p>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                Close
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setIsPreviewOpen(false);
                  openEditModal(previewContent);
                }}
              >
                Edit Content
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
