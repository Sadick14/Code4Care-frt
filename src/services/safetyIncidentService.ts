/**
 * Safety Incident Service
 * Admin endpoints for viewing and managing safety incidents
 * Requires admin authentication via Bearer token
 */

import { logger } from '@/utils/logger';

const ADMIN_BASE_PATH = '/api/admin';
const DEFAULT_API_BASE_URL = 'https://code4care-backend-production.up.railway.app';
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_ADMIN_API_BASE_URL ||
  DEFAULT_API_BASE_URL
).trim();

function buildUrl(path: string): string {
  if (!API_BASE_URL) return path;
  return new URL(path, API_BASE_URL).toString();
}

function buildHeaders(accessToken?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
}

async function readApiError(response: Response): Promise<string> {
  const bodyText = await response.text();
  if (!bodyText) return response.statusText || 'Safety API request failed';
  try {
    const parsed = JSON.parse(bodyText) as Record<string, unknown>;
    if (typeof parsed.detail === 'string') return parsed.detail;
    if (Array.isArray(parsed.detail)) {
      return parsed.detail
        .map((item) => {
          if (!item || typeof item !== 'object') return String(item);
          const detail = item as Record<string, unknown>;
          const location = Array.isArray(detail.loc) ? detail.loc.join('.') : '';
          const message = typeof detail.msg === 'string' ? detail.msg : 'Validation error';
          return location ? `${location}: ${message}` : message;
        })
        .join('; ');
    }
    if (typeof parsed.message === 'string') return parsed.message;
  } catch {
    return bodyText;
  }
  return bodyText;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) throw new Error('Empty response body');
  return JSON.parse(text) as T;
}

// Type definitions matching backend response structures
export interface IncidentType {
  type: 'self-harm' | 'suicidal' | 'abuse' | 'panic' | 'exploitation' | 'other';
  count: number;
  escalations: number;
  avg_response_time_minutes: number;
}

export interface IncidentMetrics {
  total: number;
  panic_exits: {
    total: number;
    triggered: number;
    responded_within_minutes: number;
    avg_response_time_minutes: number;
  };
  crisis_interventions: number;
  self_harm_mentions: number;
  suicidal_ideation: number;
  abuse_mentions: number;
  followed_up: number;
}

export interface SafetyAnalyticsResponse {
  period: 'today' | 'week' | 'month' | 'year';
  incidents: IncidentMetrics;
  severity_distribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  escalations: {
    total_escalated: number;
    to_human_consultant: number;
    to_external_resources: number;
    follow_up_pending: number;
  };
  trends: {
    incidents_increasing: boolean;
    change_vs_last_period: number;
    peak_time: string;
  };
  by_region?: {
    [region: string]: {
      incidents: number;
      escalations: number;
    };
  };
  by_age_group?: {
    [ageGroup: string]: {
      incidents: number;
      crisis_interventions: number;
    };
  };
}

export interface SafetyTrendDataPoint {
  day: string;
  reports: number;
  escalations: number;
  crisis_interventions: number;
  avg_response_time: number;
}

export interface IncidentListItem {
  id: string;
  type: 'self-harm' | 'suicidal' | 'abuse' | 'panic' | 'exploitation' | 'other';
  user_id: string;
  user_name?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-review' | 'resolved' | 'escalated';
  reported_at: string;
  follow_up_required: boolean;
  notes?: string;
  assigned_staff_id?: string;
  assigned_staff_name?: string;
}

