import { logger } from '@/utils/logger';

export type UserLanguage = 'en' | 'twi' | 'ewe' | 'ga' | string;
export type ChatEventCategory = 'safety' | 'engagement' | 'navigation' | 'feedback' | 'system' | string;
export type ChatInputMethod = 'quick_reply' | 'typed' | 'voice' | 'system' | string;
export type SessionAction = 'start' | 'continue' | 'end' | string;
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | string;

export interface CaptureDemographicsPayload {
  session_id: string;
  bot_name: string;
  age_range: string;
  gender_identity: string;
  region: string;
  language: UserLanguage;
}

export interface CaptureDemographicsResponse {
  session_id: string;
  age_range: string;
  gender_identity: string;
  region: string;
  language: string;
  created_at: string;
}

export interface LogChatEventPayload {
  session_id: string;
  conversation_id?: string;
  event_type: string;
  event_category: ChatEventCategory;
  topic?: string;
  input_method?: ChatInputMethod;
  metadata?: Record<string, unknown>;
}

export interface LogChatEventResponse {
  id: string;
  session_id: string;
  event_type: string;
  created_at: string;
}

export interface UpdateUserSettingsPayload {
  session_id: string;
  nickname?: string;
  language: UserLanguage;
  chat_retention: string;
  analytics_consent: boolean;
  consultant_mode_enabled: boolean;
}

export interface UpdateUserSettingsResponse {
  session_id: string;
  nickname: string;
  language: string;
  chat_retention: string;
  analytics_consent: boolean;
  updated_at: string;
}

export interface SyncUserSettingsOptions {
  sessionId: string;
  nickname?: string;
  language?: string;
  chatRetention?: string;
  analyticsConsent?: boolean;
  consultantModeEnabled?: boolean;
}

export interface TrackSessionPayload {
  session_id: string;
  action: SessionAction;
  return_visitor: boolean;
  device_type: DeviceType;
  os: string;
  browser: string;
  duration_seconds?: number;
}

export interface TrackSessionResponse {
  session_id: string;
  action: string;
  created_at: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

function buildUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is required for engagement requests.');
  }

  return new URL(path, API_BASE_URL).toString();
}

function buildHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
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

async function postJson<TPayload, TResponse>(path: string, payload: TPayload): Promise<TResponse> {
  const response = await fetch(buildUrl(path), {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return (await response.json()) as TResponse;
}

function detectDeviceType(): DeviceType {
  if (typeof window === 'undefined') {
    return 'desktop';
  }

  const width = window.innerWidth;

  if (width < 768) {
    return 'mobile';
  }

  if (width < 1024) {
    return 'tablet';
  }

  return 'desktop';
}

function getUserAgent() {
  if (typeof navigator === 'undefined') {
    return '';
  }

  return navigator.userAgent;
}

function detectBrowser(userAgent = getUserAgent()) {
  if (/Edg\//.test(userAgent)) return 'edge';
  if (/Chrome\//.test(userAgent) && !/Edg\//.test(userAgent)) return 'chrome';
  if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) return 'safari';
  if (/Firefox\//.test(userAgent)) return 'firefox';
  return '';
}

function detectOS(userAgent = getUserAgent()) {
  if (/Windows/i.test(userAgent)) return 'windows';
  if (/Android/i.test(userAgent)) return 'android';
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
  if (/Mac OS X/i.test(userAgent)) return 'macos';
  if (/Linux/i.test(userAgent)) return 'linux';
  return '';
}

export class UserEngagementService {
  /**
   * POST /v1/user/demographics - Capture user onboarding demographics.
   */
  static captureDemographics(payload: CaptureDemographicsPayload): Promise<CaptureDemographicsResponse> {
    return postJson<CaptureDemographicsPayload, CaptureDemographicsResponse>('/v1/user/demographics', payload);
  }

  /**
   * POST /v1/chat/event - Log a chat interaction event.
   */
  static logChatEvent(payload: LogChatEventPayload): Promise<LogChatEventResponse> {
    return postJson<LogChatEventPayload, LogChatEventResponse>('/v1/chat/event', payload);
  }

  /**
   * POST /v1/user/settings - Update or create user settings.
   */
  static updateUserSettings(payload: UpdateUserSettingsPayload): Promise<UpdateUserSettingsResponse> {
    return postJson<UpdateUserSettingsPayload, UpdateUserSettingsResponse>('/v1/user/settings', payload);
  }

  /**
   * Build and persist a complete user-settings payload from partial UI state.
   */
  static syncUserSettings(options: SyncUserSettingsOptions): Promise<UpdateUserSettingsResponse> {
    return UserEngagementService.updateUserSettings({
      session_id: options.sessionId,
      nickname: options.nickname ?? '',
      language: options.language ?? 'en',
      chat_retention: options.chatRetention ?? '24h',
      analytics_consent: options.analyticsConsent ?? true,
      consultant_mode_enabled: options.consultantModeEnabled ?? false,
    });
  }

  /**
   * POST /v1/session - Track user session events.
   */
  static trackSession(payload: TrackSessionPayload): Promise<TrackSessionResponse> {
    return postJson<TrackSessionPayload, TrackSessionResponse>('/v1/session', payload);
  }

  static buildSessionPayload(
    sessionId: string,
    action: SessionAction,
    returnVisitor: boolean,
    durationSeconds = 0,
  ): TrackSessionPayload {
    return {
      session_id: sessionId,
      action,
      return_visitor: returnVisitor,
      device_type: detectDeviceType(),
      os: detectOS(),
      browser: detectBrowser(),
      duration_seconds: durationSeconds,
    };
  }

  static logNonBlocking<T>(promise: Promise<T>, context: string): void {
    promise.catch((error) => {
      logger.error(context, error);
    });
  }
}
