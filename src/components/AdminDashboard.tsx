import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, MessageSquare, Languages, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface AdminDashboardProps {
  selectedLanguage: string;
}

export function AdminDashboard({ selectedLanguage }: AdminDashboardProps) {
  const content = {
    en: {
      title: "Admin Dashboard",
      subtitle: "Room 1221 Analytics & Monitoring",
      totalEngagements: "Total Engagements",
      activeChats: "Active Chats",
      avgResponseTime: "Avg Response Time",
      panicExits: "Panic Exits (Today)",
      topTopics: "Top Topics",
      languageDistribution: "Language Distribution",
      engagementsOverTime: "Engagements Over Time",
      userSatisfaction: "User Satisfaction",
      moderationAlerts: "Moderation Alerts",
      engagementsLabel: "engagements",
      chatsLabel: "chats",
      secondsLabel: "seconds",
      exitsLabel: "exits"
    },
    twi: {
      title: "Adwumayɛfo Beae",
      subtitle: "Room 1221 Nsɛm ne Hwɛsoɔ",
      totalEngagements: "Nkɔmmɔbɔ Nyinaa",
      activeChats: "Nkɔmmɔbɔ a ɛrekɔ so",
      avgResponseTime: "Mmuae Bere",
      panicExits: "Ntɛm So Fidie (Nnɛ)",
      topTopics: "Nsɛm Atitire",
      languageDistribution: "Kasa Kyekyɛmu",
      engagementsOverTime: "Nkɔmmɔbɔ Wɔ Bere So",
      userSatisfaction: "Nnipa Anigyeɛ",
      moderationAlerts: "Hwɛsoɔ Kɔkɔbɔ",
      engagementsLabel: "nkɔmmɔbɔ",
      chatsLabel: "nkɔmmɔbɔ",
      secondsLabel: "simma",
      exitsLabel: "fidie"
    },
    ewe: {
      title: "Dɔdzikpɔla ƒe Nɔƒe",
      subtitle: "Room 1221 Nyatakakawo & Kpɔkplɔ",
      totalEngagements: "Takpekpewo Katã",
      activeChats: "Nuƒoƒo siwo le edzi yim",
      avgResponseTime: "Ŋuɖoɖo ƒe Ɣeyiɣi",
      panicExits: "Dodo kaba Go (Egbe)",
      topTopics: "Nya Vevitɔwo",
      languageDistribution: "Gbegbɔgblɔ Mama",
      engagementsOverTime: "Takpekpewo Le Ɣeyiɣi Me",
      userSatisfaction: "Ezãlawo Ƒe Dzidzɔkpɔkpɔ",
      moderationAlerts: "Kpɔkplɔ Nyawo",
      engagementsLabel: "takpekpewo",
      chatsLabel: "nuƒoƒowo",
      secondsLabel: "sekendwo",
      exitsLabel: "dodo go"
    }
  };

  const lang = content[selectedLanguage as keyof typeof content] || content.en;

  // Mock data for charts
  const topicsData = [
    { name: "Contraception", value: 342 },
    { name: "STIs", value: 287 },
    { name: "Pregnancy", value: 213 },
    { name: "Menstruation", value: 189 },
    { name: "Relationships", value: 156 }
  ];

  const languageData = [
    { name: "English", value: 520 },
    { name: "Twi", value: 312 },
    { name: "Ewe", value: 155 }
  ];

  const engagementsData = [
    { date: "Mon", engagements: 85 },
    { date: "Tue", engagements: 92 },
    { date: "Wed", engagements: 78 },
    { date: "Thu", engagements: 105 },
    { date: "Fri", engagements: 98 },
    { date: "Sat", engagements: 72 },
    { date: "Sun", engagements: 67 }
  ];

  const COLORS = ['#006d77', '#ff7b6e', '#83c5be', '#ffddd2', '#e29578'];

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2" style={{ color: '#006d77' }}>{lang.title}</h1>
          <p className="text-gray-600">{lang.subtitle}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e6f4f5' }}>
                <Users className="w-6 h-6" style={{ color: '#006d77' }} />
              </div>
              <Badge variant="outline" className="rounded-full" style={{ borderColor: '#006d77', color: '#006d77' }}>
                <TrendingUp className="w-3 h-3 mr-1" />
                +12%
              </Badge>
            </div>
            <h2 className="text-gray-600 mb-1">{lang.totalEngagements}</h2>
            <p style={{ color: '#006d77' }}>2,847</p>
            <p className="text-xs text-gray-500 mt-1">{lang.engagementsLabel}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fff0ed' }}>
                <MessageSquare className="w-6 h-6" style={{ color: '#ff7b6e' }} />
              </div>
              <Badge variant="outline" className="rounded-full" style={{ borderColor: '#ff7b6e', color: '#ff7b6e' }}>
                Live
              </Badge>
            </div>
            <h2 className="text-gray-600 mb-1">{lang.activeChats}</h2>
            <p style={{ color: '#006d77' }}>43</p>
            <p className="text-xs text-gray-500 mt-1">{lang.chatsLabel}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e6f4f5' }}>
                <Clock className="w-6 h-6" style={{ color: '#006d77' }} />
              </div>
              <Badge variant="outline" className="rounded-full" style={{ borderColor: '#006d77', color: '#006d77' }}>
                Good
              </Badge>
            </div>
            <h2 className="text-gray-600 mb-1">{lang.avgResponseTime}</h2>
            <p style={{ color: '#006d77' }}>2.3</p>
            <p className="text-xs text-gray-500 mt-1">{lang.secondsLabel}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fff0ed' }}>
                <AlertTriangle className="w-6 h-6" style={{ color: '#ff7b6e' }} />
              </div>
              <Badge variant="outline" className="rounded-full" style={{ borderColor: '#ff7b6e', color: '#ff7b6e' }}>
                Today
              </Badge>
            </div>
            <h2 className="text-gray-600 mb-1">{lang.panicExits}</h2>
            <p style={{ color: '#006d77' }}>7</p>
            <p className="text-xs text-gray-500 mt-1">{lang.exitsLabel}</p>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Engagements Over Time */}
          <Card className="p-6">
            <h2 className="mb-4" style={{ color: '#006d77' }}>{lang.engagementsOverTime}</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={engagementsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="engagements" stroke="#006d77" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Topics */}
          <Card className="p-6">
            <h2 className="mb-4" style={{ color: '#006d77' }}>{lang.topTopics}</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topicsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="value" fill="#006d77" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Language Distribution */}
          <Card className="p-6">
            <h2 className="mb-4" style={{ color: '#006d77' }}>{lang.languageDistribution}</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent Alerts */}
          <Card className="p-6">
            <h2 className="mb-4" style={{ color: '#006d77' }}>{lang.moderationAlerts}</h2>
            <div className="space-y-3">
              {[
                { type: "Low", message: "Potential self-harm mention", time: "12 min ago" },
                { type: "Medium", message: "Inappropriate content flagged", time: "1 hour ago" },
                { type: "Low", message: "User requested crisis support", time: "2 hours ago" },
                { type: "High", message: "Multiple panic exits in short time", time: "3 hours ago" }
              ].map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
                  <div 
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ 
                      backgroundColor: alert.type === "High" ? '#ff7b6e' : alert.type === "Medium" ? '#ffa500' : '#83c5be' 
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