export interface IncidentListResponse {
  incidents: IncidentListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateIncidentRequest {
  status?: 'open' | 'in-review' | 'resolved' | 'escalated';
  notes?: string;
  follow_up_required?: boolean;
  assigned_staff_id?: string;
}

export class SafetyIncidentService {
  /**
   * GET /api/admin/incidents/analytics - Get safety analytics (fallback with RealAnalyticsService instead)
   */
  static async getSafetyAnalytics(
    options?: {
      period?: 'today' | 'week' | 'month' | 'year';
      severity?: 'low' | 'medium' | 'high' | 'critical';
      by_region?: boolean;
      by_age_group?: boolean;
    },
    accessToken?: string,
  ): Promise<SafetyAnalyticsResponse> {
    const params = new URLSearchParams();
    if (options?.period) params.append('period', options.period);
    if (options?.severity) params.append('severity', options.severity);
    if (options?.by_region) params.append('by_region', String(options.by_region));
    if (options?.by_age_group) params.append('by_age_group', String(options.by_age_group));

    const url = `${buildUrl(`${ADMIN_BASE_PATH}/incidents/analytics`)}${params.toString() ? `?${params.toString()}` : ''}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: buildHeaders(accessToken),
      });

      if (!response.ok) {
        // If dedicated incidents endpoint doesn't exist, return empty analytics
        logger.warn('Failed to get safety analytics - using empty fallback', await readApiError(response));
        return {
          period: options?.period || 'week',
          incidents: {
            total: 0,
            panic_exits: { total: 0, triggered: 0, responded_within_minutes: 0, avg_response_time_minutes: 0 },
            crisis_interventions: 0,
            self_harm_mentions: 0,
            suicidal_ideation: 0,
            abuse_mentions: 0,
            followed_up: 0,
          },
          severity_distribution: { low: 0, medium: 0, high: 0, critical: 0 },
          escalations: { total_escalated: 0, to_human_consultant: 0, to_external_resources: 0, follow_up_pending: 0 },
          trends: { incidents_increasing: false, change_vs_last_period: 0, peak_time: '' },
        };
      }

      return await readJsonResponse<SafetyAnalyticsResponse>(response);
    } catch (error) {
      logger.error('Failed to get safety analytics', error);
      // Return empty analytics instead of throwing
      return {
        period: options?.period || 'week',
        incidents: {
          total: 0,
          panic_exits: { total: 0, triggered: 0, responded_within_minutes: 0, avg_response_time_minutes: 0 },
          crisis_interventions: 0,
          self_harm_mentions: 0,
          suicidal_ideation: 0,
          abuse_mentions: 0,
          followed_up: 0,
        },
        severity_distribution: { low: 0, medium: 0, high: 0, critical: 0 },
        escalations: { total_escalated: 0, to_human_consultant: 0, to_external_resources: 0, follow_up_pending: 0 },
        trends: { incidents_increasing: false, change_vs_last_period: 0, peak_time: '' },
      };
    }
  }

  /**
   * GET /api/admin/incidents - List safety incidents (fallback with analytics if unavailable)
   */
  static async listIncidents(
    options?: {
      page?: number;
      limit?: number;
      status?: 'open' | 'in-review' | 'resolved' | 'escalated';
      severity?: 'low' | 'medium' | 'high' | 'critical';
      type?: string;
    },
    accessToken?: string,
  ): Promise<IncidentListResponse> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', String(options.page));
    if (options?.limit) params.append('limit', String(options.limit));
    if (options?.status) params.append('status', options.status);
    if (options?.severity) params.append('severity', options.severity);
    if (options?.type) params.append('type', options.type);

    const url = `${buildUrl(`${ADMIN_BASE_PATH}/incidents`)}${params.toString() ? `?${params.toString()}` : ''}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: buildHeaders(accessToken),
      });

      if (!response.ok) {
        // If incidents endpoint doesn't exist, return empty list so component doesn't crash
        logger.warn('Failed to list incidents - using empty fallback', await readApiError(response));
        return {
          incidents: [],
          total: 0,
          page: options?.page ?? 1,
          limit: options?.limit ?? 100,
        };
      }

