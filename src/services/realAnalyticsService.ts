/**
 * Real Analytics Service
 * Connects to backend analytics endpoints per BACKEND_API_SPECIFICATION
 */

import { logger } from '@/utils/logger';

export interface AnalyticsSummary {
  generated_at: string;
  period: 'today' | 'week' | 'month' | 'year';
  summary: {
    total_active_users: number;
    new_users_total: number;
    new_users_in_period: number;
    returning_users: number;
    total_conversations: number;
    conversations_in_period: number;
    total_messages: number;
    messages_in_period: number;
    average_session_duration_minutes: number;
    average_messages_per_session: number;
  };
  demographics: Record<string, unknown>;
  engagement: Record<string, unknown>;
  safety: Record<string, unknown>;
  performance: Record<string, unknown>;
  funnel: Record<string, unknown>;
}

export interface TopicEngagementItem {
  topic: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  avg_satisfaction: number;
}

export interface TopicEngagementResponse {
  period: string;
  topics: TopicEngagementItem[];
}

export interface UserAnalyticsResponse {
  period: string;
  total_active_users: number;
  new_users: number;
  returning_users: number;
  retention_rate: number;
  sessions: Record<string, unknown>;
  engagement_distribution: Record<string, unknown>;
  demographics: Record<string, unknown>;
}

export interface SafetyIncident {
  id: string;
  incident_type: 'self-harm' | 'suicidal' | 'abuse' | 'panic';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-review' | 'resolved' | 'escalated';
  reported_at: string;
  [key: string]: unknown;
}

export interface SafetyAnalyticsResponse {
  period: string;
  incidents: {
    total: number;
    [key: string]: unknown;
  };
  severity_distribution: Record<string, number>;
  escalations: Record<string, unknown>;
  trends: Record<string, unknown>;
  demographics: Record<string, unknown>;
}

export interface PerformanceMetricsResponse {
  period: string;
  response_time: {
    avg_ms: number;
    min_ms: number;
    max_ms: number;
    p95_ms: number;
    p99_ms: number;
  };
  message_processing: {
    success_rate: number;
    failed_count: number;
    total_processed: number;
  };
  uptime: {
    percent: number;
    incidents: number;
    [key: string]: unknown;
  };
  errors: Record<string, unknown>;
  service_availability: Record<string, string>;
}

export interface SessionAnalyticsPayload {
  session_id: string;
  user_id?: string;
  age_range: string;
  gender_identity: string;
  region: string;
  language: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  messages_exchanged: number;
  topics_discussed: string[];
  panic_button_used: boolean;
  crisis_support_accessed: boolean;
  story_modules_started: number;
  story_modules_completed: number;
  pharmacy_searches: number;
  satisfaction_rating?: number;
  would_return: boolean;
  safety_flags: string[];
}

export interface SessionAnalyticsResponse {
  session_id: string;
  recorded_at: string;
  status: 'recorded';
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_ADMIN_API_BASE_URL ||
  ''
).trim();

const ANALYTICS_BASE_PATH = '/analytics';

function buildUrl(path: string): string {
  if (!API_BASE_URL) {
    return path;
  }
  return new URL(path, API_BASE_URL).toString();
}

function buildHeaders(accessToken?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return headers;
}

