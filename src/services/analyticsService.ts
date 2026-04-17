/**
 * Analytics Data Generator Service
 * Creates realistic mock analytics data for the admin dashboard
 * In production, this would connect to a real backend analytics database
 */

import {
  AnalyticsSummary,
  AdminInsight,
  DemographicMetrics,
  TopicEngagement,
  SafetyMetrics,
  PerformanceMetrics,
  FunnelMetrics,
  TrendDataPoint,
  StoryModuleMetrics,
  ContentGap,
  AgeRange,
  GenderIdentity,
  Language,
  TopicCategory,
} from '@/types/analytics';

export class AnalyticsService {
  /**
   * Generate comprehensive analytics summary with mock data
   */
  static generateAnalyticsSummary(period: 'today' | 'week' | 'month' = 'week'): AnalyticsSummary {
    const demographics = this.generateDemographics();
    const topics = this.generateTopicEngagement();
    const safety = this.generateSafetyMetrics();
    const performance = this.generatePerformanceMetrics();
    const funnel = this.generateFunnelMetrics();
    const trends = this.generateTrendData(period);
    const contentGaps = this.generateContentGaps(topics);
    const storyModules = this.generateStoryModuleMetrics();
    const adminInsights = this.generateAdminInsights(
      demographics,
      topics,
      safety,
      funnel,
      contentGaps
    );

    return {
      generatedAt: new Date().toISOString(),
      period,
      demographics,
      topics,
      safety,
      performance,
      funnel,
      trends,
      contentGaps,
      storyModules,
      adminInsights,
    };
  }

  private static generateDemographics(): DemographicMetrics {
    return {
      ageRange: {
        '10-14': 234,
        '15-19': 892,
        '20-24': 456,
        '25+': 178,
      },
      gender: {
        male: 601,
        female: 987,
        'non-binary': 89,
        'prefer-not-say': 83,
      },
      languagePreference: {
        en: 1145,
        twi: 412,
        ewe: 156,
        ga: 47,
      },
      totalActiveUsers: 1760,
      newUsersToday: 47,
      returningUsers: 1203,
    };
  }

  private static generateTopicEngagement(): TopicEngagement[] {
    const topics: TopicCategory[] = [
      'contraception',
      'stis',
      'pregnancy',
      'menstruation',
      'relationships',
      'puberty',
      'consent',
      'mental-health',
      'general',
    ];

    return topics.map((topic) => ({
      topic,
      inquiries: Math.floor(Math.random() * 400) + 50,
      avgSessionTime: Math.floor(Math.random() * 600) + 120,
      satisfactionScore: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
      createdAt: new Date().toISOString(),
    }));
  }

  private static generateSafetyMetrics(): SafetyMetrics {
    return {
      panicExitsTotal: 23,
      panicExitsToday: 3,
      crisisInterventionsTriggered: 12,
      selfHarmMentionsDetected: 8,
      suicidalIdeationMentions: 4,
      abuseMentionsDetected: 6,
      concernedUsersFollowedUp: 18,
      risksEscalatedToHuman: 5,
    };
  }

  private static generatePerformanceMetrics(): PerformanceMetrics {
    return {
      avgResponseTime: 245,
      messageProcessingSuccess: 98.7,
      systemUptime: 99.95,
      crashesOrErrors: 0,
      consecutiveHours: 328,
    };
  }

  private static generateFunnelMetrics(): FunnelMetrics {
    return {
      totalVisitors: 3421,
      completedOnboarding: 1760,
      hadFirstChat: 1456,
      completedStoryModule: 678,
      usedPharmacy: 423,
      accessedCrisisSupport: 89,
      retentionDay1: 68,
      retentionDay7: 42,
      retentionDay30: 28,
      churnRate: 15,
    };
  }

  private static generateTrendData(period: 'today' | 'week' | 'month'): TrendDataPoint[] {
    const days = period === 'today' ? 24 : period === 'week' ? 7 : 30;
    const data: TrendDataPoint[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      if (period === 'today') {
        date.setHours(date.getHours() - (23 - i));
      } else {
        date.setDate(date.getDate() - (days - 1 - i));
      }

      data.push({
        date: date.toISOString().split('T')[0],
        sessions: Math.floor(Math.random() * 200) + 150,
        uniqueUsers: Math.floor(Math.random() * 300) + 250,
        totalMessages: Math.floor(Math.random() * 2000) + 1500,
        satisfactionAverage: parseFloat((Math.random() * 1 + 3.7).toFixed(1)),
        panicExits: Math.floor(Math.random() * 8),
        crisisInterventions: Math.floor(Math.random() * 5),
      });
    }

    return data;
  }

  private static generateStoryModuleMetrics(): StoryModuleMetrics[] {
    const modules: Array<{
      id: string;
      name: string;
      ageGroup: AgeRange;
    }> = [
      { id: 'puberty', name: 'Understanding Puberty', ageGroup: '15-19' },
      { id: 'menstrual', name: 'Menstrual Health', ageGroup: '15-19' },
      { id: 'consent', name: 'Consent & Boundaries', ageGroup: '15-19' },
      { id: 'contraception', name: 'Contraception Options', ageGroup: '20-24' },
      { id: 'sti', name: 'STI Prevention & Testing', ageGroup: '20-24' },
      { id: 'pregnancy', name: 'Pregnancy & Parenthood', ageGroup: '20-24' },
      { id: 'relationships', name: 'Healthy Relationships', ageGroup: '15-19' },
      { id: 'mental-health', name: 'Mental Health & Wellness', ageGroup: '15-19' },
    ];

    return modules.map((m) => ({
      moduleId: m.id,
      moduleName: m.name,
      timesStarted: Math.floor(Math.random() * 300) + 50,
      timesCompleted: Math.floor(Math.random() * 200) + 20,
      avgCompletionTime: Math.floor(Math.random() * 600) + 300,
      avgScore: parseFloat((Math.random() * 25 + 72).toFixed(1)),
      commonMistakes: this.generateCommonMistakes(),
      usefulnessRating: parseFloat((Math.random() * 1.2 + 3.8).toFixed(1)),
      targetAgeGroup: m.ageGroup,
    }));
  }

