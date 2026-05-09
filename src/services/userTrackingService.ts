/**
 * User Tracking Service
 * Handles user onboarding, demographics, settings, and session tracking
 * Endpoints: POST /v1/user/demographics, POST /v1/chat/event, POST /v1/user/settings, POST /v1/session
 */

import { logger } from '@/utils/logger';

// ========== User Demographics ==========

export interface UserDemographicsRequest {
  session_id: string;
  bot_name?: string;
  age_range: string;
  gender_identity: string;
  region: string;
  language: string;
}

export interface UserDemographicsResponse {
  id: string;
  session_id: string;
  bot_name?: string;
  age_range: string;
  gender_identity: string;
  region: string;
  language: string;
  created_at: string;
}

// ========== Chat Event Log ==========

export interface EventLogRequest {
  session_id: string;
  conversation_id?: string;
  event_type: string;
  event_category?: string;
  topic?: string;
  input_method?: string;
  metadata?: Record<string, unknown>;
}

export interface EventLogResponse {
  id: string;
  session_id: string;
  conversation_id?: string;
  event_type: string;
  event_category?: string;
  topic?: string;
  input_method?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// ========== User Settings ==========

export interface UserSettingsRequest {
  session_id: string;
  nickname?: string;
  language?: string;
  chat_retention?: '24h' | '7d' | '30d' | '90d' | 'never';
  analytics_consent?: boolean;
  consultant_mode_enabled?: boolean;
}

export interface UserSettingsResponse {
  id: string;
  session_id: string;
  nickname?: string;
  language?: string;
  chat_retention: string;
  analytics_consent: boolean;
  consultant_mode_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// ========== User Session ==========

export interface UserSessionRequest {
  session_id: string;
  action: 'start' | 'continue' | 'end';
  return_visitor?: boolean;
  device_type?: string;
  os?: string;
  browser?: string;
  duration_seconds?: number;
}

export interface UserSessionResponse {
  id: string;
  session_id: string;
  action: string;
  return_visitor: boolean;
  device_type?: string;
  os?: string;
  browser?: string;
  duration_seconds?: number;
  created_at: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

const DEMOGRAPHICS_PATH = '/v1/user/demographics';
const CHAT_EVENT_PATH = '/v1/chat/event';
const USER_SETTINGS_PATH = '/v1/user/settings';
const SESSION_PATH = '/v1/session';

function buildUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is required for user tracking requests.');
  }
  return new URL(path, API_BASE_URL).toString();
}

function buildHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
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

    if (Array.isArray(parsed.detail)) {
      return parsed.detail
        .map((item) => {
          if (!item || typeof item !== 'object') {
            return String(item);
          }
          const detail = item as Record<string, unknown>;
          const location = Array.isArray(detail.loc) ? detail.loc.join('.') : '';
          const message = typeof detail.msg === 'string' ? detail.msg : 'Validation error';
          return location ? `${location}: ${message}` : message;
        })
        .join('; ');
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

export class UserTrackingService {
  /**
   * POST /v1/user/demographics - Capture user onboarding demographics
   */
  static async captureDemographics(
    payload: UserDemographicsRequest,
  ): Promise<UserDemographicsResponse> {
    try {
      const response = await fetch(buildUrl(DEMOGRAPHICS_PATH), {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<UserDemographicsResponse>(response);
    } catch (error) {
      logger.error('Failed to capture demographics', error);
      throw error;
    }
  }

  /**
   * POST /v1/chat/event - Log a chat interaction event
   */
  static async logChatEvent(
    payload: EventLogRequest,
  ): Promise<EventLogResponse> {
    try {
      const response = await fetch(buildUrl(CHAT_EVENT_PATH), {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<EventLogResponse>(response);
    } catch (error) {
      logger.error('Failed to log chat event', error);
      // Don't throw - event logging shouldn't break user experience
      return {
        id: `event-${Date.now()}`,
        session_id: payload.session_id,
        event_type: payload.event_type,
        created_at: new Date().toISOString(),
      };
    }
  }

  /**
   * POST /v1/user/settings - Update or create user settings
   */
  static async updateSettings(
    payload: UserSettingsRequest,
  ): Promise<UserSettingsResponse> {
    try {
      const response = await fetch(buildUrl(USER_SETTINGS_PATH), {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<UserSettingsResponse>(response);
    } catch (error) {
      logger.error('Failed to update user settings', error);
      throw error;
    }
  }

  /**
   * POST /v1/session - Track user session events
   */
  static async trackSession(
    payload: UserSessionRequest,
  ): Promise<UserSessionResponse> {
    try {
      const response = await fetch(buildUrl(SESSION_PATH), {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      return await readJsonResponse<UserSessionResponse>(response);
    } catch (error) {
      logger.error('Failed to track session', error);
      // Don't throw - session tracking shouldn't break user experience
      return {
        id: `session-${Date.now()}`,
        session_id: payload.session_id,
        action: payload.action,
        return_visitor: payload.return_visitor || false,
        created_at: new Date().toISOString(),
      };
    }
  }
}