async function readApiError(response: Response): Promise<string> {
  const bodyText = await response.text();

  if (!bodyText) {
    return response.statusText || 'API request failed';
  }

  try {
    const parsed = JSON.parse(bodyText) as Record<string, unknown>;

    if (typeof parsed.detail === 'string') {
      return parsed.detail;
    }

    if (typeof parsed.message === 'string') {
      return parsed.message;
    }
  } catch {
    return bodyText;
  }

  return bodyText;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export class RealAnalyticsService {
  /**
   * GET /analytics/dashboard - Get overall system analytics and KPIs
   */
  static async getDashboardSummary(
    options?: {
      period?: 'today' | 'week' | 'month' | 'year';
      by_region?: boolean;
      by_age_group?: boolean;
      by_language?: boolean;
    },
    accessToken?: string,
  ): Promise<AnalyticsSummary> {
    const params = new URLSearchParams();

    if (options?.period) params.append('period', options.period);
    if (options?.by_region) params.append('by_region', String(options.by_region));
    if (options?.by_age_group) params.append('by_age_group', String(options.by_age_group));
    if (options?.by_language) params.append('by_language', String(options.by_language));

    const url = `${buildUrl(`${ANALYTICS_BASE_PATH}/dashboard`)}${params.toString() ? `?${params.toString()}` : ''}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: buildHeaders(accessToken),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<AnalyticsSummary>(response);
    } catch (error) {
      logger.error('Failed to get analytics dashboard summary', error);
      throw error;
    }
  }

  /**
   * GET /analytics/topics - Get analytics for specific topics
   */
  static async getTopicAnalytics(
    options?: {
      period?: 'today' | 'week' | 'month' | 'year';
      limit?: number;
    },
    accessToken?: string,
  ): Promise<TopicEngagementResponse> {
    const params = new URLSearchParams();

    if (options?.period) params.append('period', options.period);
    if (options?.limit) params.append('limit', String(options.limit));

    const url = `${buildUrl(`${ANALYTICS_BASE_PATH}/topics`)}${params.toString() ? `?${params.toString()}` : ''}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: buildHeaders(accessToken),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<TopicEngagementResponse>(response);
    } catch (error) {
      logger.error('Failed to get topic analytics', error);
      throw error;
    }
  }

  /**
   * GET /analytics/users - Get user behavior and retention analytics
   */
  static async getUserAnalytics(
    options?: {
      period?: 'today' | 'week' | 'month' | 'year';
      segment?: 'all' | 'new' | 'returning' | 'at-risk' | 'high_engagement';
    },
    accessToken?: string,
  ): Promise<UserAnalyticsResponse> {
    const params = new URLSearchParams();

    if (options?.period) params.append('period', options.period);
    if (options?.segment) params.append('segment', options.segment);

    const url = `${buildUrl(`${ANALYTICS_BASE_PATH}/users`)}${params.toString() ? `?${params.toString()}` : ''}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: buildHeaders(accessToken),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<UserAnalyticsResponse>(response);
    } catch (error) {
      logger.error('Failed to get user analytics', error);
      throw error;
    }
  }

  /**
   * GET /analytics/safety - Get safety & crisis analytics
   */
  static async getSafetyAnalytics(
    options?: {
      period?: 'today' | 'week' | 'month' | 'year';
      severity?: 'low' | 'medium' | 'high' | 'critical';
    },
    accessToken?: string,
  ): Promise<SafetyAnalyticsResponse> {
    const params = new URLSearchParams();

    if (options?.period) params.append('period', options.period);
    if (options?.severity) params.append('severity', options.severity);

    const url = `${buildUrl(`${ANALYTICS_BASE_PATH}/safety`)}${params.toString() ? `?${params.toString()}` : ''}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: buildHeaders(accessToken),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<SafetyAnalyticsResponse>(response);
    } catch (error) {
      logger.error('Failed to get safety analytics', error);
      throw error;
    }
  }

  /**
   * GET /analytics/performance - Get system performance metrics
   */
  static async getPerformanceMetrics(
    options?: {
      period?: 'today' | 'week' | 'month' | 'year';
    },
    accessToken?: string,
  ): Promise<PerformanceMetricsResponse> {
    const params = new URLSearchParams();

    if (options?.period) params.append('period', options.period);

    const url = `${buildUrl(`${ANALYTICS_BASE_PATH}/performance`)}${params.toString() ? `?${params.toString()}` : ''}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: buildHeaders(accessToken),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<PerformanceMetricsResponse>(response);
    } catch (error) {
      logger.error('Failed to get performance metrics', error);
      throw error;
    }
  }

  /**
   * POST /analytics/session - Record analytics data for a completed session
   * Called from frontend after session ends
   */
  static async recordSessionAnalytics(
    payload: SessionAnalyticsPayload,
  ): Promise<SessionAnalyticsResponse> {
    try {
      const response = await fetch(buildUrl(`${ANALYTICS_BASE_PATH}/session`), {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<SessionAnalyticsResponse>(response);
    } catch (error) {
      logger.error('Failed to record session analytics', error);
      // Don't re-throw for analytics errors - they shouldn't break user experience
      return {
        session_id: payload.session_id,
        recorded_at: new Date().toISOString(),
        status: 'recorded',
      };
    }
  }
}