      return await readJsonResponse<IncidentListResponse>(response);
    } catch (error) {
      logger.error('Failed to list incidents', error);
      // Return empty response instead of throwing to allow component to work with analytics data
      return {
        incidents: [],
        total: 0,
        page: options?.page ?? 1,
        limit: options?.limit ?? 100,
      };
    }
  }

  /**
   * GET /api/admin/incidents/{incident_id} - Get incident details
   */
  static async getIncident(
    incidentId: string,
    accessToken?: string,
  ): Promise<IncidentListItem | null> {
    const url = buildUrl(`${ADMIN_BASE_PATH}/incidents/${incidentId}`);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: buildHeaders(accessToken),
      });

      if (!response.ok) {
        logger.warn('Failed to get incident details', await readApiError(response));
        return null;
      }

      return await readJsonResponse<IncidentListItem>(response);
    } catch (error) {
      logger.error('Failed to get incident details', error);
      return null;
    }
  }

  /**
   * PUT /api/admin/incidents/{incident_id} - Update incident status/notes
   */
  static async updateIncident(
    incidentId: string,
    payload: UpdateIncidentRequest,
    accessToken?: string,
  ): Promise<IncidentListItem | null> {
    const url = buildUrl(`${ADMIN_BASE_PATH}/incidents/${incidentId}`);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: buildHeaders(accessToken),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        logger.warn('Failed to update incident', await readApiError(response));
        return null;
      }

      return await readJsonResponse<IncidentListItem>(response);
    } catch (error) {
      logger.error('Failed to update incident', error);
      return null;
    }
  }

  /**
   * POST /api/admin/incidents/{incident_id}/escalate - Escalate incident
   */
  static async escalateIncident(
    incidentId: string,
    payload: { reason?: string; escalate_to?: 'human_consultant' | 'external_resources' },
    accessToken?: string,
  ): Promise<IncidentListItem | null> {
    const url = buildUrl(`${ADMIN_BASE_PATH}/incidents/${incidentId}/escalate`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: buildHeaders(accessToken),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        logger.warn('Failed to escalate incident', await readApiError(response));
        return null;
      }

      return await readJsonResponse<IncidentListItem>(response);
    } catch (error) {
      logger.error('Failed to escalate incident', error);
      return null;
    }
  }

  /**
   * POST /safety/incidents/{incident_id}/assign - Assign incident to staff
   */
  static async assignIncident(
    incidentId: string,
    payload: { staff_id: string },
    accessToken?: string,
  ): Promise<IncidentListItem> {
    const url = buildUrl(`${ADMIN_BASE_PATH}/incidents/${incidentId}/assign`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: buildHeaders(accessToken),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<IncidentListItem>(response);
    } catch (error) {
      logger.error('Failed to assign incident', error);
      throw error;
    }
  }

  /**
   * Mark incident as resolved with follow-up details
   */
  static async resolveIncident(
    incidentId: string,
    payload: { resolution_notes: string; follow_up_required: boolean; follow_up_date?: string },
    accessToken?: string,
  ): Promise<IncidentListItem> {
    const url = buildUrl(`${ADMIN_BASE_PATH}/incidents/${incidentId}/resolve`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: buildHeaders(accessToken),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<IncidentListItem>(response);
    } catch (error) {
      logger.error('Failed to resolve incident', error);
      throw error;
    }
  }

  /**
   * GET /api/admin/incidents/trends - Get trends in safety incidents over time
   */
  static async getSafetyTrends(
    options?: {
      period?: 'today' | 'week' | 'month' | 'year';
      by_type?: boolean;
    },
    accessToken?: string,
  ): Promise<SafetyTrendDataPoint[]> {
    const params = new URLSearchParams();
    if (options?.period) params.append('period', options.period);
    if (options?.by_type) params.append('by_type', String(options.by_type));

    const url = `${buildUrl(`${ADMIN_BASE_PATH}/incidents/trends`)}${params.toString() ? `?${params.toString()}` : ''}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: buildHeaders(accessToken),
      });

      if (!response.ok) {
        logger.warn('Failed to get safety trends', await readApiError(response));
        return [];
      }

      const data = await readJsonResponse<{ trends: SafetyTrendDataPoint[] } | SafetyTrendDataPoint[]>(response);
      return Array.isArray(data) ? data : data.trends || [];
    } catch (error) {
      logger.error('Failed to get safety trends', error);
      return [];
    }
  }
}