  private static generateCommonMistakes(): string[] {
    const mistakes = [
      'Confusing different methods of contraception',
      'Not understanding when to take preventative measures',
      'Misunderstanding effectiveness rates',
      'Overlooking important warning signs',
      'Not recognizing when professional help is needed',
    ];
    return mistakes.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private static generateContentGaps(topics: TopicEngagement[]): ContentGap[] {
    const topicsSorted = [...topics].sort((a, b) => b.inquiries - a.inquiries);
    const gaps = topicsSorted.slice(0, 3).map((t) => ({
      topic: t.topic,
      unmetDemand: Math.floor(Math.random() * 150) + 30,
      frequentQuestions: [
        `How does ${t.topic} work in different contexts?`,
        `What are common misconceptions about ${t.topic}?`,
        `Where can I find reliable information about ${t.topic}?`,
      ],
      ageGroupsMostInterested: this.randomAgeGroups(),
      confidenceLevel: Math.floor(Math.random() * 5) + 5,
      recommendedAction: `Expand content library for ${t.topic}, especially age-group specific scenarios`,
    }));

    return gaps;
  }

  private static randomAgeGroups(): AgeRange[] {
    const allGroups: AgeRange[] = ['10-14', '15-19', '20-24', '25+'];
    return allGroups
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 2) + 1);
  }

  private static generateAdminInsights(
    demographics: DemographicMetrics,
    topics: TopicEngagement[],
    safety: SafetyMetrics,
    funnel: FunnelMetrics,
    contentGaps: ContentGap[]
  ): AdminInsight[] {
    const insights: AdminInsight[] = [];

    // Growth opportunity insight
    if (demographics.newUsersToday > 30) {
      insights.push({
        id: 'growth-1',
        type: 'opportunity',
        priority: 'high',
        title: '📈 Strong User Growth Momentum',
        description: `You gained ${demographics.newUsersToday} new users today. That's a 34% increase compared to yesterday's average.`,
        suggestedAction: 'Consider scaling server capacity and increasing content moderator staffing to handle the influx.',
        impactedUsers: demographics.newUsersToday,
        createdAt: new Date().toISOString(),
      });
    }

    // Retention insight
    if (funnel.retentionDay7 < 45) {
      insights.push({
        id: 'retention-1',
        type: 'warning',
        priority: 'high',
        title: '⚠️ Day-7 Retention Below Target',
        description: `Only ${funnel.retentionDay7}% of week-1 users return. Target is 50%+. This suggests onboarding or early engagement issues.`,
        suggestedAction: 'Analyze user feedback from dropped sessions. Consider A/B testing onboarding flow or adding push notifications for re-engagement.',
        impactedUsers: Math.floor(funnel.completedOnboarding * ((100 - funnel.retentionDay7) / 100)),
        createdAt: new Date().toISOString(),
      });
    }

    // Safety insight
    if (safety.panicExitsToday > 2) {
      insights.push({
        id: 'safety-1',
        type: 'warning',
        priority: 'high',
        title: '🚨 Elevated Panic Exit Rate',
        description: `${safety.panicExitsToday} panic exits detected today. This may indicate crisis content or user distress.`,
        suggestedAction: 'Review todays conversations for triggering content. Ensure crisis resources are prominently displayed.',
        impactedUsers: safety.panicExitsToday,
        createdAt: new Date().toISOString(),
      });
    }

    // Content recommendation
    if (contentGaps.length > 0) {
      const topGap = contentGaps[0];
      insights.push({
        id: 'content-1',
        type: 'recommendation',
        priority: 'medium',
        title: `📚 Content Gap Identified: ${topGap.topic}`,
        description: `${topGap.unmetDemand} users asked about ${topGap.topic} but received incomplete answers. Confidence: ${topGap.confidenceLevel}/10.`,
        suggestedAction: topGap.recommendedAction,
        impactedUsers: topGap.unmetDemand,
        createdAt: new Date().toISOString(),
      });
    }

    // Engagement trend
    const mostEngaged = topics.sort((a, b) => b.inquiries - a.inquiries)[0];
    if (mostEngaged) {
      insights.push({
        id: 'trend-1',
        type: 'trend',
        priority: 'medium',
        title: `🔥 ${mostEngaged.topic} is Trending`,
        description: `${mostEngaged.inquiries} inquiries this week, with avg satisfaction of ${mostEngaged.satisfactionScore}/5.`,
        suggestedAction: 'Allocate more resources to this topic. Users are engaged. Monitor for emerging sub-topics.',
        impactedUsers: mostEngaged.inquiries,
        createdAt: new Date().toISOString(),
      });
    }

    // Story module performance
    insights.push({
      id: 'modules-1',
      type: 'recommendation',
      priority: 'low',
      title: '✅ Story Modules Performing Well',
      description: 'Story mode completion rate is 38% (avg 25%). Users are engaging with structured content.',
      suggestedAction: 'Expand story modules. Plan 2 new modules this month based on trending topics.',
      impactedUsers: 678,
      createdAt: new Date().toISOString(),
    });

    return insights;
  }
}
